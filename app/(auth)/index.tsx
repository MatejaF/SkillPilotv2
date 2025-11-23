import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [gmail, setGmail] = useState('');
  const [geslo, setGeslo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!gmail || !geslo) {
      alert('Izpolnite vsa polja');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: gmail,
        password: geslo,
      });

      if (error) throw error;

      if (!data.user) {
        alert('Napaka pri prijavi. Preverite email in geslo.');
        return;
      }

      // Po uspešni prijavi preusmeri na glavni app
      router.replace('../(tabs)/home');

    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

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
     <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>

    <TouchableOpacity 
    style={styles.button} 
    onPress={() => router.push("/(auth)/register")}
  >
    <Text style={styles.buttonText}>Go to Register</Text>
  </TouchableOpacity>

      {/*<Link
        href="(tabs)"
        style={styles.button}
      >
        Register
      </Link>*/}
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
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
  fontSize: 18,
  color: '#fff',
  textDecorationLine: 'underline',
  textAlign: 'center',
  },
});
