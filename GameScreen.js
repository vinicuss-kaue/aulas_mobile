// GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ImageBackground } from 'react-native';
import axios from 'axios';

// Importar a imagem local
const backgroundImage = require('./assets/pokemon.webp'); // Caminho atualizado para a imagem local

const GameScreen = ({ route, navigation }) => {
  const [pokemon, setPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctCount, setCorrectCount] = useState(0); // Contador de acertos
  const [incorrectCount, setIncorrectCount] = useState(0); // Contador de erros/pulos
  const [questionCount, setQuestionCount] = useState(0); // Contador de perguntas
  const [loading, setLoading] = useState(true); // Controle de carregamento
  const [modalVisible, setModalVisible] = useState(false); // Controle de visibilidade do modal
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // Tipo de mensagem: 'success' ou 'error'
  const [gameOver, setGameOver] = useState(false); // Controle se o jogo acabou

  useEffect(() => {
    if (questionCount < 10) {
      fetchPokemon();
    } else {
      setGameOver(true);
      navigation.navigate('Result', {
        score: {
          correct: correctCount,
          incorrect: incorrectCount,
        },
      });
    }
  }, [questionCount]);

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
    setLoading(false);
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
      setCorrectCount(prev => prev + 1);
      showModal("Parabéns!", "Você acertou! O Pokémon era " + correctAnswer + ".", 'success');
    } else {
      setIncorrectCount(prev => prev + 1);
      showModal("Oops!", "Incorreto! O Pokémon era " + correctAnswer + ".", 'error');
    }
  };

  const showModal = (title, message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (questionCount < 10) {
      setQuestionCount(prev => prev + 1); // Incrementa a contagem de perguntas
    } else {
      setGameOver(true); // Define que o jogo acabou
    }
  };

  const resetGame = () => {
    setPokemon(null);
    setOptions([]);
    setCorrectAnswer('');
    setCorrectCount(0);
    setIncorrectCount(0);
    setQuestionCount(0);
    setLoading(true);
    setGameOver(false);
    fetchPokemon(); // Inicia o jogo novamente
  };

  const navigateToHomeAndReset = () => {
    resetGame(); // Reseta o jogo
    navigation.navigate('Home'); // Navega para a tela inicial
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        {pokemon && !gameOver && (
          <>
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
          </>
        )}
        {gameOver && (
          <View style={styles.buttonsContainer}>
            <Button
              title="Voltar para Início"
              onPress={navigateToHomeAndReset} // Navega para a tela inicial e reseta o jogo
              color="#FF6347"
            />
            <Button
              title="Jogar Novamente"
              onPress={() => {
                resetGame(); // Reseta o jogo
                fetchPokemon(); // Inicia o jogo novamente
              }}
              color="#4CAF50"
            />
          </View>
        )}
      </View>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, modalType === 'success' ? styles.success : styles.error]}>
            <Text style={styles.modalTitle}>{modalType === 'success' ? "Parabéns!" : "Oops!"}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Pressable style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    color: '#fff',
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#000',
    fontSize: 18,
  },
});

export default GameScreen;