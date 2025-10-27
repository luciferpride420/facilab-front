import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockComplaints } from '@/constants/mockData';
import type { Agent as AgentUser } from '@/constants/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const agent = user?.role === 'agent' ? (user as AgentUser) : null;

  const myComplaints = useMemo(() => {
    if (!user || user.role !== 'agent') return [] as typeof mockComplaints;
    return mockComplaints.filter((c) => c.assignedAgentId === user.id);
  }, [user]);

  const openComplaints = myComplaints.filter((c) => c.status === 'open').length;
  const inProgressComplaints = myComplaints.filter((c) => c.status === 'in_progress').length;
  const escalatedComplaints = myComplaints.filter((c) => c.status === 'escalated').length;
  const resolvedToday = 3;

  const stats = [
    {
      label: 'Réclamations ouvertes',
      value: openComplaints.toString(),
      icon: AlertCircle,
      color: Colors.agent.primary,
      bgColor: Colors.agent.background,
    },
    {
      label: 'En cours de traitement',
      value: inProgressComplaints.toString(),
      icon: Clock,
      color: Colors.common.warning,
      bgColor: '#FEF3C7',
    },
    {
      label: 'Escaladées',
      value: escalatedComplaints.toString(),
      icon: AlertTriangle,
      color: Colors.common.error,
      bgColor: '#FEE2E2',
    },
    {
      label: 'Résolues aujourd\'hui',
      value: resolvedToday.toString(),
      icon: CheckCircle,
      color: Colors.common.success,
      bgColor: '#D1FAE5',
    },
  ];

  const recentComplaints = mockComplaints.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de Bord Agent</Text>
          <Text style={styles.subtitle}>
            {agent ? `${agent.name} • ${agent.department}` : 'Gestion des réclamations et support client'}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View
                key={index}
                style={[styles.statCard, { backgroundColor: stat.bgColor }]}
              >
                <View style={styles.statIcon}>
                  <IconComponent size={24} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Réclamations récentes</Text>
            <TouchableOpacity onPress={() => router.push('/agent/complaints')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {recentComplaints.map((complaint) => (
            <TouchableOpacity
              key={complaint.id}
              style={styles.complaintCard}
              onPress={() => router.push(`/agent/complaints`)}
              activeOpacity={0.7}
            >
              <View style={styles.complaintHeader}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(complaint.status) },
                ]}>
                  <Text style={styles.statusText}>{getStatusLabel(complaint.status)}</Text>
                </View>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(complaint.priority) },
                ]}>
                  <Text style={styles.priorityText}>{complaint.priority.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.complaintSubject}>{complaint.subject}</Text>
              <Text style={styles.complaintUser}>
                De: {complaint.userName} ({complaint.userRole === 'patient' ? 'Patient' : 'Laboratoire'})
              </Text>
              <Text style={styles.complaintDate}>
                {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/agent/complaints')}
          activeOpacity={0.8}
        >
          <TrendingUp size={20} color={Colors.common.white} />
          <Text style={styles.actionButtonText}>Gérer les réclamations</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return Colors.agent.background;
    case 'in_progress':
      return '#FEF3C7';
    case 'escalated':
      return '#FEE2E2';
    case 'resolved':
      return '#D1FAE5';
    default:
      return Colors.common.lightGray;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'open':
      return 'Ouverte';
    case 'in_progress':
      return 'En cours';
    case 'escalated':
      return 'Escaladée';
    case 'resolved':
      return 'Résolue';
    case 'closed':
      return 'Fermée';
    default:
      return status;
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low':
      return '#E0E7FF';
    case 'medium':
      return '#FED7AA';
    case 'high':
      return '#FED7AA';
    case 'urgent':
      return '#FECACA';
    default:
      return Colors.common.lightGray;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.agent.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.common.gray,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    textAlign: 'center',
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
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.agent.primary,
    fontWeight: '600' as const,
  },
  complaintCard: {
    padding: 16,
    backgroundColor: Colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.common.lightGray,
    marginBottom: 12,
  },
  complaintHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
  },
  complaintSubject: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  complaintUser: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 4,
  },
  complaintDate: {
    fontSize: 12,
    color: Colors.common.gray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.agent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  actionButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
