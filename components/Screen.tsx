import theme from "@/constants/Theme"
import { PropsWithChildren } from "react"
import { View } from "react-native"

const Screen = ({ children }: PropsWithChildren) => {
    return (
        <View
            style={{
                flex: 1,
                paddingTop: 9,
                backgroundColor: theme.colors?.background
            }}>
            {children}
        </View>
    )
}

export default Screen