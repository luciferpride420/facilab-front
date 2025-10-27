import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Edit, Trash2, X, MessageSquare, Bell } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

type MessageTemplate = {
  id: string;
  title: string;
  content: string;
  category: 'patient' | 'laboratory' | 'general';
  type: 'message' | 'notice';
};

const initialMessages: MessageTemplate[] = [
  {
    id: '1',
    title: 'Bienvenue sur FaciLab',
    content: 'Bienvenue ! Nous sommes ravis de vous compter parmi nous. N\'hésitez pas à nous contacter pour toute question.',
    category: 'general',
    type: 'message',
  },
  {
    id: '2',
    title: 'Délai de résultats',
    content: 'Vos résultats seront disponibles sous 24-48h. Vous recevrez une notification dès qu\'ils seront prêts.',
    category: 'patient',
    type: 'message',
  },
  {
    id: '3',
    title: 'Commission modifiée',
    content: 'Votre taux de commission a été modifié. Consultez votre tableau de bord pour plus de détails.',
    category: 'laboratory',
    type: 'message',
  },
  {
    id: '4',
    title: 'Maintenance planifiée',
    content: 'Une maintenance est prévue le [DATE] de [HEURE] à [HEURE]. Les services seront temporairement indisponibles.',
    category: 'general',
    type: 'notice',
  },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageTemplate[]>(initialMessages);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<MessageTemplate>>({
    title: '',
    content: '',
    category: 'general',
    type: 'message',
  });

  const openAddModal = () => {
    setEditingMessage(null);
    setFormData({
      title: '',
      content: '',
      category: 'general',
      type: 'message',
    });
    setModalVisible(true);
  };

  const openEditModal = (message: MessageTemplate) => {
    setEditingMessage(message);
    setFormData(message);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingMessage) {
      setMessages(messages.map(m => 
        m.id === editingMessage.id 
          ? { ...editingMessage, ...formData } as MessageTemplate
          : m
      ));
      console.log('Message updated:', { ...editingMessage, ...formData });
    } else {
      const newMessage: MessageTemplate = {
        id: `msg_${Date.now()}`,
        title: formData.title!,
        content: formData.content!,
        category: formData.category!,
        type: formData.type!,
      };
      setMessages([...messages, newMessage]);
      console.log('Message added:', newMessage);
    }
    setModalVisible(false);
  };

  const handleDelete = (messageId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setMessages(messages.filter(m => m.id !== messageId));
            console.log('Message deleted:', messageId);
          },
        },
      ]
    );
  };

  const getCategoryColor = (category: MessageTemplate['category']) => {
    switch (category) {
      case 'patient':
        return Colors.patient.primary;
      case 'laboratory':
        return Colors.laboratory.primary;
      default:
        return Colors.admin.primary;
    }
  };

  const getCategoryLabel = (category: MessageTemplate['category']) => {
    switch (category) {
      case 'patient':
        return 'Patients';
      case 'laboratory':
        return 'Laboratoires';
      default:
        return 'Général';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.title}>Messages & Notices</Text>
            <Text style={styles.subtitle}>Modèles de messages prédéfinis</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Plus size={20} color={Colors.common.white} />
            <Text style={styles.addButtonText}>Nouveau</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {messages.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <View style={styles.messageHeaderLeft}>
                  {message.type === 'message' ? (
                    <MessageSquare size={20} color={getCategoryColor(message.category)} />
                  ) : (
                    <Bell size={20} color={getCategoryColor(message.category)} />
                  )}
                  <View>
                    <Text style={styles.messageTitle}>{message.title}</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(message.category) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.categoryText, { color: getCategoryColor(message.category) }]}
                      >
                        {getCategoryLabel(message.category)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.messageActions}>
                  <TouchableOpacity
                    style={styles.editIconButton}
                    onPress={() => openEditModal(message)}
                  >
                    <Edit size={18} color={Colors.admin.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteIconButton}
                    onPress={() => handleDelete(message.id)}
                  >
                    <Trash2 size={18} color={Colors.common.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.messageContent} numberOfLines={3}>
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMessage ? 'Modifier' : 'Nouveau'} message
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.common.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type *</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      formData.type === 'message' && styles.radioOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'message' })}
                  >
                    <MessageSquare
                      size={18}
                      color={
                        formData.type === 'message' ? Colors.admin.primary : Colors.common.gray
                      }
                    />
                    <Text
                      style={[
                        styles.radioText,
                        formData.type === 'message' && styles.radioTextActive,
                      ]}
                    >
                      Message
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      formData.type === 'notice' && styles.radioOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'notice' })}
                  >
                    <Bell
                      size={18}
                      color={formData.type === 'notice' ? Colors.admin.primary : Colors.common.gray}
                    />
                    <Text
                      style={[
                        styles.radioText,
                        formData.type === 'notice' && styles.radioTextActive,
                      ]}
                    >
                      Notice
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Catégorie *</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      formData.category === 'general' && styles.radioOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category: 'general' })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.category === 'general' && styles.radioTextActive,
                      ]}
                    >
                      Général
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      formData.category === 'patient' && styles.radioOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category: 'patient' })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.category === 'patient' && styles.radioTextActive,
                      ]}
                    >
                      Patients
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      formData.category === 'laboratory' && styles.radioOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category: 'laboratory' })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.category === 'laboratory' && styles.radioTextActive,
                      ]}
                    >
                      Labos
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Titre *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Titre du message"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contenu *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.content}
                  onChangeText={(text) => setFormData({ ...formData, content: text })}
                  placeholder="Contenu du message..."
                  placeholderTextColor={Colors.common.gray}
                  multiline
                  numberOfLines={6}
                />
                <Text style={styles.helperText}>
                  Utilisez [DATE], [HEURE], [NOM] comme variables
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.admin.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.common.gray,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  messageCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageHeaderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.admin.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.common.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContent: {
    fontSize: 14,
    color: Colors.common.gray,
    lineHeight: 20,
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
    maxWidth: 600,
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
  modalScroll: {
    maxHeight: 500,
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
  helperText: {
    fontSize: 12,
    color: Colors.common.gray,
    marginTop: 6,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.common.border,
    backgroundColor: Colors.common.white,
  },
  radioOptionActive: {
    borderColor: Colors.admin.primary,
    backgroundColor: Colors.admin.background,
  },
  radioText: {
    fontSize: 14,
    color: Colors.common.gray,
    fontWeight: '500' as const,
  },
  radioTextActive: {
    color: Colors.admin.primary,
    fontWeight: '600' as const,
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
    height: 120,
    textAlignVertical: 'top',
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
});
