import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, Phone, Calendar, Edit, Trash2, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockNurses } from '@/constants/mockData';
import { Nurse } from '@/constants/types';

export default function LaboratoryStaff() {
  const router = useRouter();
  const [nurses, setNurses] = useState<Nurse[]>(mockNurses);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [formData, setFormData] = useState<Partial<Nurse>>({
    name: '',
    phone: '',
    license: '',
    availability: [],
  });

  const openAddModal = () => {
    setEditingNurse(null);
    setFormData({
      name: '',
      phone: '',
      license: '',
      availability: [],
    });
    setModalVisible(true);
  };

  const openEditModal = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setFormData(nurse);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.license) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingNurse) {
      setNurses(nurses.map(n => n.id === editingNurse.id ? { ...editingNurse, ...formData } : n));
      console.log('Nurse updated:', { ...editingNurse, ...formData });
    } else {
      const newNurse: Nurse = {
        id: `n${Date.now()}`,
        name: formData.name!,
        phone: formData.phone!,
        license: formData.license!,
        availability: formData.availability || [],
      };
      setNurses([...nurses, newNurse]);
      console.log('Nurse added:', newNurse);
    }
    setModalVisible(false);
  };

  const handleDelete = (nurseId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet infirmier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setNurses(nurses.filter(n => n.id !== nurseId));
            console.log('Nurse deleted:', nurseId);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Personnel</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <UserPlus size={20} color={Colors.common.white} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {nurses.map((nurse) => (
          <View key={nurse.id} style={styles.nurseCard}>
            <View style={styles.nurseHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{nurse.name.charAt(0)}</Text>
              </View>
              <View style={styles.nurseInfo}>
                <Text style={styles.nurseName}>{nurse.name}</Text>
                <Text style={styles.nurseLicense}>{nurse.license}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(nurse)}
                >
                  <Edit size={18} color={Colors.laboratory.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(nurse.id)}
                >
                  <Trash2 size={18} color={Colors.common.error} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.nurseDetails}>
              <View style={styles.detailRow}>
                <Phone size={16} color={Colors.common.gray} />
                <Text style={styles.detailText}>{nurse.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={16} color={Colors.common.gray} />
                <Text style={styles.detailText}>{nurse.availability.join(', ')}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNurse ? 'Modifier' : 'Ajouter'} un infirmier
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.common.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom complet *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Nom et prénom"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Téléphone *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="06XXXXXXXX"
                  placeholderTextColor={Colors.common.gray}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Numéro de licence *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.license}
                  onChangeText={(text) => setFormData({ ...formData, license: text })}
                  placeholder="INF-XXXX-XXX-XXX"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Disponibilité</Text>
                <Text style={styles.helperText}>
                  Jours disponibles (séparés par des virgules)
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.availability?.join(', ')}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      availability: text.split(',').map(d => d.trim()).filter(d => d),
                    })
                  }
                  placeholder="Lundi, Mardi, Mercredi..."
                  placeholderTextColor={Colors.common.gray}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  backText: { fontSize: 16, color: Colors.laboratory.primary, fontWeight: '500' as const, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.common.darkGray },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.laboratory.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: __DEV__ ? 120 : 20 },
  nurseCard: { backgroundColor: Colors.laboratory.background, borderRadius: 12, padding: 16, marginBottom: 12 },
  nurseHeader: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.laboratory.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '700' as const, color: Colors.common.white },
  nurseInfo: { flex: 1 },
  nurseName: { fontSize: 18, fontWeight: '600' as const, color: Colors.common.darkGray, marginBottom: 4 },
  nurseLicense: { fontSize: 13, color: Colors.common.gray },
  nurseDetails: { gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: Colors.common.gray, flex: 1 },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.laboratory.background,
    borderWidth: 1,
    borderColor: Colors.laboratory.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.common.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  modalScroll: {
    maxHeight: 400,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 13,
    color: Colors.common.gray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.common.darkGray,
    backgroundColor: Colors.common.white,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.common.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.laboratory.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.white,
  },
});
