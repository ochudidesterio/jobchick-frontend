import React from 'react';
import { TouchableOpacity,  StyleSheet,View } from 'react-native';
import { GlobalStyles } from '../colors';
import Ent from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';


const DetailScreenActions = ({ nope, like, isTrue }) => {
  return (
   <View style={styles.conatiner}>
    <TouchableOpacity
        onPress={nope}
          style={[styles.button, {backgroundColor: GlobalStyles.colors.red}]}>
          <View style={[styles.holder, {width: 35, height: 35}]}>
            <Ent name="cross" size={30} color={GlobalStyles.colors.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={like}
          style={[styles.button, {backgroundColor: GlobalStyles.colors.green}]}>
          <View style={[styles.holder, {width: 35, height: 35}]}>
            <Icon name="heart" size={30} color={isTrue ? GlobalStyles.colors.red :GlobalStyles.colors.white} />
          </View>
        </TouchableOpacity>
   </View>
  );
};

const styles = StyleSheet.create({
  conatiner:{
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:"center"
  },
  button: {
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 50,
    padding: 7,
    elevation: 10,
    marginHorizontal:20,
    marginVertical:20
  },
  holder: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
});

export default DetailScreenActions;
