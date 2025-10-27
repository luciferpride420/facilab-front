import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { FileQuestion } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View style={styles.container}>
        <FileQuestion size={64} color={Colors.common.gray} strokeWidth={1.5} />
        <Text style={styles.title}>Page introuvable</Text>
        <Text style={styles.message}>
          Cette page n'existe pas. Retournez à l'accueil.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l'accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: __DEV__ ? 120 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.common.darkGray,
    marginTop: 20,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.common.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    backgroundColor: Colors.patient.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
