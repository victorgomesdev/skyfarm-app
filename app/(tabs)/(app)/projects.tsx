import { useEffect, useState } from "react"
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, FAB, Snackbar, Text, TextInput } from "react-native-paper"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useRouter } from "expo-router"
import ProjectCard from "@/components/ProjectCard"
import Screen from "@/components/Screen"
import Theme from "@/constants/Theme"
import useClient from "@/hooks/useClient"
import { ProjectResponse } from "@/shared/types/project"
import { createNewProject } from "@/shared/utils/create-project"
import useAuth from "@/hooks/useAuth"

const { width, height } = Dimensions.get("window")
const CARD_MARGIN = 6
const CARD_WIDTH = (width / 2) - CARD_MARGIN * 3
const MODAL_HEIGHT = height * 0.3

const ProjectsScreen = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [snackBarVisible, setVisible] = useState(false)
  const [modal, setModal] = useState(false)
  const [newProject, setNewProject] = useState('')
  const [creating, setCreating] = useState(false)

  const translateY = useSharedValue(MODAL_HEIGHT)

  const client = useClient()
  const { session } = useAuth()
  const router = useRouter()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  const onDissMissSnack = (): void => setVisible(false)

  const handleModal = (): void => {
    if (!modal) {
      setModal(true)
      translateY.value = withTiming(0, { duration: 200 })
    } else {
      translateY.value = withTiming(MODAL_HEIGHT, { duration: 200 })
      setTimeout(() => setModal(false), 200)
      setNewProject('')
    }
  }

  const handleInput = (name: string): void => {
    setNewProject(name)
  }

  const onProjectSelected = (projectId: string): void => {
    router.push({
      pathname: '/areas',
      params: { project_id: projectId }
    })
  }

  const createProject = async () => {
    setCreating(true)
    const { error, response } = await createNewProject(newProject, session?.access_token as string)

    console.log(error)
    console.log(response)

    if(error){
      setVisible(true)
      return
    } 
    setCreating(false)
    handleModal()
    refreshProjects()
  }

  const refreshProjects = async () => {
    const { data, error }: any = await client
      ?.schema('public')
      .from('projects')
      .select("id, name, created_at")
      .eq('user_id', session?.user.id)

    if (error) {
      setVisible(true)
      setLoading(false)
      return
    }
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (!client || !session) return
    refreshProjects()
  }, [client, session])

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
            <Pressable
              style={[styles.cardWrapper, { width: CARD_WIDTH }]}
              onPress={() => onProjectSelected(item.id)}
            >
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
        animationType="fade"
        onRequestClose={handleModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: Theme.colors?.background,
                height: MODAL_HEIGHT,
                width: width,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                flexDirection: 'column',
                padding: 10,
                gap: 15,
                alignItems: 'center',
              },
              animatedStyle,
            ]}
          >
            <View style={{ width: '100%', flexDirection: 'column' }}>
              <Text variant="titleLarge" style={{ alignSelf: 'center' }}>Novo Projeto</Text>
              <TextInput mode="outlined" label={"Nome"} value={newProject} onChangeText={handleInput} autoFocus />
            </View>

            <View style={{ width: '90%', gap: 10 }}>
              <Button
                onPress={createProject}
                buttonColor={Theme.colors?.primary}
                textColor="white"
                disabled={newProject.length < 1 || creating}
                loading={creating}
              >
                Criar novo projeto
              </Button>
              <Button
                onPress={handleModal}
                mode="elevated"
                textColor={Theme.colors?.error}
              >
                Cancelar
              </Button>
            </View>
          </Animated.View>
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
    marginBottom: 15,
  },
  cardWrapper: {
    marginHorizontal: CARD_MARGIN,
  },
})

export default ProjectsScreen
