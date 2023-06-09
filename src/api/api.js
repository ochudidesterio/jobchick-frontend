import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';





// Function to set the Authorization header with the token
const setAuthorizationHeader = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token retrieved from AsyncStorage:', token);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.log('Error retrieving token from AsyncStorage:', error);
  }
};

// Interceptor to update the Authorization header when the token changes
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('token');
//     setAuthorizationHeader(token);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
setAuthorizationHeader()
const api = axios.create({
  baseURL: 'http://192.168.0.103:8080',
});

export default api;
