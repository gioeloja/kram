import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import SelectImage from './selectImage';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { retrieveCollections, addCollectionToUser } from '../firestore';
import { set } from 'firebase/database';
import { useScrollToTop } from '@react-navigation/native';
import { Alert } from 'react-native';
import { runChatWithInput } from '../gemini';

const Home = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [questionContext, setQuestionContext] = useState('');
  const [user, setUser] = useState(null);
  const [text, setText] = useState(''); // Use this state to store the text detected from the image
  const [collections, setCollections] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false);

  // const collections = [
  //   { name: "Collection 1", questions: [{ question: "Who is Gio?", answer1: "Emmitt", answer2: "Emitt", answer3: "Emmit", answer4: "Emit", correct: 3 }] },
  //   { name: "Collection 2", questions: [{ question: "Who is emmitt?", answer1: "Emmitt", answer2: "Emitt", answer3: "Emmit", answer4: "Emit", correct: 2  }, { question: "Who is Josh?", answer1: "Emmitt", answer2: "Emitt", answer3: "Emmit", answer4: "Emit", correct: 1  }] }
  // ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user.uid); 
      console.log(collections)
      const userCollections = await retrieveCollections(user.uid)
      setCollections(userCollections)
      console.log(collections)
    });

    return unsubscribe;
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  // Inside the Home component
  const handleImageText = (imageText: string) => {
    setQuestionContext(imageText)
  };

  const handleGenerate = async () => {
    if (collectionName.trim() === '') {
      Alert.alert('Error', 'Please enter a collection name.');
      return;
    }
    else if (questionContext.trim() === '') {
      Alert.alert('Error', 'Please scan an image or enter context manually.');
    }
    setIsGenerating(true); // Start loading
    const generativeResponse = await runChatWithInput(questionContext);
    const newResponse = "[" + generativeResponse + "]";
  
    const responseArray = JSON.parse(newResponse);
    const newCollection = {
      name: collectionName,
      questions: responseArray,
      selected: Array.from({ length: responseArray.length }, () => 0),
      checked: Array.from({ length: responseArray.length }, () => false)
    };
    const currCol = await addCollectionToUser(user, newCollection);
    console.log('New collection added to Firestore for user:', user);
    if (currCol){
      setCollections(currCol)
    }
    setIsGenerating(false); // End loading
    setCollectionName('');
    setQuestionContext('');
    setIsModalVisible(false);
    
  };
  
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <View className='flex h-full bg-white-800 p-3 shadow-md'>
          <View className='p-2 justify-center mb-8'>
            <Text className='font-bold text-2xl'>Browse Collections</Text>
          </View>
          <View className='bg-sky-500 flex-row h-[100px] mb-7 rounded-2xl'>
              <View className='w-full h-full rounded-2xl'>
                <TouchableOpacity className='w-full h-full items-center justify-center' onPress={toggleModal}>
              <Text className='font-bold text-xl text-white'>
                Create new collection
              </Text>
            </TouchableOpacity>
            </View>
          </View>
            {collections != null ? (
              collections.map((collection, index) => (
                <View key={index} className='flex-row bg-white h-[80px] mb-4 rounded-2xl'>
                  <View className='w-2/3 p-4 justify-center'>
                    <Text className='font-bold text-xl text-gray-600'>{collection.name}:</Text>
                  </View>
                  <TouchableOpacity className='w-1/3 items-center bg-gray-100 rounded-2xl justify-center' onPress={() => navigation.navigate('Collection', { data: collection, collectionIndex: index })}>
                    <Text className='font-semibold text-lg text-gray-600'>View</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="flex items-center justify-center h-full">
                {/* Replace this with your loading circle component */}
                <ActivityIndicator size="large"/>
              </View>
            )}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View  className="flex-1 justify-end items-center bg-opacity-10" >
            <View className="bg-white w-full h-[80%] p-4 rounded-t-3xl relative">
              <TouchableOpacity onPress={toggleModal} className="absolute top-2 p-2 right-2">
                <Ionicons name="close-circle" size={36} color="gray" />
              </TouchableOpacity>
              <Text className="font-bold text-2xl p-1 mb-4">New collection</Text>
              <View className="flex flex-row items-center mt-5 h-[50px] mb-4">
                <TextInput
                  placeholder="Enter collection name..."
                  placeholderTextColor="#999"
                  className="flex-1 border-gray-400 text-lg h-full rounded-xl bg-gray-300 py-2 px-4"
                  value={collectionName}
                  onChangeText={text => setCollectionName(text)}
                />
              </View>
              <View>
                <Text className="font-bold text-xl mt-4 mb-2">Content:</Text>
                <TouchableOpacity className="bg-sky-500 rounded-lg py-2 h-[50px] px-4 mb-4">
                  <ActionSheetProvider>
                    <SelectImage handleImageTextFunc={handleImageText} />
                  </ActionSheetProvider>
                </TouchableOpacity>
                <View className='h-1/2'>
                  <TextInput
                    placeholder="Enter question context..."
                    placeholderTextColor="#999"
                    value={questionContext}
                    onChangeText={text => setQuestionContext(text)}
                    className="flex-1 border-gray-400 h-full rounded-xl text-lg bg-gray-300 py-2 px-4"
                    multiline={true}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={handleGenerate}
                className="bg-slate-700 rounded-lg py-2 px-4 absolute rounded-full bottom-10 m-5 left-4 right-4"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-white font-bold text-lg text-center">Generate</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

    </ScrollView>
  );
};

export default Home;
