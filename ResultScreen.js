import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { score } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Jogo</Text>
      <Text>Acertos: {score.correct}</Text>
      <Text>Erros: {score.incorrect}</Text>
      <Button
        title="Voltar à Tela Inicial"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="Jogar Novamente"
        onPress={() => navigation.navigate('Game')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ResultScreen;