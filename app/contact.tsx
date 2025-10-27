import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, User, MessageSquare, ArrowLeft, Send } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

export default function ContactPage() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    console.log('Contact form submitted:', { name, email, subject, message });
    Alert.alert(
      'Message envoyé',
      'Votre message a été transmis à notre équipe. Nous vous répondrons dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <SafeAreaView style={styles.safeArea} edges={Platform.OS !== 'web' ? ['top', 'bottom'] : ['bottom']}>
        {Platform.OS !== 'web' && (
          <View style={styles.mobileHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.patient.primary} />
            </TouchableOpacity>
            <Text style={styles.mobileHeaderTitle}>Contactez-nous</Text>
            <View style={styles.backButton} />
          </View>
        )}

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <MessageSquare size={48} color={Colors.patient.primary} strokeWidth={2} />
              <Text style={styles.title}>Contactez-nous</Text>
              <Text style={styles.subtitle}>
                Une question ou une demande ? Notre équipe est là pour vous aider
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom complet *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.common.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Votre nom"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.common.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="votre@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sujet *</Text>
                <View style={styles.inputContainer}>
                  <MessageSquare size={20} color={Colors.common.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Sujet de votre message"
                    value={subject}
                    onChangeText={setSubject}
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message *</Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Décrivez votre demande..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
                <Send size={20} color={Colors.common.white} />
                <Text style={styles.submitButtonText}>Envoyer le message</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Autres moyens de nous contacter</Text>
              <View style={styles.infoCard}>
                <Mail size={24} color={Colors.patient.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>contact@facilab.ma</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.border,
    backgroundColor: Colors.common.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: __DEV__ ? 120 : 20,
  },
  content: {
    maxWidth: 600,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.common.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 4,
    gap: 12,
    backgroundColor: Colors.common.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.common.darkGray,
    outlineStyle: 'none',
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.common.white,
  },
  textArea: {
    fontSize: 16,
    color: Colors.common.darkGray,
    minHeight: 150,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.patient.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonText: {
    color: Colors.common.white,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  infoSection: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.common.border,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: Colors.patient.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.patient.light,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.common.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
});
