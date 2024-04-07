import React, { useState, useCallback, useEffect } from 'react';
import {View, Text, TouchableOpacity, Modal } from 'react-native';
import Question from './QuestionPage';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import SelectImage from './selectImage';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../firebase';
import { retrieveCollections } from '../firestore';


const Collection = ({ navigation, route }) => {
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  const toggleSummaryModal = () => {
    setIsSummaryModalVisible(!isSummaryModalVisible);
  };
  const [data, setData] = useState(route.params.data);
  const collectionIndex  = route.params.collectionIndex;

  useEffect(() => {
    const currentUser = auth.currentUser
    setUser(currentUser.uid)
  }, []);

  const handleFocus = useCallback(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.log('User is null. Waiting for authentication...');
          return; // Wait for user authentication
        }
        //console.log(user)
        const collections = await retrieveCollections(user);
        setData(collections[collectionIndex]);
        console.log('Collection screen is focused'); // For demonstration
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [user]);
  
  useFocusEffect(handleFocus);
  
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <View className='flex h-full bg-white-800 p-3 shadow-md'>
          <View className='p-2 mb-8'>
            <Text className='font-bold text-2xl'>{data.name}</Text>
          </View>
          <View className='flex-row h-[100px] mb-7'>
            <View className='flex-row w-full h-full rounded-2xl justify-center'>
              <TouchableOpacity className='bg-sky-500 w-[45%] mr-2 h-full items-center justify-center rounded-2xl' onPress={toggleSummaryModal}>
                <Text className='font-bold text-xl text-white'>
                  Summary
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className='bg-sky-500 w-[45%] ml-2 h-full items-center justify-center rounded-2xl'
              onPress={() => navigation.navigate('Question', { questions: data.questions, collIndex: collectionIndex, currentIndex: 0, checked: data.checked, selected: data.selected })}>
                <Text className='font-bold text-xl text-white'>
                  Practice
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {data.questions.map((question, index) => (
            <View key={index} className='flex-row bg-white h-20 mb-4 rounded-2xl '>
              <View className='flex flex-row items-center w-2/3 p-4'>
                <Text className='font-bold text-xl text-gray-600'>Question {index + 1}:</Text>
                {data.checked[index] && data.questions[index].correct === data.selected[index] ? (
                  <View className='mx-5'>
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  </View>
                ) : (
                  data.checked[index] && (
                    <View className='mx-5'>
                      <Ionicons name="close-circle" size={24} color="red" />
                    </View>
                  )
                )}
              </View>
              <TouchableOpacity className='w-1/3 items-center bg-gray-100 rounded-2xl justify-center' onPress={() => navigation.navigate('Question', { questions: data.questions, collIndex: collectionIndex, currentIndex: index, checked: data.checked, selected: data.selected })}>
                <Text className={`font-semibold text-lg text-gray-600`}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSummaryModalVisible}
        onRequestClose={() => {
          setIsSummaryModalVisible(!isSummaryModalVisible);
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View  className="flex-1 justify-end items-center bg-opacity-10" >
            <View className="bg-white w-full h-[80%] p-4 rounded-t-3xl relative">
              <TouchableOpacity onPress={toggleSummaryModal} className="absolute top-2 p-2 right-2">
                  <Ionicons name="close-circle" size={36} color="gray" />
                </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default Collection;
