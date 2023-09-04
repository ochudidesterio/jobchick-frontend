import { StyleSheet, Text, TouchableOpacity  } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../colors'

const TouchableSettingItem = ({onPress,text}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.txt}>{text}</Text>
    </TouchableOpacity>
  )
}

export default TouchableSettingItem

const styles = StyleSheet.create({
    container:{
        height:30,
        justifyContent:"center",
        marginVertical:10,
    },
    txt:{
        color:GlobalStyles.colors.txtColor,
        fontFamily:"Bold",
        marginHorizontal:20,
        textAlign:"left"
    }
})