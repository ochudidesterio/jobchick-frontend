import React, { useState, useEffect , useRef} from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList,KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { db } from '../../firebase-config.js';
import { addDoc,collection,onSnapshot,query, where, orderBy,serverTimestamp } from 'firebase/firestore';
import { GlobalStyles } from '../colors/index.js';
import Icon from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';


const ChatScreen = ({ route,navigation }) => {
  const { user,id,name } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  let receiverId ;
  let uId;
  if(user.role === "ADMIN"){
     receiverId = id; // Replace with the actual receiver's user ID
     uId = receiverId+""+user.id
  }else{
    receiverId = id
    uId = user.id+""+receiverId
  }
  console.log("UUID",uId)
  console.log("Name",name)

const allChats = () =>{
    navigation.navigate("chatlist",{user:user})
}


useEffect(() => {
    const chatQuery = query(
      collection(db, 'chats'),
      //where('senderId', '==', user.id), // Replace 'userId' with the specific senderId
      where('uId', '==', uId), // Replace 'receiverId' with the specific receiverId
      orderBy('timestamp', 'asc'), // 'asc' for ascending or 'desc' for descending order
    );
  
    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();

        messagesData.push(messageData);
      });
      setMessages(messagesData);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });
  
    return () => {
      unsubscribe(); // Unsubscribe from the Firestore listener when the component unmounts
    };
  }, [user.id, receiverId]);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const messageData = {
        uId:uId,
        senderId: user.id,
        receiverId,
        user:name,
        text: message,
        timestamp:  serverTimestamp(), // Replace with your desired timestamp format
      };
      console.log(messageData)

      try {
        await addDoc(collection(db, 'chats'), messageData);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={120}
    >
        <View style={styles.chatNameContainer}>
            <Text style={styles.chatName}>Chat with {name}</Text>
        </View>
        <View style={styles.line} />

      {messages.length > 0 && <FlatList
              ref={flatListRef} // Assign the ref to the FlatList
        style={styles.messages}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === user.id ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>
              {item.text}
            </Text>
            <Text style={styles.time}>
                {item.timestamp?.toDate().toLocaleString()}
            </Text>
          </View>
        )}
      />}
    <TouchableOpacity style={styles.fabContainer} onPress={allChats} >
        <MatIcon name="message" size={30} color={GlobalStyles.colors.white} />
    </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          multiline
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message..."
          placeholderTextColor={GlobalStyles.colors.hint}
        />
        <TouchableOpacity style={styles.send} onPress={sendMessage}>
            <Icon name="send-sharp" size={40} color={GlobalStyles.colors.colorPrimaryDark}/>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  messages:{
    marginHorizontal:15,
    marginBottom:30,
    marginTop:10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: GlobalStyles.colors.colorPrimaryLight,
    color: 'white',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: GlobalStyles.colors.white,
  },
  messageText: {
    fontSize: 15,
    color: 'black',
    fontFamily:"Medium"
  },
  time:{
    fontSize:12,
    fontFamily:"Light",
    color:GlobalStyles.colors.gray500

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:10,
    marginBottom:15,
  },
  fabContainer: {
    // position: 'absolute',
    backgroundColor: GlobalStyles.colors.gold,
    borderRadius: 50,
    position:"absolute",
    justifyContent:"center",
    alignItems:"center",
    right:10,
    bottom:70,
    height:60,
    width:60,
    padding: 10,},
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:5,
    color: '#000',
    backgroundColor:GlobalStyles.colors.white,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  send:{
  },
  chatNameContainer:{
    height:30,
    alignItems:"center",
    justifyContent:"center",
    marginVertical:5,
  },
  chatName:{
    color:GlobalStyles.colors.txtColor,
    fontFamily:"SemiBold",
    fontSize:16,
  },
  line: {
    height: 1,
    marginVertical: 4,
    backgroundColor: GlobalStyles.colors.edit,
  },
});

export default ChatScreen;
