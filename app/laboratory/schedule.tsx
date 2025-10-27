import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, User } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { mockOrders } from '@/constants/mockData';

export default function LaboratorySchedule() {
  const router = useRouter();
  const scheduledOrders = mockOrders.filter(o => o.status === 'scheduled' || o.status === 'in_progress');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Planning</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {scheduledOrders.map((order) => (
          <View key={order.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={[styles.statusDot, { backgroundColor: Colors.laboratory.primary }]} />
              <Text style={styles.appointmentTime}>{order.scheduledTime}</Text>
            </View>
            <View style={styles.appointmentBody}>
              <View style={styles.infoRow}>
                <User size={16} color={Colors.common.gray} />
                <Text style={styles.infoText}>{order.patientName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Calendar size={16} color={Colors.common.gray} />
                <Text style={styles.infoText}>{order.scheduledDate && new Date(order.scheduledDate).toLocaleDateString('fr-FR')}</Text>
              </View>
              {order.address && (
                <View style={styles.infoRow}>
                  <MapPin size={16} color={Colors.common.gray} />
                  <Text style={styles.infoText} numberOfLines={1}>{order.address}</Text>
                </View>
              )}
              <Text style={styles.testsText}>{order.tests.map(t => t.name).join(', ')}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.laboratory.background },
  header: { padding: 20, backgroundColor: Colors.common.white, borderBottomWidth: 1, borderBottomColor: Colors.common.lightGray },
  backText: { fontSize: 16, color: Colors.laboratory.primary, fontWeight: '500' as const, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.common.darkGray },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: __DEV__ ? 120 : 20 },
  appointmentCard: { backgroundColor: Colors.common.white, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: Colors.laboratory.primary },
  appointmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  appointmentTime: { fontSize: 18, fontWeight: '700' as const, color: Colors.laboratory.primary },
  appointmentBody: { gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: Colors.common.gray, flex: 1 },
  testsText: { fontSize: 14, fontWeight: '500' as const, color: Colors.common.darkGray, marginTop: 8 },
});
