import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage"

type SupabaseCtx = {
  client: SupabaseClient | null,
  session: Session | null
}

export const SupabaseContext = createContext<SupabaseCtx>({client: null, session: null})

const SupabaseProvider = ({ children }: PropsWithChildren) => {

  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [session, setSession] = useState<Session | null>(null)

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

    const { data: { subscription } } = sp.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SupabaseContext.Provider value={{ client, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export default SupabaseProvider