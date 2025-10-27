import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Lock, Globe, Database, Shield, LogOut } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { useState } from 'react';

export default function AdminSettings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Général</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.common.gray} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ true: Colors.admin.primary }} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={Colors.common.gray} />
              <Text style={styles.settingText}>Mode maintenance</Text>
            </View>
            <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} trackColor={{ true: Colors.admin.primary }} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Système</Text>
          <TouchableOpacity style={styles.settingButton}>
            <Globe size={20} color={Colors.common.gray} />
            <Text style={styles.settingText}>Configuration API</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Database size={20} color={Colors.common.gray} />
            <Text style={styles.settingText}>Base de données</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Lock size={20} color={Colors.common.gray} />
            <Text style={styles.settingText}>Sécurité</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingButton} onPress={() => router.push('/')}>
            <LogOut size={20} color={Colors.common.error} />
            <Text style={[styles.settingText, { color: Colors.common.error }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.admin.background },
  header: { padding: 20, backgroundColor: Colors.common.white, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  backText: { fontSize: 16, color: Colors.admin.primary, fontWeight: '500' as const, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.common.darkGray },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: __DEV__ ? 120 : 20 },
  section: { backgroundColor: Colors.common.white, borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.common.darkGray, marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  settingText: { fontSize: 16, color: Colors.common.darkGray, fontWeight: '500' as const },
});
