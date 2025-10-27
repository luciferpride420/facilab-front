import React, { useCallback, useMemo, useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  updatedAt: string;
}

// Demo FAQ data - this is what the platform could look like
const DEMO_FAQ_DATA: FAQItem[] = [
  {
    id: 'demo-1',
    question: 'Comment réserver un prélèvement à domicile ?',
    answer: 'Depuis le catalogue, ajoutez vos analyses au panier, validez la commande et choisissez "Prélèvement à domicile". Le laboratoire confirmera ensuite votre rendez-vous.',
    tags: ['commande', 'prélèvement', 'domicile'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    question: 'Sous combien de temps reçois-je mes résultats ?',
    answer: 'Selon le type d\'analyse et le laboratoire choisi, la plupart des résultats sont disponibles sous 24 à 72h. Vous serez notifié dès leur publication.',
    tags: ['résultats', 'délais'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    question: 'Comment fonctionne le paiement en ligne ?',
    answer: 'Le paiement se fait de manière sécurisée via notre plateforme. Nous acceptons les cartes bancaires, PayPal et les virements. Tous les paiements sont cryptés et sécurisés.',
    tags: ['paiement', 'sécurité'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    question: 'Puis-je annuler ma commande ?',
    answer: 'Oui, vous pouvez annuler votre commande jusqu\'à 24h avant le prélèvement. Les frais d\'annulation peuvent s\'appliquer selon les conditions du laboratoire.',
    tags: ['annulation', 'commande'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    question: 'Comment contacter le support client ?',
    answer: 'Notre support client est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par email, téléphone ou via le chat en ligne sur notre site.',
    tags: ['support', 'contact'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    question: 'Mes données personnelles sont-elles protégées ?',
    answer: 'Absolument. Nous respectons le RGPD et toutes les réglementations en vigueur. Vos données médicales sont cryptées et accessibles uniquement aux professionnels autorisés.',
    tags: ['confidentialité', 'RGPD', 'données'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-7',
    question: 'Comment devenir partenaire laboratoire ?',
    answer: 'Pour rejoindre notre réseau de laboratoires partenaires, contactez notre équipe commerciale. Nous vous accompagnerons dans l\'intégration et la formation de vos équipes.',
    tags: ['partenariat', 'laboratoire'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-8',
    question: 'Quels types d\'analyses proposez-vous ?',
    answer: 'Nous proposons un large éventail d\'analyses : analyses de sang, urines, microbiologie, génétique, et bien plus. Consultez notre catalogue pour voir l\'ensemble de nos services.',
    tags: ['analyses', 'catalogue'],
    updatedAt: new Date().toISOString(),
  }
];

export const [FAQProvider, useFAQ] = createContextHook(() => {
  const [items, setItems] = useState<FAQItem[]>(DEMO_FAQ_DATA);

  const add = useCallback((q: Omit<FAQItem, 'id' | 'updatedAt'>) => {
    const item: FAQItem = {
      id: `demo-${Date.now()}`,
      question: q.question,
      answer: q.answer,
      tags: q.tags,
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [item, ...prev]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<FAQItem, 'id'>>) => {
    setItems((prev) => 
      prev.map((it) => 
        it.id === id 
          ? { ...it, ...patch, updatedAt: new Date().toISOString() } 
          : it
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const replaceAll = useCallback((all: FAQItem[]) => {
    setItems(all);
  }, []);

  const exportJson = useCallback(() => {
    return JSON.stringify(items, null, 2);
  }, [items]);

  const search = useCallback((term: string): FAQItem[] => {
    const t = term.trim().toLowerCase();
    if (!t) return items;
    
    return items.filter((it) => {
      const question = it.question.toLowerCase();
      const answer = it.answer.toLowerCase();
      
      if (question.includes(t)) return true;
      if (answer.includes(t)) return true;
      return it.tags.some((tag) => tag.toLowerCase().includes(t));
    });
  }, [items]);

  const value = useMemo(() => ({ 
    items, 
    add, 
    update, 
    remove, 
    replaceAll, 
    exportJson, 
    search 
  }), [items, add, update, remove, replaceAll, exportJson, search]);
  
  return value;
});