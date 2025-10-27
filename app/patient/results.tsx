import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Download, Calendar } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockOrders } from '@/constants/mockData';

export default function PatientResults() {
  const router = useRouter();

  const completedOrders = mockOrders.filter(
    (order) => order.status === 'completed' && order.resultsUrl
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mes Résultats</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {completedOrders.map((order) => (
          <View key={order.id} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.iconContainer}>
                <FileText size={24} color={Colors.patient.primary} />
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>
                  {order.tests.map((t) => t.name).join(', ')}
                </Text>
                <View style={styles.dateRow}>
                  <Calendar size={14} color={Colors.common.gray} />
                  <Text style={styles.resultDate}>
                    {new Date(order.scheduledDate!).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
                <Download size={18} color={Colors.common.white} />
                <Text style={styles.downloadButtonText}>Télécharger PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {completedOrders.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={64} color={Colors.common.gray} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucun résultat disponible</Text>
            <Text style={styles.emptyText}>
              Vos résultats d{"'"}analyses apparaîtront ici une fois disponibles
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: __DEV__ ? 120 : 20,
  },
  resultCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  resultHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.patient.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultDate: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  resultActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
    paddingTop: 12,
  },
  downloadButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadButtonText: {
    color: Colors.common.white,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.common.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});
