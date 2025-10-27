import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { User as UserIcon, LogOut, Home, ShoppingCart, Calendar, Settings, BarChart3, Users, FileText, AlertCircle, MessageSquare, Mail, Building2, HelpCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, logout, isHydrated } = useAuth();
  const { width } = useWindowDimensions();
  const isCompact = width < 1080;
  const isUltraCompact = width < 780;
  const headerHeight = Platform.OS === 'web' ? (isCompact ? 64 : 72) : 72;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const [isHoveringContact, setIsHoveringContact] = React.useState(false);

  const rolePrimaryColor = !user
    ? Colors.patient.primary
    : user.role === 'patient'
    ? Colors.patient.primary
    : user.role === 'laboratory'
    ? Colors.laboratory.primary
    : user.role === 'admin'
    ? Colors.admin.primary
    : Colors.agent.primary;

  const getNavigationItems = () => {
    if (!user) {
      return [
        { icon: Home, label: 'Accueil', route: '/' },
        { icon: ShoppingCart, label: 'Catalogue', route: '/patient/catalog' },
        { icon: HelpCircle, label: 'FAQ', route: '/faq' },
      ];
    }

    switch (user.role) {
      case 'patient':
        return [
          { icon: Home, label: 'Accueil', route: '/' },
          { icon: ShoppingCart, label: 'Catalogue', route: '/patient/catalog' },
          { icon: FileText, label: 'Commandes', route: '/patient/orders' },
          { icon: HelpCircle, label: 'FAQ', route: '/faq' },
          { icon: UserIcon, label: 'Profil', route: '/patient/profile' },
        ];
      case 'laboratory':
        return [
          { icon: BarChart3, label: 'Dashboard', route: '/laboratory/dashboard' },
          { icon: Calendar, label: 'Planning', route: '/laboratory/schedule' },
          { icon: FileText, label: 'Commandes', route: '/laboratory/orders' },
          { icon: Users, label: 'Personnel', route: '/laboratory/staff' },
          { icon: ShoppingCart, label: 'Gestion Catalogue', route: '/laboratory/offers' },
          { icon: HelpCircle, label: 'FAQ', route: '/faq' },
          { icon: UserIcon, label: 'Profil', route: '/laboratory/profile' },
        ];
      case 'admin':
        return [
          { icon: BarChart3, label: 'Dashboard', route: '/admin/dashboard' },
          { icon: Users, label: 'Utilisateurs', route: '/admin/users' },
          { icon: ShoppingCart, label: 'Catalogue', route: '/admin/catalog' },
          { icon: AlertCircle, label: 'Réclamations', route: '/admin/complaints' },
          { icon: FileText, label: 'Rapports', route: '/admin/reports' },
          { icon: Mail, label: 'Messages', route: '/admin/messages' },
          { icon: HelpCircle, label: 'FAQ', route: '/faq' },
          { icon: HelpCircle, label: 'Gestion FAQ', route: '/admin/faq' },
          { icon: Settings, label: 'Paramètres', route: '/admin/settings' },
        ];
      case 'agent':
        return [
          { icon: BarChart3, label: 'Dashboard', route: '/agent/dashboard' },
          { icon: AlertCircle, label: 'Réclamations', route: '/agent/complaints' },
          { icon: HelpCircle, label: 'FAQ', route: '/faq' },
          { icon: UserIcon, label: 'Profil', route: '/agent/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isHoveringLogout, setIsHoveringLogout] = React.useState(false);
  const [isHoveringLogin, setIsHoveringLogin] = React.useState(false);
  const [isHoveringLabLogin, setIsHoveringLabLogin] = React.useState(false);
  const [isHoveringAdminLogin, setIsHoveringAdminLogin] = React.useState(false);
  const [isHoveringAgentLogin, setIsHoveringAgentLogin] = React.useState(false);

  return (
    <View style={[styles.container, { paddingTop: Platform.select({ ios: 44, android: 0, web: 0 }), paddingBottom: 0, height: Platform.OS === 'web' ? headerHeight : undefined }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.logoContainer, Platform.OS === 'web' && { marginLeft: -24, height: headerHeight }]}
          onPress={() => router.push('/')}
          activeOpacity={0.7}
          testID="header-logo"
        >
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/x357ana9p9pwawz8h39gt' }}
            style={{ height: headerHeight, aspectRatio: 240/72 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={[styles.navigation, isUltraCompact && { justifyContent: 'flex-start' }]}>
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isHovered = hoveredIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.navItem,
                  isHovered && Platform.OS === 'web' && styles.navItemHovered,
                ]}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
                testID={`nav-${item.label}`}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setHoveredIndex(index),
                  onMouseLeave: () => setHoveredIndex(null),
                })}
              >
                <IconComponent size={isCompact ? 18 : 20} color={isHovered && Platform.OS === 'web' ? Colors.common.white : rolePrimaryColor} />
                {Platform.OS === 'web' && !isUltraCompact && (
                  <Text style={[styles.navText, { color: rolePrimaryColor, fontSize: isCompact ? 14 : 15 }, isHovered && styles.navTextHovered]}>{item.label}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.rightSection}>
          {user?.role !== 'agent' && (
            <TouchableOpacity
              style={[
                styles.contactButton,
                isHoveringContact && Platform.OS === 'web' && styles.navItemHovered,
              ]}
              onPress={() => router.push('/contact')}
              activeOpacity={0.7}
              testID="header-contact"
              {...(Platform.OS === 'web' && {
                onMouseEnter: () => setIsHoveringContact(true),
                onMouseLeave: () => setIsHoveringContact(false),
              })}
            >
              <MessageSquare size={isCompact ? 18 : 20} color={isHoveringContact && Platform.OS === 'web' ? Colors.common.white : rolePrimaryColor} />
              {Platform.OS === 'web' && !isUltraCompact && (
                <Text style={[styles.navText, { color: rolePrimaryColor, fontSize: isCompact ? 14 : 15 }, isHoveringContact && styles.navTextHovered]}>Contact</Text>
              )}
            </TouchableOpacity>
          )}

          {user && isHydrated && (
            <>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user.name}
                </Text>
                <Text style={styles.userRole}>
                  {user.role === 'patient' && 'Patient'}
                  {user.role === 'laboratory' && 'Laboratoire'}
                  {user.role === 'admin' && 'Administrateur'}
                  {user.role === 'agent' && 'Agent Support'}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  isHoveringLogout && Platform.OS === 'web' && styles.navItemHovered,
                ]}
                onPress={handleLogout}
                activeOpacity={0.7}
                testID="header-logout"
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setIsHoveringLogout(true),
                  onMouseLeave: () => setIsHoveringLogout(false),
                })}
              >
                <LogOut size={isCompact ? 18 : 20} color={isHoveringLogout && Platform.OS === 'web' ? Colors.common.white : rolePrimaryColor} />
              </TouchableOpacity>
            </>
          )}
          {!user && isHydrated && (
            <View style={styles.authRow}>
              <TouchableOpacity
                style={[
                  styles.smallPill,
                  isHoveringLabLogin && Platform.OS === 'web' && styles.navItemHovered,
                ]}
                onPress={() => router.push('/laboratory/login')}
                activeOpacity={0.7}
                testID="header-lab-login"
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setIsHoveringLabLogin(true),
                  onMouseLeave: () => setIsHoveringLabLogin(false),
                })}
              >
                <Building2 size={isCompact ? 16 : 18} color={isHoveringLabLogin && Platform.OS === 'web' ? Colors.common.white : Colors.laboratory.primary} />
                {Platform.OS === 'web' && !isUltraCompact && (
                  <Text style={[styles.navText, { color: Colors.laboratory.primary, fontSize: isCompact ? 13 : 14 }, isHoveringLabLogin && styles.navTextHovered]}>Labo</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.smallPill,
                  isHoveringAdminLogin && Platform.OS === 'web' && styles.navItemHovered,
                ]}
                onPress={() => router.push('/admin/login')}
                activeOpacity={0.7}
                testID="header-admin-login"
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setIsHoveringAdminLogin(true),
                  onMouseLeave: () => setIsHoveringAdminLogin(false),
                })}
              >
                <Settings size={isCompact ? 16 : 18} color={isHoveringAdminLogin && Platform.OS === 'web' ? Colors.common.white : Colors.admin.primary} />
                {Platform.OS === 'web' && !isUltraCompact && (
                  <Text style={[styles.navText, { color: Colors.admin.primary, fontSize: isCompact ? 13 : 14 }, isHoveringAdminLogin && styles.navTextHovered]}>Admin</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.smallPill,
                  isHoveringAgentLogin && Platform.OS === 'web' && styles.navItemHovered,
                ]}
                onPress={() => router.push('/agent/login')}
                activeOpacity={0.7}
                testID="header-agent-login"
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setIsHoveringAgentLogin(true),
                  onMouseLeave: () => setIsHoveringAgentLogin(false),
                })}
              >
                <UserIcon size={isCompact ? 16 : 18} color={isHoveringAgentLogin && Platform.OS === 'web' ? Colors.common.white : Colors.agent.primary} />
                {Platform.OS === 'web' && !isUltraCompact && (
                  <Text style={[styles.navText, { color: Colors.agent.primary, fontSize: isCompact ? 13 : 14 }, isHoveringAgentLogin && styles.navTextHovered]}>Agent</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isHoveringLogin && Platform.OS === 'web' && styles.navItemHovered,
                ]}
                onPress={() => router.push('/patient/login')}
                activeOpacity={0.7}
                testID="header-patient-login"
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setIsHoveringLogin(true),
                  onMouseLeave: () => setIsHoveringLogin(false),
                })}
              >
                <UserIcon size={isCompact ? 18 : 20} color={isHoveringLogin && Platform.OS === 'web' ? Colors.common.white : rolePrimaryColor} />
                {!isUltraCompact && (
                  <Text style={[styles.loginText, { color: rolePrimaryColor, fontSize: isCompact ? 13 : 14 }, isHoveringLogin && styles.navTextHovered]}>Connexion</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.common.white,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.common.border,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    maxWidth: 1600,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 72,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 6 : 16,
    flex: 1,
    justifyContent: 'center',
    flexWrap: Platform.OS === 'web' ? ('wrap' as const) : ('nowrap' as const),
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Platform.OS === 'web' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 12,
    borderRadius: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    }),
  },
  navItemHovered: {
    backgroundColor: Colors.patient.primary,
    ...Platform.select({
      web: {
        boxShadow: `0 8px 24px ${Colors.patient.primary}33`,
        transform: [{ translateY: -2 }],
      },
    }),
  },
  navText: {
    color: Colors.patient.primary,
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: '600' as const,
    ...Platform.select({
      web: {
        transition: 'color 0.3s ease',
      },
    }),
  },
  navTextHovered: {
    color: Colors.common.white,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Platform.OS === 'web' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 12,
    borderRadius: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    }),
  },
  userInfo: {
    alignItems: 'flex-end',
    maxWidth: 150,
  },
  userName: {
    color: Colors.common.darkGray,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  userRole: {
    color: Colors.common.gray,
    fontSize: 12,
  },
  logoutButton: {
    padding: Platform.OS === 'web' ? 8 : 10,
    borderRadius: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    }),
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Platform.OS === 'web' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.patient.primary,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    }),
  },
  loginText: {
    color: Colors.patient.primary,
    fontSize: 14,
    fontWeight: '600' as const,
    ...Platform.select({
      web: {
        transition: 'color 0.3s ease',
      },
    }),
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Platform.OS === 'web' ? 6 : 8,
    paddingHorizontal: Platform.OS === 'web' ? 10 : 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.common.border,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    }),
  },
});
