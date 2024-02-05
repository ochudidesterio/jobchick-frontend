import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
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
import Ent from 'react-native-vector-icons/Entypo';

import CustomCvUpoadButton from '../components/CustomCvUpoadButton';
import DropDownModal from '../components/DropDownModal';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
import {LANGUAGES} from '../util/util';

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

  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const LEVELS =[
    {
      id: 1,
      name: util.elementaryEducation,
    },
    {id: 2, name: util.secondaryEducation},
    {
      id: 3,
      name: util.bachelorsDegree,
    },
    {
      id: 4,
      name: util.mastersDegree ,
    },
  ]

  const [skill, setSkills] = useState('');
  const [badges, setBadges] = useState(user.skills);
  const addBadge = () => {
    if (skill.trim() !== '') {
      setBadges([...badges, skill]);
      setSkills('');
    }
  };

  const handleTextChange = text => {
    setSkills(text);
  };

  const removeBadge = item => {
    const updatedBadges = badges.filter(badge => badge !== item);
    setBadges(updatedBadges);
  };

  const handleLocationSelect = item => {
    setLocationItem(item.name);
  };

  const toggleLocationModal = () => {
    setIsLocationModalVisible(!isLocationModalVisible);
  };

  const handleEducationSelect = item => {
    setSelectedItem(item.name);
  };

  const toggleEducationModal = () => {
    setIsEducationModalVisible(!isEducationModalVisible);
  };

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
  const handleUploads =()=>{
    navigation.navigate('uploads',{user:user})
  }
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
            setCvTxt(util.uploaded);
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
      setCvTxt(util.attachCv);
    } else {
      setCvTxt(util.uploaded);
    }
  }, []);

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
    userData.education = selectedItem;
    userData.skills = badges;
    userData.languages = selectedLanguages;
    userData.bio = bio;
    userData.location = locationItem;
    userData.cvUrl = cvUrl;

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
              viewGallery={handleUploads}
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
            placeholder={util.bio}
            value={bio}
            onChangeText={setBio}
            isMultline={true}
            inputHolder="biography"
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
        <View style={styles.dropDownView}>
          <Text style={styles.select}>{util.from}</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={toggleLocationModal}>
            <Text style={styles.txt}>
              {locationItem !== null ? locationItem : 'Select Location'}
            </Text>
            <Icon
              name="chevron-down-sharp"
              size={20}
              color={GlobalStyles.colors.txtColor}
            />
          </TouchableOpacity>
        </View>
        <DropDownModal
          data={regions}
          handleSelect={handleLocationSelect}
          isModalVisible={isLocationModalVisible}
          toggleModal={toggleLocationModal}
          title="Region"
        />
        <View style={styles.dropDownView}>
          <Text style={styles.select}>{util.education}</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={toggleEducationModal}>
            <Text style={styles.txt}>
              {selectedItem !== null ? selectedItem : util.selectEducation}
            </Text>
            <Icon
              name="chevron-down-sharp"
              size={20}
              color={GlobalStyles.colors.txtColor}
            />
          </TouchableOpacity>
        </View>
        <DropDownModal
          data={LEVELS}
          handleSelect={handleEducationSelect}
          isModalVisible={isEducationModalVisible}
          toggleModal={toggleEducationModal}
          title={util.education}
        />

        <View style={styles.multSelect}>
          <Text style={styles.select}>{util.languages}</Text>

          <MultipleSelectList
            label={util.languages}
            labelStyles={{color: GlobalStyles.colors.txtColor}}
            setSelected={val => setSelectedLanguages(val)}
            placeholder={<Text style={styles.txt}>{util.select}</Text>}
            data={LANGUAGES}
            dropdownTextStyles={{color: GlobalStyles.colors.txtColor}}
            boxStyles={{
              borderColor: GlobalStyles.colors.border,
              borderWidth: 0.5,
            }}
            arrowicon={
              <Icon
                name="chevron-down"
                color={GlobalStyles.colors.txtColor}
                size={20}
              />
            }
            maxHeight={250}
            save="value"
            fontFamily="Medium"
            inputStyles={{color: GlobalStyles.colors.green}}
            badgeStyles={{
              backgroundColor: GlobalStyles.colors.colorPrimaryDark,
            }}
            notFoundText="language not found"
          />
        </View>

        <View style={styles.skillContainer}>

          <View style={styles.skillInputContainer}>
           
            <CustomEditInput value={skill}
            onChangeText={handleTextChange}
            inputHolder={util.addYourSkill}
            placeholder={util.skills}
             />
            <TouchableOpacity onPress={addBadge} style={styles.skillAddBtn}>
              <Icon name="add" color={GlobalStyles.colors.white} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.skillBadgeContainer}>
            {badges &&
              badges.map((badge, index) => (
                <TouchableOpacity
                  style={styles.skillBadge}
                  key={index}
                  onPress={() => removeBadge(badge)}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'left',
                      fontFamily: 'Medium',
                    }}>
                    {badge}
                  </Text>
                  <View style={styles.skillCancel}>
                    <Ent
                      name="cross"
                      size={15}
                      color={GlobalStyles.colors.white}
                    />
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>

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
          <>
            <View style={styles.resume}>
              <Text style={styles.select}>{util.resume}</Text>
            </View>
            <View style={styles.editContainer}>
              <CustomCvUpoadButton title={cvTxt} onPress={pickCvAndUpload} />
            </View>
          </>
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
  resume: {
    marginHorizontal: 25,
    marginTop: 20,
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
  dropDownView: {
    marginHorizontal: 25,
    marginVertical: 5,
  },
  multSelect: {
    marginHorizontal: 25,
    marginTop: 5,
  },
  dropdownTrigger: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  select: {
    fontSize: 16,
    fontFamily: 'Bold',
    color: GlobalStyles.colors.txtColor,
    textAlign: 'left',
    marginBottom: 5,
  },
  skillContainer: {
    marginHorizontal: 20,
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  skillInput: {
    flex: 1,
    borderColor: GlobalStyles.colors.border,
    borderRadius: 5,
    borderWidth: 0.5,
    fontSize: 14,
    height: 40,
    textAlign: 'left',
    color: GlobalStyles.colors.txtColor,
    paddingLeft: 10,
    marginRight: 10,
  },
  skillAddBtn: {
    borderRadius: 10,
    height: 40,
    width: 40,
    marginTop:24,
    backgroundColor: GlobalStyles.colors.blur,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillBadge: {
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  skillCancel: {
    backgroundColor: GlobalStyles.colors.blur,
    borderRadius: 100,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
