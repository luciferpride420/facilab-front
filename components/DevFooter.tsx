import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/colors';

const __DEV_MODE__ = __DEV__;

interface PageLink {
  name: string;
  route: string;
}

interface PageSection {
  title: string;
  color: string;
  backgroundColor: string;
  pages: PageLink[];
}

const rawSections: PageSection[] = [
  {
    title: 'Patient',
    color: Colors.patient.primary,
    backgroundColor: Colors.patient.background,
    pages: [
      { name: 'Accueil', route: '/' },
      { name: 'Catalogue Tests', route: '/patient/catalog' },
      { name: 'Détail Test', route: '/patient/test/1' },
      { name: 'Panier', route: '/patient/cart' },
      { name: 'Commande', route: '/patient/checkout' },
      { name: 'Mes Commandes', route: '/patient/orders' },
      { name: 'Résultats', route: '/patient/results' },
      { name: 'Assistant IA', route: '/patient/assistant' },
      { name: 'Profil', route: '/patient/profile' },
    ],
  },
  {
    title: 'Laboratoire',
    color: Colors.laboratory.primary,
    backgroundColor: Colors.laboratory.background,
    pages: [
      { name: 'Planning', route: '/laboratory/schedule' },
      { name: 'Commandes', route: '/laboratory/orders' },
      { name: 'Upload Résultats', route: '/laboratory/upload' },
      { name: 'Dashboard', route: '/laboratory/dashboard' },
      { name: 'Gestion Catalogue', route: '/laboratory/offers' },
      { name: 'Personnel', route: '/laboratory/staff' },
      { name: 'Profil Lab', route: '/laboratory/profile' },
    ],
  },
  {
    title: 'Administration',
    color: Colors.admin.primary,
    backgroundColor: Colors.admin.background,
    pages: [
      { name: 'Gestion Utilisateurs', route: '/admin/users' },
      { name: 'Gestion Catalogue', route: '/admin/catalog' },
      { name: 'Tableaux de Bord', route: '/admin/dashboard' },
      { name: 'Rapports', route: '/admin/reports' },
      { name: 'Paramètres', route: '/admin/settings' },
      { name: 'Réclamations', route: '/admin/complaints' },
      { name: 'Messages', route: '/admin/messages' },
    ],
  },
  {
    title: 'Agent Support',
    color: Colors.agent.primary,
    backgroundColor: Colors.agent.background,
    pages: [
      { name: 'Dashboard', route: '/agent/dashboard' },
      { name: 'Réclamations', route: '/agent/complaints' },
      { name: 'Profil', route: '/agent/profile' },
    ],
  },
];

export default function DevFooter() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const router = useRouter();

  const sections = rawSections;

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  if (!__DEV_MODE__) {
    return null;
  }

  return (
    <View style={styles.container} testID="devFooter">
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        {isExpanded ? (
          <ChevronDown size={20} color={Colors.common.white} />
        ) : (
          <ChevronUp size={20} color={Colors.common.white} />
        )}
        <Text style={styles.toggleText}>
          {isExpanded ? 'Masquer' : 'Mode Développement'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView
          horizontal
          style={styles.sectionsContainer}
          contentContainerStyle={styles.sectionsContent}
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          keyboardShouldPersistTaps="always"
        >
          {sections.map((section) => (
            <View
              key={section.title}
              style={[styles.section, { backgroundColor: section.backgroundColor }]}
            >
              <Text style={[styles.sectionTitle, { color: section.color }]}> 
                {section.title}
              </Text>
              <ScrollView
                style={styles.pagesScroll}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={Platform.OS === 'web'}
                nestedScrollEnabled
                keyboardShouldPersistTaps="always"
              >
                {section.pages.map((page) => (
                  <TouchableOpacity
                    key={page.route}
                    style={[styles.pageButton, { borderColor: section.color }]}
                    onPress={() => handleNavigate(page.route)}
                    activeOpacity={0.7}
                    testID={`dev-nav-${page.route}`}
                  >
                    <Text style={[styles.pageText, { color: section.color }]}>
                      {page.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
  },
  toggleButton: {
    backgroundColor: Colors.common.darkGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  sectionsContainer: {
    maxHeight: 520,
    backgroundColor: Colors.common.white,
    borderTopWidth: 2,
    borderTopColor: Colors.common.darkGray,
  },
  sectionsContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    minWidth: 220,
    maxWidth: 260,
    height: 440,
  },
  pagesScroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  pageButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.common.white,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
