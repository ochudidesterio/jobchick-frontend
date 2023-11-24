import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import { GlobalStyles } from '../colors'
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';


const PremiumView = ({color,premium}) => {
    const language = useSelector(state => state.auth.language);
    const util = getLanguageObject(language);



    
  return (
    <View style={[styles.container,{backgroundColor:color}]}>
      <TouchableOpacity style={styles.innerContainer}>
        <View style={styles.premiumLeft}>
            <View style ={styles.starContainer}>
            <Icon name="star" size={20} color={GlobalStyles.colors.gold} />

            </View>
        </View>
        <View style={styles.premiumRight}>
            <Text style={styles.txtPrem}>{util.getPremium}</Text>
            {premium.length > 0 && <Text style={styles.price}>{premium[0].price} {util.perMonth}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default PremiumView

const styles = StyleSheet.create({
    container:{
        height:150,
        justifyContent:"center",
        alignItems:"center",
        marginVertical:5
        
    },
    innerContainer:{
        height:80,
        width:"60%",
        backgroundColor:GlobalStyles.colors.white,
        borderRadius:20,
        borderWidth:1,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        borderColor:GlobalStyles.colors.colorPrimaryLight
    },
    premiumLeft:{
        justifyContent:"center",
        alignItems:"center",
        marginRight:5,

    },
    premiumRight:{
        justifyContent:"center",
        alignItems:"center",
        marginLeft:5,
    },
    starContainer:{
        borderRadius:100,
        height:40,
        width:40,
        padding:5,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:GlobalStyles.colors.faintGold
    },
    txtPrem:{
        color:GlobalStyles.colors.txtColor,
        fontFamily:"Bold"
    },
    price:{
        color:GlobalStyles.colors.txtColor
    }
})