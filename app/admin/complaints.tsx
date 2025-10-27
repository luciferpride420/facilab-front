import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AlertCircle, DollarSign, FileText, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockComplaints } from '@/constants/mockData';
import type { Complaint } from '@/constants/types';

export default function AdminComplaintsScreen() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [compensationAmount, setCompensationAmount] = useState<string>('');
  const [compensationType, setCompensationType] = useState<'refund' | 'credit'>('refund');
  const [internalNote, setInternalNote] = useState<string>('');

  const [responseText, setResponseText] = useState<string>('');

  const escalatedComplaints = mockComplaints.filter((c) => c.status === 'escalated');
  const allComplaints = mockComplaints;

  const handleApproveCompensation = (complaintId: string) => {
    const amount = parseFloat(compensationAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }
    console.log('Approving compensation:', {
      complaintId,
      amount,
      type: compensationType,
    });
    Alert.alert('Succès', `Compensation de ${amount} MAD (${compensationType}) approuvée`);
    setCompensationAmount('');
  };

  const handleAddInternalNote = () => {
    if (!internalNote.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une note');
      return;
    }
    console.log('Adding internal note:', internalNote);
    Alert.alert('Succès', 'Note interne ajoutée');
    setInternalNote('');
  };

  const handleResolveComplaint = (complaintId: string) => {
    console.log('Resolving complaint:', complaintId);
    Alert.alert('Succès', 'Réclamation marquée comme résolue');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.listPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Réclamations Escaladées</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{escalatedComplaints.length}</Text>
            </View>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {allComplaints.map((complaint) => (
              <TouchableOpacity
                key={complaint.id}
                style={[
                  styles.complaintItem,
                  selectedComplaint?.id === complaint.id && styles.complaintItemActive,
                  complaint.status === 'escalated' && styles.complaintItemEscalated,
                ]}
                onPress={() => setSelectedComplaint(complaint)}
                activeOpacity={0.7}
              >
                <View style={styles.complaintItemHeader}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(complaint.status) },
                  ]} />
                  <Text style={styles.complaintId}>#{complaint.id}</Text>
                  {complaint.status === 'escalated' && (
                    <View style={styles.escalatedTag}>
                      <AlertCircle size={12} color={Colors.common.white} />
                    </View>
                  )}
                </View>
                <Text style={styles.complaintSubject} numberOfLines={2}>
                  {complaint.subject}
                </Text>
                <Text style={styles.complaintUser}>
                  {complaint.userName} ({complaint.userRole})
                </Text>
                {complaint.assignedAgentName && (
                  <Text style={styles.complaintAgent}>
                    Agent: {complaint.assignedAgentName}
                  </Text>
                )}
                <View style={styles.complaintMeta}>
                  <View style={[
                    styles.priorityTag,
                    { backgroundColor: getPriorityColor(complaint.priority) },
                  ]}>
                    <Text style={styles.priorityTagText}>{complaint.priority}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.detailPanel}>
          {selectedComplaint ? (
            <ScrollView style={styles.detail} contentContainerStyle={styles.detailContent}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailSubject}>{selectedComplaint.subject}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(selectedComplaint.status) },
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {getStatusLabel(selectedComplaint.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.detailDescription}>{selectedComplaint.description}</Text>

              <View style={styles.userInfoSection}>
                <View style={styles.userInfoHeader}>
                  <User size={20} color={Colors.admin.primary} />
                  <Text style={styles.userInfoTitle}>Informations Utilisateur</Text>
                </View>
                <View style={styles.userInfoCard}>
                  <View style={styles.userInfoRow}>
                    <User size={16} color={Colors.common.gray} />
                    <Text style={styles.userInfoLabel}>Nom:</Text>
                    <Text style={styles.userInfoValue}>{selectedComplaint.userName}</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Rôle:</Text>
                    <Text style={styles.userInfoValue}>{selectedComplaint.userRole}</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Mail size={16} color={Colors.common.gray} />
                    <Text style={styles.userInfoLabel}>Email:</Text>
                    <Text style={styles.userInfoValue}>user@example.com</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Phone size={16} color={Colors.common.gray} />
                    <Text style={styles.userInfoLabel}>Téléphone:</Text>
                    <Text style={styles.userInfoValue}>+212 6 00 00 00 00</Text>
                  </View>
                  {selectedComplaint.orderId && (
                    <View style={styles.userInfoRow}>
                      <Text style={styles.userInfoLabel}>Commande:</Text>
                      <Text style={styles.userInfoValue}>#{selectedComplaint.orderId}</Text>
                    </View>
                  )}
                  {selectedComplaint.assignedAgentName && (
                    <View style={styles.userInfoRow}>
                      <Text style={styles.userInfoLabel}>Agent assigné:</Text>
                      <Text style={styles.userInfoValue}>{selectedComplaint.assignedAgentName}</Text>
                    </View>
                  )}
                </View>
              </View>

              {selectedComplaint.messages.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Messages</Text>
                    <TouchableOpacity
                      style={styles.presetButton}
                      onPress={() => {
                        console.log('Opening preset messages page');
                        Alert.alert(
                          'Réponses prédéfinies',
                          'Vous pouvez gérer vos réponses prédéfinies dans la section "Messages & Notices"',
                          [
                            { text: 'OK' },
                          ]
                        );
                      }}
                      activeOpacity={0.7}
                    >
                      <MessageSquare size={16} color={Colors.common.white} />
                      <Text style={styles.presetButtonText}>Réponses prédéfinies</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedComplaint.messages.map((msg) => (
                    <View key={msg.id} style={styles.messageCard}>
                      <View style={styles.messageHeader}>
                        <Text style={styles.messageSender}>
                          {msg.senderName} ({msg.senderRole})
                        </Text>
                        <Text style={styles.messageTime}>
                          {new Date(msg.timestamp).toLocaleString('fr-FR')}
                        </Text>
                      </View>
                      <Text style={styles.messageText}>{msg.message}</Text>
                    </View>
                  ))}
                  <View style={styles.responseInput}>
                    <TextInput
                      style={styles.responseTextInput}
                      placeholder="Écrire une réponse..."
                      value={responseText}
                      onChangeText={setResponseText}
                      multiline
                      placeholderTextColor={Colors.common.gray}
                    />
                    <TouchableOpacity
                      style={styles.sendResponseButton}
                      onPress={() => {
                        console.log('Sending response:', responseText);
                        Alert.alert('Succès', 'Réponse envoyée');
                        setResponseText('');
                      }}
                      disabled={!responseText.trim()}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.sendResponseButtonText}>Envoyer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {selectedComplaint.internalNotes.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Notes Internes</Text>
                  {selectedComplaint.internalNotes.map((note) => (
                    <View key={note.id} style={styles.noteCard}>
                      <View style={styles.noteHeader}>
                        <Text style={styles.noteAuthor}>{note.authorName}</Text>
                        <Text style={styles.noteTime}>
                          {new Date(note.timestamp).toLocaleDateString('fr-FR')}
                        </Text>
                      </View>
                      <Text style={styles.noteText}>{note.note}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ajouter Note Interne Admin</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Note visible uniquement par admin et agents..."
                  value={internalNote}
                  onChangeText={setInternalNote}
                  multiline
                  placeholderTextColor={Colors.common.gray}
                />
                <TouchableOpacity
                  style={styles.addNoteButton}
                  onPress={handleAddInternalNote}
                  disabled={!internalNote.trim()}
                  activeOpacity={0.7}
                >
                  <FileText size={18} color={Colors.common.white} />
                  <Text style={styles.addNoteButtonText}>Ajouter Note</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compensation</Text>
                {selectedComplaint.compensation ? (
                  <View style={styles.compensationCard}>
                    <Text style={styles.compensationLabel}>Compensation existante:</Text>
                    <Text style={styles.compensationValue}>
                      {selectedComplaint.compensation.amount} MAD ({selectedComplaint.compensation.type})
                    </Text>
                    <Text style={styles.compensationStatus}>
                      Statut: {selectedComplaint.compensation.status}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.compensationForm}>
                    <View style={styles.inputRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Montant (MAD)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="100"
                          value={compensationAmount}
                          onChangeText={setCompensationAmount}
                          keyboardType="numeric"
                          placeholderTextColor={Colors.common.gray}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Type</Text>
                        <View style={styles.typeButtons}>
                          <TouchableOpacity
                            style={[
                              styles.typeButton,
                              compensationType === 'refund' && styles.typeButtonActive,
                            ]}
                            onPress={() => setCompensationType('refund')}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.typeButtonText,
                                compensationType === 'refund' && styles.typeButtonTextActive,
                              ]}
                            >
                              Remboursement
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.typeButton,
                              compensationType === 'credit' && styles.typeButtonActive,
                            ]}
                            onPress={() => setCompensationType('credit')}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.typeButtonText,
                                compensationType === 'credit' && styles.typeButtonTextActive,
                              ]}
                            >
                              Crédit
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApproveCompensation(selectedComplaint.id)}
                      activeOpacity={0.7}
                    >
                      <DollarSign size={18} color={Colors.common.white} />
                      <Text style={styles.approveButtonText}>Approuver Compensation</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'closed' && (
                <TouchableOpacity
                  style={styles.resolveButton}
                  onPress={() => handleResolveComplaint(selectedComplaint.id)}
                  activeOpacity={0.7}
                >
                  <CheckCircle size={20} color={Colors.common.white} />
                  <Text style={styles.resolveButtonText}>Marquer comme Résolue</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <AlertCircle size={48} color={Colors.common.gray} />
              <Text style={styles.emptyStateText}>
                Sélectionnez une réclamation pour voir les détails
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return Colors.agent.primary;
    case 'in_progress':
      return Colors.common.warning;
    case 'escalated':
      return Colors.common.error;
    case 'resolved':
      return Colors.common.success;
    default:
      return Colors.common.gray;
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: 'Ouverte',
    in_progress: 'En cours',
    escalated: 'Escaladée',
    resolved: 'Résolue',
    closed: 'Fermée',
  };
  return labels[status] || status;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low':
      return '#E0E7FF';
    case 'medium':
      return '#FED7AA';
    case 'high':
      return '#FECACA';
    case 'urgent':
      return '#DC2626';
    default:
      return Colors.common.lightGray;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listPanel: {
    width: 350,
    borderRightWidth: 1,
    borderRightColor: Colors.common.lightGray,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.lightGray,
    backgroundColor: Colors.admin.background,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
  },
  countBadge: {
    backgroundColor: Colors.admin.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  complaintItem: {
    padding: 16,
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    marginBottom: 12,
  },
  complaintItemActive: {
    borderColor: Colors.admin.primary,
    borderWidth: 2,
    backgroundColor: Colors.admin.background,
  },
  complaintItemEscalated: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.common.error,
  },
  complaintItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  complaintId: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.common.gray,
  },
  escalatedTag: {
    backgroundColor: Colors.common.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  complaintSubject: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  complaintUser: {
    fontSize: 12,
    color: Colors.common.gray,
    marginBottom: 2,
  },
  complaintAgent: {
    fontSize: 11,
    color: Colors.agent.primary,
    marginBottom: 8,
  },
  complaintMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityTagText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    textTransform: 'uppercase' as const,
  },
  detailPanel: {
    flex: 1,
  },
  detail: {
    flex: 1,
  },
  detailContent: {
    padding: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailSubject: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginRight: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  detailDescription: {
    fontSize: 16,
    color: Colors.common.gray,
    lineHeight: 24,
    marginBottom: 24,
  },
  userInfoSection: {
    marginBottom: 24,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
  },
  userInfoCard: {
    backgroundColor: Colors.admin.background,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.admin.light,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userInfoLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    fontWeight: '500' as const,
  },
  userInfoValue: {
    fontSize: 14,
    color: Colors.common.darkGray,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.admin.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  presetButtonText: {
    color: Colors.common.white,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  responseInput: {
    marginTop: 12,
    gap: 12,
  },
  responseTextInput: {
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendResponseButton: {
    backgroundColor: Colors.admin.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendResponseButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  messageCard: {
    padding: 16,
    backgroundColor: Colors.common.lightGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.common.gray,
  },
  messageText: {
    fontSize: 14,
    color: Colors.common.darkGray,
    lineHeight: 20,
  },
  noteCard: {
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.common.warning,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteAuthor: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  noteTime: {
    fontSize: 12,
    color: Colors.common.gray,
  },
  noteText: {
    fontSize: 14,
    color: Colors.common.darkGray,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.common.warning,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addNoteButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  compensationCard: {
    padding: 16,
    backgroundColor: Colors.admin.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.admin.light,
  },
  compensationLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 8,
  },
  compensationValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.admin.primary,
    marginBottom: 4,
  },
  compensationStatus: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  compensationForm: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.common.lightGray,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: Colors.admin.primary,
    backgroundColor: Colors.admin.background,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.gray,
  },
  typeButtonTextActive: {
    color: Colors.admin.primary,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.common.success,
    paddingVertical: 14,
    borderRadius: 8,
  },
  approveButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.common.success,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  resolveButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.common.gray,
    textAlign: 'center',
    marginTop: 16,
  },
});
