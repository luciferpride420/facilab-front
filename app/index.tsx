import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Shield, Award, MapPin, Syringe, Bot, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Laboratoires près de chez vous',
      description: 'Trouvez facilement des laboratoires dans votre région',
    },
    {
      icon: Syringe,
      title: 'Prélèvement à domicile',
      description: 'Un infirmier se déplace chez vous pour le prélèvement',
    },
    {
      icon: Clock,
      title: 'Résultats en ligne',
      description: 'Recevez vos résultats directement sur la plateforme',
    },
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Vos données médicales sont protégées et confidentielles',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {Platform.OS !== 'web' && (
          <View style={styles.header}>
            <SafeAreaView edges={['top']}>
              <View style={styles.headerContent}>
                <Image
                  source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/x357ana9p9pwawz8h39gt' }}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.tagline}>Vos analyses médicales simplifiées</Text>
              </View>
            </SafeAreaView>
          </View>
        )}

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Simplifiez vos analyses médicales
          </Text>
          <Text style={styles.heroSubtitle}>
            Découvrez les laboratoires de votre région, réservez un prélèvement à domicile,
            et recevez vos résultats en ligne en toute sécurité
          </Text>

          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push(user?.role === 'patient' ? '/patient/catalog' : '/patient/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{user?.role === 'patient' ? 'Voir le catalogue' : 'Connexion Patient'}</Text>
            </TouchableOpacity>

            {!user && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/patient/signup')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Créer un compte</Text>
              </TouchableOpacity>
            )}
          </View>

          {!user && (
          <View style={styles.labAccessCard}>
            <Text style={styles.labAccessTitle}>Vous êtes un laboratoire ?</Text>
            <Text style={styles.labAccessSubtitle}>
              Connectez-vous pour gérer vos commandes, personnel et catalogue.
              L{"'"}inscription se fait sur validation de l{"'"}administration.
            </Text>
            <View style={styles.labActions}>
              <TouchableOpacity
                style={styles.labPrimary}
                onPress={() => router.push('/laboratory/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.labPrimaryText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.labSecondary}
                onPress={() => router.push('/contact')}
                activeOpacity={0.8}
              >
                <Text style={styles.labSecondaryText}>Demander un accès</Text>
              </TouchableOpacity>
            </View>
          </View>
          )}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Pourquoi choisir FaciLab ?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <feature.icon size={28} color={Colors.patient.primary} strokeWidth={2} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsSection}>
          <LinearGradient
            colors={[Colors.patient.background, Colors.common.white]}
            style={styles.statsGradient}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Patients satisfaits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Types d{"'"}analyses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24h</Text>
              <Text style={styles.statLabel}>Résultats moyens</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.processSection}>
          <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Créez votre compte</Text>
              <Text style={styles.stepDescription}>
                Inscrivez-vous gratuitement et complétez votre profil médical
              </Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Trouvez un laboratoire</Text>
              <Text style={styles.stepDescription}>
                Recherchez les laboratoires disponibles dans votre région
              </Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Réservez votre prélèvement</Text>
              <Text style={styles.stepDescription}>
                Choisissez entre un prélèvement à domicile ou au laboratoire
              </Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepTitle}>Recevez vos résultats</Text>
              <Text style={styles.stepDescription}>
                Consultez vos résultats en ligne de manière sécurisée
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>Votre Assistant Intelligent</Text>
          <View style={styles.aiCard}>
            <View style={styles.aiIconContainer}>
              <Bot size={40} color={Colors.patient.primary} strokeWidth={2} />
            </View>
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>Assistant IA Personnalisé</Text>
              <Text style={styles.aiDescription}>
                Notre assistant virtuel vous aide à choisir les bons tests, répond à vos questions 24/7,
                et vous guide tout au long de votre parcours médical.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.tryAiButton}
            onPress={() => router.push('/patient/assistant')}
            activeOpacity={0.8}
          >
            <MessageCircle size={20} color={Colors.common.white} strokeWidth={2} />
            <Text style={styles.tryAiButtonText}>Essayer l{"'"}assistant</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Un Support Dédié</Text>
          <View style={styles.supportGrid}>
            <View style={styles.supportCard}>
              <View style={styles.supportIconContainer}>
                <Shield size={28} color={Colors.patient.primary} strokeWidth={2} />
              </View>
              <Text style={styles.supportTitle}>Support Client</Text>
              <Text style={styles.supportDescription}>
                Notre équipe est disponible pour répondre à toutes vos questions
              </Text>
            </View>
            <View style={styles.supportCard}>
              <View style={styles.supportIconContainer}>
                <Award size={28} color={Colors.patient.primary} strokeWidth={2} />
              </View>
              <Text style={styles.supportTitle}>Qualité Certifiée</Text>
              <Text style={styles.supportDescription}>
                Tous nos laboratoires partenaires sont certifiés et régulés
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 FaciLab - Tous droits réservés</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Mentions légales</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Confidentialité</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Contact</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: __DEV__ ? 120 : 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: Colors.common.white,
  },
  headerContent: {
    paddingTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
  tagline: {
    fontSize: 18,
    color: Colors.patient.primary,
    marginTop: 8,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    lineHeight: 40,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 17,
    color: Colors.common.gray,
    lineHeight: 26,
    marginBottom: 32,
  },
  ctaContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.common.white,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    backgroundColor: Colors.common.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.patient.primary,
  },
  secondaryButtonText: {
    color: Colors.patient.primary,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  labAccessCard: {
    marginTop: 20,
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  labAccessTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  labAccessSubtitle: {
    fontSize: 14,
    color: Colors.common.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  labActions: {
    flexDirection: 'row',
    gap: 12,
  },
  labPrimary: {
    backgroundColor: Colors.laboratory.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  labPrimaryText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  labSecondary: {
    backgroundColor: Colors.common.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.laboratory.primary,
  },
  labSecondaryText: {
    color: Colors.laboratory.primary,
    fontSize: 14,
    fontWeight: '700' as const,
  },

  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: Colors.patient.background,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: Colors.common.white,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.patient.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 15,
    color: Colors.common.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  statsGradient: {
    borderRadius: 16,
    padding: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.patient.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.common.gray,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.common.border,
  },
  processSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: Colors.common.white,
  },
  processSteps: {
    gap: 24,
  },
  processStep: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.patient.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.common.white,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: Colors.common.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  aiSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: Colors.patient.background,
  },
  aiCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.patient.light,
    marginBottom: 16,
  },
  tryAiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.patient.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  tryAiButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  aiIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.patient.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 15,
    color: Colors.common.gray,
    lineHeight: 22,
  },
  supportSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  supportGrid: {
    gap: 16,
  },
  supportCard: {
    backgroundColor: Colors.common.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.common.border,
  },
  supportIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.patient.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.common.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 14,
    color: Colors.common.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: Colors.common.lightGray,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.common.gray,
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: Colors.common.gray,
  },
  footerDot: {
    fontSize: 14,
    color: Colors.common.gray,
  },
});
