import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Settings, Bell, Weight, Ruler, Droplet, Edit2, Save, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockPatients } from '@/constants/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientProfile() {
  const router = useRouter();
  const { logout } = useAuth();
  const [patient, setPatient] = useState(mockPatients[0]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    age: patient.age || '',
    weight: patient.weight || '',
    height: patient.height || '',
    bloodType: patient.bloodType || '',
    allergies: patient.allergies?.join(', ') || '',
    medicalHistory: patient.medicalHistory || '',
  });

  const handleSave = () => {
    console.log('Saving profile:', editData);
    setPatient({
      ...patient,
      age: editData.age ? Number(editData.age) : undefined,
      weight: editData.weight ? Number(editData.weight) : undefined,
      height: editData.height ? Number(editData.height) : undefined,
      bloodType: editData.bloodType || undefined,
      allergies: editData.allergies ? editData.allergies.split(',').map(a => a.trim()) : undefined,
      medicalHistory: editData.medicalHistory || undefined,
    });
    setIsEditing(false);
    if (Platform.OS === 'web') {
      alert('Profil mis à jour avec succès');
    } else {
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    }
  };

  const handleCancel = () => {
    setEditData({
      age: patient.age || '',
      weight: patient.weight || '',
      height: patient.height || '',
      bloodType: patient.bloodType || '',
      allergies: patient.allergies?.join(', ') || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        {Platform.OS !== 'web' && (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mon Profil</Text>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
            >
              <Edit2 size={20} color={Colors.patient.primary} />
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <X size={20} color={Colors.common.gray} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Save size={20} color={Colors.common.white} />
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={40} color={Colors.patient.primary} strokeWidth={2} />
          </View>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.email}>{patient.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <View style={styles.infoItem}>
            <Mail size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{patient.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{patient.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>{patient.address}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Calendar size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date de naissance</Text>
              <Text style={styles.infoValue}>
                {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseignée'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations médicales</Text>
          <Text style={styles.sectionSubtitle}>
            Ces informations sont privées et peuvent être utilisées par l{"'"}assistant IA pour des recommandations personnalisées
          </Text>

          <View style={styles.infoItem}>
            <User size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Âge</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={String(editData.age)}
                  onChangeText={(text) => setEditData({ ...editData, age: text })}
                  placeholder="Ex: 35"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {patient.age ? `${patient.age} ans` : 'Non renseigné'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Weight size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Poids</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={String(editData.weight)}
                  onChangeText={(text) => setEditData({ ...editData, weight: text })}
                  placeholder="Ex: 70"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {patient.weight ? `${patient.weight} kg` : 'Non renseigné'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ruler size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Taille</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={String(editData.height)}
                  onChangeText={(text) => setEditData({ ...editData, height: text })}
                  placeholder="Ex: 175"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {patient.height ? `${patient.height} cm` : 'Non renseigné'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Droplet size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Groupe sanguin</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editData.bloodType}
                  onChangeText={(text) => setEditData({ ...editData, bloodType: text })}
                  placeholder="Ex: A+"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {patient.bloodType || 'Non renseigné'}
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
            <Bell size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Allergies</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, styles.multilineInput]}
                  value={editData.allergies}
                  onChangeText={(text) => setEditData({ ...editData, allergies: text })}
                  placeholder="Ex: Pénicilline, Arachides"
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>
                  {patient.allergies && patient.allergies.length > 0
                    ? patient.allergies.join(', ')
                    : 'Aucune allergie connue'}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <Settings size={20} color={Colors.common.gray} />
            <Text style={styles.settingText}>Paramètres du compte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <Bell size={20} color={Colors.common.gray} />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={async () => {
              await logout();
              router.push('/');
            }}
          >
            <LogOut size={20} color={Colors.common.error} />
            <Text style={[styles.settingText, { color: Colors.common.error }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.patient.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  backText: {
    fontSize: 16,
    color: Colors.patient.primary,
    fontWeight: '500' as const,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.patient.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.patient.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.patient.primary,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  profileCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.patient.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  section: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.common.gray,
    marginBottom: 16,
    lineHeight: 18,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.common.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.common.darkGray,
    fontWeight: '500' as const,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  settingText: {
    fontSize: 16,
    color: Colors.common.darkGray,
    marginLeft: 12,
    fontWeight: '500' as const,
  },
  infoInput: {
    fontSize: 15,
    color: Colors.common.darkGray,
    fontWeight: '500' as const,
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    outlineStyle: 'none',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
