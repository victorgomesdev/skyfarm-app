import { View, StyleSheet } from 'react-native'
import { Button, Card, Text, useTheme } from 'react-native-paper'
import Screen from '@/components/Screen'

import useAuth from '@/hooks/useAuth'

const ProfileScreen = () => {

    const theme = useTheme()
    const { auth, session } = useAuth()

    return (
        <View style={{ flex: 1 }}>
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                <Text variant='titleLarge' style={{ color: 'white' }}>Perfil</Text>
            </View>
            <Screen>
                <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <Card style={{ padding: 10, width: '90%', gap: 10 }}>
                        <Card.Title titleVariant='titleLarge' title='Informações do perfil' style={{ alignSelf: 'center' }} />
                        <Card.Content>
                            <Text><Text variant='labelLarge'>Email:</Text> {session?.user.email}</Text>
                            <Text><Text variant='labelLarge'>ID:</Text> {session?.user.id}</Text>
                            <Text><Text variant='labelLarge'>Criado em: </Text>{new Date(session?.user.created_at as string).toLocaleDateString()}</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode='outlined' textColor='red' onPress={async () => await auth?.signOut()}>Sair</Button>
                        </Card.Actions>
                    </Card>
                </View>
            </Screen>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 15,
        paddingVertical: 14,
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2
    }
})

export default ProfileScreen