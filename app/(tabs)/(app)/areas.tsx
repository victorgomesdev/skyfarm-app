import { useEffect, useState } from "react"
import { Text, FlatList, StyleSheet, Dimensions, View } from "react-native"
import { ActivityIndicator, Snackbar, FAB } from "react-native-paper"
import { useLocalSearchParams } from "expo-router"
import Screen from "@/components/Screen"
import useClient from "@/hooks/useClient"
import { ProjectResponse } from "@/shared/types/project"
import ProjectCard from "@/components/ProjectCard"
import Theme from "@/constants/Theme"

const { width } = Dimensions.get("window")
const CARD_MARGIN = 4
const CARD_WIDTH = (width / 2) - CARD_MARGIN * 3

const AreasScreen = () => {
  const [areas, setAreas] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [snackBarVisible, setVisible] = useState(false)
  const client = useClient()

  const onDissMissSnack = () => setVisible(false)

  const { project_id } = useLocalSearchParams()

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

export default AreasScreen
