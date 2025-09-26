import { SupabaseContext } from "@/shared/supabase"
import { useContext } from "react"

const useSession = () => {
    const ctx = useContext(SupabaseContext)

    return ctx.session
}

export default useSession