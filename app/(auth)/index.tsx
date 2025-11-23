import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

      const supabase_id = data.user.id;

    // pridobi tip uporabnika iz baze
    const { data: userData, error: userError } = await supabase
      .from('uporabnik')
      .select('fk_vrsta')
      .eq('supabase_id', supabase_id)
      .single();

        if (userError || !userData) throw new Error('Uporabnik ni najden v bazi.');

        // Preusmeri glede na tip
        if (userData.fk_vrsta === 1) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/+not-found');
        }

    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

      <LinearGradient
        colors={['#965BCC', '#E980EC']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <TextInput
          style={styles.input}
          placeholder="Gmail"
          value={gmail}
          onChangeText={setGmail}
          autoCapitalize="none"
        />
      </LinearGradient>

      <LinearGradient
        colors={['#965BCC', '#E980EC']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <TextInput
          style={styles.input}
          placeholder="Geslo"
          value={geslo}
          onChangeText={setGeslo}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </LinearGradient>

      <LinearGradient
        colors={['#965BCC', '#E980EC']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Prijava</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={{ color: '#fff', textDecorationLine: 'underline', fontSize: 16 }}>
          Registracija
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0eff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8, // manjše od gradientBorder, da se vidi gradient
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  gradientBorder: {
    width: '90%',
    borderRadius: 10,
    padding: 2,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
});