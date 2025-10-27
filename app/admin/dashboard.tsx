import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  Building2,
  Package,
  DollarSign,
  AlertCircle,
  FileText,
  Wallet,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockStats } from '@/constants/mockData';

export default function AdminDashboard() {
  const router = useRouter();

  const stats = [
    {
      label: 'Commandes totales',
      value: mockStats.totalOrders.toString(),
      icon: Package,
      color: Colors.patient.primary,
      change: '+12%',
    },
    {
      label: 'Revenus totaux',
      value: `${mockStats.totalRevenue.toLocaleString()} MAD`,
      icon: DollarSign,
      color: Colors.common.success,
      change: '+8%',
    },
    {
      label: 'Patients actifs',
      value: mockStats.activePatients.toString(),
      icon: Users,
      color: Colors.patient.primary,
      change: '+15%',
    },
    {
      label: 'Laboratoires',
      value: mockStats.activeLaboratories.toString(),
      icon: Building2,
      color: Colors.laboratory.primary,
      change: '+3',
    },
  ];

  const quickActions = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Patients, laboratoires, agents',
      icon: Users,
      color: Colors.patient.primary,
      route: '/admin/users',
    },
    {
      title: 'Gestion du catalogue',
      description: 'Tests et packs',
      icon: Package,
      color: Colors.admin.primary,
      route: '/admin/catalog',
    },
    {
      title: 'Réclamations',
      description: 'Support et compensations',
      icon: AlertCircle,
      color: Colors.common.warning,
      route: '/admin/complaints',
    },
    {
      title: 'Portefeuille',
      description: 'Transactions et commissions',
      icon: Wallet,
      color: Colors.common.success,
      route: '/admin/wallet',
    },
    {
      title: 'Rapports',
      description: 'Statistiques détaillées',
      icon: FileText,
      color: Colors.agent.primary,
      route: '/admin/reports',
    },
  ];

  const recentActivity = [
    { type: 'order', text: 'Nouvelle commande #247', time: 'Il y a 5 min' },
    { type: 'lab', text: 'Nouveau laboratoire inscrit', time: 'Il y a 23 min' },
    { type: 'complaint', text: 'Réclamation escaladée #C002', time: 'Il y a 1h' },
    { type: 'payment', text: 'Paiement reçu - 520 MAD', time: 'Il y a 2h' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Tableau de Bord</Text>
            <Text style={styles.subtitle}>Vue d&#39;ensemble de la plateforme</Text>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                    <stat.icon size={24} color={stat.color} strokeWidth={2} />
                  </View>
                  <View style={[styles.changeBadge, { backgroundColor: Colors.common.success + '20' }]}>
                    <Text style={[styles.changeText, { color: Colors.common.success }]}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions Rapides</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                    <action.icon size={28} color={action.color} strokeWidth={2} />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activité Récente</Text>
            <View style={styles.activityCard}>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{activity.text}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.metricsSection}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Taux de complétion</Text>
              <Text style={styles.metricValue}>
                {Math.round((mockStats.completedOrders / mockStats.totalOrders) * 100)}%
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.round((mockStats.completedOrders / mockStats.totalOrders) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Commissions totales</Text>
              <Text style={styles.metricValue}>{mockStats.totalCommissions.toLocaleString()} MAD</Text>
              <Text style={styles.metricSubtext}>
                {((mockStats.totalCommissions / mockStats.totalRevenue) * 100).toFixed(1)}% des revenus
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.common.gray,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: '46%',
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  activityCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.admin.primary,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: Colors.common.darkGray,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.common.gray,
  },
  metricsSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.admin.background,
    borderRadius: 12,
    padding: 20,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
    marginBottom: 8,
  },
  metricSubtext: {
    fontSize: 13,
    color: Colors.common.gray,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.common.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.admin.primary,
    borderRadius: 4,
  },
});
