import { useState } from "react";
import { View, Alert, KeyboardAvoidingView } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import Screen from "@/components/Screen";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [protectedText, setProtected] = useState(true);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const { auth } = useAuth();
    const navigation = useRouter()

    const handleEmailTyping = (text: string) => {
        const trimmed = text.trim();
        setEmail(trimmed);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (trimmed.length === 0) {
            setEmailError(false);
            return;
        }

        setEmailError(!emailRegex.test(trimmed));
    };

    const handlePasswordTyping = (text: string) => {
        setPassword(text);

        if (text.length === 0) {
            setPasswordError(false);
            return;
        }

        setPasswordError(text.length < 6);
    };

    const handleLogin = async () => {

        try {
            const res = await auth?.signInWithPassword({
                email,
                password,
            });

            if (res?.error) {
                Alert.alert("Erro", res.error.message || "Erro ao fazer login.");
            }
        } catch (err) {
            Alert.alert("Erro", "Ocorreu um erro inesperado.");
        }
    };

    return (
        <Screen>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View
                    style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}
                >
                    <Card style={{ width: "90%" }}>
                        <Card.Title
                            titleVariant="titleLarge"
                            title="Login"
                            titleStyle={{ textAlign: "center" }}
                        />

                        <Card.Content style={{ gap: 10 }}>
                            <TextInput
                                mode="outlined"
                                label="Email"
                                value={email}
                                onChangeText={handleEmailTyping}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={emailError}
                            />

                            <TextInput
                                mode="outlined"
                                label="Senha"
                                value={password}
                                onChangeText={handlePasswordTyping}
                                secureTextEntry={protectedText}
                                right={
                                    <TextInput.Icon
                                        icon={protectedText ? "eye-off" : "eye"}
                                        onPress={() => setProtected(!protectedText)}
                                    />
                                }
                                error={passwordError}
                            />
                        </Card.Content>

                        <Card.Actions style={{ justifyContent: "center" }}>
                            <Button mode="outlined" onPress={() => navigation.push('/signin')}>
                                Criar conta
                            </Button>

                            <Button
                                mode="contained"
                                onPress={handleLogin}
                                disabled={!(email && password) || emailError || passwordError}
                            >
                                Entrar
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
};

export default LoginScreen;
