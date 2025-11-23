import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: authData } = await supabase.auth.getUser();
            const authUuid = authData.user?.id;
            if (!authUuid) {
                setObjave([]);
                return;
            }

            const { data: userData } = await supabase
                .from('uporabnik')
                .select('id_uporabnik')
                .eq('supabase_id', authUuid)
                .single();
            
            if (!userData) {
                setObjave([]);
                return;
            }

            const userId = userData.id_uporabnik;
            setCurrentUserId(userId);

            const { data: savedData } = await supabase
                .from('fizicnaoseba_objava')
                .select('id_fk_objava')
                .eq('id_fk_uporabnik', userId)
                .eq('shranjen', true);

            const savedIds = savedData?.map(d => Number(d.id_fk_objava)) || [];
            if (savedIds.length === 0) {
                setObjave([]);
                return;
            }

            const { data: allObjave } = await supabase
                .from('objava')
                .select('id_objava, naslov, besedilo, dolg_opis, link')
                .in('id_objava', savedIds)
                .order('id_objava', { ascending: false });

            setObjave(allObjave as Objava[]);
        } catch (err) {
            console.error("Napaka pri pridobivanju shranjenih objav:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Forcing refresh on focus
    useFocusEffect(
        useCallback(() => {
            fetchAllData();
        }, [fetchAllData])
    );

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
                        currentUserId={currentUserId.toString()} 
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
        backgroundColor: '#f1e4f3ff',
        alignItems: 'center',
        minHeight: '100%',
    },
    container: {
        flex: 1, 
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#ecdaeeff',
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
