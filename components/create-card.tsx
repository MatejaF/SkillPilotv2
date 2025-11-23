import React, { useState } from "react";
import { StyleSheet } from 'react-native';
import { Button, Card, IconButton, Paragraph, Title } from 'react-native-paper';

const CreateCard = ({ title = "Brez naslova", description = "Brez opisa", onPress = () => {} }) => {

  const [saved, setSaved] = useState(false); // spremlja, ali je shranjeno

  const toggleSaved = () => {
    setSaved(!saved);
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.header}>
        <Title>{title}</Title>

        {/* Ikona shranjeno */}
        <IconButton
          icon={saved ? "heart" : "heart-outline"} // polno ali prazno srce
          iconColor={saved ? "red" : "grey"}
          size={24}
          onPress={toggleSaved}
        />
      </Card.Content>

      <Card.Content>
        <Paragraph>{description}</Paragraph>
      </Card.Content>

      <Card.Actions>
        <Button onPress={onPress}>Več informacij</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CreateCard;
