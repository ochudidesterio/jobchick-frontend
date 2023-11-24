import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';

const LikeJobItem = ({item, isGrey}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.company.logoUrl !== null
              ? {uri: item.company.logoUrl}
              : require('../images/google.png')
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
              {item.region}
            </Text>
          </View>
          <Text style={[styles.company, isGrey && styles.greyText]}>
            {item.company.name}
          </Text>
        </View>
        <View>
          <Text style={[styles.title, isGrey && styles.greyText]}>
            {item.title}
          </Text>
        </View>
        <View>
          <Text style={[styles.company, isGrey && styles.greyText]}>
            {item.level} | {item.type}
          </Text>
        </View>
       
            {item.status === "ACTIVE" ? 
            <View style={styles.status}>
              <Text style={[styles.open, isGrey && styles.greyText]}>open</Text>
              <Icon
          
              name="checkmark-done"
              size={11}
              color={
                isGrey ? GlobalStyles.colors.blur : GlobalStyles.colors.green
              }
            />
            </View> : 
            <View style={styles.status}>
            <Text style={[styles.closed, isGrey && styles.greyText]}>closed</Text>
            <Icon
          
              name="close-circle"
              size={11}
              color={
                isGrey ? GlobalStyles.colors.blur : GlobalStyles.colors.red
              }
            />
          </View>
            }
         
      </View>
    </View>
  );
};

export default LikeJobItem;

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
  open: {
    color: GlobalStyles.colors.green,
    fontFamily: 'Small',
    textAlign: 'left',
    marginBottom:2,
    paddingRight:1,
    fontSize:11
  },
  closed: {
    color: GlobalStyles.colors.red,
    fontFamily: 'Small',
    textAlign: 'left',
    marginBottom:2,
    paddingRight:1,
    fontSize:11

  },
  status:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
