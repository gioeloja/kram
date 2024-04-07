import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
const logo = require('../assets/icon.png'); // Adjust the path according to your project structure

import { Image } from 'react-native';
const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // User signed in successfully
        setError('');
        console.log("Successful sign in")
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // User signed up successfully
        setError('');
        console.log("Successful register")
      })
      .catch((error) => {
        setError(error.message);
        console.log(auth)
        console.log(error.message)
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='bg-slate-800'>
            <View className='h-1/3 items-center justify-center'>
                {/* Placeholder Ionicon for the logo */}
                <Image source={logo} style={{ width: 220, height: 220 }}/>
                {/* Placeholder app name */}
                
            </View>
            <View className='bg-white h-2/3 rounded-t-[70%]'>
                <View className="flex-1 m-10">
                    <Text className="text-2xl font-bold mb-4 text-slate-800">Welcome</Text>
                    <TextInput
                        className='border-b-[1px] my-8 pb-2 border-gray-300 text-lg'
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}/>
                        
                    <TextInput
                        className='border-b-[1px] pb-2 border-gray-300 mb-8 text-lg'
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity className='items-end mb-7' onPress={handleSignUp}>
                        <Text className='font-semibold text-blue-700'>Sign Up</Text>
                    </TouchableOpacity>
                    <View className='items-center justify-center h-[50px] w-full'>
                        <TouchableOpacity className='w-1/2 h-full bg-slate-800 items-center justify-center rounded-full' onPress={handleSignIn}>
                            <Text className='text-white font-semibold text-xl'>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;
