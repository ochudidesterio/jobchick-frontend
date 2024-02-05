import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import RefreshModal from '../components/RefreshModal';
import { PRIVACY_POLICY } from '../util/util';

const TermsOfServiceWebview = () => {
  const termsURL = PRIVACY_POLICY;
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
