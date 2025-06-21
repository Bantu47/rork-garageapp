import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Platform, View, Text, StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";
import AnimatedGarageLogo from "@/components/AnimatedGarageLogo";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Create a client with custom settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 500,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Custom splash screen component
function CustomSplashScreen() {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000000', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <AnimatedGarageLogo size={200} color="white" />
    </View>
  );
}

// Authentication guard component
function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const isMounted = useRef(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // Set mounted flag to true
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Only proceed with navigation if component is mounted
    if (!isMounted.current) return;
    
    const inAuthGroup = segments[0] === "(auth)";
    
    // Only perform the navigation check once after initial mount
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to the login page if not authenticated and not already in auth group
        router.replace("/login");
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to the main app if authenticated but still in auth group
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <CustomSplashScreen />;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <AuthenticationGuard>
              <RootLayoutNav />
            </AuthenticationGuard>
          </SafeAreaProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="vehicle/[id]" 
        options={{ 
          title: "Vehicle Details",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}