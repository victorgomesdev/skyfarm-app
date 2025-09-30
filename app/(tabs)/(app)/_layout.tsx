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
        </Stack>
    )
}

export default AppLayout