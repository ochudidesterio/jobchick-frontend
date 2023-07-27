import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../colors';
import { useNavigation } from '@react-navigation/native';
import DetailScreenActions from '../components/DetailScreenActions';
import { useSelector } from 'react-redux';
import api from '../api/api';

const UserDetailsScreen = ({route}) => {
    const navigation = useNavigation()
    const company = useSelector(state=>state.auth.company)
    const matchingIds = useSelector(state=>state.auth.matchingIds)
    console.log ("Ids",matchingIds)
  const {user} = route.params;

  const back = async ()=>{
    navigation.navigate('Home')
  }
  const adminLikeBack = async ()=>{
    try {
      const response  = await api.post(`/likes/admin/like/${user.id}/${company.id}`)
      console.log("Res",response.data)
    } catch (error) {
      
    }
  }
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
          <Text style={styles.title}>Biography</Text>
          <Text style={styles.txtBio}>{user.bio}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Gender</Text>
          <Text style={styles.txtBio}>{user.gender}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Proffesion</Text>
          <Text style={styles.txtBio}>{user.proffession}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Education</Text>
          <Text style={styles.txtBio}>{user.education}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Skills</Text>
          {user.skills && user.skills.length > 0 ? (
            <Text style={styles.txtBio}>{user.skills.join(' | ')}</Text>
          ) : (
            <Text style={styles.txt}>{}</Text>
          )}
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Languages</Text>
          {user.languages && user.languages.length > 0 ? (
            <Text style={styles.txtBio}>{user.languages.join(' | ')}</Text>
          ) : (
            <Text style={styles.txt}>{}</Text>
          )}
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Region</Text>
          <Text style={styles.txtBio}>{user.location}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Email</Text>
          <Text style={styles.txtBio}>{user.email}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Phone number</Text>
          <Text style={styles.txtBio}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.other}>
            <DetailScreenActions like={adminLikeBack} isTrue={isTrue} nope={back} />
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
