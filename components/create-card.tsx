import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, IconButton, Paragraph, Title } from 'react-native-paper';

interface CreateCardProps {
  title: string;
  description: string;
  onPress: () => void;
  objId: number;
  currentUserId: string;
  onToggleSaved?: (objId: number, isSaved: boolean) => void;
}

const CreateCard = ({ title, description, onPress, objId, currentUserId, onToggleSaved }: CreateCardProps) => {
  const [saved, setSaved] = useState(false);

  // preveri ob mountu
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const { data } = await supabase
          .from('fizicnaoseba_objava')
          .select('shranjen')
          .eq('id_fk_uporabnik', currentUserId)
          .eq('id_fk_objava', objId)
          .single();
        setSaved(!!data?.shranjen);
      } catch {
        setSaved(false);
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
          .insert([{ id_fk_uporabnik: Number(currentUserId), id_fk_objava: objId, shranjen: true }]);
      }

      const newSaved = !saved;
      setSaved(newSaved);
      onToggleSaved?.(objId, newSaved);
    } catch (err) {
      console.error('Napaka pri shranjevanju:', err);
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
    justifyContent: 'flex-end',
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
