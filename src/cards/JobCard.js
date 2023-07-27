import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {GlobalStyles} from '../colors';
import ParagraghView from '../components/ParagraghView';
import JobDetailCard from './JobDetailCard';
import {useNavigation} from '@react-navigation/native';
import calculateTimeElapsed from '../util/timeUtils';
import {useSelector} from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import Icon from 'react-native-vector-icons/Ionicons';

const JobCard = ({data}) => {
  const navigation = useNavigation();
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);

  const showMoreDetails = () => {
    navigation.navigate('Details', {data});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.headAvatar}
            source={require('../images/google.png')}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{data.title}</Text>
      </View>
      
        <JobDetailCard
          level={data.level}
          salary={data.salary}
          location={data.region}
          timePosted={calculateTimeElapsed(
            data.timestamp,
            util.hr,
            util.min,
            util.sec,
            util.s,
            util.ago,
            util.day,
          )}
          company={data.company.name}
        />
     

      
        <Text style={styles.desc}>{util.description}</Text>
    
     
<View style={styles.desc}>
<ParagraghView paragraph={data.description} />
</View>
     
      <View style={styles.chevron}>
        <TouchableOpacity onPress={showMoreDetails}>
          <Icon name={'chevron-down'} size={35} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 6,
    width: '100%',
    // height: '90%',
    paddingVertical: 8,
  },
 
  title: {
    fontSize: 20,
    fontFamily: 'ExtraBold',
    marginBottom: 8,
    color: GlobalStyles.colors.txtColor,
    paddingVertical: 5,
  },
  desc: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Bold',
    paddingVertical: 10,
    paddingHorizontal: 16,
    textAlign: 'left',
  },

  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.cream,
  },
  headAvatar: {
    width: '100%',
    height: '100%',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locText: {
    color: GlobalStyles.colors.txtColor,
    fontSize: 12,
  },
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginTop: 5,
  },
  salaryItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc:{
    marginHorizontal:16,
  }
});

export default JobCard;
