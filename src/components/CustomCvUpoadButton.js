import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../colors'
import Icon from 'react-native-vector-icons/FontAwesome';


const CustomCvUpoadButton = ({title,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.txtContainer}>
        <Text style={styles.txt}>{title}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon name="file-pdf-o" color={GlobalStyles.colors.red} size={40} />
      </View>
    </TouchableOpacity>
  )
}

export default CustomCvUpoadButton

const styles = StyleSheet.create({
    container:{
        backgroundColor:GlobalStyles.colors.blur,
        borderRadius:10,
        height:60,
        flexDirection:"row",
        flex:1,
        marginVertical:15,

    },
    txtContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    iconContainer:{
        alignItems:"center",
        justifyContent:"center",
        marginHorizontal:10
    },
    txt:{
        color:GlobalStyles.colors.txtColor,
        fontFamily:"Medium",
        fontSize:16,
    }
})