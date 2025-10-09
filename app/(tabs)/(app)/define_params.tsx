import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, Card, Snackbar, Text, TextInput, Checkbox } from 'react-native-paper'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import Slider from '@react-native-community/slider'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { isAfter, subDays, subYears, differenceInDays } from 'date-fns'
import Screen from "@/components/Screen"
import useSession from '@/hooks/useSession'
import { CreateAreaRequest } from "@/shared/types/area-request"
import { createNewArea } from '@/shared/utils/create-area'
import Theme from '@/constants/Theme'

type Metrics = 'NDVI' | 'MOISTURE' | 'TEMP' | 'LAI' | 'PROD'

const DefineAreaParams = () => {

    const [query, setQuery] = useState<Partial<CreateAreaRequest>>()
    const [dateFrom, setFrom] = useState('')
    const [dateTo, setTo] = useState('')
    const [aggregation, setAggregation] = useState(1)
    const [metrics, setMetrics] = useState<Metrics[]>([])
    const [agDiff, setDiff] = useState(0)
    const [message, setMessage] = useState('')

    const [loading, setLoading] = useState(false)
    const [snack, setSnack] = useState(false)

    const router = useRouter()
    const params = useLocalSearchParams()
    const session = useSession()

    const handleDatePicker = (target: 'FROM' | 'TO'): void => {
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: (event, date) => {
                if (event.type === 'set' && date) {
                    if (target === 'FROM') {
                        setFrom(date.toISOString())
                        setTo('')
                        setMetrics([])
                    } else {

                        if (isAfter(dateFrom, date)) {
                            setMessage('A data inicial não pode ser depois dadata final!')
                            setSnack(true)
                            return

                        }

                        setTo(date.toISOString())

                        const diff = differenceInDays(new Date(date), new Date(dateFrom))
                        setDiff(diff)
                        setAggregation(diff <= 30 ? 1 : diff <= 60 ? 5 : diff <= 90 ? 10 : 15)
                    }
                }

                DateTimePickerAndroid.dismiss('date')
            },
            mode: 'date',
            minimumDate: subYears(new Date(), 2),
            maximumDate: subDays(new Date(), 5)
        })
    }

    const handleMetricsChange = (metric: Metrics): void => {

        setMetrics((prev) => {

            if (prev.includes(metric)) {
                return prev.filter(p => p !== metric)
            } else {
                return [...prev, metric]
            }
        })

    }

    const createArea = async (): Promise<void> => {

        setLoading(true)
        const payload: CreateAreaRequest = {
            name: query?.name as string,
            project_id: query?.project_id as string,
            datefrom: dateFrom,
            dateto: dateTo,
            coords: query?.coords as string,
            metrics: metrics,
            aggregation: aggregation
        }

        const { error, respose } = await createNewArea(payload, session?.access_token as string)

        if (error) {
            setLoading(false)
            setMessage(error.message)
            setSnack(true)
            console.log(error)
            return
        }

        setLoading(false)

        router.navigate({
            pathname: '/areas',
            params: {
                project_id: query?.project_id as string
            }
        })
    }

    useEffect(() => {
        setQuery({
            name: (params.name as string),
            coords: (params.coords as string),
            project_id: (params.project_id as string)
        })
    }, [])

    return (
        <Screen>
            <ScrollView contentContainerStyle={{ gap: 18, paddingHorizontal: 10, paddingBottom: 10 }}>
                <Card style={styles.areaDetails}>
                    <Card.Title title="Detalhes da área" titleVariant='headlineSmall' />
                    <Card.Content style={{ gap: 10 }}>
                        <View style={styles.adTop}>
                            <Text><Text variant='bodyLarge' style={{ fontWeight: '800' }}>Nome:</Text> {query?.name}</Text>
                            <Text><Text variant='bodyLarge' style={{ fontWeight: '800' }}>Área(m²):</Text> 0</Text>
                        </View>
                        <View>
                            <Text variant='bodyLarge' style={{ fontWeight: '800' }}>Coordenadas do polígono - Longitude/Latitude :</Text>
                            <Text>{query?.coords}</Text>
                        </View>
                    </Card.Content>
                </Card>
                <View style={styles.timeInputs}>
                    <Text style={{}} variant='titleMedium'>Período de observação: {agDiff} dias</Text>
                    <TextInput
                        label="Data inicial"
                        mode="outlined"
                        readOnly
                        value={dateFrom == '' ? '' : new Date(dateFrom).toLocaleDateString()}
                        right={<TextInput.Icon icon="calendar" onPress={() => handleDatePicker('FROM')} />}
                    />
                    <TextInput
                        label={"Data final"}
                        mode="outlined"
                        readOnly
                        value={dateTo == '' ? '' : new Date(dateTo).toLocaleDateString()}
                        right={<TextInput.Icon icon="calendar" onPress={() => handleDatePicker('TO')} disabled={dateFrom == ''} />} />
                </View>

                <Text variant='titleMedium'>Fator de agregação: {aggregation} dias</Text>
                <Slider
                    style={{
                        width: '100%'
                    }}
                    disabled={dateFrom == '' || dateTo == ''}
                    minimumValue={agDiff <= 30 ? 1 : agDiff <= 60 ? 5 : agDiff <= 90 ? 10 : 15}
                    maximumValue={agDiff == 0 ? 1 : agDiff}
                    minimumTrackTintColor={Theme.colors?.primary}
                    step={agDiff <= 30 ? 1 : agDiff <= 60 ? 5 : agDiff <= 90 ? 10 : 15}
                    renderStepNumber={true}
                    thumbTintColor={Theme.colors?.primary}
                    onValueChange={(v) => setAggregation(v)}
                />
                <View style={{ flexDirection: 'column' }}>
                    <Text variant='titleMedium' style={{ textAlign: 'left' }}>Métricas a serem consideradas:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={dateFrom == '' || dateTo == ''}
                            status={metrics.includes('NDVI') ? 'checked' : 'unchecked'}
                            onPress={() => handleMetricsChange('NDVI')} />
                        <Text>Densidade de vegetação corrigida - NDVI</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={dateFrom == '' || dateTo == ''}
                            status={metrics.includes('MOISTURE') ? 'checked' : 'unchecked'}
                            onPress={() => handleMetricsChange('MOISTURE')} />
                        <Text>Umidade do solo - MOISTURE</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={dateFrom == '' || dateTo == ''}
                            status={metrics.includes('TEMP') ? 'checked' : 'unchecked'}
                            onPress={() => handleMetricsChange('TEMP')} />
                        <Text>Temperatura do solo - TEMP</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={dateFrom == '' || dateTo == ''}
                            status={metrics.includes('LAI') ? 'checked' : 'unchecked'}
                            onPress={() => handleMetricsChange('LAI')} />
                        <Text>Saúde vegetal / absorção de água - LAI</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={dateFrom == '' || dateTo == ''}
                            status={metrics.includes('PROD') ? 'checked' : 'unchecked'}
                            onPress={() => handleMetricsChange('PROD')} />
                        <Text>Produtividade vegetal / absorção de carbono - PROD</Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <Button mode='elevated' textColor={Theme.colors?.error} onPress={() => router.back()}>Cancelar</Button>
                    <Button
                        mode='contained'
                        loading={loading}
                        disabled={metrics.length < 1 || loading}
                        onPress={createArea}
                    >Gerar relatório</Button>
                </View>
            </ScrollView>
            <Snackbar
                style={{
                    zIndex: 9999,
                    position: 'absolute',
                    bottom: 30,
                }}
                visible={snack}
                onDismiss={() => {
                    setSnack(false)
                    setMessage('')
                }}
                action={{
                    label: 'Fechar',
                    onPress: () => setSnack(false)
                }}>{message}</Snackbar>
        </Screen>
    )
}

const styles = StyleSheet.create({
    areaDetails: {
        flexDirection: 'column',
        width: '100%'
    },
    adTop: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        gap: 25
    },
    timeInputs: {
        width: '100%',
        gap: 10
    }
})

export default DefineAreaParams