import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import RefreshModal from '../components/RefreshModal';
import { PRIVACY_POLICY } from '../util/util';


const PrivacyPolicyWebview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const privacyPolicyURL = PRIVACY_POLICY
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
