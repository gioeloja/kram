import React from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Settings = () => {
  return (
    <View className='flex items-center bg-white-800 h-full'>
      <View className='w-full flex-row  items-center justify-between h-[100px]'>
        <TouchableOpacity className='flex-row w-full  border-b-2 border-w-3/4 border-gray-300 justify-between h-full px-4'>
          <View className='flex-row items-center'>
            <Ionicons name="person" size={36} color="gray" />
            <Text className='text-[24px] text-gray-600 mx-5'>
              Account
            </Text>
          </View>
          <View className='flex-row items-center'>
            <Ionicons name="arrow-forward" size={36} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
      <View className='w-full flex-row  items-center justify-between h-[100px]'>
        <TouchableOpacity className='flex-row w-full  border-b-2 border-w-3/4 border-gray-300 justify-between h-full px-4'>
          <View className='flex-row items-center'>
            <Ionicons name="notifications" size={36} color="gray" />
            <Text className='text-[24px] text-gray-600 mx-5'>
              Notifications
            </Text>
          </View>
          <View className='flex-row items-center'>
            <Ionicons name="arrow-forward" size={36} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
      <View className='w-full flex-row  items-center justify-between h-[100px]'>
        <TouchableOpacity className='flex-row w-full  border-b-2 border-w-3/4 border-gray-300 justify-between h-full px-4'>
          <View className='flex-row items-center'>
            <Ionicons name="information-circle" size={36} color="gray" />
            <Text className='text-[24px] text-gray-600 mx-5'>
              About
            </Text>
          </View>
          <View className='flex-row items-center'>
            <Ionicons name="arrow-forward" size={36} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
