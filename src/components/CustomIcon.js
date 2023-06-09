import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

const CustomIcon = ({icon,color, back}) => {
  return (
    <View style={[styles.container,{ backgroundColor: back }]}>
        <Icon name={icon} color={color} size={12} />
    </View>
  )
}

export default CustomIcon

const styles = StyleSheet.create({
    container:{
        width:30,
        height:30,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center', 
    }
})