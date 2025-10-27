import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, UserCheck } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { mockAgents } from '@/constants/mockData';

export default function AgentLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    console.log('Agent login attempt:', { email, password });
    const agent = mockAgents.find((a) => a.email === email);
    if (agent) {
      await login(agent);
      router.replace('/agent/dashboard');
    } else {
      alert('Email ou mot de passe invalide');
    }
  };

  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/x357ana9p9pwawz8h39gt' }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.iconContainer}>
                <UserCheck size={48} color={Colors.agent.primary} />
              </View>
              <Text style={styles.title}>Agent Support FaciLab</Text>
              <Text style={styles.subtitle}>Connectez-vous pour gérer les réclamations</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color={Colors.agent.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="votre.email@facilab.ma"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color={Colors.agent.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor={Colors.common.gray}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>Comptes démo:</Text>
                {mockAgents.map((agent) => (
                  <TouchableOpacity
                    key={agent.id}
                    style={styles.demoButton}
                    onPress={() => {
                      setEmail(agent.email);
                      setPassword('demo123');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.demoButtonText}>
                      {agent.name} - {agent.department}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  },
  content: {
    flex: 1,
    padding: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 70,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.agent.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.agent.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.common.gray,
    textAlign: 'center',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.agent.light,
    borderRadius: 12,
    backgroundColor: Colors.common.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.common.black,
  },
  loginButton: {
    backgroundColor: Colors.agent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: Colors.common.white,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  demoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.agent.background,
    borderRadius: 12,
    gap: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.agent.text,
    marginBottom: 4,
  },
  demoButton: {
    backgroundColor: Colors.common.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.agent.light,
  },
  demoButtonText: {
    color: Colors.agent.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
