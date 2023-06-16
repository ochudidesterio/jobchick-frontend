import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';

const QualificationList = ({qualifications}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qualifications and Requirements</Text>
      {qualifications.map((qualification, index) => (
        <View key={qualification.id} style={styles.roleConatiner}>
          <Text style={styles.role}>({`${index + 1}.`}) {qualification.qualification}</Text>
        </View>
      ))}
    </View>
  );
};

export default QualificationList;

const styles = StyleSheet.create({
  container: {
   width:"100%"
  },
  title: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'ExtraBold',
    marginTop: 10,
    fontSize: 15,
  },
 
  role: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'SemiBold',
    
    textAlign:"justify",
    fontSize: 15,
  },
  roleConatiner: {
    paddingVertical:3,
   
  },
});
