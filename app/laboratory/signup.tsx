import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Mail, Phone, AlertCircle, MessageSquare } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

export default function LaboratorySignup() {
  const router = useRouter();
  const [labName, setLabName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={styles.alertBox}>
              <AlertCircle size={24} color={Colors.common.warning} />
              <Text style={styles.alertText}>
                L{"'"}inscription des laboratoires nécessite une approbation de l{"'"}administration
              </Text>
            </View>

            <Text style={styles.title}>Demande d{"'"}Inscription Laboratoire</Text>
            <Text style={styles.subtitle}>
              Veuillez nous contacter pour rejoindre notre réseau de laboratoires partenaires
            </Text>

            <View style={styles.contactOptions}>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={() => {
                  const phoneNumber = '+212600000000';
                  Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                    Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application téléphone');
                  });
                }}
                activeOpacity={0.7}
              >
                <Phone size={32} color={Colors.laboratory.primary} />
                <Text style={styles.contactCardTitle}>Appeler</Text>
                <Text style={styles.contactCardText}>+212 6 00 00 00 00</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactCard}
                onPress={() => router.push('/contact')}
                activeOpacity={0.7}
              >
                <MessageSquare size={32} color={Colors.laboratory.primary} />
                <Text style={styles.contactCardTitle}>Message</Text>
                <Text style={styles.contactCardText}>Via la plateforme</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.formTitle}>Envoyez-nous un message rapide</Text>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Building2 size={20} color={Colors.common.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom du laboratoire"
                  value={labName}
                  onChangeText={setLabName}
                  placeholderTextColor={Colors.common.gray}
                />
              </View>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.common.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>
              <View style={styles.inputContainer}>
                <Phone size={20} color={Colors.common.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={Colors.common.gray}
                />
              </View>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Votre message (optionnel)..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={Colors.common.gray}
                />
              </View>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => {
                  if (!labName || !email || !phone) {
                    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
                    return;
                  }
                  console.log('Laboratory signup request:', { labName, email, phone, message });
                  Alert.alert(
                    'Demande envoyée',
                    'Votre demande a été transmise à notre équipe. Nous vous contacterons sous 48h.',
                    [{ text: 'OK', onPress: () => router.back() }]
                  );
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.signupButtonText}>Envoyer la demande</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/laboratory/login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLinkText}>
                  Déjà inscrit ? <Text style={styles.loginLinkTextBold}>Se connecter</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: __DEV__ ? 120 : 40 },
  header: { padding: 20 },
  backText: { fontSize: 16, color: Colors.laboratory.primary, fontWeight: '500' as const },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.common.warning,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: Colors.common.darkGray,
    lineHeight: 20,
  },
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.common.darkGray, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.common.gray, marginBottom: 32, lineHeight: 22 },
  contactOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  contactCard: {
    flex: 1,
    backgroundColor: Colors.laboratory.background,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.laboratory.light,
  },
  contactCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginTop: 12,
    marginBottom: 4,
  },
  contactCardText: {
    fontSize: 13,
    color: Colors.common.gray,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.common.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.common.gray,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 16,
  },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 4,
    gap: 12,
  },
  input: { flex: 1, fontSize: 16, color: Colors.common.darkGray, outlineStyle: 'none' },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 12,
    padding: 12,
  },
  textArea: {
    fontSize: 16,
    color: Colors.common.darkGray,
    minHeight: 100,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  signupButton: {
    backgroundColor: Colors.laboratory.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: { color: Colors.common.white, fontSize: 17, fontWeight: '600' as const },
  loginLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginLinkText: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  loginLinkTextBold: {
    fontWeight: '600' as const,
    color: Colors.laboratory.primary,
  },
});
