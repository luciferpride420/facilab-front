import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertCircle, FileText, ShoppingCart } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockTests } from '@/constants/mockData';

export default function TestDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState<number>(1);

  const test = mockTests.find((t) => t.id === id) || mockTests[0];

  const handleAddToCart = () => {
    console.log('Add to cart:', { testId: test.id, quantity });
    router.push('/patient/cart');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/patient/cart')}>
            <ShoppingCart size={24} color={Colors.patient.primary} />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: test.imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.category}>{test.category}</Text>
          <Text style={styles.title}>{test.name}</Text>
          <Text style={styles.description}>{test.description}</Text>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Clock size={24} color={Colors.patient.primary} />
              <Text style={styles.infoLabel}>Durée</Text>
              <Text style={styles.infoValue}>{test.duration}</Text>
            </View>
            <View style={styles.infoCard}>
              <FileText size={24} color={Colors.patient.primary} />
              <Text style={styles.infoLabel}>Résultats</Text>
              <Text style={styles.infoValue}>24-48h</Text>
            </View>
          </View>

          {(test.preparation || test.requiresPrescription) && (
            <View style={styles.prerequisitesSection}>
              <Text style={styles.prerequisitesTitle}>Prérequis</Text>
              
              {test.preparation && (
                <View style={styles.preparationCard}>
                  <View style={styles.preparationHeader}>
                    <AlertCircle size={20} color={Colors.common.warning} />
                    <Text style={styles.preparationLabel}>Préparation</Text>
                  </View>
                  <Text style={styles.preparationText}>{test.preparation}</Text>
                </View>
              )}
              
              {test.requiresPrescription && (
                <View style={styles.prescriptionCard}>
                  <View style={styles.preparationHeader}>
                    <FileText size={20} color={Colors.admin.primary} />
                    <Text style={styles.preparationLabel}>Ordonnance</Text>
                  </View>
                  <Text style={styles.preparationText}>
                    Ce test nécessite une ordonnance médicale valide. Vous devrez la fournir lors de la commande.
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Prix</Text>
              <Text style={styles.price}>{test.price.toFixed(2)} MAD</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <ShoppingCart size={20} color={Colors.common.white} />
              <Text style={styles.addButtonText}>Ajouter au panier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: __DEV__ ? 120 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backText: {
    fontSize: 16,
    color: Colors.patient.primary,
    fontWeight: '500' as const,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.common.lightGray,
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 13,
    color: Colors.patient.primary,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.common.gray,
    lineHeight: 24,
    marginBottom: 24,
  },
  infoCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.patient.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.common.gray,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  prerequisitesSection: {
    marginBottom: 24,
  },
  prerequisitesTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  preparationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  prescriptionCard: {
    backgroundColor: Colors.admin.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.admin.light,
  },
  preparationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  preparationLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  preparationText: {
    fontSize: 14,
    color: Colors.common.gray,
    lineHeight: 20,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.common.border,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
  },
  addButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
