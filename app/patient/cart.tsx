import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockTests } from '@/constants/mockData';

export default function PatientCart() {
  const router = useRouter();

  const cartItems = [
    { test: mockTests[0], quantity: 1 },
    { test: mockTests[2], quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.test.price * item.quantity, 0);
  const fees = 5.0;
  const total = subtotal + fees;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mon Panier</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <Image source={{ uri: item.test.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.test.name}</Text>
              <Text style={styles.itemCategory}>{item.test.category}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>{item.test.price.toFixed(2)} €</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Minus size={16} color={Colors.patient.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Plus size={16} color={Colors.patient.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton}>
              <Trash2 size={20} color={Colors.common.error} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Résumé</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de service</Text>
            <Text style={styles.summaryValue}>{fees.toFixed(2)} €</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/patient/checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>
            Commander - {total.toFixed(2)} €
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: __DEV__ ? 200 : 120,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.common.lightGray,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    color: Colors.common.gray,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.patient.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  summary: {
    backgroundColor: Colors.patient.background,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.common.darkGray,
    fontWeight: '500' as const,
  },
  summaryTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.common.border,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
  },
  footer: {
    padding: 20,
    paddingBottom: __DEV__ ? 90 : 20,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
    backgroundColor: Colors.common.white,
  },
  checkoutButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.common.white,
    fontSize: 17,
    fontWeight: '600' as const,
  },
});
