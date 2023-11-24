import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { GlobalStyles } from '../colors';
import Ent from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';


const DropDownModal = ({
  isModalVisible,
  toggleModal,
  data,
  handleSelect,
  title,
}) => {

  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleModal}>
      <View style={styles.modalContainer}>
        <View style={styles.titleConatiner}>
        <Text style={styles.title}>{title} {util.options}</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.close}>
        <Ent name="cross" size ={30} color={GlobalStyles.colors.white} />

        </TouchableOpacity>

        </View>
        <View style={styles.modalContent}>
          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  handleSelect(item);
                  toggleModal(); // Close the modal when a category is selected
                }}>
                <Text style={styles.txt}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // This positions the modal at the bottom
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '50%', // Adjust this value as needed
  },
  dropdownItem: {
    borderWidth: 0.5,
    borderColor: GlobalStyles.colors.colorPrimaryLight,
    backgroundColor: GlobalStyles.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 2,
    
  },
  txt: {
    color: GlobalStyles.colors.txtColor,
    textAlign: 'left',
  },
  title: {
    fontSize: 18,
    fontFamily: 'SemiBold',
    textAlign: 'left', // Center the title
    color: GlobalStyles.colors.white,
    marginLeft:16,
    

  },
  titleConatiner:{
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical:10,
    flexDirection:"row"
    
  },
  close:{
    backgroundColor: GlobalStyles.colors.blur,
    borderRadius: 100,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default DropDownModal;
