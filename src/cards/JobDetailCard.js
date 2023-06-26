import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../colors';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';

const JobDetailCard = ({location, timePosted, salary,level,company}) => {
    const language = useSelector(state=>state.auth.language)
    const util = getLanguageObject(language)
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        
        <Text style={styles.txt}>{company}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.txt}>{location}</Text>
          <Icon name="location" size={15} color={GlobalStyles.colors.red} />
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.txt}>{salary}</Text>
        <Icon name="logo-usd" size={15} color={GlobalStyles.colors.txtColor} />
      </View>
      <View style={styles.item}>
        <Text style={styles.txt}>{level}</Text>
        <Icon name="briefcase" size={15} color={GlobalStyles.colors.txtColor} />
      </View>
      <View style={styles.item}>
      <Text style={styles.txt}>{util.posted} {timePosted}</Text>
      </View>
    </View>
  );
};

export default JobDetailCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor:GlobalStyles.colors.whiteSmoke,
    paddingHorizontal:16,
    paddingVertical:6,
    
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
  },
  txt: {
    fontFamily: 'Medium',
    fontSize: 14,
    color: GlobalStyles.colors.txtColor,
    marginEnd:5
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop:3,
  },
});
