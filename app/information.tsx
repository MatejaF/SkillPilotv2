import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

interface Params {
  id?: string; // id objave
}

interface ObjavaDetail {
  naslov: string;
  dolg_opis: string;
  link: string;
  firma: string;
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

    setObjava(data); // npr. state za prikaz podatkov
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
});