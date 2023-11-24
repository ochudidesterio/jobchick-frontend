import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import RefreshModal from '../components/RefreshModal';

const TermsOfServiceWebview = () => {
  const termsURL = 'https://sams-sales.com/index.php/privacy-policy';
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <WebView
        source={{uri: termsURL}}
        style={{flex: 1}}
        onLoad={() => setIsLoading(false)}
      />
      <RefreshModal isRefreshing={isLoading} />
    </>
  );
};

export default TermsOfServiceWebview;

const styles = StyleSheet.create({});
