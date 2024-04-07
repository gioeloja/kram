import React, { useState } from 'react';
import { Button, Alert, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';

// Import the helper function from ImgProcessing.js (make sure the path matches your structure)
import { processImageWithVisionApi } from './imgProcessing';

import { runChatWithInput } from '../gemini';

const SelectImage = ( {handleImageTextFunc} ) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [isLoading, setIsLoading] = useState(false);
  const openImagePickerAsync = async (useCamera: boolean) => {
    let permissionResult;

    if (useCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Allow access in settings.');
      return;
    }

    let pickerResult = await (useCamera ? ImagePicker.launchCameraAsync({
      base64: true,
    }) : ImagePicker.launchImageLibraryAsync({
      base64: true,
    }));

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets[0].base64) {
      setIsLoading(true); // Start loading
      console.log("processing image")
      // Pass the base64 string to the processImageWithVisionApi function
      processImageWithVisionApi(pickerResult.assets[0].base64)
        .then(detectedText => {
          setIsLoading(false); // Start loading
          console.log('Vision API Result:', detectedText);
          // Pass the detected text back to the Home component via onAIResponse
          handleImageTextFunc(detectedText);
        })
        .catch(error => {
          setIsLoading(false); // Start loading
          console.error('Error processing image with Vision API:', error);
        });
    }
  };

  const onSelectImagePress = () => {
    const options = ['Camera Roll', 'Take Picture', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          openImagePickerAsync(false);
        } else if (buttonIndex === 1) {
          openImagePickerAsync(true);
        }
    });
  };

  return (
    
    <View className="w-full h-full items-center justify-center">
    {isLoading ? (
      <ActivityIndicator size="medium" color="#dbdbff" /> // You can adjust the color as needed
    ) : (
      <TouchableOpacity className="w-full h-full items-center justify-center" onPress={onSelectImagePress}>
        <Text className="font-bold text-xl text-white">
          Scan Image
        </Text>
      </TouchableOpacity>
    )}
  </View>
);
};

export default SelectImage;