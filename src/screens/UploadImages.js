import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GlobalStyles} from '../colors';
import {storageRef, storage} from '../../firebase-config.js';
import {launchImageLibrary} from 'react-native-image-picker';
import {getDownloadURL, uploadBytes} from 'firebase/storage';
import CustomButton from '../components/CustomButton';
import api from '../api/api';
import { useSelector } from 'react-redux';
import {async} from '@firebase/util';
import getLanguageObject from '../util/LanguageUtil';

const UploadImages = ({route}) => {
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const [imageUris, setImageUris] = useState(Array(6).fill(null));
  const {user} = route.params;
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 1000000);
  }
  const getUserImages = async () => {
    try {
      const response = await api.get(`/gallery/get/${user.id}`);
      console.log('Images', response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Extract image URLs from the response
        const imageUrls = response.data.map(image => image.url);

        // Create an array with exactly 6 elements, filling missing ones with null
        const filledImageUrls = new Array(6).fill(null);
        for (let i = 0; i < imageUrls.length; i++) {
          filledImageUrls[i] = imageUrls[i];
        }

        // Update the imageUris state with the filledImageUrls
        setImageUris(filledImageUrls);
      } else {
        // If response.data is empty, set imageUris to an array of 6 null values
        setImageUris(new Array(6).fill(null));
      }
    } catch (error) {
      console.log('Error fetching User Images', error);
    }
  };

  useEffect(() => {
    getUserImages();
  }, []);

  const pickPhoto = async index => {
    const allUrlsNotNull = imageUris.every(uri => uri !== null);
    if (allUrlsNotNull) {
      // Display a toast message
      ToastAndroid.show(
        util.maxSelection,
        ToastAndroid.SHORT,
      );
    } else {
      try {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 1,
        });

        if (!result.didCancel && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          try {
            setUploadingIndex(index);
            const url = await uploadImageToFirebase(imageUri);
            if (url) {
              const updatedImageUris = [...imageUris];
              updatedImageUris[index] = url;
              setImageUris(updatedImageUris);
            }
          } catch (error) {
            console.log(error);
          } finally {
            setUploadingIndex(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const uploadImageToFirebase = async imageUri => {
    try {
      const randomNumber = generateRandomNumber();
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reference = storageRef(
        storage,
        `gallery/${randomNumber}/${user.firstName}`,
      );

      const snapshot = await uploadBytes(reference, blob);
      const url = await getDownloadURL(snapshot.ref);

      console.log('Upload successful');
      return url;
    } catch (error) {
      console.log('Error uploading image:', error);
      return null;
    }
  };
  const uploadUrls = async () => {
    const validUrls = imageUris.filter(uri => uri !== null);
    console.log('Valid URLs:', validUrls);
    if (validUrls.length > 0) {
      try {
        const response = await api.post(`/gallery/save/${user.id}`, validUrls);
        console.log('Response', response.data);
      } catch (error) {
        console.log('Error saving images', error);
      }
    }
  };

  const deleteImage = async index => {
    // Get the URL of the image to be deleted
    const imageUrlToDelete = imageUris[index];

    if (imageUrlToDelete) {
      Alert.alert(
        util.delImage,
        util.delImageConfirmation,
        [
          {
            text: util.cancel,
            style: 'cancel',
          },
          {
            text: util.del,
            onPress: async () => {
              try {
                const delData = {
                  name: imageUrlToDelete,
                };
                const response = await api.delete(`/gallery/delete`, {
                  data: delData,
                });
                if (response.data === 'deleted') {
                  // Update the state to remove the deleted image URL
                  const updatedImageUris = [...imageUris];
                  updatedImageUris[index] = null;
                  setImageUris(updatedImageUris);

                  console.log('Image deleted successfully');
                }
              } catch (error) {
                console.log('Error deleting image:', error.message);
                // Handle the error, e.g., show a toast or alert with the error message
              }
            },
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getUserImages();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <Text style={styles.title}>{util.myUploads}</Text>
      <View style={styles.gridContainer}>
        {imageUris.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            onPress={() => pickPhoto(index)}
            onLongPress={() => {
              if (uri) {
                console.log('Image URL:', uri);
                deleteImage(index);
              }
            }}>
            {uploadingIndex === index ? (
              <Text>{util.uploading}...</Text>
            ) : uri ? (
              <Image source={{uri}} style={styles.image} />
            ) : (
              <Text style={styles.txt}>{util.selectAnImage}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.btnContainer}>
        <CustomButton title={util.saveYourImages} onPress={uploadUrls} />
      </View>
    </ScrollView>
  );
};

export default UploadImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: GlobalStyles.colors.white,

  },
  title: {
    color: GlobalStyles.colors.txtColor,
    textAlign: 'center',
    fontFamily: 'Bold',
    fontSize: 16,
    marginVertical: 10,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop:19,
  },
  imageContainer: {
    width: '48%', // Adjust as needed to fit two columns
    aspectRatio: 1, // Makes the container square
    borderWidth: .5,
    borderRadius:10,
    height: 200,
    borderColor: GlobalStyles.colors.colorPrimaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: "#ececec",
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius:10,

  },
  btnContainer: {
    marginBottom: 40,
  },
  txt:{
    color:"#8e8e8e"
  }
});
