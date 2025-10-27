import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Offer } from '@/constants/types';

interface OffersContextValue {
  offers: Offer[];
  getOffersByLab: (labId: string) => Offer[];
  addOffer: (offer: Offer) => Promise<void>;
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  isLoading: boolean;
}

const STORAGE_KEY = 'offers';

export const [OffersProvider, useOffers] = createContextHook<OffersContextValue>(() => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setOffers(JSON.parse(stored) as Offer[]);
        } else {
          setOffers([]);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error loading offers:', error);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: Offer[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setOffers(next);
  }, []);

  const getOffersByLab = useCallback((labId: string) => {
    return offers.filter(o => o.labId === labId);
  }, [offers]);

  const addOffer = useCallback(async (offer: Offer) => {
    const next = [...offers, offer];
    await persist(next);
  }, [offers, persist]);

  const updateOffer = useCallback(async (id: string, updates: Partial<Offer>) => {
    const next = offers.map(o => o.id === id ? { ...o, ...updates } : o);
    await persist(next);
  }, [offers, persist]);

  const deleteOffer = useCallback(async (id: string) => {
    const next = offers.filter(o => o.id !== id);
    await persist(next);
  }, [offers, persist]);

  return useMemo(() => ({
    offers,
    getOffersByLab,
    addOffer,
    updateOffer,
    deleteOffer,
    isLoading,
  }), [offers, getOffersByLab, addOffer, updateOffer, deleteOffer, isLoading]);
});
