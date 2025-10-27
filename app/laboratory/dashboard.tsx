import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Package, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

const screenWidth = Dimensions.get('window').width;

export default function LaboratoryDashboard() {
  const router = useRouter();

  const stats = [
    { label: 'Commandes ce mois', value: '45', icon: Package, color: Colors.laboratory.primary },
    { label: 'Revenus', value: '32,500 MAD', icon: DollarSign, color: Colors.common.success },
    { label: 'Patients', value: '128', icon: Users, color: Colors.patient.primary },
    { label: 'Taux complétion', value: '94%', icon: TrendingUp, color: Colors.common.warning },
  ];

  const monthlyRevenue = [
    { month: 'Jan', amount: 28000 },
    { month: 'Fév', amount: 31000 },
    { month: 'Mar', amount: 29500 },
    { month: 'Avr', amount: 33000 },
    { month: 'Mai', amount: 35500 },
    { month: 'Juin', amount: 32500 },
  ];

  const monthlyOrders = [
    { month: 'Jan', count: 38 },
    { month: 'Fév', count: 42 },
    { month: 'Mar', count: 40 },
    { month: 'Avr', count: 45 },
    { month: 'Mai', count: 48 },
    { month: 'Juin', count: 45 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));
  const maxOrders = Math.max(...monthlyOrders.map(m => m.count));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tableau de Bord</Text>
        <Text style={styles.subtitle}>Votre performance ce mois</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenus mensuels</Text>
            <View style={styles.chartLegend}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>En MAD</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {monthlyRevenue.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(item.amount / maxRevenue) * 100}%`,
                        backgroundColor: Colors.common.success,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
                <Text style={styles.barValue}>{(item.amount / 1000).toFixed(1)}K</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Commandes mensuelles</Text>
            <View style={styles.chartLegend}>
              <View style={[styles.legendDot, { backgroundColor: Colors.laboratory.primary }]} />
              <Text style={styles.legendText}>Nombre</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {monthlyOrders.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(item.count / maxOrders) * 100}%`,
                        backgroundColor: Colors.laboratory.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
                <Text style={styles.barValue}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/laboratory/schedule')}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Calendar size={20} color={Colors.laboratory.primary} />
            </View>
            <Text style={styles.actionTitle}>Voir le planning</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/laboratory/orders')}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Package size={20} color={Colors.laboratory.primary} />
            </View>
            <Text style={styles.actionTitle}>Gérer les commandes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/laboratory/staff')}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Users size={20} color={Colors.laboratory.primary} />
            </View>
            <Text style={styles.actionTitle}>Gérer le personnel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <CheckCircle size={24} color={Colors.common.success} />
            <Text style={styles.summaryTitle}>Résumé financier</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Revenus bruts</Text>
            <Text style={styles.summaryValue}>32,500 MAD</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Commission FaciLab (25%)</Text>
            <Text style={[styles.summaryValue, { color: Colors.common.error }]}>-8,125 MAD</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowTotal]}>
            <Text style={styles.summaryLabelBold}>Revenus nets</Text>
            <Text style={[styles.summaryValue, styles.summaryValueBold]}>24,375 MAD</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.laboratory.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  backText: {
    fontSize: 16,
    color: Colors.laboratory.primary,
    fontWeight: '500' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '46%',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.common.gray,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.common.success,
  },
  legendText: {
    fontSize: 12,
    color: Colors.common.gray,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    gap: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderRadius: 6,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.common.gray,
    fontWeight: '500' as const,
  },
  barValue: {
    fontSize: 12,
    color: Colors.common.darkGray,
    fontWeight: '600' as const,
  },
  quickActions: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: Colors.laboratory.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.laboratory.primary,
  },
  summaryCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRowTotal: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  summaryValueBold: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.success,
  },
});
