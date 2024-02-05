import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import api from '../api/api';

const PaymentScreen = ({ route }) => {
  const { data, userId, amount } = route.params;
  const [user, setUserId] = useState(userId);
  const [price, setPrice] = useState(amount);
  const [apiCallInitiated, setApiCallInitiated] = useState(false);
  const navigation = useNavigation()
  const navStateChange = (navState) => {
    const { title, url } = navState;
    console.log("STATE", navState);
    console.log("URL", url);

    if (title === "Success" && !apiCallInitiated) {
      setApiCallInitiated(true);

      let splitUrl = url.split('?');
      let splitToDetails = splitUrl[1].split('&');
      let token = splitToDetails[0].replace("token=", "");
      console.log("Token", token);
      console.log("User", user);
      console.log("Price", price);

      try {
        api.post(`/paypal/capture?token=${token}&userId=${user}&amount=${price}`)
          .then((res) => {
            console.log("PayResponse", res.data);
            if(res.data.status === "success"){
              setTimeout(() => {
                navigation.navigate("Settings");
              }, 2000);
            }
          })
          .catch(e => console.log("Error processing the payment", e));
      } catch (error) {
        // Handle error
      }
    }

    if(title === "Cancelled"){
      setTimeout(() => {
        navigation.navigate("Settings");
      }, 2000);
    }
  };

  const Loading = () => {
    return (
      <View style={styles.load}>
        <Image
          style={styles.paypal}
          resizeMode="contain"
          source={require('../images/paypal.png')}
        />
      </View>
    );
  };

  return (
    <WebView
      startInLoadingState={true}
      onNavigationStateChange={navStateChange}
      renderLoading={() => <Loading />}
      source={{ uri: data.redirectUrl }}
    />
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  load: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paypal: {
    height: 300,
    width: 300,
  },
});
