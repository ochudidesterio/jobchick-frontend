import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GlobalStyles} from '../colors';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import UserImage from './UserImage';

const CircularImageView = ({imageSource, onPress, icon, user}) => {
  let percent;

  const getProgressPercentage = () => {
    const {firstName, lastName, email,gender, phoneNumber, authUsername,age,proffession} = user;
    const progressProperties = [
      firstName,
      lastName,
      email,
      phoneNumber,
      authUsername,
      age,
      proffession,
      gender
    ];
    const nonEmptyProperties = progressProperties.filter(prop => prop);

    const percent =
      (nonEmptyProperties.length / progressProperties.length) * 100;

    return percent;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={onPress}>
        <View>
          <Icon name={icon} size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchEnd}>
        <Text style={styles.touchEndTxt}>קו"ח</Text>
      </TouchableOpacity>
      {/* <UserImage user={user}/> */}
      {/* <View style={[styles.imageContainer]}> */}
        <AnimatedCircularProgress
          style={styles.progressCircle}
          progress={100}
          size={160}
          fill={getProgressPercentage()}
          thickness={5}
          width={6}
          tintTransparency={true}
          tintColor={GlobalStyles.colors.colorPrimaryDark}>
          {() => (
            
              <View style={styles.imageContainer}>
                <Image
                source={imageSource}
                style={styles.profile}
                resizeMode="cover"
              />
              </View>
            
          )}
        </AnimatedCircularProgress>

        {/* <View style={getMaskStyle()}> */}
        {/* <Image source={imageSource} style={styles.profile} resizeMode="cover" /> */}
        {/* </View> */}
      {/* </View> */}

      <View style={styles.touchBorder}>
        <Text style={styles.touchText}>Progress, {getProgressPercentage().toFixed()}%</Text>
      </View>
    </View>
  );
};
export default CircularImageView;
const styles = StyleSheet.create({
  container: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  imageContainer:{
    width:150,
    height:150,
    borderRadius:150/2,
    borderColor:GlobalStyles.colors.hint,
    borderWidth:2,
    overflow: 'hidden',
   
  },
  profile: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  editButton: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    zIndex: 1,
    borderRadius: 50,
    backgroundColor: GlobalStyles.colors.edit,
  },
  touchBorder: {
    position: 'absolute',
    marginTop: 8,
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
    padding: 8,
    borderRadius: 30,
    top: 50,
  },
  touchText: {
    color: GlobalStyles.colors.white,
    fontSize: 12,
    fontFamily: 'Bold',
    paddingHorizontal: 12,
  },
  touchEnd: {
    position: 'absolute',
    left: 120,
    bottom: 10,
    top: 35,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 90,
    paddingRight: 10,
    height: 30,

    borderRadius: 50,
    backgroundColor: GlobalStyles.colors.red,
    overflow:"hidden"
  },
  touchEndTxt: {
    color: GlobalStyles.colors.white,
    textAlign: 'right',
    fontFamily: 'Bold',
  },
});
