import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Edit, Trash2, X, Package } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { useTests } from '@/contexts/TestContext';
import { Test, TestPack } from '@/constants/types';

type TabType = 'tests' | 'packs';
type ModalMode = 'add' | 'edit' | null;

export default function AdminCatalog() {
  const { tests, packs, addTest, updateTest, deleteTest, addPack, updatePack, deletePack } = useTests();
  const [activeTab, setActiveTab] = useState<TabType>('tests');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<Test | TestPack | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Test & TestPack>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
    preparation: '',
    requiresPrescription: false,
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      duration: '',
      preparation: '',
      requiresPrescription: false,
    });
    setModalMode('add');
    setModalVisible(true);
  };

  const openEditModal = (item: Test | TestPack) => {
    setSelectedItem(item);
    setFormData(item);
    setModalMode('edit');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    try {
      if (activeTab === 'tests') {
        const testData: Test = {
          id: modalMode === 'add' ? `test_${Date.now()}` : (selectedItem as Test).id,
          name: formData.name || '',
          description: formData.description || '',
          category: formData.category || '',
          price: formData.price || 0,
          duration: formData.duration || '',
          preparation: formData.preparation,
          imageUrl: formData.imageUrl,
          requiresPrescription: formData.requiresPrescription || false,
        };

        if (modalMode === 'add') {
          await addTest(testData);
        } else {
          await updateTest(testData.id, testData);
        }
      } else {
        const packData: TestPack = {
          id: modalMode === 'add' ? `pack_${Date.now()}` : (selectedItem as TestPack).id,
          name: formData.name || '',
          description: formData.description || '',
          tests: formData.tests || [],
          price: formData.price || 0,
          discount: formData.discount || 0,
          imageUrl: formData.imageUrl,
        };

        if (modalMode === 'add') {
          await addPack(packData);
        } else {
          await updatePack(packData.id, packData);
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'tests') {
        await deleteTest(id);
      } else {
        await deletePack(id);
      }
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Gestion du Catalogue</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Plus size={20} color={Colors.common.white} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tests' && styles.activeTab]}
            onPress={() => setActiveTab('tests')}
          >
            <Text style={[styles.tabText, activeTab === 'tests' && styles.activeTabText]}>
              Tests ({tests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'packs' && styles.activeTab]}
            onPress={() => setActiveTab('packs')}
          >
            <Text style={[styles.tabText, activeTab === 'packs' && styles.activeTabText]}>
              Packs ({packs.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'tests' &&
            tests.map((test) => (
              <View key={test.id} style={styles.itemCard}>
                <View style={styles.itemMain}>
                  <Text style={styles.itemName}>{test.name}</Text>
                  <Text style={styles.itemCategory}>{test.category}</Text>
                  <Text style={styles.itemPrice}>{test.price.toFixed(2)} MAD</Text>
                  {test.requiresPrescription && (
                    <View style={styles.prescriptionBadge}>
                      <Text style={styles.prescriptionText}>Ordonnance requise</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: Colors.admin.light }]}
                    onPress={() => openEditModal(test)}
                  >
                    <Edit size={18} color={Colors.admin.dark} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: Colors.common.error }]}
                    onPress={() => setConfirmDeleteId(test.id)}
                  >
                    <Trash2 size={18} color={Colors.common.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {activeTab === 'packs' &&
            packs.map((pack) => (
              <View key={pack.id} style={styles.itemCard}>
                <View style={styles.packIcon}>
                  <Package size={24} color={Colors.admin.primary} />
                </View>
                <View style={styles.itemMain}>
                  <Text style={styles.itemName}>{pack.name}</Text>
                  <Text style={styles.itemCategory}>{pack.tests.length} tests inclus</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.itemPrice, { textDecorationLine: 'line-through', fontSize: 14 }]}>
                      {(pack.price + pack.discount).toFixed(2)} MAD
                    </Text>
                    <Text style={styles.itemPrice}>{pack.price.toFixed(2)} MAD</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>-{pack.discount} MAD</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: Colors.admin.light }]}
                    onPress={() => openEditModal(pack)}
                  >
                    <Edit size={18} color={Colors.admin.dark} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: Colors.common.error }]}
                    onPress={() => setConfirmDeleteId(pack.id)}
                  >
                    <Trash2 size={18} color={Colors.common.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === 'add' ? 'Ajouter' : 'Modifier'}{' '}
                {activeTab === 'tests' ? 'un Test' : 'un Pack'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={Colors.common.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Nom du test ou pack"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Description détaillée"
                  placeholderTextColor={Colors.common.gray}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {activeTab === 'tests' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Catégorie</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.category}
                      onChangeText={(text) => setFormData({ ...formData, category: text })}
                      placeholder="Catégorie du test"
                      placeholderTextColor={Colors.common.gray}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Durée</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.duration}
                      onChangeText={(text) => setFormData({ ...formData, duration: text })}
                      placeholder="Ex: 15 min"
                      placeholderTextColor={Colors.common.gray}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Préparation</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={formData.preparation}
                      onChangeText={(text) => setFormData({ ...formData, preparation: text })}
                      placeholder="Instructions de préparation"
                      placeholderTextColor={Colors.common.gray}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <View style={styles.switchRow}>
                      <Text style={styles.label}>Ordonnance requise</Text>
                      <Switch
                        value={formData.requiresPrescription}
                        onValueChange={(value) =>
                          setFormData({ ...formData, requiresPrescription: value })
                        }
                        trackColor={{ false: Colors.common.lightGray, true: Colors.admin.light }}
                        thumbColor={formData.requiresPrescription ? Colors.admin.primary : Colors.common.gray}
                      />
                    </View>
                  </View>
                </>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Prix (MAD)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price?.toString() || ''}
                  onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                  placeholder="Prix en MAD"
                  placeholderTextColor={Colors.common.gray}
                  keyboardType="numeric"
                />
              </View>

              {activeTab === 'packs' && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Réduction (MAD)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.discount?.toString() || ''}
                    onChangeText={(text) => setFormData({ ...formData, discount: parseFloat(text) || 0 })}
                    placeholder="Montant de la réduction"
                    placeholderTextColor={Colors.common.gray}
                    keyboardType="numeric"
                  />
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>URL de l'image</Text>
                <TextInput
                  style={styles.input}
                  value={formData.imageUrl}
                  onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                  placeholder="https://..."
                  placeholderTextColor={Colors.common.gray}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmDeleteId !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setConfirmDeleteId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>Confirmer la suppression</Text>
            <Text style={styles.confirmText}>
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setConfirmDeleteId(null)}
              >
                <Text style={styles.confirmCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              >
                <Text style={styles.confirmDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.admin.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.admin.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.common.white,
    fontSize: 15,
    fontWeight: '600' as const,
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
    borderBottomColor: Colors.admin.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.common.gray,
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: Colors.admin.primary,
    fontWeight: '700' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  itemCard: {
    backgroundColor: Colors.admin.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  packIcon: {
    marginRight: 12,
  },
  itemMain: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prescriptionBadge: {
    backgroundColor: Colors.common.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  prescriptionText: {
    fontSize: 12,
    color: Colors.common.white,
    fontWeight: '600' as const,
  },
  discountBadge: {
    backgroundColor: Colors.common.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    color: Colors.common.white,
    fontWeight: '600' as const,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    maxHeight: '90%',
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
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: Platform.OS === 'web' ? 500 : 400,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.common.darkGray,
    backgroundColor: Colors.common.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.common.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.admin.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.white,
  },
  confirmDialog: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 12,
  },
  confirmText: {
    fontSize: 15,
    color: Colors.common.gray,
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.common.border,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.common.error,
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.common.white,
  },
});
