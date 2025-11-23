import { Stack, useLocalSearchParams } from "expo-router";
import { Button, Linking, StyleSheet, Text, View } from 'react-native';

interface Params {
  title?: string;
  url?: string;
}

export default function InformationScreen() {
  // Najprej shranimo params
  const params = useLocalSearchParams() as Params;

  // Privzete vrednosti
  const title: string = params.title ?? 'Informacije';
  const url: string = params.url ?? '';

  const handleRegister = () => {
    if (url) {
      Linking.openURL(url);
    } else {
      alert('Ni linka za ta dogodek!');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: title,
          headerShown: true,
          headerStyle: { backgroundColor: '#25292e' },
          headerTintColor: '#fff',
        }} 
      />

      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>Tukaj bodo podrobnosti dogodka.</Text>

        <View style={styles.buttonContainer}>
          <Button title="Prijavi se" onPress={handleRegister} color="#1E90FF" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 20,
    width: '60%'
  }
});
