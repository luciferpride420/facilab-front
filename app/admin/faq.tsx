import React, { useCallback, memo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { FAQProvider, useFAQ, FAQItem } from '@/contexts/FAQContext';
import { Plus, Trash2, Upload, Download, Tag, HelpCircle } from 'lucide-react-native';
import { Stack } from 'expo-router';

interface Draft {
  question: string;
  answer: string;
  tags: string;
}

// Simple FAQ item component without complex debouncing
const SimpleFAQItem = memo(({ 
  item, 
  onUpdate, 
  onRemove 
}: { 
  item: FAQItem; 
  onUpdate: (id: string, updates: Partial<Omit<FAQItem, 'id'>>) => void;
  onRemove: (id: string) => void;
}) => {
  const [localQuestion, setLocalQuestion] = useState(item.question);
  const [localAnswer, setLocalAnswer] = useState(item.answer);
  const [localTags, setLocalTags] = useState(item.tags.join(', '));

  const handleQuestionChange = (text: string) => {
    setLocalQuestion(text);
    onUpdate(item.id, { question: text });
  };

  const handleAnswerChange = (text: string) => {
    setLocalAnswer(text);
    onUpdate(item.id, { answer: text });
  };

  const handleTagsChange = (text: string) => {
    setLocalTags(text);
    const tags = text.split(',').map((x) => x.trim()).filter(Boolean);
    onUpdate(item.id, { tags });
  };

  return (
    <View style={styles.itemRow}>
      <TextInput
        style={[styles.input, styles.flex1]}
        value={localQuestion}
        onChangeText={handleQuestionChange}
        placeholder="Question"
        testID={`faq-q-${item.id}`}
      />
      <TextInput
        style={[styles.input, styles.flex1, styles.multiline]}
        value={localAnswer}
        onChangeText={handleAnswerChange}
        placeholder="Réponse"
        multiline
        numberOfLines={3}
        testID={`faq-a-${item.id}`}
      />
      <TextInput
        style={[styles.input, styles.flex1]}
        value={localTags}
        onChangeText={handleTagsChange}
        placeholder="Tags (séparés par des virgules)"
        testID={`faq-tags-${item.id}`}
      />
      <TouchableOpacity 
        style={[styles.iconBtn, styles.danger]} 
        onPress={() => onRemove(item.id)} 
        testID={`faq-del-${item.id}`}
      >
        <Trash2 size={18} color={Colors.common.white} />
      </TouchableOpacity>
    </View>
  );
});

function AdminFAQInner() {
  const { items, add, update, remove, replaceAll, exportJson } = useFAQ();
  const [draft, setDraft] = useState<Draft>({ question: '', answer: '', tags: '' });
  const [importText, setImportText] = useState<string>('');

  const onAdd = useCallback(() => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir une question et une réponse.');
      return;
    }
    const tags = draft.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => !!t);
    add({ question: draft.question.trim(), answer: draft.answer.trim(), tags });
    setDraft({ question: '', answer: '', tags: '' });
  }, [draft, add]);

  const onImport = useCallback(() => {
    try {
      const parsed = JSON.parse(importText) as FAQItem[];
      if (!Array.isArray(parsed)) throw new Error('Format invalide');
      replaceAll(parsed);
      setImportText('');
      Alert.alert('Succès', 'FAQ importée avec succès.');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de lire ce JSON.');
    }
  }, [importText, replaceAll]);

  const onExport = useCallback(() => {
    const txt = exportJson();
    setImportText(txt);
  }, [exportJson]);

  const handleUpdate = useCallback((id: string, updates: Partial<Omit<FAQItem, 'id'>>) => {
    update(id, updates);
  }, [update]);

  const handleRemove = useCallback((id: string) => {
    remove(id);
  }, [remove]);

  return (
    <View style={styles.container} testID="admin-faq-page">
      <Stack.Screen options={{ title: 'Gestion FAQ', headerShown: true }} />

      <View style={styles.header}>
        <HelpCircle size={22} color={Colors.common.darkGray} />
        <Text style={styles.title}>Gestion de la FAQ</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ajouter une question</Text>
          <TextInput
            style={styles.input}
            placeholder="Question"
            value={draft.question}
            onChangeText={(t) => setDraft((d) => ({ ...d, question: t }))}
            testID="faq-new-question"
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Réponse"
            value={draft.answer}
            onChangeText={(t) => setDraft((d) => ({ ...d, answer: t }))}
            multiline
            numberOfLines={4}
            testID="faq-new-answer"
          />
          <View style={styles.row}>
            <Tag size={16} color={Colors.common.gray} />
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Tags (séparés par des virgules)"
              value={draft.tags}
              onChangeText={(t) => setDraft((d) => ({ ...d, tags: t }))}
              testID="faq-new-tags"
            />
          </View>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={onAdd} activeOpacity={0.8} testID="faq-add">
            <Plus size={18} color={Colors.common.white} />
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Questions existantes</Text>
            <Text style={styles.count}>{items.length} élément(s)</Text>
          </View>
          {items.map((it) => (
            <SimpleFAQItem
              key={it.id}
              item={it}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Importer / Exporter</Text>
          <View style={styles.rowGap}>
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onExport} activeOpacity={0.8} testID="faq-export">
              <Download size={18} color={Colors.patient.primary} />
              <Text style={[styles.buttonText, styles.secondaryText]}>Exporter en JSON</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onImport} activeOpacity={0.8} testID="faq-import">
              <Upload size={18} color={Colors.patient.primary} />
              <Text style={[styles.buttonText, styles.secondaryText]}>Importer depuis JSON</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.multiline, { minHeight: 160 }]}
            placeholder="Collez votre JSON ici..."
            value={importText}
            onChangeText={setImportText}
            multiline
            testID="faq-json"
          />
          <Text style={styles.helper}>
            Astuce: copiez/collez ce JSON pour sauvegarder une version ou pour partager avec un autre administrateur.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function AdminFAQPage() {
  return (
    <FAQProvider>
      <AdminFAQInner />
    </FAQProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.common.white },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: '700' as const, color: Colors.common.darkGray },
  content: { padding: 20, gap: 16 },
  card: { borderWidth: 1, borderColor: Colors.common.border, borderRadius: 12, backgroundColor: Colors.common.white, padding: 14, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.common.darkGray },
  input: { borderWidth: 1, borderColor: Colors.common.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: Colors.common.white, outlineStyle: 'none' },
  multiline: { textAlignVertical: 'top' as const },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  flex1: { flex: 1 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  primary: { backgroundColor: Colors.patient.primary },
  secondary: { backgroundColor: Colors.patient.background, borderWidth: 1, borderColor: Colors.patient.primary },
  secondaryText: { color: Colors.patient.primary },
  danger: { backgroundColor: '#ef4444' },
  iconBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { color: Colors.common.white, fontWeight: '700' as const },
  itemRow: { gap: 8, borderTopWidth: 1, borderTopColor: Colors.common.border, paddingTop: 12, marginTop: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { color: Colors.common.gray, fontSize: 12 },
  helper: { color: Colors.common.gray, fontSize: 12 },
});