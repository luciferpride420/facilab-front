import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, Briefcase, Award, LogOut } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (!user || user.role !== 'agent') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Accès non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={Colors.agent.primary} />
            </View>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>Agent Support</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Mail size={20} color={Colors.agent.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            {user.phone && (
              <View style={styles.infoItem}>
                <Phone size={20} color={Colors.agent.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Téléphone</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </View>
            )}

            {('department' in user) && (user as any).department && (
              <View style={styles.infoItem}>
                <Briefcase size={20} color={Colors.agent.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Département</Text>
                  <Text style={styles.infoValue}>{(user as any).department}</Text>
                </View>
              </View>
            )}

            {('assignedComplaints' in user) && (user as any).assignedComplaints !== undefined && (
              <View style={styles.infoItem}>
                <Award size={20} color={Colors.agent.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Réclamations assignées</Text>
                  <Text style={styles.infoValue}>{(user as any).assignedComplaints}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Statistiques du mois</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Réclamations résolues</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3.5h</Text>
              <Text style={styles.statLabel}>Temps moyen de résolution</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Taux de satisfaction</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={20} color={Colors.common.white} />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: Colors.agent.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.agent.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.agent.primary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.agent.text,
    marginBottom: 24,
  },
  infoSection: {
    width: '100%',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.common.white,
    padding: 16,
    borderRadius: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.common.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  statsCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 20,
  },
  statsGrid: {
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.agent.background,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.agent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.agent.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: Colors.common.error,
    textAlign: 'center',
  },
});
