import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {GlobalStyles} from '../colors';
import ParagraghView from '../components/ParagraghView';
import JobDetailCard from './JobDetailCard';
import { useNavigation } from '@react-navigation/native';

const JobCard = ({data}) => {
  const navigation = useNavigation()
  const calculateTimeElapsed = timestamp => {
    const currentTime = new Date();
    const pastTime = new Date(timestamp);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - pastTime;

    // Calculate the time difference in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
    }
  };

  const showMoreDetails = () => {
    navigation.navigate("Details",{data})
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
        timePosted={calculateTimeElapsed(data.timestamp)}
      />

      <Text style={styles.desc}>Description</Text>
      <ParagraghView paragraph={data.description} onPress={showMoreDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    width: '100%',
    height: '90%',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-ExtraBold',
    marginBottom: 8,
    color: GlobalStyles.colors.txtColor,
  },
  desc: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-Light',
    paddingVertical: 10,
    textAlign: 'right',
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
});

export default JobCard;
