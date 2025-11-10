import TabBar from "@/components/TabBar"
import { SupabaseContext } from "@/shared/supabase"
import { Tabs } from "expo-router"
import { useContext } from "react"

const TabLayout = () => {

    const { loading } = useContext(SupabaseContext)

    return (
        <Tabs
            initialRouteName="(app)"
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => {
                return (
                    <TabBar descriptors={props.descriptors} state={props.state} navigation={props.navigation} insets={props.insets} />
                )
            }}>
            <Tabs.Screen name="(app)" />
            <Tabs.Screen name="saved" options={{ headerTitle: 'Itens salvos'}}/>
        </Tabs>
    )
}

export default TabLayout