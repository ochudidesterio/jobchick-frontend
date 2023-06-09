import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../colors';

const JobDetailCard = ({location, timePosted, salary,level}) => {
    
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.locationContainer}>
          <Text style={styles.txt}>{location}</Text>
          <Icon name="location" size={15} color={GlobalStyles.colors.red} />
        </View>
        <Text style={styles.txt}>Posted {timePosted}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.txt}>{salary}</Text>
        <Icon name="logo-usd" size={15} color={GlobalStyles.colors.txtColor} />
      </View>
      <View style={styles.item}>
        <Text style={styles.txt}>{level}</Text>
        <Icon name="briefcase" size={15} color={GlobalStyles.colors.txtColor} />
      </View>
    </View>
  );
};

export default JobDetailCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor:GlobalStyles.colors.whiteSmoke,
    paddingHorizontal:3,
    paddingVertical:6,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
  },
  txt: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: GlobalStyles.colors.txtColor,
    marginEnd:5
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop:3,
  },
});
