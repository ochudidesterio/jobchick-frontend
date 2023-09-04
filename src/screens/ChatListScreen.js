import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config.js';
import { collection, onSnapshot, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { GlobalStyles } from '../colors/index.js';
import ChatRoom from '../components/ChatRoom.js';

const ChatListScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [chatUsers, setChatUsers] = useState([]);
  const [myUsers, setMyUsers] = useState([]);

//   useEffect(() => {
//     const fetchChatUsers = () => {
//       const chatUsersQuery = query(
//         collection(db, 'chats'),
//         where('senderId', '==', user.id),
//         orderBy('timestamp', 'desc')
//       );

//       const unsubscribe = onSnapshot(chatUsersQuery, (querySnapshot) => {
//         const chatUsersData = [];
//         querySnapshot.forEach((doc) => {
//           const messageData = doc.data();
//           const otherUserId = messageData.senderId === user.id ? messageData.receiverId : messageData.senderId;
//         console.log("Ot",otherUserId)
//           if (!chatUsersData.includes(otherUserId)) {
//             chatUsersData.push(otherUserId);
//           }
//         });

//         setChatUsers(chatUsersData);
//       });

//       return () => {
//         unsubscribe();
//       };
//     };

//     fetchChatUsers();
//   }, []);

useEffect(() => {
    const fetchChatUsers = () => {
      const senderQuery = query(
        collection(db, 'chats'),
        where('senderId', '==', user.id),
        orderBy('timestamp', 'desc')
      );
  
      const receiverQuery = query(
        collection(db, 'chats'),
        where('receiverId', '==', user.id),
        orderBy('timestamp', 'desc')
      );
  
      const unsubscribeSender = onSnapshot(senderQuery, (querySnapshot) => {
        const chatUsersData = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          const otherUserId = messageData.receiverId;
          console.log("Other User ID:", otherUserId);
  
          if (!chatUsersData.includes(otherUserId)) {
            chatUsersData.push(otherUserId);
          }
        });
  
        setChatUsers((prevChatUsers) => [...prevChatUsers, ...chatUsersData]);
      });
  
      const unsubscribeReceiver = onSnapshot(receiverQuery, (querySnapshot) => {
        const chatUsersData = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          const otherUserId = messageData.senderId;
          console.log("Other User ID:", otherUserId);
  
          if (!chatUsersData.includes(otherUserId)) {
            chatUsersData.push(otherUserId);
          }
        });
  
        setChatUsers((prevChatUsers) => [...prevChatUsers, ...chatUsersData]);
      });
  
      return () => {
        unsubscribeSender();
        unsubscribeReceiver();
      };
    };
  
    fetchChatUsers();
  }, []);


  
  

//   useEffect(() => {
//     const fetchMyUsers = async () => {
//       if (chatUsers.length > 0) {
// const uniqueArray = [...new Set(chatUsers)];
// console.log("Unique",uniqueArray);
//         const promises = uniqueArray.map((id) => {
//           return new Promise((resolve, reject) => {
//             const data = [];

    
//             const qa = query(
//               collection(db, 'chats'),
//               where('senderId', '==', user.id),
//               where('receiverId', '==', id),
//               orderBy('timestamp', 'desc'),
//               limit(1)
//             );

//             const qb = query(
//                 collection(db, 'chats'),
//                 where('senderId', '==', id),
//                 where('receiverId', '==', user.id),
//                 orderBy('timestamp', 'desc'),
//                 limit(1)
//               );

          

//             const unsubscribe = onSnapshot(qa, (querySnapshot) => {
//               querySnapshot.forEach((doc) => {
//                 const messageData = doc.data();
//                 console.log("Last",messageData)
//                 data.push(messageData);
//               });

//               unsubscribe();
//               resolve(data);
//             });

        
//           });
//         });

//         const myUsersData = await Promise.all(promises);
//         setMyUsers(myUsersData.flat());
//       }
//     };
//     fetchMyUsers();
//   }, [chatUsers]);

useEffect(() => {
    const fetchMyUsers = async () => {
      if (chatUsers.length > 0) {
        const uniqueArray = [...new Set(chatUsers)];
        console.log("Unique", uniqueArray);
        const promises = uniqueArray.map((id) => {
          return new Promise(async (resolve, reject) => {
            //const data = [];
            let text = "";
            let latestTimestamp = 0
  
            const qa = query(
              collection(db, 'chats'),
              where('senderId', '==', user.id),
              where('receiverId', '==', id),
              orderBy('timestamp', 'desc'),
              limit(1)
            );
  
            const qb = query(
              collection(db, 'chats'),
              where('senderId', '==', id),
              where('receiverId', '==', user.id),
              orderBy('timestamp', 'desc'),
              limit(1)
            );
  
            const unsubscribeA = onSnapshot(qa, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const messageData = doc.data();
                console.log("Last A", messageData);
                const timestampA = messageData.timestamp?.toDate().getTime();
                if (timestampA > latestTimestamp) {
                    latestTimestamp = timestampA;
                    text = messageData.text;
                  }

                //data.push(messageData);
              });
  
              unsubscribeA();
              //resolve(data);
              resolve({ id, text });
            });
  
            const unsubscribeB = onSnapshot(qb, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const messageData = doc.data();
                const timestampB = messageData.timestamp?.toDate().getTime();
              console.log("Last B", messageData);

              if (timestampB > latestTimestamp) {
                latestTimestamp = timestampB;
                text = messageData.text;
              }
                //data.push(messageData);
              });
  
              unsubscribeB();
              //resolve(data);
              resolve({ id, text });
            });
          });
        });
  
        // const myUsersData = await Promise.all(promises);
        // console.log("sms",myUsersData)
        // setMyUsers(myUsersData.flat());
        const myUsersData = await Promise.all(promises);
        console.log("sms",myUsersData)
      setMyUsers(myUsersData);
      }
    };
    fetchMyUsers();
  }, [chatUsers]);
  

  return (
    <View>
      {myUsers.length > 0 && (
        <FlatList
          data={myUsers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ChatRoom item={item} />}
        />
      )}
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  text: {
    color: GlobalStyles.colors.txtColor,
  },
});
