import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, IconButton, Paragraph, Title } from 'react-native-paper';
interface CreateCardProps {
  title: string;
  description: string;
  objId: number;
  currentUserId: string; // UUID uporabnika
  onPress: () => void;
}

const CreateCard = ({ title, description, objId, currentUserId, onPress }: CreateCardProps) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (!currentUserId) return;
      try {
        const { data } = await supabase
          .from('fizicnaoseba_objava')
          .select('shranjen')
          .eq('id_fk_uporabnik', currentUserId)
          .eq('id_fk_objava', objId)
          .single();
        setSaved(!!data?.shranjen);
      } catch (err) {
        console.error(err);
      }
    };
    checkSaved();
  }, [currentUserId, objId]);

  const toggleSaved = async () => {
    try {
      const { data: existing } = await supabase
        .from('fizicnaoseba_objava')
        .select('*')
        .eq('id_fk_uporabnik', currentUserId)
        .eq('id_fk_objava', objId)
        .single();

      if (existing) {
        await supabase
          .from('fizicnaoseba_objava')
          .update({ shranjen: !saved })
          .eq('id_fk_uporabnik', currentUserId)
          .eq('id_fk_objava', objId);
      } else {
        await supabase
          .from('fizicnaoseba_objava')
          .insert({ id_fk_uporabnik: currentUserId, id_fk_objava: objId, shranjen: true });
      }

      setSaved(!saved);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.header}>
        <Title style={styles.title}>{title}</Title>
        <IconButton
          icon={saved ? "heart" : "heart-outline"}
          iconColor={saved ? "red" : "grey"}
          size={24}
          onPress={toggleSaved}
        />
      </Card.Content>

      <Card.Content>
        <Paragraph>{description}</Paragraph>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <TouchableOpacity onPress={onPress}>
          <LinearGradient
            colors={['#965BCC', '#E980EC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Več informacij</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    marginVertical: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title:{
    flex: 1,
    color: '#000',
    fontWeight: '600',
  },
  actions: {
    justifyContent: 'flex-end', // gumb desno
  },
  gradientButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});


export default CreateCard;