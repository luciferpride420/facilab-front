import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, Send, ArrowUpCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockComplaints } from '@/constants/mockData';
import type { Complaint } from '@/constants/types';

export default function AgentComplaintsScreen() {
  const router = useRouter();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [message, setMessage] = useState<string>('');
  const [internalNote, setInternalNote] = useState<string>('');

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage('');
    alert('Message envoyé avec succès');
  };

  const handleAddNote = () => {
    console.log('Adding internal note:', internalNote);
    setInternalNote('');
    alert('Note interne ajoutée');
  };

  const handleEscalate = (complaintId: string) => {
    console.log('Escalating complaint:', complaintId);
    alert('Réclamation escaladée à l\'administration');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.listPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Réclamations</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{mockComplaints.length}</Text>
            </View>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {mockComplaints.map((complaint) => (
              <TouchableOpacity
                key={complaint.id}
                style={[
                  styles.complaintItem,
                  selectedComplaint?.id === complaint.id && styles.complaintItemActive,
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
                </View>
                <Text style={styles.complaintSubject} numberOfLines={2}>
                  {complaint.subject}
                </Text>
                <Text style={styles.complaintUser}>
                  {complaint.userName}
                </Text>
                <View style={styles.complaintMeta}>
                  <View style={[
                    styles.priorityTag,
                    { backgroundColor: getPriorityColor(complaint.priority) },
                  ]}>
                    <Text style={styles.priorityTagText}>{complaint.priority}</Text>
                  </View>
                  <Text style={styles.complaintDate}>
                    {new Date(complaint.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.detailPanel}>
          {selectedComplaint ? (
            <ScrollView style={styles.detail} contentContainerStyle={styles.detailContent}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTop}>
                  <Text style={styles.detailSubject}>{selectedComplaint.subject}</Text>
                  <TouchableOpacity
                    style={styles.escalateButton}
                    onPress={() => handleEscalate(selectedComplaint.id)}
                    activeOpacity={0.7}
                  >
                    <ArrowUpCircle size={18} color={Colors.common.white} />
                    <Text style={styles.escalateButtonText}>Escalader</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.detailDescription}>{selectedComplaint.description}</Text>
                <View style={styles.detailMeta}>
                  <Text style={styles.detailMetaText}>
                    De: {selectedComplaint.userName} ({selectedComplaint.userRole})
                  </Text>
                  {selectedComplaint.orderId && (
                    <Text style={styles.detailMetaText}>
                      Commande: #{selectedComplaint.orderId}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.messagesSection}>
                <Text style={styles.sectionTitle}>Messages</Text>
                {selectedComplaint.messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageCard,
                      msg.senderRole === 'agent' && styles.messageCardAgent,
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageSender}>{msg.senderName}</Text>
                      <Text style={styles.messageTime}>
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.messageText}>{msg.message}</Text>
                  </View>
                ))}

                <View style={styles.messageInput}>
                  <TextInput
                    style={styles.messageTextInput}
                    placeholder="Écrire une réponse..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    placeholderTextColor={Colors.common.gray}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!message.trim()}
                    activeOpacity={0.7}
                  >
                    <Send size={20} color={Colors.common.white} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.notesSection}>
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

                <View style={styles.noteInput}>
                  <TextInput
                    style={styles.noteTextInput}
                    placeholder="Ajouter une note interne (visible uniquement par les agents et admin)..."
                    value={internalNote}
                    onChangeText={setInternalNote}
                    multiline
                    placeholderTextColor={Colors.common.gray}
                  />
                  <TouchableOpacity
                    style={styles.addNoteButton}
                    onPress={handleAddNote}
                    disabled={!internalNote.trim()}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addNoteButtonText}>Ajouter Note</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.agent.primary,
  },
  countBadge: {
    backgroundColor: Colors.agent.primary,
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
    borderColor: Colors.agent.primary,
    borderWidth: 2,
    backgroundColor: Colors.agent.background,
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
  complaintSubject: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 4,
  },
  complaintUser: {
    fontSize: 12,
    color: Colors.common.gray,
    marginBottom: 8,
  },
  complaintMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  complaintDate: {
    fontSize: 12,
    color: Colors.common.gray,
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
    marginBottom: 24,
  },
  detailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailSubject: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginRight: 16,
  },
  escalateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.common.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  escalateButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  detailDescription: {
    fontSize: 16,
    color: Colors.common.gray,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailMeta: {
    gap: 4,
  },
  detailMetaText: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  messagesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  messageCard: {
    padding: 16,
    backgroundColor: Colors.common.lightGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  messageCardAgent: {
    backgroundColor: Colors.agent.background,
    borderWidth: 1,
    borderColor: Colors.agent.light,
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
  messageInput: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  messageTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Colors.agent.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesSection: {
    marginBottom: 24,
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
  noteInput: {
    gap: 12,
    marginTop: 12,
  },
  noteTextInput: {
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addNoteButton: {
    backgroundColor: Colors.common.warning,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addNoteButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
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
