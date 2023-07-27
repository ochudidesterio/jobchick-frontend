import { StyleSheet, Text,TouchableOpacity} from 'react-native'
import React from 'react'
import { GlobalStyles } from '../colors'

export default function SettingButton({txt,onPress,color}) {
  return (
    <TouchableOpacity onPress={onPress}  style={[styles.container,{backgroundColor:color}]}>
      <Text style={styles.txt}>{txt}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container:{
        borderRadius:15,
        width:140,
        justifyContent:"center",
        alignItems:"center",
        paddingVertical:8,
        paddingHorizontal:5,
    },
    txt:{
        color:GlobalStyles.colors.white,
        fontFamily:"SemiBold"
    }
})