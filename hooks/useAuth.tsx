import { useContext } from "react"
import { SupabaseContext } from "@/shared/supabase"

const useAuth = () => {
    const ctx = useContext(SupabaseContext)
    return {
        auth: ctx.auth,
        session: ctx.session
    }
}

export default useAuth