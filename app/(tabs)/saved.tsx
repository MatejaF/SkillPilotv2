import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import CreateCard from '../../components/create-card';
import { supabase } from '../../lib/supabase';
interface Objava {
    id_objava: number;
    naslov: string;
    besedilo: string;
    dolg_opis: string;
    link: string;
}

export default function SavedScreen() {
    const router = useRouter();
    const [objave, setObjave] = useState<Objava[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // 1. Pridobi Auth UUID
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;

                const authUuid = authData.user?.id;
                if (!authUuid) {
                    setObjave([]);
                    return;
                }

                // 2. Prevedi UUID v integer id_uporabnik
                const { data: userData, error: userError } = await supabase
                    .from('uporabnik')
                    .select('id_uporabnik')
                    .eq('supabase_id', authUuid)
                    .single();
                
                if (userError || !userData) {
                    setObjave([]);
                    return;
                }

                const userId = userData.id_uporabnik;
                setCurrentUserId(userId);

                // 3. Pridobi ID-je shranjenih objav
                const { data: savedData, error: savedError } = await supabase
                    .from('fizicnaoseba_objava')
                    .select('id_fk_objava')
                    .eq('id_fk_uporabnik', userId)
                    .eq('shranjen', true);
                
                if (savedError) throw savedError;

                const savedIds = savedData?.map(d => Number(d.id_fk_objava)) || [];
                if (savedIds.length === 0) {
                    setObjave([]);
                    return;
                }

                // 4. Pridobi podatke teh objav
                const { data: allObjave, error: allError } = await supabase
                    .from('objava')
                    .select('id_objava, naslov, besedilo, dolg_opis, link')
                    .in('id_objava', savedIds)
                    .order('id_objava', { ascending: false });
                
                if (allError) throw allError;

                setObjave(allObjave as Objava[]);

            } catch (err) {
                console.error("Napaka pri pridobivanju shranjenih objav:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#7a55c5" />
            </View>
        );
    }

    if (!currentUserId) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <Text style={styles.emptyText}>Za ogled shranjenih objav se morate prijaviti.</Text>
            </View>
        );
    }

    if (objave.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <Text style={styles.emptyText}>Trenutno nimate shranjenih objav.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cardContainer}>
                {objave.map(obj => (
                    <CreateCard
    key={obj.id_objava}
    title={obj.naslov}
    description={obj.besedilo}
    objId={obj.id_objava}
    currentUserId={currentUserId.toString()}  // <-- tukaj pretvori v string
    onPress={() =>
        router.push({
            pathname: '/information',
            params: { id: obj.id_objava },
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
        backgroundColor: '#e9c5eeff',
        alignItems: 'center',
        minHeight: '100%',
    },
    container: {
        flex: 1, 
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#e9c5eeff',
    },
    cardContainer: {
        width: '100%',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        padding: 20,
    },
});
