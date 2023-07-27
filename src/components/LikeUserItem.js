import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';

const LikeUserItem = ({item, isGrey}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.profileImage !== null
              ? {uri: item.profileImage}
              : require('../images/person.jpg')
          }
          style={styles.headAvatar}
          resizeMode="contain"
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.item}>
          <View style={styles.location}>
            <Icon
              name="location"
              size={20}
              color={
                isGrey ? GlobalStyles.colors.blur : GlobalStyles.colors.red
              }
            />
            <Text style={[styles.company, isGrey && styles.greyText]}>
              {item.location}
            </Text>
          </View>
          <Text style={[styles.company, isGrey && styles.greyText]}>
            {item.proffession}
          </Text>
        </View>
        <View>
          <Text style={[styles.title, isGrey && styles.greyText]}>
            {item.firstName === null && item.lastName === null
              ? item.authUsername
              : item.firstName + ' ' + item.lastName}
          </Text>
        </View>
        <View>
          <Text style={[styles.company, isGrey && styles.greyText]}>
            {item.skills && item.skills.length > 0 ? (<>
            {item.skills.join('|')}
            </>):""}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LikeUserItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 3,
    height: 100,
    backgroundColor: GlobalStyles.colors.white,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 3,
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 2.5,
    marginLeft: 3,
  },
  title: {
    color: GlobalStyles.colors.colorPrimaryDark,
    fontFamily: 'ExtraBold',
    textAlign: 'left',
  },

  headAvatar: {
    width: '100%',
    height: '50%',
  },
  item: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  company: {
    fontFamily: 'Medium',
    color: GlobalStyles.colors.txtColor,
    textAlign: 'left',
    fontSize: 13,
  },
  greyText: {
    color: GlobalStyles.colors.blur, // Change the text color to grey
  },

  location: {
    flexDirection: 'row',
    marginRight: 3,
  },
});
