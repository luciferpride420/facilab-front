import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Send, Bot, User as UserIcon } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function PatientAssistant() {
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis votre assistant santé FaciLab. Comment puis-je vous aider aujourd'hui ?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Je comprends votre question. Pour obtenir des conseils personnalisés, je vous recommande de consulter un professionnel de santé.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const quickQuestions = [
    'Comment me préparer pour une analyse ?',
    'Quand vais-je recevoir mes résultats ?',
    'Que signifient mes résultats ?',
    'Puis-je annuler ma commande ?',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Assistant IA</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <View style={styles.notice} testID="assistant-notice">
          <Text style={styles.noticeTitle}>Important</Text>
          <Text style={styles.noticeText}>
            L’assistant fournit uniquement des informations générales et ne remplace pas un avis médical. Vérifiez toujours auprès d’un professionnel de santé.
          </Text>
        </View>
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <View style={styles.messageHeader}>
                {msg.sender === 'assistant' ? (
                  <Bot size={18} color={Colors.patient.primary} />
                ) : (
                  <UserIcon size={18} color={Colors.common.white} />
                )}
                <Text
                  style={[
                    styles.messageSender,
                    msg.sender === 'user' && styles.userSender,
                  ]}
                >
                  {msg.sender === 'assistant' ? 'Assistant' : 'Vous'}
                </Text>
              </View>
              <Text
                style={[
                  styles.messageText,
                  msg.sender === 'user' && styles.userMessageText,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          ))}

          {messages.length === 1 && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Questions fréquentes</Text>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestion}
                  onPress={() => setMessage(question)}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={16} color={Colors.patient.primary} />
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Posez votre question..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={Colors.common.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  messageBubble: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.patient.background,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.patient.primary,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.patient.primary,
  },
  userSender: {
    color: Colors.common.white,
  },
  messageText: {
    fontSize: 15,
    color: Colors.common.darkGray,
    lineHeight: 22,
  },
  userMessageText: {
    color: Colors.common.white,
  },
  quickQuestionsContainer: {
    marginTop: 20,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 12,
  },
  quickQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.common.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.common.border,
    marginBottom: 8,
  },
  quickQuestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.common.darkGray,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: __DEV__ ? 90 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.common.lightGray,
    backgroundColor: Colors.common.white,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.patient.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    outlineStyle: 'none',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.patient.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  notice: {
    backgroundColor: '#FFF7D6',
    borderColor: '#F2E3A8',
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#7A5E00',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: '#7A5E00',
  },
});
