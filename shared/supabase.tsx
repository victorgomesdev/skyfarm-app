import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

type SupabaseCtx = {
  client: SupabaseClient | null;
  session: Session | null;
  auth: SupabaseAuthClient | null;
  loading: boolean;
};

export const SupabaseContext = createContext<SupabaseCtx>({
  client: null,
  session: null,
  loading: true,
  auth: null,
});

const SupabaseProvider = ({ children }: PropsWithChildren) => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [auth, setAuth] = useState<SupabaseAuthClient | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useRouter();

  useEffect(() => {
    const sp = createClient(
      process.env.EXPO_PUBLIC_SB_URL as string,
      process.env.EXPO_PUBLIC_SB_KEY as string,
      {
        auth: {
          storage: AsyncStorage,
          persistSession: true,
          detectSessionInUrl: false,
          autoRefreshToken: true,
        },
      }
    );

    setClient(sp);
    setAuth(sp.auth);

    const checkInitialSession = async () => {
      try {
        const { data, error } = await sp.auth.getSession();
        if (error) {
          setSession(null);
        } else {
          setSession(data.session);
        }
        setLoading(false);
      } catch (err: any) {
        setSession(null);
        setLoading(false);
        //navigation.replace('/login')
      }
    };

    checkInitialSession();

    const { data: { subscription } } = sp.auth.onAuthStateChange((event, session) => {

      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          setSession(session);
          setLoading(false);
          break;
        case 'SIGNED_OUT':
        case 'USER_UPDATED':
        case 'PASSWORD_RECOVERY':
          setSession(null);
          setLoading(false);
          //navigation.replace('/login');
          break;
      }
    });

    const stateSubscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active' && client) {
        try {
          const { data, error } = await client.auth.getSession();
          if (error) {
            await client.auth.signOut();
            await AsyncStorage.removeItem(`sb-${process.env.EXPO_PUBLIC_SB_URL?.split('.')[0].replace('https://', '')}-auth-token`);
            setSession(null);
            return;
          }
          setSession(data.session);
        } catch (err: any) {
          setSession(null);
          //navigation.replace('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      stateSubscription.remove();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ client, session, loading, auth }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;