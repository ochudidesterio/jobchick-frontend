import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../colors'
import calculateTimeElapsed from '../util/timeUtils'

const DetailsScreen = ({route}) => {
  const {data} = route.params
  console.log(data)
  return (
    <ScrollView style = {styles.container}>
      <View style={styles.jobContainer}>
        <View style={styles.header}>
        <View style={styles.avatar}>
          <Image source={require('../images/google.png')} style={styles.headAvatar} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.type}>{data.level} | {data.type} | {data.region}</Text>
        <Text style={styles.salary}>{data.salary} / Year</Text>
        </View>
        <View style={styles.jdContainer}>
        <Text style={styles.time}>Posted {calculateTimeElapsed(data.timestamp)}</Text>
        <Text style={styles.jd}>Job Description</Text>
        </View>
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
    paddingHorizontal:18
  },
  avatar:{
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.cream,
  },
  headAvatar: {
    width: '100%',
    height: '100%',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:15,
  },
  description:{
    color:GlobalStyles.colors.txtColor,
    fontFamily:"Medium",
    textAlign:"justify",
    fontSize:16
  },
  title:{
    color:GlobalStyles.colors.txtColor,
    fontFamily:"ExtraBold",
    fontSize:20,
    textAlign:"center",
    
  },
  type:{
    fontFamily:"SemiBold",
    color:GlobalStyles.colors.txtColor
  },
  salary:{
    fontFamily:"Medium",
    color:GlobalStyles.colors.txtColor,
    fontSize:15
  },
  time:{
    color:GlobalStyles.colors.green,
    fontFamily:"Medium",
    textAlign:"right",
  },
  jd:{
    color:GlobalStyles.colors.txtColor,
    fontFamily:"Bold",
    fontSize:16,
  },
  jdContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingVertical:10
    
  }
})