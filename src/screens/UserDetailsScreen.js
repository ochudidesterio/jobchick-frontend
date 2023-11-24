import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../colors';
import {useNavigation} from '@react-navigation/native';
import DetailScreenActions from '../components/DetailScreenActions';
import {useSelector} from 'react-redux';
import api from '../api/api';
import getLanguageObject from '../util/LanguageUtil';

const UserDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const company = useSelector(state => state.auth.company);
  const matchingIds = useSelector(state => state.auth.matchingIds);
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const {userParam} = route.params;
  let user = userParam;

  const back = async () => {
    navigation.navigate('Home');
  };
  const viewLikedJobs = async () => {
    try {
      navigation.navigate('likedJobs', {userParam});
    } catch (error) {}
  };
  const adminLikeUser = async () => {
    try {
      await api.post(`/companylikes/create/${company.id}/${user.id}`);
    } catch (error) {}
  };
  let isTrue = false;
  for (const item of matchingIds) {
    if (item.userId === user.id) {
      isTrue = item.likedBack;
      break; // No need to check further if we found a match
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imgCotainer}>
        <Image
          style={styles.img}
          source={
            user.profileImage !== null
              ? {uri: user.profileImage}
              : require('../images/person.jpg')
          }
          resizeMode="cover"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.username}>
          {user && user.firstName !== null && user.lastName !== null
            ? user.firstName + ' ' + user.lastName
            : user.authUsername}
        </Text>
        <View style={styles.item}>
          <Text style={styles.title}>{util.bio}</Text>
          <Text style={styles.txtBio}>{user.bio}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.gender}</Text>
          <Text style={styles.txtBio}>{user.gender}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.proffesion}</Text>
          <Text style={styles.txtBio}>{user.proffession}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.education}</Text>
          <Text style={styles.txtBio}>{user.education}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.skills}</Text>
          {user.skills && user.skills.length > 0 ? (
            <Text style={styles.txtBio}>{user.skills.join(' | ')}</Text>
          ) : (
            <Text style={styles.txt}>{}</Text>
          )}
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.languages}</Text>
          {user.languages && user.languages.length > 0 ? (
            <Text style={styles.txtBio}>{user.languages.join(' | ')}</Text>
          ) : (
            <Text style={styles.txt}>{}</Text>
          )}
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.region}</Text>
          <Text style={styles.txtBio}>{user.location}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.email}</Text>
          <Text style={styles.txtBio}>{user.email}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>{util.phonenumber}</Text>
          <Text style={styles.txtBio}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.other}>
          <DetailScreenActions
            jobs={viewLikedJobs}
            like={adminLikeUser}
            isTrue={isTrue}
            nope={back}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
  },
  imgCotainer: {
    height: 300,
    width: '100%',
  },
  img: {
    height: '100%',
    width: '100%',
  },
  details: {
    marginHorizontal: 20,
  },
  title: {
    color: GlobalStyles.colors.txtColor,
    marginVertical: 2,
    fontFamily: 'Light',
    textAlign: 'left',
  },
  username: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'ExtraBold',
    textAlign: 'left',
    fontSize: 20,
    marginVertical: 20,
  },
  txtBio: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'SemiBold',
    textAlign: 'justify',
  },
  item: {
    marginVertical: 5,
  },
});
