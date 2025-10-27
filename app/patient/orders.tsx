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
import { Package, Clock, CheckCircle, AlertCircle, Calendar, MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockOrders } from '@/constants/mockData';
import { OrderStatus } from '@/constants/types';

export default function PatientOrders() {
  const router = useRouter();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return Colors.common.success;
      case 'in_progress':
      case 'scheduled':
        return Colors.patient.primary;
      case 'pending':
        return Colors.common.warning;
      case 'cancelled':
        return Colors.common.error;
      default:
        return Colors.common.gray;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
      case 'scheduled':
        return Clock;
      case 'pending':
        return AlertCircle;
      case 'cancelled':
        return AlertCircle;
      default:
        return Package;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      pending: 'En attente',
      scheduled: 'Planifié',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mes Commandes</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {mockOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          const statusColor = getStatusColor(order.status);

          return (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdContainer}>
                  <Package size={18} color={Colors.common.gray} />
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                  <StatusIcon size={14} color={statusColor} strokeWidth={2.5} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {getStatusLabel(order.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderContent}>
                <Text style={styles.orderTests}>
                  {order.tests.map((t) => t.name).join(', ')}
                </Text>

                {order.scheduledDate && order.scheduledTime && (
                  <View style={styles.orderDetail}>
                    <Calendar size={16} color={Colors.common.gray} />
                    <Text style={styles.orderDetailText}>
                      {new Date(order.scheduledDate).toLocaleDateString('fr-FR')} à{' '}
                      {order.scheduledTime}
                    </Text>
                  </View>
                )}

                {order.address && (
                  <View style={styles.orderDetail}>
                    <MapPin size={16} color={Colors.common.gray} />
                    <Text style={styles.orderDetailText} numberOfLines={1}>
                      {order.address}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderPrice}>{order.price.toFixed(2)} €</Text>
                {order.status === 'completed' && order.resultsUrl && (
                  <TouchableOpacity
                    style={styles.resultsButton}
                    onPress={() => router.push('/patient/results')}
                  >
                    <Text style={styles.resultsButtonText}>Voir résultats</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
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
  orderCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  orderContent: {
    marginBottom: 12,
  },
  orderTests: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  orderDetailText: {
    fontSize: 14,
    color: Colors.common.gray,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
  },
  resultsButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resultsButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
