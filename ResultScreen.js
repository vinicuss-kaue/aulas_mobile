// ResultScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

// Importar a imagem de fundo local
const backgroundImage = require('./assets/download.jpg'); // Caminho para sua imagem de alta qualidade

const ResultScreen = ({ route, navigation }) => {
  const { score } = route.params;

  const handleRestart = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Game' }],
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Resumo do Jogo</Text>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultText}>Acertos: {score.correct}</Text>
          <Text style={styles.resultText}>Erros: {score.incorrect}</Text>
        </View>
        <Button
          title="Voltar à Tela Inicial"
          onPress={() => navigation.navigate('Home')}
          color="#FF6347"
        />
        <Button
          title="Jogar Novamente"
          onPress={handleRestart}
          color="#1E90FF"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  resultsContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 15,
  },
  resultText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ResultScreen;