import { FlatList } from "react-native"
import Screen from "@/components/Screen"

const ProjectsScreen = ()=> {

    const proj = Array.from({length: 5}).map((e, i)=> {
        return {
            id: i+1,
            nome: `Projeto-${i+1}`
        }
    })

    return(
        <Screen>
            
        </Screen>
    )
}

export default ProjectsScreen