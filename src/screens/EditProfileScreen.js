import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import CircularImageView from '../components/CircularImageView';
import {launchImageLibrary} from 'react-native-image-picker';
import {GlobalStyles} from '../colors';
import {useSelector} from 'react-redux';
import CustomButton from '../components/CustomButton';
import {storageRef, storage} from '../../firebase-config.js';
import {getDownloadURL, uploadBytes} from 'firebase/storage';
import CustomEditInput from '../components/CustomEditInput';
import api from '../api/api';
import {useDispatch} from 'react-redux';
import {updateUser} from '../store/slices/authSlice';
import { Translation } from '../util/WordsUtil';

const EditProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  console.log(user);
  const dispatch = useDispatch();
  const [uri, setUri] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [firstName, setFirstName] = useState(user.firstName);
  const [gender, setGender] = useState(user.gender);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [proffession, setProffession] = useState(user.proffession);
  const [authUsername, setAuthUserName] = useState(user.authUsername);
  const [age, setAge] = useState(user.age);
  const [isLoading, setIsLoading] = useState(false);
  const userData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    proffession: '',
    gender: '',
    authUsername: '',
    profileImage: '',
    age,
  };
  function generateRandomNumber() {
    return Math.floor(Math.random() * 1000000);
  }
  const handleCameraPress = () => {
    try {
      setImageUrl(null);
      // setProfileImage(false);
      pickPhoto();
    } catch (error) {
      console.log(error);
    }
  };
  const pickPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      })
        .then(response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri;
            console.log(imageUri);
            setImageUrl(imageUri);
            try {
              handleUpload();
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch(e => console.log(e));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async () => {
    try {
      
      const randomNumber = generateRandomNumber();

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reference = storageRef(
        storage,
        `images/${randomNumber}/${user.firstName}`,
      );

      const snapshot = await uploadBytes(reference, blob);
      const url = await getDownloadURL(snapshot.ref);

      if (url) {
        // setProfileImage(url);
        setImageUrl(null);
        setUri(url);
      }

      console.log('Upload successful');
    } catch (error) {
      console.log('Error uploading image:', error);
    }finally{

    }
  };
  useEffect(() => {
    setProfileImage(uri);
    console.log('EffectUri', profileImage);
  }, [uri]);

  const handleSubmit = async () => {

    userData.authUsername = authUsername;
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.gender = gender;
    userData.phoneNumber = phoneNumber;
    userData.proffession = proffession;
    userData.profileImage = profileImage;
    userData.age = age;
    try {
      setIsLoading(true);
      const res = await api.put(`/user/update/${user.id}`, userData);

      if (res.data.message === 'Successful') {
        dispatch(updateUser(res.data));
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.log('Update Error', error);
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.holder}>
        <View style={styles.imageContainer}>
          {
            <CircularImageView
              icon="camera"
              onPress={handleCameraPress}
              imageSource={
                profileImage !== null
                  ? {uri: profileImage}
                  : require('../images/person.jpg')
              }
              user={user}
            />
          }
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={Translation.word.lastName}
            value={lastName}
            onChangeText={setLastName}
          />
          <CustomEditInput
            placeholder={Translation.word.firstName}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={Translation.word.username}
            value={authUsername}
            onChangeText={setAuthUserName}
          />
          <CustomEditInput
            placeholder={Translation.word.gender}
            value={gender}
            onChangeText={setGender}
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={Translation.word.age}
            value={age}
            onChangeText={setAge}
            keyboard="numeric"
          />
          <CustomEditInput
            placeholder={Translation.word.phonenumber}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboard="numeric"
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={Translation.word.proffesion}
            value={proffession}
            onChangeText={setProffession}
          />
        </View>
        <View>
        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={GlobalStyles.colors.colorPrimaryLight} />
          </View>
        )}
        </View>

        <View style={styles.editContainer}>
          <CustomButton title={Translation.word.updateProfile} onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    paddingBottom: 20,
    backgroundColor:GlobalStyles.colors.white
  },
  holder: {
    height: 200,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  detailsContainer: {
    flex: 2,
    marginTop: 20,
    paddingBottom: 90,
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  text: {
    color: GlobalStyles.colors.txtColor,
  },
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
});
