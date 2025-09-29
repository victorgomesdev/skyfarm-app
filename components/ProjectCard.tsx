import { Card } from "react-native-paper";
import { ProjectResponse } from "@/shared/types/project";

const ProjectCard = (project: ProjectResponse)=> {

    return(
        <Card
        onPress={()=> {}}>
            <Card.Title
            title={project.name}
            titleNumberOfLines={3}
            titleVariant="titleMedium"
            subtitle={"Criado em " + new Date(project.created_at).toLocaleDateString()}
            />
        </Card>
    )
}

export default ProjectCard