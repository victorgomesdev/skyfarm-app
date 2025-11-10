import { CreateAreaRequest } from "../types/area-request";

export async function createNewArea(payload: CreateAreaRequest, accessToken: string) {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/area/create`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || response.status !== 201) {
            // Erro de requisição
            return {
                response: false,
                error: data?.message || "Erro ao criar área."
            };
        }

        // Sucesso
        return {
            response: data,
            error: null
        };

    } catch (err) {
        console.error("Erro na requisição:", err);
        return {
            response: false,
            error: "Ocorreu um erro ao se conectar ao servidor. Tente novamente."
        };
    }
}
