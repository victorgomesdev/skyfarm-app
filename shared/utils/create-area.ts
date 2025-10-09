import { CreateAreaRequest } from "../types/area-request";

export async function createNewArea(payload: CreateAreaRequest, accessToken: string) {

    let respose!: any
    let error!: any

    try {

        await fetch((process.env.EXPO_PUBLIC_API_URL as string) + '/area/create', {
            method: 'post',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(async (r) => {

            const res = await r.json()
            if (r.status != 201) {
                error = res
                respose = false
            }

           respose = res
           error = false
        })
    } catch (err) {
        error = "Ocorreu um erro, tente novamente."
        respose = false
    }

    return { respose, error }
}