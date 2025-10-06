import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button } from 'react-native-paper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Screen from "@/components/Screen"
import useSession from '@/hooks/useSession'

const DefineAreaParams = () => {

    const [query, setQuery] = useState<{name: string, coords: string, project_id: string}>()

    const params = useLocalSearchParams()
    const session = useSession()

    const teste = async () => {

        await fetch((process.env.EXPO_PUBLIC_API_URL as string) + '/area/create', {
            method: 'post',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                name: query?.name,
                coords: query?.coords,
                project_id: query?.project_id
            })
        }).then()
    }

    useEffect(() => {
        setQuery({
            name: (params.name as string),
            coords: (params.coords as string),
            project_id: (params.project_id as string)
        })
    }, [])

    return (
        <Screen>
            <Button onPress={teste}>Enviar</Button>
        </Screen>
    )
}

export default DefineAreaParams