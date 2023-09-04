import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CircularImageView from '../components/CircularImageView';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import {GlobalStyles} from '../colors';
import {useSelector} from 'react-redux';
import CustomButton from '../components/CustomButton';
import {storageRef, storage} from '../../firebase-config.js';
import {getDownloadURL, uploadBytes} from 'firebase/storage';
import CustomEditInput from '../components/CustomEditInput';
import api from '../api/api';
import {useDispatch} from 'react-redux';
import {updateUser} from '../store/slices/authSlice';
import getLanguageObject from '../util/LanguageUtil';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDropDown from '../components/CustomDropDown';
import CustomLocationDropDown from '../components/CustomLocationDropDown';
import CustomCvUpoadButton from '../components/CustomCvUpoadButton';

const EditProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const dispatch = useDispatch();
  const [uri, setUri] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [cvUrl, setCvURl] = useState(user.cvUrl);
  const [firstName, setFirstName] = useState(user.firstName);
  const [gender, setGender] = useState(user.gender);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [proffession, setProffession] = useState(user.proffession);
  const [authUsername, setAuthUserName] = useState(user.authUsername);
  const [bio, setBio] = useState(user.bio);
  const [age, setAge] = useState(user.age);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(user.education);
  const [locationItem, setLocationItem] = useState(user.location);

  const [cvTxt, setCvTxt] = useState('Attach Cv');

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const getRegions = async () => {
    try {
      const response = await api.get(`/region/all`);
      setRegions(response.data);
      setLocationItem(response.data[0].name);
    } catch (error) {}
  };
  useEffect(() => {
    getRegions();
  }, []);
  const userData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    proffession: '',
    gender: '',
    authUsername: '',
    profileImage: '',
    age,
    education: '',
    cvUrl: '',
    skills: [],
    languages: [],
    bio: '',
    location: '',
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
    } finally {
    }
  };
  const pickCvAndUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      console.log('Result:', result);

      if (result && result.length > 0) {
        const pickedDocument = result[0]; // Assuming you're only picking one document
        try {
          // Upload the picked document to Firebase or perform other operations
          const randomFileName = `cv_${generateRandomNumber()}.pdf`;
          const reference = storageRef(
            storage,
            `cv/${user.id}/${randomFileName}`,
          );

          const response = await fetch(pickedDocument.uri);
          const blob = await response.blob();

          const snapShot = await uploadBytes(reference, blob);

          console.log('CV uploaded successfully');

          // Get the download URL of the uploaded CV
          const cvDownloadUrl = await getDownloadURL(snapShot.ref);
          if (cvDownloadUrl) {
            setCvTxt('Uploaded');
            setCvURl(cvDownloadUrl);
            console.log('CV download URL:', cvDownloadUrl);
          } else {
            setCvTxt('Failed');
          }

          // Now you can update the user's CV URL or perform other operations
          // You might want to store the CV URL in your userData or user state
          // For example: userData.cvUrl = url;
        } catch (uploadError) {
          console.error('Error uploading CV:', uploadError);
          setCvTxt('Failed');
        }

        console.log(
          'URI: ' + pickedDocument.uri,
          'Type: ' + pickedDocument.type,
          'Name: ' + pickedDocument.name,
          'Size: ' + pickedDocument.size,
        );
      } else {
        console.log('No document picked.');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  useEffect(() => {
    if (cvUrl === null) {
      setCvTxt('Attach Cv');
    } else {
      setCvTxt('Uploaded');
    }
  }, []);

  useEffect(() => {
    setProfileImage(uri);
    if (user.skills.length > 0) {
      setSkills(
        user.skills.map((name, index) => ({id: index + 1, value: name})),
      );
    }

    if (user.languages.length > 0) {
      setLanguages(
        user.languages.map((name, index) => ({id: index + 1, value: name})),
      );
    }
    console.log('EffectUri', profileImage);
  }, [uri]);

  const handleSubmit = async () => {
    // console.log("item",selectedItem)
    const skillValues = skills.map(skill => skill.value);
    const languageValues = languages.map(language => language.value);
    // console.log("Skills",skillValues)
    // console.log("Languages",languageValues)

    userData.authUsername = authUsername;
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.gender = gender;
    userData.phoneNumber = phoneNumber;
    userData.proffession = proffession;
    userData.profileImage = profileImage;
    userData.age = age;
    userData.education = selectedItem;
    userData.skills = skillValues;
    userData.languages = languageValues;
    userData.bio = bio;
    userData.location = locationItem;
    userData.cvUrl = cvUrl;

    // console.log("User",userData)

    try {
      setIsLoading(true);
      const res = await api.post(`/user/update/${user.id}`, userData);

      if (res.data.message === 'Successful') {
        dispatch(updateUser(res.data));
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.log('Update Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  //SKills

  const [skills, setSkills] = useState([{id: 1, value: ''}]);
  const handleSkillChange = (index, text) => {
    const updatedSkills = [...skills];
    updatedSkills[index].value = text;
    setSkills(updatedSkills);
  };
  const addSkill = () => {
    if (skills.length < 3) {
      const newSkill = {id: skills.length + 1, value: ''};
      setSkills([...skills, newSkill]);
    }
  };

  //Languages

  const [languages, setLanguages] = useState([{id: 1, value: ''}]);
  const handleLanguageChange = (index, text) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index].value = text;
    setLanguages(updatedLanguages);
  };
  const addLanguage = () => {
    if (languages.length < 3) {
      const newLanguage = {id: languages.length + 1, value: ''};
      setLanguages([...languages, newLanguage]);
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
            placeholder={util.firstName}
            value={firstName}
            onChangeText={setFirstName}
            isMultline={false}
            icon="person-circle-outline"
            inputHolder="first name"
          />

          <CustomEditInput
            placeholder={util.lastName}
            value={lastName}
            onChangeText={setLastName}
            isMultline={false}
            icon="person-circle-outline"
            inputHolder="last name"
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={util.username}
            value={authUsername}
            onChangeText={setAuthUserName}
            isMultline={false}
            icon="person"
            inputHolder="username"
          />
          <CustomEditInput
            placeholder={util.gender}
            value={gender}
            onChangeText={setGender}
            isMultline={false}
            inputHolder="gender"
            icon="people"
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={util.age}
            value={age}
            onChangeText={setAge}
            keyboard="numeric"
            isMultline={false}
            icon="calendar"
            inputHolder="age"
          />
          <CustomEditInput
            placeholder={util.phonenumber}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboard="numeric"
            isMultline={false}
            icon="call"
            inputHolder="telephone"
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            isMultline={true}
            inputHolder="biography"
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <CustomLocationDropDown
            options={regions.map(region => region.name)}
            defaultValue={locationItem}
            onSelect={value => setLocationItem(value)}
          />
        </View>
        <View style={styles.editContainer}>
          <CustomEditInput
            placeholder={util.proffesion}
            value={proffession}
            onChangeText={setProffession}
            isMultline={false}
            icon="briefcase"
            inputHolder="proffession"
          />
        </View>

        <View style={styles.dropdownWrapper}>
          <CustomDropDown
            options={[
              'Elementary Education',
              'Secondary Education',
              'Bachelors Degree',
              'Masters Degree',
            ]}
            defaultValue={selectedItem}
            onSelect={value => setSelectedItem(value)}
          />
        </View>

        <View>
          {languages.map((language, index) => (
            <View style={styles.editContainer} key={language.id}>
              <CustomEditInput
                placeholder={`Language ${index + 1}`}
                value={language.value}
                onChangeText={text => handleLanguageChange(index, text)}
                isMultline={false}
                icon="language"
              />
              {index === languages.length - 1 && languages.length < 3 && (
                <TouchableOpacity style={styles.test} onPress={addLanguage}>
                  {/* You can customize the "plus" icon here */}
                  <Icon
                    name="add"
                    size={20}
                    color={GlobalStyles.colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View>
          {skills.map((skill, index) => (
            <View style={styles.editContainer} key={skill.id}>
              <CustomEditInput
                placeholder={`Skill ${index + 1}`}
                value={skill.value}
                onChangeText={text => handleSkillChange(index, text)}
                isMultline={false}
                icon="checkmark-done-sharp"
              />
              {index === skills.length - 1 && skills.length < 3 && (
                <TouchableOpacity style={styles.test} onPress={addSkill}>
                  {/* You can customize the "plus" icon here */}
                  <Icon
                    name="add"
                    size={20}
                    color={GlobalStyles.colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* <Button title="Save" onPress={handleSave} /> */}

        <View>
          {isLoading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                color={GlobalStyles.colors.colorPrimaryLight}
              />
            </View>
          )}
        </View>
        {user && user.role === 'USER' && (
          <View style={styles.editContainer}>
            <CustomCvUpoadButton title={cvTxt} onPress={pickCvAndUpload} />
          </View>
        )}

        <View style={styles.editContainer}>
          <CustomButton title={util.updateProfile} onPress={handleSubmit} />
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
    backgroundColor: GlobalStyles.colors.white,
  },
  holder: {
    height: 200,
  },
  test: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
    height: 30,
    width: 30,
    marginTop: 35,
    borderRadius: 5,
  },
  txt: {
    color: GlobalStyles.colors.txtColor,
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
  dropdownWrapper: {
    marginHorizontal: 25,
    marginBottom: 10,

    alignSelf: 'stretch',
  },
});
