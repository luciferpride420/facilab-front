import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View } from "react-native";
import DevFooter from "@/components/DevFooter";
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { LaboratoryProvider } from "@/contexts/LaboratoryContext";
import { TestProvider } from "@/contexts/TestContext";
import { OffersProvider } from "@/contexts/OffersContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <>
      {Platform.OS === 'web' && <Header />}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="patient/login" />
          <Stack.Screen name="patient/signup" />
          <Stack.Screen name="patient/catalog" />
          <Stack.Screen name="patient/test/[id]" />
          <Stack.Screen name="patient/cart" />
          <Stack.Screen name="patient/checkout" />
          <Stack.Screen name="patient/orders" />
          <Stack.Screen name="patient/results" />
          <Stack.Screen name="patient/assistant" />
          <Stack.Screen name="patient/profile" />
          <Stack.Screen name="faq" />
          <Stack.Screen name="laboratory/login" />
          <Stack.Screen name="laboratory/signup" />
          <Stack.Screen name="laboratory/schedule" />
          <Stack.Screen name="laboratory/orders" />
          <Stack.Screen name="laboratory/upload" />
          <Stack.Screen name="laboratory/dashboard" />
          <Stack.Screen name="laboratory/staff" />
          <Stack.Screen name="laboratory/profile" />
          <Stack.Screen name="laboratory/offers" />
          <Stack.Screen name="admin/login" />
          <Stack.Screen name="admin/users" />
          <Stack.Screen name="admin/catalog" />
          <Stack.Screen name="admin/dashboard" />
          <Stack.Screen name="admin/reports" />
          <Stack.Screen name="admin/settings" />
          <Stack.Screen name="admin/complaints" />
          <Stack.Screen name="admin/messages" />
          <Stack.Screen name="admin/wallet" />
          <Stack.Screen name="admin/faq" />
          <Stack.Screen name="agent/login" />
          <Stack.Screen name="agent/dashboard" />
          <Stack.Screen name="agent/complaints" />
          <Stack.Screen name="agent/profile" />
        </Stack>
      </View>
      <DevFooter />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LaboratoryProvider>
            <TestProvider>
              <OffersProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootLayoutNav />
                </GestureHandlerRootView>
              </OffersProvider>
            </TestProvider>
          </LaboratoryProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
