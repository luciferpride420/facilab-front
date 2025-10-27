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
import {
  User,
  Building2,
  Mail,
  Phone,
  Edit,
  MessageSquare,
  UserPlus,
  Trash2,
  X,
  Shield,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockPatients, mockLaboratories, mockAgents } from '@/constants/mockData';
import { Patient, Laboratory, Agent, Admin } from '@/constants/types';

type TabType = 'patients' | 'laboratories' | 'agents' | 'admins';
type UserType = Patient | Laboratory | Agent | Admin;

const mockAdmins: Admin[] = [
  {
    id: 'admin1',
    email: 'admin@facilab.ma',
    name: 'Admin Principal',
    role: 'admin',
    phone: '0665000000',
    permissions: ['all'],
    createdAt: '2023-01-01',
  },
  {
    id: 'admin2',
    email: 'support@facilab.ma',
    name: 'Admin Support',
    role: 'admin',
    phone: '0665000001',
    permissions: ['users', 'support'],
    createdAt: '2024-01-15',
  },
];

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>('patients');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [laboratories, setLaboratories] = useState<Laboratory[]>(mockLaboratories);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  
  const [messageModalVisible, setMessageModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [editFormData, setEditFormData] = useState<Partial<UserType>>({});

  const handleSendMessage = (user: UserType) => {
    setSelectedUser(user);
    setMessageText('');
    setMessageModalVisible(true);
  };

  const sendMessage = () => {
    if (!messageText.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un message');
      return;
    }

    console.log('Message sent to:', selectedUser?.email, messageText);
    Alert.alert('Succès', 'Message envoyé avec succès');
    setMessageModalVisible(false);
    setMessageText('');
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setEditFormData(user);
    setEditModalVisible(true);
  };

  const saveUserEdit = () => {
    if (!selectedUser) {
      const now = new Date().toISOString();
      switch (activeTab) {
        case 'laboratories': {
          const newLab: Laboratory = {
            id: `lab_${Date.now()}`,
            role: 'laboratory',
            name: (editFormData.name as string) ?? '',
            email: (editFormData.email as string) ?? '',
            phone: (editFormData.phone as string) ?? undefined,
            address: (editFormData.address as string) ?? '',
            createdAt: now,
            labName: (editFormData as Partial<Laboratory>).labName ?? ((editFormData.name as string) ?? ''),
            license: (editFormData as Partial<Laboratory>).license ?? '',
            nurses: [],
            commission: (editFormData as Partial<Laboratory>).commission ?? 0.2,
          };
          setLaboratories([newLab, ...laboratories]);
          console.log('Laboratory added:', newLab);
          break;
        }
        case 'agents': {
          const newAgent: Agent = {
            id: `agent_${Date.now()}`,
            role: 'agent',
            name: (editFormData.name as string) ?? '',
            email: (editFormData.email as string) ?? '',
            phone: (editFormData.phone as string) ?? undefined,
            address: (editFormData.address as string) ?? undefined,
            createdAt: now,
            department: (editFormData as Partial<Agent>).department ?? 'Support',
            assignedComplaints: (editFormData as Partial<Agent>).assignedComplaints ?? 0,
          };
          setAgents([newAgent, ...agents]);
          console.log('Agent added:', newAgent);
          break;
        }
        case 'admins': {
          const newAdmin: Admin = {
            id: `admin_${Date.now()}`,
            role: 'admin',
            name: (editFormData.name as string) ?? '',
            email: (editFormData.email as string) ?? '',
            phone: (editFormData.phone as string) ?? undefined,
            address: (editFormData.address as string) ?? undefined,
            createdAt: now,
            permissions: ['users'],
          };
          setAdmins([newAdmin, ...admins]);
          console.log('Admin added:', newAdmin);
          break;
        }
        default:
          break;
      }
      setEditModalVisible(false);
      return;
    }

    switch (activeTab) {
      case 'patients':
        setPatients(patients.map(u => 
          u.id === selectedUser.id ? { ...u, ...editFormData } as Patient : u
        ));
        break;
      case 'laboratories':
        setLaboratories(laboratories.map(u => 
          u.id === selectedUser.id ? { ...u, ...editFormData } as Laboratory : u
        ));
        break;
      case 'agents':
        setAgents(agents.map(u => 
          u.id === selectedUser.id ? { ...u, ...editFormData } as Agent : u
        ));
        break;
      case 'admins':
        setAdmins(admins.map(u => 
          u.id === selectedUser.id ? { ...u, ...editFormData } as Admin : u
        ));
        break;
    }

    console.log('User updated:', { ...selectedUser, ...editFormData });
    setEditModalVisible(false);
  };

  const handleAddAdmin = () => {
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
    });
    setEditModalVisible(true);
  };

  const handleAddLaboratory = () => {
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'laboratory',
      labName: '',
      license: '',
      commission: 0.2,
    } as Partial<Laboratory> as Partial<UserType>);
    setEditModalVisible(true);
  };

  const handleAddAgent = () => {
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      role: 'agent',
      department: 'Support',
      assignedComplaints: 0,
    } as Partial<Agent> as Partial<UserType>);
    setEditModalVisible(true);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (adminId === 'admin1') {
      Alert.alert('Erreur', 'Le propriétaire ne peut pas être supprimé');
      return;
    }

    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet administrateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setAdmins(admins.filter(a => a.id !== adminId));
            console.log('Admin deleted:', adminId);
          },
        },
      ]
    );
  };

  const renderUserCard = (user: UserType) => {
    const isAdmin = activeTab === 'admins';
    const isOwner = isAdmin && user.id === 'admin1';
    
    return (
      <View key={user.id} style={styles.userCard}>
        <View style={styles.userCardHeader}>
          <View style={styles.userCardLeft}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    activeTab === 'patients'
                      ? Colors.patient.background
                      : activeTab === 'laboratories'
                      ? Colors.laboratory.background
                      : activeTab === 'agents'
                      ? Colors.agent.background
                      : Colors.admin.background,
                },
              ]}
            >
              {activeTab === 'patients' && <User size={24} color={Colors.patient.primary} />}
              {activeTab === 'laboratories' && <Building2 size={24} color={Colors.laboratory.primary} />}
              {activeTab === 'agents' && <User size={24} color={Colors.agent.primary} />}
              {activeTab === 'admins' && <Shield size={24} color={Colors.admin.primary} />}
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                {isOwner && (
                  <View style={styles.ownerBadge}>
                    <Text style={styles.ownerText}>Propriétaire</Text>
                  </View>
                )}
              </View>
              {activeTab === 'laboratories' && (
                <Text style={styles.labName}>{(user as Laboratory).labName}</Text>
              )}
              <View style={styles.infoRow}>
                <Mail size={14} color={Colors.common.gray} />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              {user.phone && (
                <View style={styles.infoRow}>
                  <Phone size={14} color={Colors.common.gray} />
                  <Text style={styles.infoText}>{user.phone}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.userActions}>
            <TouchableOpacity
              style={styles.actionIconButton}
              onPress={() => handleSendMessage(user)}
            >
              <MessageSquare size={18} color={Colors.patient.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionIconButton}
              onPress={() => handleEditUser(user)}
            >
              <Edit size={18} color={Colors.admin.primary} />
            </TouchableOpacity>
            {isAdmin && !isOwner && (
              <TouchableOpacity
                style={[styles.actionIconButton, styles.deleteIconButton]}
                onPress={() => handleDeleteAdmin(user.id)}
              >
                <Trash2 size={18} color={Colors.common.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {activeTab === 'laboratories' && (
          <View style={styles.labDetails}>
            <View style={styles.labDetailItem}>
              <Text style={styles.labDetailLabel}>Commission</Text>
              <Text style={styles.labDetailValue}>
                {((user as Laboratory).commission * 100).toFixed(0)}%
              </Text>
            </View>
            <View style={styles.labDetailItem}>
              <Text style={styles.labDetailLabel}>Personnel</Text>
              <Text style={styles.labDetailValue}>
                {(user as Laboratory).nurses?.length || 0} infirmiers
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.title}>Gestion Utilisateurs</Text>
            <Text style={styles.subtitle}>Patients, labos, agents & admins</Text>
          </View>
          {activeTab === 'admins' && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
              <UserPlus size={20} color={Colors.common.white} />
              <Text style={styles.addButtonText}>Admin</Text>
            </TouchableOpacity>
          )}
          {activeTab === 'laboratories' && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddLaboratory}>
              <UserPlus size={20} color={Colors.common.white} />
              <Text style={styles.addButtonText}>Labo</Text>
            </TouchableOpacity>
          )}
          {activeTab === 'agents' && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddAgent}>
              <UserPlus size={20} color={Colors.common.white} />
              <Text style={styles.addButtonText}>Agent</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'patients' && styles.activeTab]}
            onPress={() => setActiveTab('patients')}
          >
            <Text style={[styles.tabText, activeTab === 'patients' && styles.activeTabText]}>
              Patients ({patients.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'laboratories' && styles.activeTab]}
            onPress={() => setActiveTab('laboratories')}
          >
            <Text style={[styles.tabText, activeTab === 'laboratories' && styles.activeTabText]}>
              Labos ({laboratories.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'agents' && styles.activeTab]}
            onPress={() => setActiveTab('agents')}
          >
            <Text style={[styles.tabText, activeTab === 'agents' && styles.activeTabText]}>
              Agents ({agents.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'admins' && styles.activeTab]}
            onPress={() => setActiveTab('admins')}
          >
            <Text style={[styles.tabText, activeTab === 'admins' && styles.activeTabText]}>
              Admins ({admins.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'patients' && patients.map(renderUserCard)}
          {activeTab === 'laboratories' && laboratories.map(renderUserCard)}
          {activeTab === 'agents' && agents.map(renderUserCard)}
          {activeTab === 'admins' && admins.map(renderUserCard)}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={messageModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMessageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Envoyer un message</Text>
              <TouchableOpacity onPress={() => setMessageModalVisible(false)}>
                <X size={24} color={Colors.common.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientLabel}>À:</Text>
                <Text style={styles.recipientName}>{selectedUser?.name}</Text>
              </View>

              <TextInput
                style={styles.messageInput}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Votre message..."
                placeholderTextColor={Colors.common.gray}
                multiline
                numberOfLines={8}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setMessageModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedUser ? 'Modifier' : 'Ajouter'} utilisateur
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={24} color={Colors.common.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom *</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.name}
                  onChangeText={(text) => setEditFormData({ ...editFormData, name: text })}
                  placeholder="Nom complet"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.email}
                  onChangeText={(text) => setEditFormData({ ...editFormData, email: text })}
                  placeholder="email@example.com"
                  placeholderTextColor={Colors.common.gray}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.phone}
                  onChangeText={(text) => setEditFormData({ ...editFormData, phone: text })}
                  placeholder="06XXXXXXXX"
                  placeholderTextColor={Colors.common.gray}
                  keyboardType="phone-pad"
                />
              </View>

              {activeTab === 'laboratories' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Nom du laboratoire *</Text>
                    <TextInput
                      style={styles.input}
                      value={(editFormData as Partial<Laboratory>).labName as any}
                      onChangeText={(text) => setEditFormData({ ...editFormData, labName: text } as any)}
                      placeholder="Ex: Labo Santé Plus"
                      placeholderTextColor={Colors.common.gray}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Commission (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={String((((editFormData as Partial<Laboratory>).commission ?? 20) as number))}
                      onChangeText={(text) => {
                        const percent = parseFloat(text);
                        setEditFormData({ ...editFormData, commission: isNaN(percent) ? 0.2 : percent / 100 } as any);
                      }}
                      placeholder="Ex: 20"
                      placeholderTextColor={Colors.common.gray}
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}

              {activeTab === 'agents' && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Département</Text>
                  <TextInput
                    style={styles.input}
                    value={(editFormData as Partial<Agent>).department as any}
                    onChangeText={(text) => setEditFormData({ ...editFormData, department: text } as any)}
                    placeholder="Support / Opérations"
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={saveUserEdit}>
                <Text style={styles.sendButtonText}>Enregistrer</Text>
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
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
    fontSize: 13,
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
  userCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userCardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  ownerBadge: {
    backgroundColor: Colors.admin.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownerText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.admin.primary,
  },
  labName: {
    fontSize: 14,
    color: Colors.laboratory.primary,
    fontWeight: '500' as const,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.common.gray,
    flex: 1,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.common.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIconButton: {
    backgroundColor: Colors.common.error + '20',
  },
  labDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.common.border,
  },
  labDetailItem: {
    flex: 1,
  },
  labDetailLabel: {
    fontSize: 12,
    color: Colors.common.gray,
    marginBottom: 4,
  },
  labDetailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
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
    maxWidth: 500,
    maxHeight: '80%',
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
  modalBody: {
    padding: 20,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
  },
  recipientLabel: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.common.darkGray,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  formGroup: {
    marginBottom: 16,
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
  sendButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.admin.primary,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.white,
  },
});
