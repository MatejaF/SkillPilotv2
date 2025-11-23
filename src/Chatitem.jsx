import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChatItem = ({ role, text }) => {
    return (
        <View
            style={[
                styles.container,
                role === 'user' ? styles.userChatItem : styles.modelChatItem,
            ]}
        >
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginBottom: 10,
        maxWidth: '70%',
        borderRadius: 20,
    },
    userChatItem: {
        alignSelf: 'flex-end',
        backgroundColor: '#000',
    },
    modelChatItem: {
        alignSelf: 'flex-start',
        backgroundColor: '#965BCC',
    },
    text: {
        fontSize: 18,
        color: '#fff',
    },
});

export default ChatItem;
