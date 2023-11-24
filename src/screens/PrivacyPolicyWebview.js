import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import RefreshModal from '../components/RefreshModal';

const PrivacyPolicyWebview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const privacyPolicyURL = 'https://bga-k.com/';
  return (
    <>
     
      <WebView
        source={{uri: privacyPolicyURL}}
        style={{flex: 1}}
        onLoad={() => setIsLoading(false)}
      />
      <RefreshModal isRefreshing={isLoading} />
    </>
  );
};

export default PrivacyPolicyWebview;

const styles = StyleSheet.create({});
