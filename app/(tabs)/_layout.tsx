import { Tabs } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons'
import Theme from "@/constants/Theme"
import TabBar from "@/components/TabBar"

const ROUTES = ["Projetos", "Nova área", "Perfil"]

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
            tabBar={(props) => (<TabBar descriptors={props.descriptors} state={props.state} navigation={props.navigation} insets={props.insets}/>)}>
            <Tabs.Screen name="projects" />
            <Tabs.Screen name="new_area"/>
            <Tabs.Screen name="profile"/>            
        </Tabs>
    )
}

export default TabLayout