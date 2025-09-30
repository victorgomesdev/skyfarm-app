import { useEffect, useState } from "react"
import { Text, FlatList, StyleSheet, Dimensions, Pressable } from "react-native"
import { ActivityIndicator, Snackbar, FAB } from "react-native-paper"
import { useRouter } from "expo-router"
import Screen from "@/components/Screen"
import useClient from "@/hooks/useClient"
import { ProjectResponse } from "@/shared/types/project"
import ProjectCard from "@/components/ProjectCard"
import Theme from "@/constants/Theme"

const { width } = Dimensions.get("window")
const CARD_MARGIN = 4
const CARD_WIDTH = (width / 2) - CARD_MARGIN * 3

const ProjectsScreen = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [snackBarVisible, setVisible] = useState(false)
  const client = useClient()
  const router = useRouter()

  const onDissMissSnack = (): void => setVisible(false)

  const onProjectSelected = (projectId: string): void => {

    router.push({
      pathname: '/areas',
      params: {
        project_id: projectId
      }
    })
  }

  useEffect(() => {
    if (!client) return
    (async () => {
      const { data, error }: any = await client
        ?.schema('public')
        .from('projects')
        .select("id, name, created_at")

      if (error) {
        setVisible(true)
        setLoading(false)
        return
      }
      setProjects(data ?? [])
      setLoading(false)
    })()
  }, [client])

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : projects.length > 0 ? (
        <FlatList
          style={styles.list}
          data={projects}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={[styles.cardWrapper, { width: CARD_WIDTH }]} onPress={() => onProjectSelected(item.id)}>
              <ProjectCard name={item.name} created_at={item.created_at} id={item.id} />
            </Pressable>
          )}
        />
      ) : (
        <Text>Nenhum projeto encontrado</Text>
      )}

      <Snackbar
        action={{
          label: 'Fechar',
          onPress: () => setVisible(false)
        }}
        visible={snackBarVisible}
        onDismiss={onDissMissSnack}
      >
        Ocorreu um erro ao listar os projetos.
      </Snackbar>
      <FAB
      color="#ffffff"
      style={{
        position: 'absolute',
        bottom: 8,
        right: 10,
        backgroundColor: Theme.colors?.primary,
      }}
        icon="plus"
        onPress={() => console.log('Pressed')}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 5
  },
  row: {
    justifyContent: "space-between",
    marginBottom: CARD_MARGIN,
  },
  cardWrapper: {
    marginHorizontal: CARD_MARGIN,
  },
})

export default ProjectsScreen