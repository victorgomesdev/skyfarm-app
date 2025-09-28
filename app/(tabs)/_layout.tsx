import { Tabs } from "expo-router"
import Theme from "@/constants/Theme"
import TabBar from "@/components/TabBar"

const TabLayout = () => {
    return (
        <Tabs
            initialRouteName="projects"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Theme.colors?.primary
                },
                headerTintColor: '#ffffff'
            }}
            tabBar={(props) => {
                return (
                    <TabBar descriptors={props.descriptors} state={props.state} navigation={props.navigation} insets={props.insets} />
                )
            }}>
            <Tabs.Screen name="projects" options={{ headerTitle: 'Projetos' }} />
            <Tabs.Screen name="new_area" options={{ headerTitle: 'Nova área' }} />
            <Tabs.Screen name="profile" options={{ headerTitle: 'Perfil' }} />
        </Tabs>
    )
}

export default TabLayout