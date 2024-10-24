import React, { useState, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input';
import InputRedacao from '@/components/InputRedacao';
import { useRouter, useLocalSearchParams, Link as ExpoRouterLink } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function NovoModelo() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [titulo, setTitulo] = useState<string>('');
    const [texto, setTexto] = useState<string>('');
    const router = useRouter();
    const { modeloTexto, modeloTitulo } = useLocalSearchParams();
    const [inputHeight, setInputHeight] = useState(200);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        if (modeloTitulo && modeloTexto) {
            setTitulo(Array.isArray(modeloTitulo) ? modeloTitulo[0] : modeloTitulo);
            setTexto(Array.isArray(modeloTexto) ? modeloTexto[0] : modeloTexto);
        }
    }, [modeloTitulo, modeloTexto]);

    const handleTextChange = (text: string) => {
        setTexto(text);
        if (text.length === 2000) {
            Alert.alert('Atenção', 'Você atingiu 2000 caracteres! Aproximadamente 30 linhas');
        }
    };

    const handleEditClick = async () => {
        try {
            const existingData = await AsyncStorage.getItem('redacoes');
            const redacoes = existingData ? JSON.parse(existingData) : [];
            redacoes.push({ id: Math.random().toString(36).substr(2, 9), titulo, texto });

            await AsyncStorage.setItem('redacoes', JSON.stringify(redacoes));
            Alert.alert('Salvo', 'Sua redação foi salva com sucesso!');
            router.push('/(groups)');
        } catch (error) {
            Alert.alert('Erro', 'Houve um erro ao salvar sua redação.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ContainerBody>
                <Header>

                <TituloTextoContainers>
                    <Input
                        style={{ flex: 1 }}
                        placeholder="Título"
                        value={titulo}
                        onChangeText={setTitulo}
                    />
                    </TituloTextoContainers>

                    <Pressable style={estilo.botaosalvar} onPress={handleEditClick}>
                    <MaterialIcons name="save" size={24} color="#18206f" />
                    </Pressable>
                </Header>


                <ScrollContainer>
                    <ScrollView contentContainerStyle={{ paddingBottom: 1 }}>
                        <InputRedacao
                            placeholder="Escreva sua redação..."
                            multiline={true}
                            style={{
                                 height: 850, 
                                 borderWidth: 1,
                                  padding: 10, 
                                  minHeight: 700,  // Altura mínima do InputRedacao
                                height: inputHeight > 200 ? inputHeight : 200, // Ajusta a altura dinamicamente
                                maxHeight: '100%', // Altura máxima (opcional, para limitar) 
                                }}
                            onChangeText={handleTextChange}
                            value={texto}
                        />
                    </ScrollView>
                </ScrollContainer>

               
                {!keyboardVisible && (
                    <Footer>
                                            <ButtonContainer href='/(groups)'>
<Icone source={require('../../assets/botao-de-inicio.png')} />
</ButtonContainer>

<ButtonContainer href='/sinonimos'>
<Icone source={require('../../assets/editor-de-texto.png')} /> 
</ButtonContainer>

<ButtonContainer href='/ia'>
<Icone source={require('../../assets/ia.png')} /> 
</ButtonContainer>
                    </Footer>
                )}
            </ContainerBody>
        </KeyboardAvoidingView>
    );
}

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #F5F5F5;
    padding: 16px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding-top: 20px; 
    margin-bottom:-57px;
`;

const ScrollContainer = styled.View`
    flex: 1;
    padding-top: 100px; 
    padding-bottom: 90px;
`;

const TituloTextoContainers = styled.View`
    flex: 1; 
    margin-right: 10px;
`;

const Footer = styled.View`
    width: 100%;
    position: absolute;
    bottom: 0;
    flex-direction: row;
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 90px;
`;

const ButtonContainer = styled(ExpoRouterLink)`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    padding-left: 28px;
    margin-top: 28px;
`;

const Icone = styled.Image`
    width: 30px;  
    height: 30px;
`;

const estilo = StyleSheet.create({
    botaosalvar: {
        paddingBottom: 14,
        paddingTop: 14,
        width: 80,
        alignItems: 'center',
        marginBottom: -33,
    },
});