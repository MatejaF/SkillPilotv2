import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
const router = useRouter();


export default function Index() {
  const [ime, setIme] = useState('');
  const [priimek, setPriimek] = useState('');
  const [gmail, setGmail] = useState('');
  const [geslo, setGeslo] = useState('');
  const [loading, setLoading] = useState(false);

   const handleRegister = async () => {
    if (!ime || !priimek || !gmail || !geslo) {
      alert('Izpolnite vsa polja');
      return;
    }
      // Preveri validnost gesla
      const gesloRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!gesloRegex.test(geslo)) {
        alert('Geslo mora imeti vsaj 8 znakov, eno veliko, eno malo črko, številko in poseben znak');
        return;
      }
    setLoading(true);
    try {
        // Registracija v Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: gmail,
        password: geslo,
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        alert('Ta email je že registriran ali čaka potrditev.');
        setLoading(false);
        return;
      }

      const supabase_id = signUpData.user.id;

      // Vstavi uporabnika v tabelo uporabnik z email UNIQUE
      const { data: userData, error: userError } = await supabase
        .from('uporabnik')
        .insert([{ supabase_id, fk_vrsta: 1, email: gmail }])
        .select()
        .single();

      if (userError || !userData) {
        // Če UNIQUE constraint emaila ni izpolnjen
        throw new Error('Ta email je že registriran v naši bazi.');
      }

      const id_uporabnik = userData.id_uporabnik;

      //Vstavi Fizicno Oseba
      const { data: fizData, error: fizError } = await supabase
        .from('fizicnaoseba')
        .insert([{ id_fk_uporabnik: id_uporabnik, ime, priimek }])
        .select()
        .single();
      if (fizError) throw fizError;

      alert('Registracija uspešna!');

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
     <TouchableOpacity style={styles.button} onPress={handleRegister}>
      <Text style={styles.buttonText}>Register</Text>
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
