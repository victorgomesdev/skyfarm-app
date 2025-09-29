import { useContext } from "react"
import { Tabs } from "expo-router"
import Theme from "@/constants/Theme"
import TabBar from "@/components/TabBar"
import { SupabaseContext } from "@/shared/supabase"

const TabLayout = () => {

    const { loading } = useContext(SupabaseContext)

    return (
        <Tabs
            initialRouteName="projects"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Theme.colors?.primary
                },
                headerTintColor: '#ffffff',
                animation: 'shift'
            }}
            tabBar={(props) => {
                return (
                    <TabBar descriptors={props.descriptors} state={props.state} navigation={props.navigation} insets={props.insets} />
                )
            }}>
            <Tabs.Screen name="projects" options={{ headerTitle: 'Projetos' }} />
            <Tabs.Screen name="new_area" options={{ headerTitle: 'Nova área' }} />
        </Tabs>
    )
}

export default TabLayout