import Screen from "@/components/Screen"
import Theme from "@/constants/Theme"
import theme from "@/constants/Theme"
import { useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { Button } from 'react-native-paper'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

const WebViewScreen = () => {

    const [coords, setCoords] = useState<string | null>(null)

    const handleMessage = ({ nativeEvent: { data } }: WebViewMessageEvent) => {
        if (data === 'null') {
            setCoords(null)
        } else {
            setCoords(data)
        }
    }

    return (
        <Screen>
            <View style={styles.controls}>
                <Button
                    onPress={() => {  }}
                    mode="contained"
                    buttonColor={Theme.colors?.error}>Cancelar</Button>
                <Button
                    disabled={coords == null}
                    buttonColor={theme.colors?.primary}
                    onPress={() => { Alert.alert('oi') }}
                    mode="contained">Continuar</Button>
            </View>
            <WebView
            
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