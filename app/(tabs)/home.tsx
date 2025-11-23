import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import CreateCard from '../../components/create-card';
import { supabase } from '../../lib/supabase';

interface Objave {
  id_objava: number;
  naslov: string;
  besedilo: string;
  link: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [objave, setObjave] = useState<Objave[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Pridobi auth user
        const { data: authData } = await supabase.auth.getUser();
        const authUuid = authData.user?.id;
        if (!authUuid) {
          setObjave([]);
          return;
        }

        // 2. UUID -> id_uporabnik
        const { data: userData } = await supabase
          .from('uporabnik')
          .select('id_uporabnik')
          .eq('supabase_id', authUuid)
          .single();
        if (!userData) return;

        const userId = userData.id_uporabnik;
        setCurrentUserId(userId);

        // 3. Vse objave
        const { data: allObjave } = await supabase
          .from('objava')
          .select('*')
          .order('id_objava', { ascending: false });
        setObjave(allObjave || []);

        // 4. Shrani katere objave ima uporabnik shranjene
        const { data: savedData } = await supabase
          .from('fizicnaoseba_objava')
          .select('id_fk_objava')
          .eq('id_fk_uporabnik', userId)
          .eq('shranjen', true);

        const savedIdsArr = savedData?.map(d => Number(d.id_fk_objava)) || [];
        setSavedIds(savedIdsArr);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleSaved = (objId: number, isSaved: boolean) => {
    if (isSaved) {
      setSavedIds(prev => [...prev, objId]);
    } else {
      setSavedIds(prev => prev.filter(id => id !== objId));
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#7a55c5" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {objave.map(obj => (
          <CreateCard
            key={obj.id_objava}
            title={obj.naslov}
            description={obj.besedilo}
            objId={obj.id_objava}
            currentUserId={currentUserId?.toString() || ''}
            onPress={() => router.push({ pathname: '/information', params: { id: obj.id_objava } })}
            onToggleSaved={handleToggleSaved}
            // predajemo stanje shranjen
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 30,
    backgroundColor: '#f4f0f8',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
