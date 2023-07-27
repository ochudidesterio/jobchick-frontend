import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';
import CircularImageView from '../components/CircularImageView';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/Fontisto';
import {useDispatch} from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import UserInterests from '../components/UserInterests';
import api from '../api/api';
import {updateUser} from '../store/slices/authSlice';
import UserSkills from '../components/UserSkills';

const ProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const dispatch = useDispatch();
  const handleEditPress = () => {
    navigation.navigate('editProfile');
  };
  const handleAddInterest = () => {
    navigation.navigate('interests');
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Perform the necessary data fetching or refreshing operations here
    await fetchUserInterests(user.id);
    setRefreshing(false);
  };

  const [interests, setInterests] = useState([]);

  const fetchUserInterests = async id => {
    try {
      const res = await api.get(`/category/get/interests/${id}`);
      console.log(res.data);
      if (res.status === 200) {
        setInterests(res.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserInterests(user.id);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(`/user/${user.id}`);
        dispatch(updateUser(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [user.id]);
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.holder}>
        <View style={styles.imageConainer}>
          <CircularImageView
            icon="pencil"
            imageSource={
              user.profileImage !== null
                ? {uri: user.profileImage}
                : require('../images/person.jpg')
            }
            onPress={handleEditPress}
            user={user}
          />
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameLeft}>
            ({user.age == null ? 0 : user.age})
          </Text>
          <Text style={styles.name}>
            {user.firstName === null || user.lastName === null
              ? user.authUsername
              : user.firstName + ' ' + user.lastName}
          </Text>
          <View style={styles.dotContainer}></View>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{user.bio !== null ? user.bio : ""}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Font name="phone" size={15} color={GlobalStyles.colors.white} />
          </View>
          <Text style={styles.text}>{util.phonenumber}</Text>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Icon name="mail" size={15} color={GlobalStyles.colors.white} />
          </View>
          <Text style={styles.text}>{util.email}</Text>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.email}</Text>
        </View>
        <View style={styles.line} />

        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="person-circle-outline"
              size={15}
              color={GlobalStyles.colors.white}
            />
          </View>
          <Text style={styles.text}>{util.username}</Text>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.authUsername}</Text>
        </View>

        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="book"
              size={15}
              color={GlobalStyles.colors.white}
            />
          </View>
          <Text style={styles.text}>Education</Text>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.education}</Text>
        </View>
        
        {/* proffession */}
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="briefcase"
              size={15}
              color={GlobalStyles.colors.white}
            />
          </View>
          <Text style={styles.text}>{util.proffesion}</Text>
        </View>
        <View style={styles.telephone}>
          <Text style={styles.txtItem}>{user.proffession}</Text>
        </View>
              {/* user langs */}
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="language"
              size={15}
              color={GlobalStyles.colors.white}
            />
          </View>
          <Text style={styles.text}>Languages</Text>
        </View>
        <View style={styles.telephone}>
          <UserSkills skills={user.languages} />
        </View>
        {/* skills */}
        <View style={styles.line} />
        <View style={styles.teleContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name="checkmark-done-sharp"
              size={15}
              color={GlobalStyles.colors.white}
            />
          </View>
          <Text style={styles.text}>Skills</Text>
        </View>
        <View style={styles.telephone}>
          <UserSkills skills={user.skills} />
        </View>

        {/* interests */}
        <View style={styles.line} />

        <View style={styles.interest}>
          <Text style={[styles.text, {fontSize: 24}]}>{util.interests}</Text>
          <TouchableOpacity
            onPress={handleAddInterest}
            style={styles.addInterest}>
            <Icon name="add" size={24} color={GlobalStyles.colors.white} />
          </TouchableOpacity>
        </View>
        <UserInterests interests={interests} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: GlobalStyles.colors.white,
  },
  holder: {
    height: 200,
  },
  imageConainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dotContainer: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.colors.green,
    marginTop: 3,
  },

  name: {
    color: GlobalStyles.colors.txtColor,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'ExtraBold',
    paddingVertical: 15,
  },
  nameLeft: {
    color: GlobalStyles.colors.colorPrimaryLight,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'ExtraBold',
  },
  details: {
    flex: 2,
  },
  line: {
    height: 1,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.edit,
  },
  teleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginLeft: 20,
    flexWrap: 'wrap',
  },

  interest: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addInterest: {
    backgroundColor: GlobalStyles.colors.edit,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    padding: 2,
  },
  text: {
    color: GlobalStyles.colors.txtColor,
    fontSize: 16,

    marginLeft: 10,
    fontFamily: 'Bold',
  },
  bio:{
    color: GlobalStyles.colors.txtColor,
    fontSize: 16,
    textAlign:"justify",
    fontFamily: 'SemiBold',

  },
  bioContainer:{
    marginHorizontal:20
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
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  txtItem: {
    color: GlobalStyles.colors.txtColor,
    marginLeft: 25,
    fontFamily: 'Medium',
  },
});
