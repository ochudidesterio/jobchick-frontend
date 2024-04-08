import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import RefreshModal from '../components/RefreshModal';
import {  TERMS_OF_SERVICE } from '../util/util';

const TermsOfServiceWebview = () => {
  const termsURL = TERMS_OF_SERVICE;
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
