import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { AppState } from 'react-native'

type SupabaseCtx = {
  client: SupabaseClient | null,
  session: Session | null,
  loading: boolean
}

export const SupabaseContext = createContext<SupabaseCtx>({ client: null, session: null, loading: true })

const SupabaseProvider = ({ children }: PropsWithChildren) => {

  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const navigation = useRouter()

  useEffect(() => {

    const sp = createClient(process.env.EXPO_PUBLIC_SB_URL as string, process.env.EXPO_PUBLIC_SB_KEY as string, {
      auth: {
        storage: AsyncStorage,
        persistSession: true,
        detectSessionInUrl: false,
        autoRefreshToken: true
      }
    })

    setClient(sp)

    sp.auth.getSession().then(s => setSession(s.data.session))

    const { data: { subscription } } = sp.auth.onAuthStateChange((event, session) => {

      switch (event) {
        case "INITIAL_SESSION": setSession(session); break;
        case 'SIGNED_IN': setSession(session); break;
        case 'TOKEN_REFRESHED': setSession(session); break;
        case 'SIGNED_OUT': setSession(null); break;
      }
    })

    const stateSubscription = AppState.addEventListener('change', (state) => {
      (async () => {
        if (state == 'active') {

          setLoading(true)
          const { error } = await sp.auth.refreshSession()

          if (error) {
            setLoading(false)
            navigation.replace('/projects')
          }
        }
      })()
    })

    return () => {
      subscription.unsubscribe()
      stateSubscription.remove()
    }
  }, [])

  useEffect(() => {

    if (session) {
      setLoading(false)
      return
    }

    setLoading(false)
    // navigation.replace('/projects')

  }, [session])

  return (
    <SupabaseContext.Provider value={{ client, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export default SupabaseProvider