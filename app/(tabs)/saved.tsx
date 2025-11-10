import Screen from "@/components/Screen"
import useClient from '@/hooks/useClient'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from "expo-router"
import { useEffect, useState, useCallback } from 'react'
import { Dimensions, FlatList, Modal, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Card, Snackbar, Text, TextInput, useTheme } from 'react-native-paper'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useFocusEffect } from '@react-navigation/native'

const { width, height } = Dimensions.get("window")
const CARD_MARGIN = 6
const MODAL_HEIGHT = height * 0.3

const SavedQueriesScreen = () => {

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState<{ name: string, created_at: string, metrics: string[], aggregation: number, project_id: string }[]>([])
    const [selected, setSelected] = useState('')
    const [modal, setModal] = useState(false)
    const [name, setName] = useState('')

    const theme = useTheme()
    const client = useClient()
    const router = useRouter()

    const translateY = useSharedValue(MODAL_HEIGHT)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }))

    const useSavedItem = (projectId: string) => {
        setSelected(projectId)
        setModal(true)
    }

    const createArea = (name: string, projectId: string) => {

        router.navigate({
            pathname: '/(tabs)/(app)/webview',
            params: {
                project_id: projectId,
                name: name
            }
        })

        setName('')
        setModal(false)
        setSelected('')
    }

    useEffect(() => {
        if (modal) {
            translateY.value = withTiming(0, { duration: 300 })
        } else {
            translateY.value = withTiming(MODAL_HEIGHT, { duration: 300 })
        }
    }, [modal])

    const loadSavedItems = async () => {
        try {
            if (!client) return
            const { data, error } = await client.from('saved')
                .select('name, created_at, metrics, aggregation, project_id')

            if (error) {
                setMessage('Ocorreu um erro ao carregar os itens.')
                return
            }
            
            setItems(data)
        } catch {
            setMessage('Ocorreu um erro ao carregar os itens.')
        } finally {
            setLoading(false)
        }
    }
    const focused = useCallback(loadSavedItems, [])
    
    useEffect(() => {
        focused()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                <Text variant='titleLarge' style={{ color: 'white' }}>Salvos</Text>
            </View>

            <Screen>
                <View style={{ flexDirection: 'column', paddingHorizontal: 10, marginTop: 60 }}>
                    {
                        loading ? (
                            <ActivityIndicator size={25} />
                        ) : (
                            items.length > 0 ? (
                                <FlatList
                                    data={items}
                                    keyExtractor={(item) => item.created_at}
                                    renderItem={({ item }) => (
                                        <Card style={{ marginVertical: CARD_MARGIN }}>
                                            <Card.Title
                                                title={item.name}
                                                subtitle={`Criado em ${new Date(item.created_at).toLocaleDateString()}`}
                                                titleVariant='titleLarge'
                                                titleNumberOfLines={3}
                                                left={() => (
                                                    <View style={{
                                                        backgroundColor: theme.colors.primary,
                                                        padding: 6,
                                                        borderRadius: 25
                                                    }}>
                                                        <FontAwesome name='map' color={'white'} size={27} />
                                                    </View>
                                                )}
                                            />
                                            <Card.Content>
                                                <Text>Métricas: {item.metrics.join(' ')}</Text>
                                                <Text>Agregação: {item.aggregation} dias</Text>
                                            </Card.Content>
                                            <Card.Actions>
                                                <Button mode='contained' onPress={() => useSavedItem(item.project_id)}>
                                                    Usar
                                                </Button>
                                            </Card.Actions>
                                        </Card>
                                    )}
                                />
                            ) : (
                                <Text style={{ alignSelf: 'center' }}>Nenhum item salvo</Text>
                            )
                        )
                    }
                </View>
            </Screen>

            <Snackbar
                visible={message.length > 1}
                onDismiss={() => setMessage('')}
            >
                {message}
            </Snackbar>

            <Modal
                transparent
                visible={modal}
                animationType="fade"
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
                                backgroundColor: theme.colors?.background,
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
                            <Text variant="titleLarge" style={{ alignSelf: 'center' }}>Nova área</Text>
                            <TextInput value={name} mode="outlined" label={"Nome da área"} autoFocus onChangeText={(t) => setName(t)} />
                        </View>

                        <View style={{ width: '90%', gap: 10 }}>
                            <Button
                                buttonColor={theme.colors?.primary}
                                textColor="white"
                                onPress={() => createArea(name, selected)}
                            >
                                Continuar
                            </Button>
                            <Button
                                mode="elevated"
                                textColor={theme.colors?.error}
                                onPress={() => {
                                    setSelected('')
                                    setModal(false)
                                }}
                            >
                                Cancelar
                            </Button>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 15,
        paddingVertical: 14,
        position: 'absolute', // 'fixed' não existe no RN
        top: 0,
        width: '100%',
        zIndex: 2
    }
})

export default SavedQueriesScreen
