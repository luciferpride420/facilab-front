import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, FileText, CheckCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

export default function LaboratoryUpload() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean>(false);

  const handleUpload = () => {
    console.log('Upload for order:', orderId);
    setUploaded(true);
    setTimeout(() => router.back(), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Upload Résultats</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {!uploaded ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Numéro de commande</Text>
              <TextInput style={styles.input} placeholder="Ex: o1" value={orderId} onChangeText={setOrderId} />
            </View>
            <TouchableOpacity style={styles.uploadZone} activeOpacity={0.7}>
              <Upload size={48} color={Colors.laboratory.primary} />
              <Text style={styles.uploadTitle}>Cliquer pour sélectionner un fichier</Text>
              <Text style={styles.uploadSubtitle}>PDF uniquement, max 10 MB</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleUpload} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>Envoyer les résultats</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <CheckCircle size={64} color={Colors.common.success} />
            </View>
            <Text style={styles.successTitle}>Résultats envoyés !</Text>
            <Text style={styles.successText}>Le patient sera notifié</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  backText: { fontSize: 16, color: Colors.laboratory.primary, fontWeight: '500' as const, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.common.darkGray },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: __DEV__ ? 120 : 20 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600' as const, color: Colors.common.darkGray, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: Colors.common.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, outlineStyle: 'none' },
  uploadZone: { borderWidth: 2, borderColor: Colors.laboratory.primary, borderStyle: 'dashed', borderRadius: 16, padding: 40, alignItems: 'center', marginBottom: 24 },
  uploadTitle: { fontSize: 16, fontWeight: '600' as const, color: Colors.common.darkGray, marginTop: 16 },
  uploadSubtitle: { fontSize: 14, color: Colors.common.gray, marginTop: 4 },
  submitButton: { backgroundColor: Colors.laboratory.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: Colors.common.white, fontSize: 17, fontWeight: '600' as const },
  successContainer: { alignItems: 'center', paddingTop: 60 },
  successIcon: { marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '700' as const, color: Colors.common.darkGray, marginBottom: 8 },
  successText: { fontSize: 16, color: Colors.common.gray },
});
