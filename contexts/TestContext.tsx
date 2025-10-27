import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Test, TestPack } from '@/constants/types';
import { mockTests, mockPacks } from '@/constants/mockData';

interface TestContextValue {
  tests: Test[];
  packs: TestPack[];
  addTest: (test: Test) => Promise<void>;
  updateTest: (id: string, updates: Partial<Test>) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
  addPack: (pack: TestPack) => Promise<void>;
  updatePack: (id: string, updates: Partial<TestPack>) => Promise<void>;
  deletePack: (id: string) => Promise<void>;
  getTestById: (id: string) => Test | undefined;
  getPackById: (id: string) => TestPack | undefined;
  isLoading: boolean;
}

const TESTS_STORAGE_KEY = 'tests';
const PACKS_STORAGE_KEY = 'packs';

export const [TestProvider, useTests] = createContextHook<TestContextValue>(() => {
  const [tests, setTests] = useState<Test[]>([]);
  const [packs, setPacks] = useState<TestPack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedTests, storedPacks] = await Promise.all([
        AsyncStorage.getItem(TESTS_STORAGE_KEY),
        AsyncStorage.getItem(PACKS_STORAGE_KEY),
      ]);

      if (storedTests) {
        setTests(JSON.parse(storedTests));
      } else {
        setTests(mockTests);
        await AsyncStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(mockTests));
      }

      if (storedPacks) {
        setPacks(JSON.parse(storedPacks));
      } else {
        setPacks(mockPacks);
        await AsyncStorage.setItem(PACKS_STORAGE_KEY, JSON.stringify(mockPacks));
      }
    } catch (error) {
      console.error('Error loading tests/packs:', error);
      setTests(mockTests);
      setPacks(mockPacks);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTests = async (updatedTests: Test[]) => {
    try {
      await AsyncStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(updatedTests));
      setTests(updatedTests);
    } catch (error) {
      console.error('Error saving tests:', error);
      throw error;
    }
  };

  const savePacks = async (updatedPacks: TestPack[]) => {
    try {
      await AsyncStorage.setItem(PACKS_STORAGE_KEY, JSON.stringify(updatedPacks));
      setPacks(updatedPacks);
    } catch (error) {
      console.error('Error saving packs:', error);
      throw error;
    }
  };

  const addTest = useCallback(async (test: Test) => {
    const updated = [...tests, test];
    await saveTests(updated);
  }, [tests]);

  const updateTest = useCallback(async (id: string, updates: Partial<Test>) => {
    const updated = tests.map(test => 
      test.id === id ? { ...test, ...updates } : test
    );
    await saveTests(updated);
  }, [tests]);

  const deleteTest = useCallback(async (id: string) => {
    const updated = tests.filter(test => test.id !== id);
    await saveTests(updated);
  }, [tests]);

  const addPack = useCallback(async (pack: TestPack) => {
    const updated = [...packs, pack];
    await savePacks(updated);
  }, [packs]);

  const updatePack = useCallback(async (id: string, updates: Partial<TestPack>) => {
    const updated = packs.map(pack => 
      pack.id === id ? { ...pack, ...updates } : pack
    );
    await savePacks(updated);
  }, [packs]);

  const deletePack = useCallback(async (id: string) => {
    const updated = packs.filter(pack => pack.id !== id);
    await savePacks(updated);
  }, [packs]);

  const getTestById = useCallback((id: string) => {
    return tests.find(test => test.id === id);
  }, [tests]);

  const getPackById = useCallback((id: string) => {
    return packs.find(pack => pack.id === id);
  }, [packs]);

  return useMemo(() => ({
    tests,
    packs,
    addTest,
    updateTest,
    deleteTest,
    addPack,
    updatePack,
    deletePack,
    getTestById,
    getPackById,
    isLoading,
  }), [tests, packs, addTest, updateTest, deleteTest, addPack, updatePack, deletePack, getTestById, getPackById, isLoading]);
});
