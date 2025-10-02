import useSession from "@/hooks/useSession"

export async function createNewProject(projectName: string, token: string) {

    let response!: any
    let error!: any

    try {
        await fetch(<string>process.env.EXPO_PUBLIC_API_URL + '/project/create', {
            method: 'post',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: projectName
            })
        }).then(async (r) => {
            if(r.status == 200){
                response = true
                return
            }

            response = await r.json()
        })
    } catch (err) {
        error = "Ocorreu um erro inesperado."
    }

    return { response, error }
}