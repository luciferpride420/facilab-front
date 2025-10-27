import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { FAQProvider, useFAQ, FAQItem } from '@/contexts/FAQContext';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react-native';
import { Stack } from 'expo-router';
import ErrorBoundary from '@/components/ErrorBoundary';

// Simple FAQ item component
const FAQItemComponent = memo(({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: (id: string) => void }) => {
  const handleToggle = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={handleToggle}
        activeOpacity={0.7}
        testID={`faq-item-${item.id}`}
      >
        <Text style={styles.question}>{item.question}</Text>
        {isOpen ? (
          <ChevronUp size={18} color={Colors.common.darkGray} />
        ) : (
          <ChevronDown size={18} color={Colors.common.darkGray} />
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.answerBox}>
          <Text style={styles.answer}>{item.answer}</Text>
          {item.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {item.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>#{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
});

function FAQContent() {
  const { items, search } = useFAQ();
  const [query, setQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo<FAQItem[]>(() => {
    if (!query.trim()) return items;
    return search(query);
  }, [query, search, items]);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setQuery(text);
  }, []);

  return (
    <View style={styles.container} testID="faq-page">
      <Stack.Screen options={{ title: 'FAQ', headerShown: true }} />
      
      <View style={styles.header}>
        <HelpCircle size={22} color={Colors.common.darkGray} />
        <Text style={styles.title}>Foire aux questions</Text>
      </View>

      <Text style={styles.subtitle}>Trouvez rapidement des réponses à vos questions fréquentes.</Text>

      <View style={styles.searchBox}>
        <Search size={18} color={Colors.common.gray} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearchChange}
          placeholder="Rechercher une question ou un mot-clé"
          testID="faq-search"
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {results.map((item) => {
          const isOpen = openId === item.id;
          return (
            <FAQItemComponent
              key={item.id}
              item={item}
              isOpen={isOpen}
              onToggle={toggle}
            />
          );
        })}
        {results.length === 0 && query.trim() && (
          <Text style={styles.empty}>Aucun résultat. Essayez un autre mot-clé.</Text>
        )}
      </ScrollView>
    </View>
  );
}

export default function FAQPage() {
  return (
    <ErrorBoundary>
      <FAQProvider>
        <FAQContent />
      </FAQProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: '700' as const, color: Colors.common.darkGray },
  subtitle: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14, color: Colors.common.gray },
  searchBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.common.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.common.white,
  },
  searchInput: { flex: 1, fontSize: 15, outlineStyle: 'none' },
  list: { padding: 20, gap: 12 },
  card: { borderWidth: 1, borderColor: Colors.common.border, borderRadius: 12, backgroundColor: Colors.common.white },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  question: { flex: 1, fontSize: 16, fontWeight: '600' as const, color: Colors.common.darkGray, paddingRight: 10 },
  answerBox: { borderTopWidth: 1, borderTopColor: Colors.common.border, padding: 14, backgroundColor: Colors.patient.background },
  answer: { fontSize: 15, color: Colors.common.darkGray, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.common.white, borderWidth: 1, borderColor: Colors.common.border },
  tagText: { fontSize: 12, color: Colors.common.gray },
  empty: { textAlign: 'center', color: Colors.common.gray, marginTop: 40 },
});