import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Package, ShoppingCart } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockTests, mockPacks } from '@/constants/mockData';

export default function PatientCatalog() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tests' | 'packs'>('tests');

  const filteredTests = mockTests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPacks = mockPacks.filter((pack) =>
    pack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/patient/cart')}>
            <ShoppingCart size={24} color={Colors.patient.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Catalogue</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.common.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une analyse..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity>
            <Filter size={20} color={Colors.common.gray} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tests' && styles.activeTab]}
          onPress={() => setActiveTab('tests')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'tests' && styles.activeTabText]}>
            Tests individuels
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'packs' && styles.activeTab]}
          onPress={() => setActiveTab('packs')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'packs' && styles.activeTabText]}>
            Packs santé
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'tests' && (
          <View style={styles.grid}>
            {filteredTests.map((test) => (
              <TouchableOpacity
                key={test.id}
                style={styles.card}
                onPress={() => router.push(`/patient/test/${test.id}`)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: test.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardCategory}>{test.category}</Text>
                  <Text style={styles.cardTitle}>{test.name}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {test.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>{test.price.toFixed(2)} MAD</Text>
                    <Text style={styles.cardDuration}>{test.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'packs' && (
          <View style={styles.grid}>
            {filteredPacks.map((pack) => (
              <TouchableOpacity
                key={pack.id}
                style={styles.card}
                onPress={() => router.push('/patient/cart')}
                activeOpacity={0.8}
              >
                <Image source={{ uri: pack.imageUrl }} style={styles.cardImage} />
                <View style={styles.packBadge}>
                  <Package size={16} color={Colors.common.white} />
                  <Text style={styles.packBadgeText}>Pack</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{pack.name}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {pack.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardPrice}>{pack.price.toFixed(2)} MAD</Text>
                      <Text style={styles.cardDiscount}>
                        Économisez {pack.discount.toFixed(2)} MAD
                      </Text>
                    </View>
                    <Text style={styles.packTests}>{pack.tests.length} tests</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    backgroundColor: Colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: Colors.patient.primary,
    fontWeight: '500' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.patient.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.common.darkGray,
    outlineStyle: 'none',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
    backgroundColor: Colors.common.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.patient.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.common.gray,
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: Colors.patient.primary,
    fontWeight: '600' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: __DEV__ ? 140 : 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.common.lightGray,
  },
  packBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.patient.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  packBadgeText: {
    color: Colors.common.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  cardContent: {
    padding: 16,
  },
  cardCategory: {
    fontSize: 12,
    color: Colors.patient.primary,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.common.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
  },
  cardDiscount: {
    fontSize: 12,
    color: Colors.common.success,
    fontWeight: '500' as const,
  },
  cardDuration: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  packTests: {
    fontSize: 14,
    color: Colors.common.gray,
    fontWeight: '500' as const,
  },
});
