import { useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { ActivityIndicator, Button } from 'react-native-paper'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { useRouter, useLocalSearchParams } from "expo-router"
import Screen from "@/components/Screen"
import Theme from "@/constants/Theme"
import theme from "@/constants/Theme"

const WebViewScreen = () => {

    const [coords, setCoords] = useState<string | null>(null)
    const [size, setSize] = useState(0)
    const [loaded, setLoaded] = useState(false)

    const router = useRouter()
    const params = useLocalSearchParams()

    const handleMessage = ({ nativeEvent: { data } }: WebViewMessageEvent): void => {
        const area = JSON.parse(data)
        if (area.polygon != "null") {
            setCoords(JSON.stringify(area.polygon))
            setSize(area.area)
            return
        }

        setCoords(null)
    }

    const handleCreate = (): void => {

        router.navigate({
            pathname: '/define_params',
            params: {
                name: params.name,
                coords: coords,
                project_id: params.project_id,
                size: size
            }
        })
    }

    return (
        <Screen>
            <View style={{
                position: 'absolute',
                zIndex: 9999,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: Theme.colors?.background,
                display: loaded ? 'none' : 'flex'
            }}>
                <ActivityIndicator size={'large'} />
            </View>
            <View style={styles.controls}>
                <Button
                    onPress={() => router.back()}
                    mode="contained"
                    buttonColor={Theme.colors?.error}>Cancelar</Button>
                <Button
                    disabled={coords == null}
                    buttonColor={theme.colors?.primary}
                    mode="contained"
                    onPress={handleCreate}>Continuar</Button>
            </View>
            <WebView
                style={{ flex: 1 }}
                nestedScrollEnabled={false}
                scrollEnabled={false}
                onMessage={handleMessage}
                onLoad={() => setLoaded(true)}
                source={{
                    uri: 'https://skyfarm-webview.vercel.app'
                }} />
        </Screen>
    )
}

const styles = StyleSheet.create({
    controls: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10
    }
})

export default WebViewScreen