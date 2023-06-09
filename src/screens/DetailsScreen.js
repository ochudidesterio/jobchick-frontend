import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../colors'

const DetailsScreen = ({route}) => {
  const {data} = route.params
  console.log(data)
  return (
    <ScrollView style = {styles.container}>
      <View style={styles.jobContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>
    </ScrollView>
  )
}

export default DetailsScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  jobContainer:{
    paddingHorizontal:10,
  },
  description:{
    color:GlobalStyles.colors.txtColor,
    fontFamily:"Poppins-Light",
    textAlign:"justify",
    fontSize:16
  },
  title:{
    color:GlobalStyles.colors.green,
    fontFamily:"Poppins-ExtraBold",
    fontSize:24,
    textAlign:"center",
  }
})