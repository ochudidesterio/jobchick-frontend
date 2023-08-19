import {StyleSheet, TouchableOpacity, View, RefreshControl} from 'react-native';
import React ,{useState,useEffect}from 'react'
import { useSelector } from 'react-redux'
import api from '../api/api'
import LikeJobItem from '../components/LikeJobItem';
import {GlobalStyles} from '../colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';


const LikedJobsScreen = ({route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const company = useSelector(state=>state.auth.company)
    const [jobs,setJobs] = useState([])
    const[ids,setIds] = useState([])
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

    const fetchLikeIds = async () => {
      try {
        const response = await api.get(`/likes/company/${company.id}`);
        console.log('comIDS', response.data);
        setIds(response.data)
      } catch (error) {}
    };

useEffect(()=>{
    getLikedJobByUser()
    fetchLikeIds()
},[])

const handleRefresh = () => {
  setRefreshing(true);
  getLikedJobByUser()
  fetchLikeIds()
  setRefreshing(false);
};

const handleView = item => {
  data = item;
  const param = user
  navigation.navigate('HomeStack', {screen: 'Details', params: {data,param}});
};
const handleMatch = async (jobId,value)=>{
  try {
    const res = await api.post(`/job/admin/like/${jobId}/${!value}`)
    handleRefresh()
  } catch (error) {
    
  }
}

const renderItem = ({item}) => {

  const likedJob = ids.find(
    job => job.userId === user.id && job.jobId === item.id,
  );

  const isLikedBack = likedJob && likedJob.likedBack;

  return (
    <View style={styles.itemContainer}>
      <LikeJobItem item={item} isGrey={!isLikedBack} />
    </View>
  );
};

const renderHiddenItem = ({item}) =>{

  const likedJob = ids.find(
    job => job.userId === user.id && job.jobId === item.id,
  );

  const isLikedBack = likedJob && likedJob.likedBack;
 
  return( 
  <View style={styles.hiddenItem}>
    <View style={styles.hiddenLeft}>
      <TouchableOpacity onPress={()=>handleMatch(likedJob.id,isLikedBack)} >
        <Icon name={ isLikedBack ? "checkmark-done-circle-sharp" : "checkmark-circle-outline"} size={35} color={ GlobalStyles.colors.red } />
      </TouchableOpacity>
    </View>

    <View style={styles.huddenRight}>
      <TouchableOpacity onPress={() => handleView(item)} >
        <Icon name="eye" size={35} color={GlobalStyles.colors.green} />
      </TouchableOpacity>
    </View>
  </View>
)};


// Sort jobs based on whether they have been liked back or not
const sortedJobs = [...jobs].sort((a, b) => {
  const aLikedJob = ids.find(
    job => job.userId === user.id && job.jobId === a.id,
  );
  const bLikedJob = ids.find(
    job => job.userId === user.id && job.jobId === b.id,
  );

  const aIsLikedBack = aLikedJob && aLikedJob.likedBack;
  const bIsLikedBack = bLikedJob && bLikedJob.likedBack;

  if (aIsLikedBack && !bIsLikedBack) {
    return -1; // a comes first
  } else if (!aIsLikedBack && bIsLikedBack) {
    return 1; // b comes first
  } else {
    return 0; // order remains the same
  }
});

  return (
    <View style={styles.container}>
      {jobs.length > 0 && (
        <SwipeListView
        style={styles.listContainer}
        data={sortedJobs}
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