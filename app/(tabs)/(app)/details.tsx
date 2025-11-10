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
  value: Stats[]
}

interface Area {
  id: string
  name: string
  coords: any
  datefrom: string
  dateto: string
  size: number,
  aggregation: number
}

type Stats = {
  from: string,
  to: string,
  stats: {
    min: number,
    mean: number,
    max: number,
    stDev: number,
    sampleCount: number,
    noDataCount: number
  }
}

// Mapeamento de nomes e unidades
const metricLabels: Record<string, { label: string; unit: string }> = {
  moisture: { label: 'Umidade do Solo', unit: '' },
  lai: { label: 'Índice de Cobertura de Folhagem', unit: 'm²/m²' },
  temp: { label: 'Temperatura do Solo', unit: '°C' },
  prod: { label: 'Absorção de Radiação', unit: '' },
  ndvi: { label: 'Densidade Vegetal Corrigida', unit: '' },
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
                  <Text style={{ fontWeight: '800' }}>Área: </Text>
                  {(area.size /1000000).toLocaleString('pt-BR')}km²
                </Text>
                <Text style={{ fontWeight: '800' }}>
                  Coordenadas do polígono - Longitude/Latitude:
                </Text>
                <Text>{JSON.stringify(area.coords.coordinates)}</Text>
                <Text>
                  <Text style={{ fontWeight: '800' }}>Período de observação: </Text>
                  {new Date(area.datefrom).toLocaleDateString()} até{' '}
                  {new Date(area.dateto).toLocaleDateString()}
                </Text>
                <Text><Text style={{ fontWeight: '800' }}>Fator de agregação:</Text> {area.aggregation}</Text>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Métricas */}
        <Text variant="titleLarge" style={{ marginVertical: 10 }}>
          Relatório:
        </Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          metrics.map((metric, index) => {
            const metricKey = metric.name.toLowerCase()
            const metricLabel = metricLabels[metricKey]?.label ?? metric.name
            const unit = metricLabels[metricKey]?.unit ?? ''
            const statsList = metric.value || []

            return (
              <Card key={metric.id} style={styles.metricCard}>
                <Card.Title
                  title={metricLabel}
                  titleVariant="titleLarge"
                  titleStyle={{ fontWeight: 'bold' }}
                />
                <Card.Content>
                  {statsList.length > 2 ? (
                    // --- Exibe gráfico se houver dados suficientes ---
                    <View style={{ marginVertical: 10, minHeight: 250 }}>
                      <LineChart
                        data={statsList.map((item) => ({
                          label: new Date(item.from).toLocaleDateString('pt-BR', {
                            month: 'short',
                            day: 'numeric',
                          }),
                          value: item.stats.mean,
                        }))}
                        data2={statsList.map((item) => ({ label: '', value: item.stats.min }))}
                        data3={statsList.map((item) => ({ label: '', value: item.stats.max }))}
                        height={300}
                        adjustToWidth
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor="blue"
                        dataPointsColor2="green"
                        dataPointsColor3="red"
                        color="blue"
                        color2="green"
                        color3="red"
                        thickness={2}
                        showVerticalLines
                        verticalLinesColor="#ddd"
                        xAxisLabelTextStyle={{ fontSize: 12, color: '#333', textAlign: 'center' }}
                        yAxisTextStyle={{ fontSize: 12, color: '#333' }}
                        noOfSections={5}
                        stepValue={0.1}
                        maxValue={Math.max(
                          ...statsList.map((v) => Number(v.stats.max) || 0),
                          1
                        )}
                        scrollToEnd={statsList.length > 5}
                      />
                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, gap: 16 }}>
                        <Text style={{ color: 'blue', fontStyle: 'italic' }}>Média</Text>
                        <Text style={{ color: 'green', fontStyle: 'italic' }}>Mínimo</Text>
                        <Text style={{ color: 'red', fontStyle: 'italic' }}>Máximo</Text>
                      </View>
                    </View>
                  ) : (
                    // --- Exibe versão direta se poucos dados ---
                    <View style={{ marginVertical: 10, gap: 10 }}>
                      {statsList.map((item, i) => (
                        <Card key={i} mode="outlined" style={{ backgroundColor: '#fafafa' }}>
                          <Card.Content>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                              {new Date(item.from).toLocaleDateString('pt-BR')}
                            </Text>
                            <Text>Mínimo: {item.stats.min.toFixed(3)} {unit}</Text>
                            <Text>Média: {item.stats.mean.toFixed(3)} {unit}</Text>
                            <Text>Máximo: {item.stats.max.toFixed(3)} {unit}</Text>
                            <Text style={{ color: '#777', marginTop: 4 }}>
                              (Desvio padrão: {item.stats.stDev.toFixed(3)})
                            </Text>
                          </Card.Content>
                        </Card>
                      ))}
                    </View>
                  )}

                  {urls[index] && (
                    <Image
                      source={{ uri: urls[index] }}
                      style={styles.metricImage}
                      resizeMode="contain"
                    />
                  )}
                </Card.Content>
              </Card>
            )
          })
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
    paddingBottom: 20,
    gap: 18,
  },
  areaCard: {
    marginVertical: 8,
  },
  metricCard: {
    marginVertical: 8,
  },
  statsContainer: {
    gap: 6,
    marginTop: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontWeight: '600',
    color: '#555',
  },
  statValue: {
    fontWeight: '500',
    color: '#222',
  },
  metricImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 10,
  },
  snackbar: {
    zIndex: 9999,
    position: 'absolute',
    bottom: 30,
  },
})
