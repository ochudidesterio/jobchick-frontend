import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';

const LikeJobItem = ({item}) => {
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
            <Icon name="location" size={20} color={GlobalStyles.colors.red} />
            <Text style={styles.company}>{item.region}</Text>
          </View>
          <Text style={styles.company}>{item.company.name}</Text>
        </View>
        <View>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View>
          <Text style={styles.company}>
            {item.level} | {item.type}
          </Text>
        </View>
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
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 3,
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 2,
    marginLeft: 3,
  },
  title: {
    color: GlobalStyles.colors.colorPrimaryDark,
    fontFamily: 'ExtraBold',
    textAlign: 'left',
  },

  headAvatar: {
    width: '100%',
    height: '100%',
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
  location: {
    flexDirection: 'row',
    marginRight:3
  },
});
