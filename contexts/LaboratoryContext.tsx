import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Laboratory } from '@/constants/types';
import { mockLaboratories } from '@/constants/mockData';

interface LaboratoryContextValue {
  laboratories: Laboratory[];
  addLaboratory: (lab: Laboratory) => Promise<void>;
  updateLaboratory: (id: string, updates: Partial<Laboratory>) => Promise<void>;
  deleteLaboratory: (id: string) => Promise<void>;
  getLaboratoryById: (id: string) => Laboratory | undefined;
  isLoading: boolean;
}

const STORAGE_KEY = 'laboratories';

export const [LaboratoryProvider, useLaboratories] = createContextHook<LaboratoryContextValue>(() => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLaboratories();
  }, []);

  const loadLaboratories = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLaboratories(JSON.parse(stored));
      } else {
        setLaboratories(mockLaboratories);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockLaboratories));
      }
    } catch (error) {
      console.error('Error loading laboratories:', error);
      setLaboratories(mockLaboratories);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLaboratories = async (labs: Laboratory[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(labs));
      setLaboratories(labs);
    } catch (error) {
      console.error('Error saving laboratories:', error);
      throw error;
    }
  };

  const addLaboratory = useCallback(async (lab: Laboratory) => {
    const updated = [...laboratories, lab];
    await saveLaboratories(updated);
  }, [laboratories]);

  const updateLaboratory = useCallback(async (id: string, updates: Partial<Laboratory>) => {
    const updated = laboratories.map(lab => 
      lab.id === id ? { ...lab, ...updates } : lab
    );
    await saveLaboratories(updated);
  }, [laboratories]);

  const deleteLaboratory = useCallback(async (id: string) => {
    const updated = laboratories.filter(lab => lab.id !== id);
    await saveLaboratories(updated);
  }, [laboratories]);

  const getLaboratoryById = useCallback((id: string) => {
    return laboratories.find(lab => lab.id === id);
  }, [laboratories]);

  return useMemo(() => ({
    laboratories,
    addLaboratory,
    updateLaboratory,
    deleteLaboratory,
    getLaboratoryById,
    isLoading,
  }), [laboratories, addLaboratory, updateLaboratory, deleteLaboratory, getLaboratoryById, isLoading]);
});
