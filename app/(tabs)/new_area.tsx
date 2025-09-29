import { useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { Button } from 'react-native-paper'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import Screen from "@/components/Screen"
import Theme from "@/constants/Theme"
import theme from "@/constants/Theme"
import { useRouter } from "expo-router"
import useAuth from "@/hooks/useAuth"

const WebViewScreen = () => {
    const [coords, setCoords] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)
    const router = useRouter()
    const auth = useAuth()

    const handleMessage = ({ nativeEvent: { data } }: WebViewMessageEvent) => {
        if (data != "null") {
            setCoords(data)
            return
        }

        setCoords(null)
    }

    const sendData = async ()=> {
        await fetch(process.env.EXPO_PUBLIC_API_URL as string + '/area/create', {
            method: 'post',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                coords: coords,
                userID: (await auth?.getSession())?.data.session?.access_token
            })
        })
    }
    
    return (
        <Screen>
            <View style={styles.controls}>
                <Button
                    onPress={() => router.back()}
                    mode="contained"
                    buttonColor={Theme.colors?.error}>Cancelar</Button>
                <Button
                    disabled={coords == null}
                    buttonColor={theme.colors?.primary}
                    onPress={sendData}
                    mode="contained">Continuar</Button>
            </View>
            <WebView
                style={{ flex: 1 }}
                nestedScrollEnabled={false}
                scrollEnabled={false}
                onMessage={handleMessage}
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