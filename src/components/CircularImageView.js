import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GlobalStyles} from '../colors';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useSelector} from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Permissions from 'react-native-permissions';

const CircularImageView = ({imageSource, onPress, icon, user, download}) => {
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const getProgressPercentage = () => {
    const {
      firstName,
      lastName,
      email,
      gender,
      profileImage,
      phoneNumber,
      authUsername,
      age,
      proffession,
    } = user;
    const progressProperties = [
      firstName,
      lastName,
      email,
      phoneNumber,
      authUsername,
      age,
      proffession,
      gender,
      profileImage,
    ];
    const nonEmptyProperties = progressProperties.filter(prop => prop);

    const percent =
      (nonEmptyProperties.length / progressProperties.length) * 100;

    return percent;
  };

  function generateRandomNumber() {
    return Math.floor(Math.random() * 1000000);
  }

  const downloadPDF = async () => {
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

        const response = await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: uniqueFilename,
            path: downloadPath + uniqueFilename,
          },
        }).fetch('GET', `${user.cvUrl}`);

        console.log('Download Status:', response.path());
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

        console.log('Download Status:', response.path());
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
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
      <TouchableOpacity style={styles.editButton} onPress={onPress}>
        <View>
          <Icon name={icon} size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      {user && user.role === 'USER' && (
        <TouchableOpacity onPress={downloadFile} style={styles.touchEnd}>
          <Text onPress={downloadFile} style={styles.touchEndTxt}>
            {user && user.role === 'USER' && 'CV'}
          </Text>
        </TouchableOpacity>
      )}
      {/* <UserImage user={user}/> */}
      {/* <View style={[styles.imageContainer]}> */}
      <AnimatedCircularProgress
        style={styles.progressCircle}
        progress={100}
        size={160}
        fill={getProgressPercentage()}
        thickness={5}
        width={4}
        tintTransparency={true}
        rotation={180}
        tintColor={GlobalStyles.colors.colorPrimaryDark}>
        {() => (
          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={[styles.profile]}
              resizeMode="cover"
            />
            <View style={styles.imageBorder} />
          </View>
        )}
      </AnimatedCircularProgress>

      {/* <View style={getMaskStyle()}> */}
      {/* <Image source={imageSource} style={styles.profile} resizeMode="cover" /> */}
      {/* </View> */}
      {/* </View> */}

      <View style={styles.touchBorder}>
        <Text style={styles.touchText}>
          {util.progress} {getProgressPercentage().toFixed()}%
        </Text>
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
  imageContainer: {
    width: 152,
    height: 152,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    elevation: 5,
    position: 'relative',
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  profile: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
    borderRadius: 100,
  },
  editButton: {
    position: 'absolute',
    right: 20,
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
    right: 130,
    bottom: 10,
    top: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 90,
    paddingLeft: 20,
    height: 30,

    borderRadius: 50,
    backgroundColor: GlobalStyles.colors.red,
    overflow: 'hidden',
  },
  touchEndTxt: {
    color: GlobalStyles.colors.white,
    textAlign: 'left',
    fontFamily: 'Bold',
  },
});
