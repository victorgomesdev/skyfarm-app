import { useContext } from "react"
import { SupabaseContext } from "@/shared/supabase"

const useAuth = () => {
    const ctx = useContext(SupabaseContext)
    return ctx.client?.auth ?? null
}

export default useAuth