import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

import { mockPatients, mockLaboratories } from '@/constants/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async () => {
    console.log('Login attempt:', { email });
    if (!email || !password) {
      if (Platform.OS === 'web') {
        alert('Veuillez remplir tous les champs');
      }
      return;
    }
    const labByEmail = mockLaboratories.find((l) => l.email.toLowerCase() === email.toLowerCase());
    if (labByEmail) {
      await login(labByEmail);
      router.push('/laboratory/dashboard');
      return;
    }
    const found = mockPatients.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      await login(found);
    } else {
      const fallback = mockPatients[0];
      await login(fallback);
    }
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/x357ana9p9pwawz8h39gt' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Connexion Patient</Text>
            <Text style={styles.subtitle}>
              Accédez à vos analyses et résultats
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.common.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.common.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.common.gray} />
                  ) : (
                    <Eye size={20} color={Colors.common.gray} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
                testID="patient-login-button"
              >
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>Comptes démo:</Text>
                {mockPatients.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.demoButton}
                    onPress={() => {
                      setEmail(p.email);
                      setPassword('demo123');
                    }}
                    activeOpacity={0.7}
                    testID={`patient-demo-${p.id}`}
                  >
                    <Text style={styles.demoButtonText}>{p.name}</Text>
                    <Text style={styles.demoMeta}>{p.email} • mot de passe: demo123</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.signupPrompt}
                onPress={() => router.push('/patient/signup')}
              >
                <Text style={styles.signupPromptText}>
                  Pas encore de compte ?{' '}
                  <Text style={styles.signupLink}>S{"'"}inscrire</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: __DEV__ ? 120 : 40,
  },
  header: {
    padding: 20,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: Colors.patient.primary,
    fontWeight: '500' as const,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.common.gray,
    marginBottom: 40,
  },
  form: {
    gap: 16,
    width: '100%',
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.patient.primary,
    fontWeight: '500' as const,
  },
  loginButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: Colors.common.white,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.common.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.common.gray,
  },
  signupPrompt: {
    alignItems: 'center',
  },
  signupPromptText: {
    fontSize: 15,
    color: Colors.common.gray,
  },
  signupLink: {
    color: Colors.patient.primary,
    fontWeight: '600' as const,
  },
  demoSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.patient.background,
    borderRadius: 12,
    gap: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.patient.text,
    marginBottom: 4,
  },
  demoButton: {
    backgroundColor: Colors.common.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.patient.light,
  },
  demoButtonText: {
    color: Colors.patient.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  demoMeta: {
    color: Colors.common.gray,
    fontSize: 12,
    marginTop: 2,
  },
});
