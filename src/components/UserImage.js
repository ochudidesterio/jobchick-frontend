import React from 'react';
import {View, Image} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const UserImage = ({user}) => {
  const getProgressPercentage = () => {
    const {firstName, lastName, email, phoneNumber, token, authUsername} = user;
    const progressProperties = [
      firstName,
      lastName,
      email,
      phoneNumber,
      token,
      authUsername,
    ];
    const nonEmptyProperties = progressProperties.filter(prop => prop);

    const percent =
      (nonEmptyProperties.length / progressProperties.length) * 100;

    return percent;
  };
  console.log('Percent', getProgressPercentage());
  // const getProgressPercentage = () => {
  //     const detailsArray = Object.values(user);
  //     const nonNullDetails = detailsArray.filter(detail => detail !== null && detail !== undefined);
  //     const percent = (nonNullDetails.length / detailsArray.length) * 100;

  //     return percent;
  //   };

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <AnimatedCircularProgress
        style={styles.progressCircle}
        progress={100}
        size={150}
        fill={getProgressPercentage()}
        thickness={8}
        width={3}
        tintColor="red">
        {() => (
          <Image
            source={require('../images/person.jpg')}
            style={styles.image}
          />
        )}
      </AnimatedCircularProgress>
    </View>
  );
};
export default UserImage;

const styles = {
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
};
