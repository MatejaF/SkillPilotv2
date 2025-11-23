import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
const router = useRouter();


export default function Index() {
  const [ime, setIme] = useState('');
  const [priimek, setPriimek] = useState('');
  const [gmail, setGmail] = useState('');
  const [geslo, setGeslo] = useState('');
  const [loading, setLoading] = useState(false);

   const handleRegister = async () => {
  if (!ime || !gmail || !geslo || (userType === 'fizicna' ? !priimek : !davcna)) {
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

      // določi tip uporabnika glede na izbiro
      const fk_vrsta = userType === 'fizicna' ? 1 : 2; // 1 = fizična oseba, 2 = podjetje

      // Vstavi uporabnika v tabelo uporabnik z email UNIQUE
      const { data: userData, error: userError } = await supabase
        .from('uporabnik')
        .insert([{ supabase_id, fk_vrsta, email: gmail }])
        .select()
        .single();

      if (userError || !userData) {
        // Če UNIQUE constraint emaila ni izpolnjen
        throw new Error('Ta email je že registriran v naši bazi.');
      }

      const id_uporabnik = userData.id_uporabnik;

       // vstavi v fizicnaoseba ali podjetje
      if (userType === 'fizicna') {
        await supabase
          .from('fizicnaoseba')
          .insert([{ id_fk_uporabnik: id_uporabnik, ime, priimek }]);
      } else {
        await supabase
          .from('podjetje')
          .insert([{ id_fk_uporabnik: id_uporabnik, ime_podjetja: ime, davcna_stevilka: davcna }]);
      }

      alert('Registracija uspešna! Preverite vaš email za potrditev računa.');


    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const [userType, setUserType] = useState<'fizicna' | 'podjetje'>('fizicna');
    const [davcna, setDavcna] = useState('');

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 36, color: '#fff', marginBottom: 40}}>Dobrodošli!</Text>
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
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Fizična oseba" value="fizicna" />
        <Picker.Item label="Podjetje" value="podjetje" />
      </Picker>
    </LinearGradient>
    <LinearGradient
      colors={['#965BCC', '#E980EC']} 
      start={{ x: 0.2, y: 0.2 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <TextInput
        style={styles.input}
        placeholder="Ime"
        value={ime}
        onChangeText={setIme}
      />
  </LinearGradient>
 <LinearGradient
  colors={['#965BCC', '#E980EC']}
  start={{ x: 0.2, y: 0.2 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientBorder}
>
  {userType === 'fizicna' ? (
    <TextInput
      style={styles.input}
      placeholder="Priimek"
      value={priimek}
      onChangeText={setPriimek}
    />
  ) : (
    <TextInput
      style={styles.input}
      placeholder="Davčna številka"
      value={davcna}
      onChangeText={setDavcna}
      keyboardType="numeric"
    />
  )}
</LinearGradient>
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
     <TouchableOpacity style={styles.button} onPress={handleRegister}>
      <Text style={styles.buttonText}>Registracija</Text>
    </TouchableOpacity>
    </LinearGradient>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
  fontSize: 18,
  color: '#fff',
  textAlign: 'center',
  },
  gradientBorder: {
    width: '90%',
    borderRadius: 10,
    padding: 2, // debelina borderja
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  picker: {
    height: 45,
  width: '100%',
  color: '#000', // tekst v pickerju
},
});
