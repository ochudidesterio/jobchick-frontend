import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react'
import { GlobalStyles } from '../colors'
import api from '../api/api'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { Image } from 'react-native-animatable'

const ChatRoom = ({item}) => {
    const navigation = useNavigation()
    const user = useSelector(state => state.auth.user);
    const [name,setName] = useState('')
    const [avatar,setAvatar] = useState(null)
    const getUserName = async ()=>{
        try {
            const res = await api.get(`/user/${item.id}`)
            const userName = res.data.firstName !== null && res.data.lastName !== null ? res.data.firstName+" "+res.data.lastName : res.data.authUsername
            const userProfile = res.data.profileImage
            
            setName(userName)
            setAvatar(userProfile)
        } catch (error) {
           console.log("Error fetchng user",error) 
        }
    }
    const navigateToChat =(id)=>{
        navigation.navigate("chats",{user:user,id:id,name:name})

    }
    useEffect(()=>{
        getUserName()
    },[item.id])
    

  return (
    <TouchableOpacity onPress={() => navigateToChat(item.id)} >
     <View style={styles.container}>
     <View style={styles.avatar} >
        <Image style={styles.avatarImage} resizeMode="cover" source={avatar && avatar !== null ? {uri:avatar} : require('../images/person.jpg')} />
     </View>
      <View style={styles.room}>
        {name && <Text style={styles.name}>{name}</Text>}
        <Text style={styles.txt}>{item.text}</Text>

      </View>
     </View>
      <View style={styles.line}></View>
    </TouchableOpacity>
  )
}

export default ChatRoom

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:10,
        paddingVertical:5,
        flex:1,
    },
    avatar:{
        height:60,
        width:60,
        borderRadius:100,
    },
    avatarImage:{
        width:"100%",
        height:"100%",
        borderRadius:100,

    },
    room:{
        flex:1,
        marginLeft:7,
    },
    name:{
        color:GlobalStyles.colors.txtColor,
        fontSize:16,
        fontFamily:"SemiBold"
    },
    txt:{
        color:GlobalStyles.colors.txtColor,
        fontSize:16,
        fontFamily:"Light"
    },
    line:{
        height: 1,
    backgroundColor: GlobalStyles.colors.edit,
  },
    
})