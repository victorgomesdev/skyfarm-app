import { SupabaseContext } from "@/shared/supabase"
import { useContext } from "react"

const useClient = ()=> {
    const ctx = useContext(SupabaseContext)
    return ctx.client
}

export default useClient