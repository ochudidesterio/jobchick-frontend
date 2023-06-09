import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GlobalStyles} from '../colors';

const CircularImageView = ({imageSource, onPress, icon}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={onPress}>
        <View>
          <Icon name={icon} size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <View style={styles.touchEnd}>
        <Text style={styles.touchEndTxt}>test</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.profile} resizeMode="cover" />
      </View>

      <View style={styles.touchBorder}>
        <Text style={styles.touchText}>Profile Progress, 24%</Text>
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
  imageContainer: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.hint,
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
    backgroundColor: GlobalStyles.colors.colorPrimaryLight,
    padding: 8,
    borderRadius: 30,
    top: 50,
  },
  touchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  touchEnd: {
    position: 'absolute',
    left: 120,
    bottom: 10,
    top: 35,
    justifyContent: 'center',
    alignItems: "flex-end",
    width: 90,
    paddingRight:10,
    height: 30,

    borderRadius: 50,
    backgroundColor: GlobalStyles.colors.red,
  },
  touchEndTxt: {
    color: GlobalStyles.colors.white,
    textAlign: 'right',
    fontFamily: 'Poppins-Bold',
  },
});
