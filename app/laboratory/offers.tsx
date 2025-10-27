import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { useOffers } from '@/contexts/OffersContext';
import { Offer, Laboratory } from '@/constants/types';
import { Plus, Trash2, Edit3, CheckCircle2, Percent, DollarSign } from 'lucide-react-native';
import { useLaboratories } from '@/contexts/LaboratoryContext';

export default function LaboratoryOffers() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();
  const { offers, getOffersByLab, addOffer, updateOffer, deleteOffer } = useOffers();
  const { laboratories } = useLaboratories();

  const lab = useMemo(() => {
    if (user?.role !== 'laboratory') return undefined;
    return laboratories.find(l => l.id === user.id) as Laboratory | undefined;
  }, [user, laboratories]);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const labOffers = useMemo(() => lab ? getOffersByLab(lab.id) : [], [lab, offers, getOffersByLab]);

  const handleSave = async () => {
    if (!lab) {
      Alert.alert('Accès refusé', 'Connexion laboratoire requise');
      return;
    }
    if (!title || !description || !price) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    const priceValue = Number(price);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Prix invalide', 'Veuillez saisir un prix valide (> 0)');
      return;
    }

    const base: Partial<Offer> = {
      title: title.trim(),
      description: description.trim(),
      price: priceValue,
      imageUrl: imageUrl || undefined,
      active: true,
      requiresAdminApproval: false,
      approved: true,
    };

    try {
      if (editingId) {
        await updateOffer(editingId, base);
        setEditingId(null);
      } else {
        const newOffer: Offer = {
          id: `${Date.now()}`,
          labId: lab.id,
          title: base.title!,
          description: base.description!,
          price: base.price!,
          imageUrl: base.imageUrl,
          active: true,
          requiresAdminApproval: false,
          approved: true,
          createdAt: new Date().toISOString(),
        };
        await addOffer(newOffer);
      }
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
    } catch (e) {
      console.error('save offer error', e);
      Alert.alert('Erreur', 'Impossible d\u2019enregistrer l\u2019offre');
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setTitle(offer.title);
    setDescription(offer.description);
    setPrice(String(offer.price));
    setImageUrl(offer.imageUrl ?? '');
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Supprimer', 'Confirmer la suppression ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try { await deleteOffer(id); } catch (e) { Alert.alert('Erreur', 'Suppression échouée'); }
      }}
    ]);
  };

  const commissionRate = lab?.commission ?? 0;
  const netExample = useMemo(() => {
    const p = Number(price) || 0;
    const commissionAmount = p * commissionRate;
    const net = p - commissionAmount;
    return { commissionAmount, net };
  }, [price, commissionRate]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} testID="labOffersScreen">
      <Stack.Screen options={{ title: 'Gestion Catalogue', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={Platform.OS === 'web'}>
        <Text style={styles.header} testID="offersHeader">Gestion du catalogue de mon laboratoire</Text>
        {lab ? (
          <Text style={styles.sub} testID="commissionInfo">
            Taux de commission admin: {(commissionRate * 100).toFixed(0)}% • Exemple: pour {price || '0'} MAD, commission {(netExample.commissionAmount).toFixed(2)} MAD, net {(netExample.net).toFixed(2)} MAD
          </Text>
        ) : (
          <Text style={styles.errorText}>Connectez-vous en tant que laboratoire pour gérer vos offres.</Text>
        )}

        <View style={styles.card}>
          <TextInput
            placeholder="Titre de l\'offre"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            testID="offerTitleInput"
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            testID="offerDescriptionInput"
          />
          <TextInput
            placeholder="Prix (MAD)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
            testID="offerPriceInput"
          />
          <TextInput
            placeholder="Image URL (optionnel)"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
            testID="offerImageInput"
          />
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.preview} resizeMode="cover" />
          ) : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSave} testID="saveOfferBtn" activeOpacity={0.8}>
            {editingId ? <Edit3 color={Colors.common.white} size={18} /> : <Plus color={Colors.common.white} size={18} />}
            <Text style={styles.primaryBtnText}>{editingId ? 'Mettre à jour' : 'Ajouter l\u2019offre'}</Text>
          </TouchableOpacity>

          <View style={styles.note}>
            <Percent size={16} color={Colors.common.darkGray} />
            <Text style={styles.noteText}>Les offres classiques appliquent automatiquement le taux de commission défini par l\u2019admin.</Text>
          </View>
          <View style={styles.note}>
            <CheckCircle2 size={16} color={Colors.common.darkGray} />
            <Text style={styles.noteText}>Pour une requête spéciale (prix négocié, conditions particulières), contactez l\u2019admin pour activer la commande et l\u2019associer à votre profil.</Text>
          </View>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/contact' as any)} testID="contactAdminFromOffers">
            <Text style={styles.outlineBtnText}>Contacter l\u2019admin</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Mes offres actives</Text>
        <View style={styles.grid}>
          {labOffers.map((o) => {
            const commissionAmount = o.price * commissionRate;
            const net = o.price - commissionAmount;
            return (
              <View key={o.id} style={styles.offerCard} testID={`offer-${o.id}`}>
                {o.imageUrl ? <Image source={{ uri: o.imageUrl }} style={styles.offerImage} /> : null}
                <Text style={styles.offerTitle}>{o.title}</Text>
                <Text style={styles.offerDesc}>{o.description}</Text>
                <View style={styles.rowBetween}>
                  <View style={styles.pricePill}>
                    <DollarSign size={14} color={Colors.common.white} />
                    <Text style={styles.pricePillText}>{o.price} MAD</Text>
                  </View>
                  <Text style={styles.netText}>Net labo: {net.toFixed(2)} MAD</Text>
                </View>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleEdit(o)} testID={`edit-${o.id}`}>
                    <Edit3 size={16} color={Colors.laboratory.primary} />
                    <Text style={styles.secondaryBtnText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dangerBtn} onPress={() => handleDelete(o.id)} testID={`delete-${o.id}`}>
                    <Trash2 size={16} color={Colors.common.white} />
                    <Text style={styles.dangerBtnText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  content: { padding: 16, gap: 16 },
  header: { fontSize: 22, fontWeight: '700' as const, color: Colors.laboratory.primary },
  sub: { fontSize: 14, color: Colors.common.darkGray },
  errorText: { color: 'red', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: '#fff' },
  multiline: { minHeight: 80, textAlignVertical: 'top' as const },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.laboratory.primary, paddingVertical: 12, borderRadius: 10, justifyContent: 'center' },
  primaryBtnText: { color: Colors.common.white, fontWeight: '600' as const, fontSize: 16 },
  note: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  noteText: { color: Colors.common.darkGray, fontSize: 12, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 12 },
  offerCard: { width: 320, backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  offerImage: { width: '100%', height: 120, borderRadius: 8 },
  offerTitle: { fontSize: 16, fontWeight: '700' as const },
  offerDesc: { fontSize: 13, color: '#4b5563' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  pricePill: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: Colors.laboratory.primary, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  pricePillText: { color: Colors.common.white, fontWeight: '600' as const },
  netText: { color: '#111827', fontSize: 12, fontWeight: '500' as const },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: Colors.laboratory.primary, backgroundColor: '#fff' },
  outlineBtn: { alignSelf: 'flex-start', marginTop: 4, borderWidth: 1, borderColor: Colors.common.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  outlineBtnText: { color: '#111827', fontWeight: '600' as const },
  secondaryBtnText: { color: Colors.laboratory.primary, fontWeight: '600' as const },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#ef4444' },
  dangerBtnText: { color: Colors.common.white, fontWeight: '600' as const },
  preview: { width: '100%', height: 140, borderRadius: 10 },
});
