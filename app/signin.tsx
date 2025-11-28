import { useState } from "react";
import { View, Alert, KeyboardAvoidingView } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import Screen from "@/components/Screen";
import useAuth from "@/hooks/useAuth";

const CreateAccountScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [protectedText, setProtected] = useState(true);
    const [protectedText2, setProtected2] = useState(true);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);

    const { auth } = useAuth();

    const handleEmailTyping = (text: string) => {
        const trimmed = text.trim();
        setEmail(trimmed);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmed) {
            setEmailError(false);
            return;
        }

        setEmailError(!emailRegex.test(trimmed));
    };

    const handlePasswordTyping = (text: string) => {
        setPassword(text);

        if (!text) {
            setPasswordError(false);
            return;
        }

        setPasswordError(text.length < 6);
        setConfirmError(text !== passwordConfirm);
    };

    const handleConfirmTyping = (text: string) => {
        setPasswordConfirm(text);

        if (!text) {
            setConfirmError(false);
            return;
        }

        setConfirmError(text !== password);
    };

    const handleCreate = async () => {
        try {
            const res = await auth?.signUp({
                email,
                password,
            });

            if (res?.error) {
                Alert.alert("Erro", res.error.message || "Erro ao criar conta.");
                return;
            }

            Alert.alert("Conta criada", "Verifique seu email para confirmar sua conta.");
        } catch (err) {
            Alert.alert("Erro", "Ocorreu um erro inesperado.");
        }
    };

    const canCreate =
        email &&
        password &&
        passwordConfirm &&
        !emailError &&
        !passwordError &&
        !confirmError;

    return (
        <Screen>
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">

                <View
                    style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}
                >
                    <Card style={{ width: "90%" }}>
                        <Card.Title
                            titleVariant="titleLarge"
                            title="Criar conta"
                            titleStyle={{ textAlign: "center" }}
                        />

                        <Card.Content style={{ gap: 12 }}>
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

                            <TextInput
                                mode="outlined"
                                label="Confirmar senha"
                                value={passwordConfirm}
                                onChangeText={handleConfirmTyping}
                                secureTextEntry={protectedText2}
                                right={
                                    <TextInput.Icon
                                        icon={protectedText2 ? "eye-off" : "eye"}
                                        onPress={() => setProtected2(!protectedText2)}
                                    />
                                }
                                error={confirmError}
                            />
                        </Card.Content>

                        <Card.Actions style={{ justifyContent: "center" }}>
                            <Button
                                mode="contained"
                                onPress={handleCreate}
                                disabled={!canCreate}
                            >
                                Criar conta
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
};

export default CreateAccountScreen;
