import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React,{useState} from 'react';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ParagraghView from '../components/ParagraghView';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import RNFetchBlob from 'rn-fetch-blob';
import Permissions from 'react-native-permissions';
import {Alert} from 'react-native';
import RefreshModal from '../components/RefreshModal';



const UserCard = ({user}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const showUserDetails = () => {
    let userParam = user;
    navigation.navigate('UserDetails', {userParam});
  };
 

  const downloadPDF = async () => {
    setIsRefreshing(true);
    try {
      const {dirs} = RNFetchBlob.fs;
      const downloadPath = `${dirs.DownloadDir}/`;

      const isFileExists = await RNFetchBlob.fs.exists(
        `${downloadPath}${user.firstName}.pdf`,
      );

      if (isFileExists) {
        // Append a timestamp to the filename for uniqueness
        const timestamp = new Date().getTime();
        const uniqueFilename = `${user.firstName}_${timestamp}.pdf`;

        await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: uniqueFilename,
            path: downloadPath + uniqueFilename,
          },
        }).fetch('GET', `${user.cvUrl}`);
        setIsRefreshing(false)
        Alert.alert("Download","Download complete")

      } else {
        // File doesn't exist, proceed with regular download
        const response = await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: `${user.firstName}.pdf`,
            path: downloadPath + `${user.firstName}.pdf`,
          },
        }).fetch('GET', `${user.cvUrl}`);

        setIsRefreshing(false)
        Alert.alert("Download","Download complete")
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setIsRefreshing(false)
    }
  };

  const downloadFile = async () => {
    try {
      const permissionStatus = await Permissions.request(
        'android.permission.WRITE_EXTERNAL_STORAGE',
      );

      if (permissionStatus === 'granted') {
        if (user.cvUrl !== null) {
          downloadPDF();
        } else {
          Alert.alert('No CV', 'User has not uploaded CV');
        }
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };
 

  return (
    <View style={styles.container}>
      {isRefreshing && <RefreshModal isRefreshing={isRefreshing} />}
      <View style={styles.stackContainer}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.profile}
            source={
              user.profileImage !== null
                ? {uri: user.profileImage}
                : require('../images/person.jpg')
            }
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity onPress={downloadFile} style={styles.cv}>
          <Text>{util.cv}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.namespace}>
        <View style={styles.name}>
          <Text style={styles.txtName}>
            {user && user.firstName !== null && user.lastName !== null
              ? user.firstName + ' ' + user.lastName + ' '
              : user.authUsername + ' '}
          </Text>
          <Text style={styles.txtAge}>
          {" "}({user.age !== null ? user.age : 0}){" "} 
          </Text>
        </View>
        <View style={styles.location}>
          <Icon name="location" size={18} color={GlobalStyles.colors.red} />

          <Text style={styles.txtLoc}>{user.location}</Text>
        </View>
      </View>
      <View style={styles.skillContainer}>
        {user.skills && user.skills.length > 0 ? (
          <Text style={styles.txt}>{user.skills.join(' | ')}</Text>
        ) : (
          <Text style={styles.txt}>No skills available</Text>
        )}
      </View>

      <View style={styles.bioContainer}>
        <ParagraghView paragraph={user.bio} />
      </View>
      <View style={styles.chevron}>
        <TouchableOpacity onPress={showUserDetails}>
          <Icon name={'chevron-down'} size={35} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.userBg,
    borderRadius: 15,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 10,
    width: '100%',
    //height: '70%',
    padding: 20,
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: GlobalStyles.colors.txtColor,
  },
  txtName: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'ExtraBold',
    fontSize: 17,
  },
  txtAge: {
    color: GlobalStyles.colors.colorPrimaryDark,
    fontFamily: 'ExtraBold',
    fontSize: 17,
  },
  txtLoc: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'SemiBold',
  },

  profile: {
    height: '100%',
    borderRadius:15,
    width: '100%', // Updated width to "100%"
  },
  stackContainer: {
    height: '45%',
    width: '100%',
  },
  imgContainer: {
    height: '100%',
    width: '100%',
    borderRadius:15,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items to the top-left
    position: 'relative', // Added position relative to enable positioning of the CV view
  },
  cv: {
    backgroundColor: GlobalStyles.colors.red,
    height: 30,
    width: '25%',
    borderRadius:15,
    justifyContent: 'center',
    alignItems: 'center',
    //  position: 'absolute', // Position the CV view absolutely
      top: '-100%', // Place it at the top
    // left: 0, // Place it at the left
  },
  namespace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  skillContainer: {
    width: '100%',
    marginBottom: 5,
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  name: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bioContainer: {
    marginTop: 5,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
 
});
