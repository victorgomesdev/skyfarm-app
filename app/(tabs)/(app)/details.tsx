import Screen from '@/components/Screen'
import Theme from '@/constants/Theme'
import useClient from '@/hooks/useClient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { ActivityIndicator, Card, Snackbar, Text } from 'react-native-paper'

interface Metric {
  id: string
  name: string
  value: any
}

interface Area {
  id: string
  name: string
  coords: any
  datefrom: string
  dateto: string
  area_m2: number
}

const DetailsScreen = () => {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [area, setArea] = useState<Area | null>(null)

  const { area_id, project_id } = useLocalSearchParams()
  const client = useClient()
  const router = useRouter()

  const getArea = async () => {
    if (!client) return null

    const { data, error } = await client
      .from('areas')
      .select('*')
      .eq('id', area_id)
      .single()

    if (error) throw new Error('Erro ao buscar a área')
    return data as Area
  }

  const getMetrics = async () => {
    if (!client) return []

    const { data, error } = await client
      .from('metrics')
      .select('id, name, value')
      .eq('area_id', area_id)

    if (error) throw new Error('Erro ao buscar métricas')
    return data ?? []
  }

  const getUrls = async (metricsList: Metric[]) => {
    if (!client) return []

    const files = metricsList.map((m) => `${project_id}/${area_id}/${m.name}.png`)

    const { data, error } = await client.storage
      .from('projects')
      .createSignedUrls(files, 60)

    if (error) throw new Error('Erro ao buscar URLs')

    return data.map((u) => u.signedUrl)
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const areaData = await getArea()
        setArea(areaData)

        const metricsData = await getMetrics()
        setMetrics(metricsData)

        const urlsData = await getUrls(metricsData)
        setUrls(urlsData)
      } catch (err) {
        setMessage('Ocorreu um erro ao buscar os dados.')
      } finally {
        setLoading(false)
      }
    })()
  }, [client, area_id, project_id])

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Detalhes da Área */}
        <Card style={styles.areaCard}>
          <Card.Title title="Detalhes da Área" titleVariant="headlineSmall" />
          <Card.Content style={{ gap: 10 }}>
            {loading || !area ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <Text>
                  <Text style={{ fontWeight: '800' }}>Nome: </Text>
                  {area.name}
                </Text>
                <Text>
                  <Text style={{ fontWeight: '800' }}>Área (m²): </Text>
                  {area.area_m2 ?? 0}
                </Text>
                <Text style={{ fontWeight: '800' }}>
                  Coordenadas do polígono - Longitude/Latitude:
                </Text>
                <Text>{JSON.stringify(area.coords.coordinates)}</Text>
                <Text>
                  <Text style={{ fontWeight: '800' }}>Período de observação: </Text>
                  {new Date(area.datefrom).toLocaleDateString()} até {new Date(area.dateto).toLocaleDateString()}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Métricas */}
        <Text variant="titleMedium" style={{ marginVertical: 10 }}>
          Métricas:
        </Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          metrics.map((metric, index) => (
            <Card key={metric.id} style={styles.metricCard}>
              <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {metric.name}
                </Text>
                {Array.isArray(metric.value) && metric.value.length > 0 ? (
                  <View style={{ marginVertical: 10 }}>
                    <LineChart
                      data={metric.value.map((item) => item.stats.mean)}
                      data2={metric.value.map((item) => item.stats.min)}
                      data3={metric.value.map((item) => item.stats.max)}
                      curved
                      thickness={2}
                      hideRules={false}
                      hideDataPoints={false}
                      color={Theme.colors?.primary}    // linha média
                      color2="#4c66afff"               // linha min
                      color3="#88cc88"                 // linha max
                      yAxisTextStyle={{ color: '#555' }}
                      xAxisLabelTextStyle={{ color: '#555', fontSize: 10 }}
                      noOfSections={4}
                      spacing={60}
                      initialSpacing={20}
                      yAxisLabelTexts={[]}
                      animateOnDataChange
                      width={340}
                      height={220}
                    />

                    <Text style={{ textAlign: 'center', marginTop: 4, fontStyle: 'italic', color: '#666' }}>
                      {metric.name}
                    </Text>
                  </View>
                ) : (
                  <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                    Valor: {typeof metric.value === 'object' ? JSON.stringify(metric.value) : metric.value}
                  </Text>
                )}


                {urls[index] && (
                  <Image
                    source={{ uri: urls[index] }}
                    style={styles.metricImage}
                    resizeMode="center"
                  />
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Snackbar de erro */}
      <Snackbar
        style={styles.snackbar}
        visible={!!message}
        onDismiss={() => setMessage('')}
        action={{
          label: 'Fechar',
          onPress: () => setMessage(''),
        }}
      >
        {message}
      </Snackbar>
    </Screen>
  )
}

export default DetailsScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 18,
  },
  areaCard: {
    marginVertical: 8,
  },
  metricCard: {
    marginVertical: 8,
  },
  metricImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  snackbar: {
    zIndex: 9999,
    position: 'absolute',
    bottom: 30,
  },
})
