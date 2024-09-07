// GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import axios from 'axios';

// Importar a imagem local
const backgroundImage = require('./assets/pokemon.webp'); // Caminho atualizado para a imagem local

const GameScreen = ({ navigation }) => {
  const [pokemon, setPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const randomId = Math.floor(Math.random() * 898) + 1; // 898 é o número total de Pokémon
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const name = data.name;
      setPokemon({
        name: name,
        image: data.sprites.front_default,
      });
      generateOptions(name);
    } catch (error) {
      console.error(error);
    }
  };

  const generateOptions = async (correct) => {
    const ids = new Set();
    ids.add(Math.floor(Math.random() * 898) + 1);
    
    while (ids.size < 4) {
      ids.add(Math.floor(Math.random() * 898) + 1);
    }

    const fetchPokemonName = async (id) => {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return data.name;
    };

    const names = await Promise.all(Array.from(ids).map(id => fetchPokemonName(id)));
    if (!names.includes(correct)) {
      names[Math.floor(Math.random() * names.length)] = correct;
    }
    
    setOptions(shuffle(names));
    setCorrectAnswer(correct);
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleOptionPress = (selected) => {
    if (selected === correctAnswer) {
      showAlert("Parabéns!", "Você acertou! O Pokémon era " + correctAnswer + ".", 'success');
      fetchPokemon(); // Carrega um novo Pokémon
    } else {
      showAlert("Oops!", "Incorreto! Tente novamente.", 'error');
    }
  };

  const showAlert = (title, message, type) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "OK",
          onPress: () => type === 'success' ? fetchPokemon() : null,
        }
      ],
      { cancelable: false }
    );
  };

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
        <Text style={styles.question}>Qual é este Pokémon?</Text>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.optionButton}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <Button
          title="Voltar para Início"
          onPress={() => navigation.navigate('Home')}
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
  pokemonImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff', // Ajusta a cor do texto para garantir visibilidade no fundo
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default GameScreen;
