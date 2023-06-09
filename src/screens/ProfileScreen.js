import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import CircularImageView from '../components/CircularImageView';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/Fontisto';
import InterestItem from '../components/InterestItem';

const ProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  console.log(user);
  const handleEditPress = () => {
    navigation.navigate('editProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageConainer}>
        <CircularImageView
          icon="pencil"
          imageSource={{uri:user.profileImage}}
          onPress={handleEditPress}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.nameContainer}>
        <Text style={styles.nameLeft}>(20),</Text>
        <Text style={styles.name}>{user.firstName + ' ' + user.lastName}</Text>
        <View style={styles.dot}></View>
        </View>
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <Text style={styles.text}>Phone Number</Text>
          <View style={styles.iconContainer}>
            <Font name="phone" size={15} color={GlobalStyles.colors.white} />
          </View>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <Text style={styles.text}>Email</Text>
          <View style={styles.iconContainer}>
            <Icon name="mail" size={15} color={GlobalStyles.colors.white} />
          </View>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.email}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <Text style={[styles.text, {fontSize: 24}]}>Interests</Text>
        </View>
        <ScrollView >
          <View style={styles.teleContainer}>
          <InterestItem name="Software Engineering" />
          <InterestItem name=" Marketing" />
          <InterestItem name="Engineering" />
          <InterestItem name="Social Media Marketing" />
          <InterestItem name="Cloud computing" />
          <InterestItem name="Software Engineering" />
          <InterestItem name=" Marketing" />
          <InterestItem name="Engineering" />
          <InterestItem name="Social Media Marketing" />
          <InterestItem name="Cloud computing" />
          <InterestItem name="Software Engineering" />
          <InterestItem name=" Marketing" />
          <InterestItem name="Engineering" />
          <InterestItem name="Social Media Marketing" />
          <InterestItem name="Cloud computing" />
          <InterestItem name="Software Engineering" />
          <InterestItem name=" Marketing" />
          <InterestItem name="Engineering" />
          <InterestItem name="Social Media Marketing" />
          <InterestItem name="Cloud computing" />
          <InterestItem name="Software Engineering" />
          <InterestItem name=" Marketing" />
          <InterestItem name="Engineering" />
          <InterestItem name="Social Media Marketing" />
          <InterestItem name="Cloud computing" />
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 3,
  },
  imageConainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },
  dot:{
    width:15,
    height:15,
    borderRadius:50,
    marginStart:5,
    backgroundColor:GlobalStyles.colors.green
  },
  name: {
    color: GlobalStyles.colors.txtColor,
    textAlign: 'center',
    fontSize: 20,
    fontFamily:'Poppins-Bold'
  },
  nameLeft: {
    color: GlobalStyles.colors.colorPrimaryLight,
    textAlign: 'center',
    fontSize: 16,
    fontFamily:'Poppins-Bold'
  },
  details: {
    flex: 2,
  },
  line: {
    height: 1,
    marginVertical: 5,
    backgroundColor: GlobalStyles.colors.edit,
  },
  teleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
    paddingRight:20,
    flexWrap: 'wrap',
  },
  text: {
    color: GlobalStyles.colors.txtColor,
    fontSize: 16,
   
    marginRight: 10,
    fontFamily:'Poppins-ExtraBold'
  },
  iconContainer: {
    height: 28,
    width: 28,
    borderRadius: 50,
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  telephone: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  txtItem: {
    color: GlobalStyles.colors.txtColor,
    paddingRight: 20,
    fontFamily:'Poppins-Light'
  },
});
