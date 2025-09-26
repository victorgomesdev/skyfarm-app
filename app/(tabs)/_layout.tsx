import { Tabs } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons'
import Theme from "@/constants/Theme"

const ROUTES = ["Projetos", "Nova área", "Perfil"]

const TabLayout = () => {

    return (
        <Tabs initialRouteName="projects" screenOptions={{
            headerTintColor: Theme.colors?.primary
        }}>
            <Tabs.Screen name="projects"/>
        </Tabs>
    )
}

export default TabLayout