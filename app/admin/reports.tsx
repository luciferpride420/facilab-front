import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, TrendingUp, Download } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockStats } from '@/constants/mockData';

export default function AdminReports() {
  const router = useRouter();

  const reports = [
    { title: 'Rapport mensuel', period: 'Janvier 2025', value: '12,450 €', growth: '+15%' },
    { title: 'Commandes', period: 'Ce mois', value: mockStats.totalOrders.toString(), growth: '+8%' },
    { title: 'Nouveaux patients', period: 'Cette semaine', value: '24', growth: '+12%' },
    { title: 'Taux de satisfaction', period: 'Global', value: '96%', growth: '+2%' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rapports</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartPlaceholder}>
          <BarChart3 size={64} color={Colors.admin.primary} strokeWidth={1.5} />
          <Text style={styles.chartText}>Graphiques et visualisations</Text>
        </View>
        {reports.map((report, index) => (
          <View key={index} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportPeriod}>{report.period}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={20} color={Colors.admin.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.reportStats}>
              <Text style={styles.reportValue}>{report.value}</Text>
              <View style={styles.growthBadge}>
                <TrendingUp size={16} color={Colors.common.success} />
                <Text style={styles.growthText}>{report.growth}</Text>
              </View>
            </View>
          </View>
        ))}
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
  chartPlaceholder: { backgroundColor: Colors.common.white, borderRadius: 16, padding: 40, alignItems: 'center', marginBottom: 20 },
  chartText: { fontSize: 16, color: Colors.common.gray, marginTop: 16 },
  reportCard: { backgroundColor: Colors.common.white, borderRadius: 12, padding: 16, marginBottom: 12 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  reportTitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.common.darkGray, marginBottom: 4 },
  reportPeriod: { fontSize: 13, color: Colors.common.gray },
  downloadButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.admin.background, alignItems: 'center', justifyContent: 'center' },
  reportStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportValue: { fontSize: 28, fontWeight: '700' as const, color: Colors.admin.primary },
  growthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.common.success + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  growthText: { fontSize: 14, fontWeight: '600' as const, color: Colors.common.success },
});
