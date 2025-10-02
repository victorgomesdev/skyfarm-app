import { useEffect, useState } from "react"
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, FAB, Snackbar, Text, TextInput } from "react-native-paper"
import { useRouter } from "expo-router"
import ProjectCard from "@/components/ProjectCard"
import Screen from "@/components/Screen"
import Theme from "@/constants/Theme"
import useClient from "@/hooks/useClient"
import { ProjectResponse } from "@/shared/types/project"

const { width, height } = Dimensions.get("window")
const CARD_MARGIN = 4
const CARD_WIDTH = (width / 2) - CARD_MARGIN * 3
const MODAL_HEIGHT = height * 0.3

const ProjectsScreen = () => {

  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [snackBarVisible, setVisible] = useState(false)
  const [modal, setModal] = useState(false)
  const [newProject, setNewProject] = useState('')

  const client = useClient()
  const router = useRouter()

  const onDissMissSnack = (): void => setVisible(false)

  const handleModal = (): void => setModal(!modal)

  const handleInput = (name: string): void => {
    setNewProject(name)
  }

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
        onPress={handleModal}
      />
      <Modal
        transparent={true}
        visible={modal}
        animationType="slide"
        onRequestClose={handleModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'column'
          }}>
          <View
            style={{
              backgroundColor: Theme.colors?.background,
              height: MODAL_HEIGHT,
              width: width,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              flexDirection: 'column',
              padding: 10,
              gap: 15,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Text variant="titleLarge" style={{ alignSelf: 'center' }}>Novo Projeto</Text>
              <TextInput mode="outlined" label={"Nome"} value={newProject} onChangeText={handleInput} />
            </View>
            <View style={{
              width: '90%',
              gap: 10,
            }}>
              <Button
                onPress={handleModal}
                buttonColor={Theme.colors?.primary}
                textColor="white">Criar novo projeto</Button>
              <Button
                onPress={handleModal}
                mode="elevated"
                textColor={Theme.colors?.error}>Cancelar</Button>
            </View>

          </View>
        </View>
      </Modal>
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