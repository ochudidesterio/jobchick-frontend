import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
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

const EditProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [firstName, setFirstName] = useState(user.firstName);
  const [gender, setGender] = useState(user.gender);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [proffession, setProffession] = useState(user.proffession);
  const [authUsername, setAuthUserName] = useState(user.authUsername);
  const userData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    proffession: '',
    gender: '',
    authUsername: '',
    profileImage: '',
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
      uploadBytes(reference, blob).then(snapshot => {
        getDownloadURL(snapshot.ref).then(url => {
          console.log(url);
          if (url) {
            setProfileImage(url);
            setImageUrl(null);
          }
        });
      });

      console.log('Upload successful');
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  };

  const handleSubmit = async () => {
    userData.authUsername = authUsername;
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.gender = gender;
    userData.phoneNumber = phoneNumber;
    userData.proffession = proffession;
    userData.profileImage = profileImage;
    try {
      const res = await api.put(`/user/update/${user.id}`, userData);
      console.log(userData);
      console.log(res.data);
      dispatch(updateUser(res.data));
      navigation.navigate("Profile")
    } catch (error) {
      console.log('Update Error', error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.holder}>
        <View style={styles.imageContainer}>
          {profileImage !== null || profileImage !== '' ? (
            <CircularImageView
              icon="camera"
              onPress={handleCameraPress}
              imageSource={{uri: profileImage}}
            />
          ) : (
            <CircularImageView
              icon="camera"
              onPress={handleCameraPress}
              imageSource={{
                uri:
                  user.profileImage !== null || user.profileImage !== ''
                    ? user.profileImage
                    : require('../images/person.jpg'),
              }}
            />
          )}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder="first name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <CustomEditInput
            placeholder="last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder="username"
            value={authUsername}
            onChangeText={setAuthUserName}
          />
          <CustomEditInput
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder="Proffession"
            value={proffession}
            onChangeText={setProffession}
          />
        </View>

        <View style={styles.editContainer}>
          <CustomButton title="Update Profile" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 3,
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
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  text: {
    color: GlobalStyles.colors.txtColor,
  },
});
