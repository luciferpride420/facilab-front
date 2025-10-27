import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Mail, Phone, MapPin, LogOut, Settings } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockLaboratories } from '@/constants/mockData';

export default function LaboratoryProfile() {
  const router = useRouter();
  const lab = mockLaboratories[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Building2 size={40} color={Colors.laboratory.primary} strokeWidth={2} />
          </View>
          <Text style={styles.labName}>{lab.labName}</Text>
          <Text style={styles.license}>{lab.license}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Mail size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{lab.email}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Phone size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{lab.phone}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={20} color={Colors.common.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>{lab.address}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem}>
            <Settings size={20} color={Colors.common.gray} />
            <Text style={styles.settingText}>Paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/')}>
            <LogOut size={20} color={Colors.common.error} />
            <Text style={[styles.settingText, { color: Colors.common.error }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.laboratory.background },
  header: { padding: 20, backgroundColor: Colors.common.white, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  backText: { fontSize: 16, color: Colors.laboratory.primary, fontWeight: '500' as const, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.common.darkGray },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: __DEV__ ? 120 : 20 },
  profileCard: { backgroundColor: Colors.common.white, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.laboratory.background, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  labName: { fontSize: 24, fontWeight: '700' as const, color: Colors.common.darkGray, marginBottom: 4 },
  license: { fontSize: 14, color: Colors.common.gray },
  section: { backgroundColor: Colors.common.white, borderRadius: 16, padding: 20, marginBottom: 16 },
  infoItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  infoContent: { marginLeft: 12, flex: 1 },
  infoLabel: { fontSize: 13, color: Colors.common.gray, marginBottom: 2 },
  infoValue: { fontSize: 15, color: Colors.common.darkGray, fontWeight: '500' as const },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  settingText: { fontSize: 16, color: Colors.common.darkGray, marginLeft: 12, fontWeight: '500' as const },
});
