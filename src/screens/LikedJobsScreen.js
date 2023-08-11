import {StyleSheet, TouchableOpacity, View, RefreshControl} from 'react-native';
import React ,{useState,useEffect}from 'react'
import { useSelector } from 'react-redux'
import api from '../api/api'
import LikeJobItem from '../components/LikeJobItem';
import {GlobalStyles} from '../colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';


const LikedJobsScreen = ({route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const company = useSelector(state=>state.auth.company)
    const [jobs,setJobs] = useState([])
    const {userParam} = route.params
    let user = userParam



    const getLikedJobByUser = async ()=>{
        try {
            const response = await api.get(`/job/company/${company.id}/user/${user.id}`)
            setJobs(response.data)
        } catch (error) {
            console.error("Error fetching liked jobs:", error)

        }
    }

useEffect(()=>{
    getLikedJobByUser()
},[])

const handleRefresh = () => {
  setRefreshing(true);
  getLikedJobByUser()
  setRefreshing(false);
};

const handleView = item => {
  data = item;
  const param = user
  navigation.navigate('HomeStack', {screen: 'Details', params: {data,param}});
};

const renderItem = ({item}) => {

  return (
    <View style={styles.itemContainer}>
      <LikeJobItem item={item}/>
    </View>
  );
};

const renderHiddenItem = ({item}) =>{

 
  return( 
  <View style={styles.hiddenItem}>
    <View style={styles.hiddenLeft}>
      <TouchableOpacity >
        <Font name= "heart-o" size={35} color={ GlobalStyles.colors.red } />
      </TouchableOpacity>
    </View>

    <View style={styles.huddenRight}>
      <TouchableOpacity onPress={() => handleView(item)} >
        <Icon name="eye" size={35} color={GlobalStyles.colors.green} />
      </TouchableOpacity>
    </View>
  </View>
)};

  return (
    <View style={styles.container}>
      {jobs.length > 0 && (
        <SwipeListView
        style={styles.listContainer}
        data={jobs}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75} // Width of the hidden item view
        rightOpenValue={-75}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      )}
    </View>
  )
}

export default LikedJobsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
  },
  listContainer: {
    backgroundColor: GlobalStyles.colors.white,
    flex: 1,
    marginTop: 20,
  },

  itemContainer: {
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 1,
  },
  hiddenItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: GlobalStyles.colors.white,
  },
  hiddenLeft: {
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 5,
  },
  huddenRight: {
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 5,
  },
})