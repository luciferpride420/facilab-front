import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Building2, Calendar, Clock, MapPin, CreditCard, Upload, FileText, AlertCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

export default function PatientCheckout() {
  const router = useRouter();
  const [location, setLocation] = useState<'home' | 'laboratory'>('home');
  const [address, setAddress] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [requiresPrescription] = useState<boolean>(true);

  const handlePrescriptionUpload = () => {
    Alert.alert(
      'Upload Ordonnance',
      'Sélectionnez votre ordonnance médicale',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Choisir fichier',
          onPress: () => {
            setPrescriptionFile('prescription_sample.pdf');
            console.log('Prescription uploaded');
          },
        },
      ]
    );
  };

  const handlePlaceOrder = () => {
    if (requiresPrescription && !prescriptionFile) {
      Alert.alert(
        'Ordonnance requise',
        'Ce test nécessite une ordonnance médicale. Veuillez l\'uploader avant de continuer.'
      );
      return;
    }
    console.log('Order placed:', { location, address, date, time, prescriptionFile });
    router.push('/patient/orders');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Commander</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lieu du prélèvement</Text>
          <View style={styles.locationOptions}>
            <TouchableOpacity
              style={[styles.locationCard, location === 'home' && styles.locationCardActive]}
              onPress={() => setLocation('home')}
              activeOpacity={0.7}
            >
              <Home
                size={32}
                color={location === 'home' ? Colors.patient.primary : Colors.common.gray}
              />
              <Text
                style={[
                  styles.locationTitle,
                  location === 'home' && styles.locationTitleActive,
                ]}
              >
                À domicile
              </Text>
              <Text style={styles.locationSubtitle}>Un infirmier vient chez vous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.locationCard,
                location === 'laboratory' && styles.locationCardActive,
              ]}
              onPress={() => setLocation('laboratory')}
              activeOpacity={0.7}
            >
              <Building2
                size={32}
                color={
                  location === 'laboratory' ? Colors.patient.primary : Colors.common.gray
                }
              />
              <Text
                style={[
                  styles.locationTitle,
                  location === 'laboratory' && styles.locationTitleActive,
                ]}
              >
                En laboratoire
              </Text>
              <Text style={styles.locationSubtitle}>Vous vous déplacez</Text>
            </TouchableOpacity>
          </View>
        </View>

        {location === 'home' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.common.gray} />
              <TextInput
                style={styles.input}
                placeholder="Votre adresse complète"
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>
          </View>
        )}

        {requiresPrescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordonnance médicale *</Text>
            <View style={styles.prescriptionInfo}>
              <AlertCircle size={16} color={Colors.common.warning} />
              <Text style={styles.prescriptionInfoText}>
                Ce test nécessite une ordonnance médicale valide
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                prescriptionFile && styles.uploadButtonSuccess,
              ]}
              onPress={handlePrescriptionUpload}
              activeOpacity={0.7}
            >
              {prescriptionFile ? (
                <FileText size={20} color={Colors.common.success} />
              ) : (
                <Upload size={20} color={Colors.patient.primary} />
              )}
              <Text
                style={[
                  styles.uploadButtonText,
                  prescriptionFile && styles.uploadButtonTextSuccess,
                ]}
              >
                {prescriptionFile
                  ? 'Ordonnance uploadée ✓'
                  : 'Uploader ordonnance'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date et heure</Text>
          <View style={styles.dateTimeRow}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Calendar size={20} color={Colors.common.gray} />
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Clock size={20} color={Colors.common.gray} />
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paiement</Text>
          <View style={styles.inputContainer}>
            <CreditCard size={20} color={Colors.common.gray} />
            <TextInput
              style={styles.input}
              placeholder="Numéro de carte"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.cardDetailsRow}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput style={styles.input} placeholder="MM/AA" />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput style={styles.input} placeholder="CVV" keyboardType="number-pad" />
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total à payer</Text>
            <Text style={styles.priceValue}>700.00 MAD</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.orderButtonText}>Valider la commande</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  backText: {
    fontSize: 16,
    color: Colors.patient.primary,
    fontWeight: '500' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 200 : 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  locationOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  locationCard: {
    flex: 1,
    backgroundColor: Colors.common.white,
    borderWidth: 2,
    borderColor: Colors.common.border,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  locationCardActive: {
    borderColor: Colors.patient.primary,
    backgroundColor: Colors.patient.background,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginTop: 12,
    marginBottom: 4,
  },
  locationTitleActive: {
    color: Colors.patient.primary,
  },
  locationSubtitle: {
    fontSize: 13,
    color: Colors.common.gray,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: Colors.common.white,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.common.darkGray,
    outlineStyle: 'none',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceSection: {
    backgroundColor: Colors.patient.background,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
  },
  footer: {
    padding: 20,
    paddingBottom: __DEV__ ? 90 : 20,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
    backgroundColor: Colors.common.white,
  },
  orderButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonText: {
    color: Colors.common.white,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  prescriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.common.warning + '20',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  prescriptionInfoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.common.darkGray,
    lineHeight: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.patient.primary,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: Colors.common.white,
    borderStyle: 'dashed',
  },
  uploadButtonSuccess: {
    borderColor: Colors.common.success,
    backgroundColor: Colors.common.success + '10',
    borderStyle: 'solid',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.patient.primary,
  },
  uploadButtonTextSuccess: {
    color: Colors.common.success,
  },
});
