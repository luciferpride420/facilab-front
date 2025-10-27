import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Package,
  Calendar,
  MapPin,
  CheckCircle,
  Phone,
  User,
  X,
  UserCheck,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockOrders, mockNurses } from '@/constants/mockData';
import { Order } from '@/constants/types';

export default function LaboratoryOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [nurseModalVisible, setNurseModalVisible] = useState<boolean>(false);

  const handleCallPatient = (phone: string) => {
    const phoneNumber = phone.replace(/\s+/g, '');
    Alert.alert(
      'Appeler le patient',
      `Voulez-vous appeler ${phoneNumber} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appeler',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
            console.log('Calling patient:', phoneNumber);
          },
        },
      ]
    );
  };

  const handleConfirmOrder = (orderId: string) => {
    Alert.alert(
      'Confirmer la commande',
      'Confirmez-vous avoir pris contact avec le patient et planifié le rendez-vous ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setOrders(
              orders.map(o =>
                o.id === orderId
                  ? { ...o, status: 'confirmed', confirmedByLab: true, confirmedAt: new Date().toISOString() }
                  : o
              )
            );
            console.log('Order confirmed:', orderId);
          },
        },
      ]
    );
  };

  const handleAssignNurse = (order: Order) => {
    setSelectedOrder(order);
    setNurseModalVisible(true);
  };

  const assignNurse = (nurseId: string, nurseName: string) => {
    if (!selectedOrder) return;

    setOrders(
      orders.map(o =>
        o.id === selectedOrder.id
          ? { ...o, assignedNurse: nurseName, status: 'in_progress' }
          : o
      )
    );
    console.log('Nurse assigned:', { orderId: selectedOrder.id, nurseId, nurseName });
    setNurseModalVisible(false);
    setSelectedOrder(null);
  };

  const handleUploadResults = (orderId: string) => {
    router.push('/laboratory/upload');
    console.log('Upload results for order:', orderId);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return Colors.common.warning;
      case 'confirmed':
        return Colors.patient.primary;
      case 'in_progress':
        return Colors.agent.primary;
      case 'completed':
        return Colors.common.success;
      default:
        return Colors.common.gray;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Commandes</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderIdRow}>
                <Package size={18} color={Colors.common.gray} />
                <Text style={styles.orderId}>#{order.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            <View style={styles.patientSection}>
              <View style={styles.patientInfo}>
                <User size={16} color={Colors.common.gray} />
                <Text style={styles.patientName}>{order.patientName}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCallPatient('0612345678')}
              >
                <Phone size={16} color={Colors.common.white} />
                <Text style={styles.callButtonText}>Appeler</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.testsText}>{order.tests.map(t => t.name).join(', ')}</Text>

            <View style={styles.orderDetails}>
              {order.scheduledDate && (
                <View style={styles.detailRow}>
                  <Calendar size={14} color={Colors.common.gray} />
                  <Text style={styles.detailText}>
                    {new Date(order.scheduledDate).toLocaleDateString('fr-FR')} à {order.scheduledTime || 'Non défini'}
                  </Text>
                </View>
              )}
              {order.address && (
                <View style={styles.detailRow}>
                  <MapPin size={14} color={Colors.common.gray} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {order.address}
                  </Text>
                </View>
              )}
              {order.assignedNurse && (
                <View style={styles.detailRow}>
                  <UserCheck size={14} color={Colors.laboratory.primary} />
                  <Text style={[styles.detailText, { color: Colors.laboratory.primary }]}>
                    Infirmier: {order.assignedNurse}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Montant</Text>
              <Text style={styles.priceValue}>{order.price.toFixed(2)} MAD</Text>
            </View>

            <View style={styles.actionsRow}>
              {order.status === 'pending' && !order.confirmedByLab && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.confirmButton]}
                  onPress={() => handleConfirmOrder(order.id)}
                >
                  <CheckCircle size={16} color={Colors.common.white} />
                  <Text style={styles.actionButtonText}>Confirmer RDV</Text>
                </TouchableOpacity>
              )}

              {order.confirmedByLab && !order.assignedNurse && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.assignButton]}
                  onPress={() => handleAssignNurse(order)}
                >
                  <UserCheck size={16} color={Colors.common.white} />
                  <Text style={styles.actionButtonText}>Assigner infirmier</Text>
                </TouchableOpacity>
              )}

              {order.assignedNurse && order.status !== 'completed' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.uploadButton]}
                  onPress={() => handleUploadResults(order.id)}
                >
                  <Package size={16} color={Colors.common.white} />
                  <Text style={styles.actionButtonText}>Uploader résultats</Text>
                </TouchableOpacity>
              )}

              {order.status === 'completed' && (
                <View style={styles.completedBadge}>
                  <CheckCircle size={16} color={Colors.common.success} />
                  <Text style={styles.completedText}>Commande terminée</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={nurseModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNurseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assigner un infirmier</Text>
              <TouchableOpacity onPress={() => setNurseModalVisible(false)}>
                <X size={24} color={Colors.common.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.nurseList}>
              {mockNurses.map((nurse) => (
                <TouchableOpacity
                  key={nurse.id}
                  style={styles.nurseItem}
                  onPress={() => assignNurse(nurse.id, nurse.name)}
                >
                  <View style={styles.nurseAvatar}>
                    <Text style={styles.nurseAvatarText}>{nurse.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.nurseInfo}>
                    <Text style={styles.nurseName}>{nurse.name}</Text>
                    <Text style={styles.nurseLicense}>{nurse.license}</Text>
                    <Text style={styles.nurseAvailability}>
                      {nurse.availability.join(', ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    color: Colors.laboratory.primary,
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
    backgroundColor: Colors.laboratory.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdRow: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  patientSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.border,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.common.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  testsText: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 12,
    lineHeight: 20,
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: Colors.common.gray,
    flex: 1,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.common.border,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.laboratory.primary,
  },
  actionsRow: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: Colors.patient.primary,
  },
  assignButton: {
    backgroundColor: Colors.agent.primary,
  },
  uploadButton: {
    backgroundColor: Colors.laboratory.primary,
  },
  actionButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.common.success + '20',
    borderRadius: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.common.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  nurseList: {
    maxHeight: 400,
  },
  nurseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  nurseAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.laboratory.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nurseAvatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.white,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 2,
  },
  nurseLicense: {
    fontSize: 13,
    color: Colors.common.gray,
    marginBottom: 2,
  },
  nurseAvailability: {
    fontSize: 12,
    color: Colors.laboratory.primary,
  },
});
