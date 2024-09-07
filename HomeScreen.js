// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

// Importar a imagem local
const backgroundImage = require('./assets/images.jpg'); // Caminho para a imagem de fundo

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Jogo de Adivinhação de Pokémon!</Text>
        <Button
          title="Iniciar Jogo"
          onPress={() => navigation.navigate('Game')}
          color="#FF6347"
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
    fontSize: 24,
    marginBottom: 20,
    color: '#000', // Ajusta a cor do texto para garantir visibilidade no fundo
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
