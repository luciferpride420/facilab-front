import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Shield } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    console.log('Admin login attempt:', { email });
    if (!email || !password) {
      const message = 'Veuillez remplir tous les champs';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Erreur', message);
      }
      return;
    }
    if (email === 'admin@facilab.ma' && password === 'admin123') {
      await login({
        id: 'admin1',
        email: 'admin@facilab.ma',
        name: 'Administrateur',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      router.push('/admin/dashboard');
    } else {
      const message = 'Accès refusé: identifiants incorrects';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Erreur', message);
      }
    }
  };

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
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/x357ana9p9pwawz8h39gt' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.iconContainer}>
              <Shield size={48} color={Colors.admin.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Administration</Text>
            <Text style={styles.subtitle}>Accès restreint</Text>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.common.gray} />
                <TextInput style={styles.input} placeholder="Email administrateur" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.common.gray} />
                <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8} testID="admin-login-button">
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>Compte démo:</Text>
                <TouchableOpacity
                  style={styles.demoButton}
                  onPress={() => {
                    setEmail('admin@facilab.ma');
                    setPassword('admin123');
                  }}
                  activeOpacity={0.7}
                  testID="admin-demo"
                >
                  <Text style={styles.demoButtonText}>Administrateur</Text>
                  <Text style={styles.demoMeta}>admin@facilab.ma • mot de passe: admin123</Text>
                </TouchableOpacity>
              </View>
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
  backText: { fontSize: 16, color: Colors.admin.primary, fontWeight: '500' as const },
  content: { paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  logoWrapper: { marginBottom: 20, alignItems: 'center' },
  logo: { width: 180, height: 70 },
  iconContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.admin.background, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '700' as const, color: Colors.common.darkGray, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.common.gray, marginBottom: 40 },
  form: { width: '100%', gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.common.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 4, gap: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.common.darkGray, outlineStyle: 'none' },
  loginButton: { backgroundColor: Colors.admin.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: Colors.common.white, fontSize: 17, fontWeight: '600' as const },
  demoSection: { marginTop: 16, padding: 16, backgroundColor: Colors.admin.background, borderRadius: 12, gap: 12 },
  demoTitle: { fontSize: 14, fontWeight: '600' as const, color: Colors.admin.text, marginBottom: 4 },
  demoButton: { backgroundColor: Colors.common.white, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: Colors.admin.light },
  demoButtonText: { color: Colors.admin.primary, fontSize: 14, fontWeight: '600' as const },
  demoMeta: { color: Colors.common.gray, fontSize: 12, marginTop: 2 },
});
