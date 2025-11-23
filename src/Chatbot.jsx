import Constants from 'expo-constants';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ChatItem from './Chatitem';

const API_KEY = Constants.expoConfig.extra.GEMINI_API_KEY;

const ChatBot = () => {
  const [chat, setChat] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTextInput = async () => {
    if (loading || !textInput.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: textInput }] };
    const newChat = [...chat, userMessage];

    setLoading(true);
    setError(null);

    try {
      // Combine chat history into a single prompt
      const fullPrompt = newChat
        .map(c => (c.role === 'user' ? 'User: ' : 'Bot: ') + c.parts[0].text)
        .join('\n') + '\nBot:';

      console.log('Full prompt sent to API:', fullPrompt);

     const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            // 1. Send the history array directly
            contents: newChat, 
            }),
        }
        );

        const data = await response.json();

        // 2. Response structure also changes slightly for Gemini
        const modelResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t respond.';

      // Update chat with bot response
      const updatedChat = [
        ...newChat,
        { role: 'model', parts: [{ text: modelResponse }] },
      ];
      setChat(updatedChat);
      setTextInput('');
    } catch (err) {
      console.error('API call failed:', err);
      setError('Sorry, an error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderChatItem = ({ item }) => (
    <ChatItem role={item.role} text={item.parts?.[0]?.text || ''} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkillPilot</Text>

      <FlatList
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={textInput}
          onChangeText={setTextInput}
          placeholder="Type a message..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleTextInput}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loading} color="purple" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, marginTop: 40, textAlign: 'center', color: 'purple' },
  chatContainer: { flexGrow: 1, justifyContent: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  textInput: { flex: 1, height: 40, borderWidth: 2, borderColor: 'gray', borderRadius: 5, padding: 10, marginRight: 10, color: 'black', backgroundColor: '#fff' },
  sendButton: { padding: 10, backgroundColor: 'purple', borderRadius: 5 },
  sendText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  loading: { marginTop: 20 },
  error: { color: 'red', marginTop: 20 },
});

export default ChatBot;
