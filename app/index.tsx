import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function Index() {
  const [ime, setIme] = useState('');
  const [priimek, setPriimek] = useState('');
  const [gmail, setGmail] = useState('');
  const [geslo, setGeslo] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ime"
        value={ime}
        onChangeText={setIme}
      />

      <TextInput
        style={styles.input}
        placeholder="Priimek"
        value={priimek}
        onChangeText={setPriimek}
      />

      <TextInput
        style={styles.input}
        placeholder="Gmail"
        value={gmail}
        onChangeText={setGmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Geslo"
        value={geslo}
        onChangeText={setGeslo}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Link
        href="(tabs)"
        style={styles.button}
      >
        Register
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
