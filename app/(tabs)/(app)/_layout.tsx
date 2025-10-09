import Theme from "@/constants/Theme"
import { Stack } from "expo-router"

const AppLayout = () => {
    return (
        <Stack
            initialRouteName="projects"
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: Theme.colors?.primary,
                },
                headerTintColor: '#ffffff',

            }}>
            <Stack.Screen name="areas" options={{ headerShown: true, headerTitle: 'Áreas' }} />
            <Stack.Screen name="projects" options={{ headerShown: true, headerTitle: 'Projetos' }} />
            <Stack.Screen name="webview" options={{ headerShown: true, headerTitle: 'Selecione os limites', presentation: 'modal', animation: 'slide_from_right' }} />
            <Stack.Screen name="define_params" options={{ headerShown: true, headerTitle: 'Parâmetros de consulta', presentation: 'modal', animation: 'slide_from_right' }} />
            <Stack.Screen name="details" options={{headerShown: true, headerTitle: 'Relatório'}}/>
        </Stack>
    )
}

export default AppLayout