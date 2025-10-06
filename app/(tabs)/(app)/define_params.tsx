import Screen from "@/components/Screen"
import useSession from '@/hooks/useSession'
import { CreateAreaRequest } from "@/shared/types/area-request"
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Card, Text, TextInput } from 'react-native-paper'


const DefineAreaParams = () => {

    const [query, setQuery] = useState<CreateAreaRequest>()
    const [dateFrom, setFrom] = useState('')
    const [dateTo, setTo] = useState('')

    const params = useLocalSearchParams()
    const session = useSession()

    const onDateSelected = (event: DateTimePickerEvent, date?: Date): void => {
        switch (event.type) {
            case 'set':
                if (date) {
                    dateFrom
                        ? setTo(date.toISOString())
                        : setFrom(date.toISOString())
                }
                break

            case 'dismissed':
                DateTimePickerAndroid.dismiss('date')
                break
        }
    }

    const handleDatePicker = (): void => {
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: onDateSelected,
            mode: 'date',
        })
    }


    const teste = async () => {

        await fetch((process.env.EXPO_PUBLIC_API_URL as string) + '/area/create', {
            method: 'post',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                name: query?.name,
                coords: query?.coords,
                project_id: query?.project_id
            })
        }).then()
    }

    useEffect(() => {
        setQuery({
            name: (params.name as string),
            coords: (params.coords as string),
            project_id: (params.project_id as string),
            datefrom: dateFrom,
            dateto: dateTo,
            metrics: []
        })
    }, [])

    return (
        <Screen>
            <Card style={styles.areaDetails}>
                <Card.Title title="Detalhes da área" titleVariant='headlineSmall' />
                <Card.Content style={{ gap: 10 }}>
                    <View style={styles.adTop}>
                        <Text><Text variant='bodyLarge' style={{ fontWeight: '800' }}>Nome:</Text> {query?.name}</Text>
                        <Text><Text variant='bodyLarge' style={{ fontWeight: '800' }}>Área(m²):</Text> 0</Text>
                    </View>
                    <View>
                        <Text variant='bodyLarge' style={{ fontWeight: '800' }}>Coordenadas do polígono:</Text>
                        <Text>{query?.coords}</Text>
                    </View>
                </Card.Content>
            </Card>
            <View style={styles.timeInputs}>
                <TextInput label={"Data inicial"} mode="flat" readOnly value={dateFrom}/>
                <TextInput label={"Data final"} mode="flat" readOnly value={dateTo}/>
            </View>
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