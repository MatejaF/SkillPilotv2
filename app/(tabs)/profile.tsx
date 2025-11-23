import { StyleSheet, View } from 'react-native';
import ChatBot from '../../src/Chatbot';

export default function ProfileSheet() {
  return (
    <View style={styles.container}>
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});