import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Dimensions, View, Modal, Keyboard } from "react-native"
import { ActivityIndicator, Snackbar, FAB, Button, TextInput, Text } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useLocalSearchParams, useRouter } from "expo-router"
import Screen from "@/components/Screen"
import useClient from "@/hooks/useClient"
import { ProjectResponse } from "@/shared/types/project"
import ProjectCard from "@/components/ProjectCard"
import Theme from "@/constants/Theme"

const { width, height } = Dimensions.get("window")
const CARD_MARGIN = 4
const CARD_WIDTH = (width / 2) - CARD_MARGIN * 3
const MODAL_HEIGHT = height * 0.3

const AreasScreen = () => {

  const [areas, setAreas] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [snackBarVisible, setVisible] = useState(false)
  const [modal, setModal] = useState(false)
  const [newArea, setNewArea] = useState('')

  const client = useClient()
  const translateY = useSharedValue(MODAL_HEIGHT)
  const { project_id } = useLocalSearchParams()
  const router = useRouter()

  const onDissMissSnack = () => setVisible(false)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  const handleModal = (): void => {
    if (!modal) {
      setModal(true)
      translateY.value = withTiming(0, { duration: 200 })
    } else {
      Keyboard.dismiss()
      translateY.value = withTiming(MODAL_HEIGHT, { duration: 200 })
      setTimeout(() => setModal(false), 200)
      setNewArea('')
    }
  }

  const handleCreate = (): void => {
    handleModal()
    setTimeout(() => { }, 100)
    router.navigate({
      pathname: '/webview',
      params: {
        name: newArea,
        project_id: project_id
      }
    })
  }

  useEffect(() => {

    if (!client) return
    (async () => {
      const { data, error }: any = await client
        ?.schema('public')
        .from('areas')
        .select("id, name, created_at")
        .eq("project_id", project_id)

      if (error) {
        setVisible(true)
        setLoading(false)
        return
      }
      setAreas(data ?? [])
      setLoading(false)
    })()
  }, [client])

  return (
    <Screen>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : areas.length > 0 ? (
        <FlatList
          style={styles.list}
          data={areas}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
              <ProjectCard name={item.name} created_at={item.created_at} id="" />
            </View>
          )}
        />
      ) : (
        <Text style={{
          alignSelf: 'center'
        }}>Nenhuma área encontrada</Text>
      )}

      <Snackbar
        action={{
          label: 'Fechar',
          onPress: () => setVisible(false)
        }}
        visible={snackBarVisible}
        onDismiss={onDissMissSnack}
      >
        Ocorreu um erro ao listar as áreas.
      </Snackbar>
      <FAB
        color="#ffffff"
        style={{
          backgroundColor: Theme.colors?.primary,
          position: 'absolute',
          bottom: 5,
          right: 10
        }}
        icon="plus"
        onPress={handleModal}
      />
      <Modal
        transparent={true}
        visible={modal}
        animationType="fade"
        style={styles.modal}>
        <View style={styles.modalView}>
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            <View
              style={{
                width: '100%',
                gap: 10
              }}>
              <Text variant="titleLarge" style={{ alignSelf: 'center' }}>Criar nova área</Text>
              <TextInput
                value={newArea}
                onChangeText={(text) => setNewArea(text)}
                mode="outlined"
                label={'Nome'}
                autoFocus />
            </View>
            <Button
              disabled={newArea.length < 2}
              style={{ width: '90%' }}
              onPress={handleCreate}
              mode="contained">Continuar</Button>
            <Button
              style={{ width: '90%' }}
              onPress={handleModal}
              mode="elevated"
              textColor={Theme.colors?.error}>Cancelar</Button>
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
    marginBottom: CARD_MARGIN,
  },
  cardWrapper: {
    marginHorizontal: CARD_MARGIN,
  },
  modal: {

  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column'
  },
  modalContainer: {
    backgroundColor: Theme.colors?.background,
    height: MODAL_HEIGHT,
    width: width,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    padding: 10,
    gap: 15,
    alignItems: 'center',
  }
})

export default AreasScreen
