import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setCurrentUserId(data.user.id);
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchObjave = async () => {
      try {
        const { data: allObjave } = await supabase
          .from('objava')
          .select('*')
          .order('id_objava', { ascending: false });
        setObjave(allObjave || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchObjave();
  }, [currentUserId]);

  if (loading || !currentUserId) return null;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {objave.map(obj => (
          <CreateCard
            key={obj.id_objava}
            title={obj.naslov}
            description={obj.besedilo}
            objId={obj.id_objava}
            currentUserId={currentUserId!}
            onPress={() =>
                        router.push({
            pathname: '/information',
            params: { id: obj.id_objava }
          })
            }
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
