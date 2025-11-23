import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

const dummyMnenja = [
  {
    avtor: 'Ana K.',
    tip: 'Ocena: 8/10',
    ocena: 'Zelo koristno, veliko sem se naučila!'
  },
  {
    avtor: 'Marko P.',
    tip: 'Ocena: 9/10',
    ocena: 'Super organizacija in vsebina.'
  },
  {
    avtor: 'Sara L.',
    tip: 'Ocena: 7/10',
    ocena: 'Dobra izkušnja, priporočam.'
  },
];
interface Params {
  id?: string; // id objave
}

interface ObjavaDetail {
  naslov: string;
  dolg_opis: string;
  link: string;

}

export default function InformationScreen() {

  const [objava, setObjava] = useState<ObjavaDetail | null>(null);
  const [loading, setLoading] = useState(true);

 const params = useLocalSearchParams();
const id = params.id; // id_objava

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('objava')
      .select('*')
      .eq('id_objava', Number(id))
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setObjava(data); 
  };

  fetchData();
}, [id]);

  const handleRegister = () => {
    if (objava?.link) {
      Linking.openURL(objava.link);
    } else {
      alert('Ni linka za prijavo!');
    }
  };



  if (!objava) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Objava ni najdena.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: objava.naslov,
          headerShown: true,
          headerStyle: { backgroundColor: '#25292e' },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{objava.naslov}</Text>
        <Text style={styles.description}>{objava.dolg_opis}</Text>

        <View style={styles.buttonWrapper}>
          <Button title="Prijavi se" onPress={handleRegister} color="#965BCC" />
        </View>
        <View style={styles.mnenjaContainer}>
      <Text style={styles.mnenjaTitle}>Mnenja udeležencev</Text>
      {dummyMnenja.map((m, idx) => (
        <View key={idx} style={styles.mnenjaCard}>
          <Text style={styles.mnenjaTip}>{m.tip}</Text>
          <Text style={styles.mnenjaOcena}>{m.ocena}</Text>
          <Text style={styles.mnenjaAvtor}>- {m.avtor}</Text>
        </View>
  ))}
</View>
      </ScrollView>
          
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#25292e',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#E980EC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonWrapper: {
    width: '60%',
    borderRadius: 10,
    overflow: 'hidden',
  }, text: {
    color: '#fff',
  },
  mnenjaContainer: {
  width: '100%',
  marginTop: 30,
  alignItems: 'center',
},
mnenjaTitle: {
  fontSize: 20,
  color: '#fff',
  fontWeight: '700',
  marginBottom: 15,
},
mnenjaCard: {
  backgroundColor: '#3b3f46',
  padding: 15,
  borderRadius: 12,
  width: '90%',
  marginBottom: 10,
},
mnenjaTip: {
  color: '#E980EC',
  fontWeight: '600',
  marginBottom: 5,
},
mnenjaOcena: {
  color: '#ccc',
  fontSize: 16,
  marginBottom: 5,
},
mnenjaAvtor: {
  color: '#fff',
  fontSize: 14,
  fontStyle: 'italic',
  textAlign: 'right',
},
});