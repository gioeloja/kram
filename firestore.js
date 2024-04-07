import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, FieldValue } from "firebase/firestore"; 

const initializeUser = async (userID) => {
    try {
      // Check if user document already exists
      const userDocRef = doc(db, "users", userID);
      const userDoc = await getDoc(userDocRef)
  
      if (userDoc.exists()) {
        console.error('User document already exists');
        return;
      }
  
      // Create a new user document with provided userData
      await setDoc(userDocRef, {collections: []})
  
      console.log('User initialized successfully');
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };
  

const addCollectionToUser = async (userID, collectionInfo) => {
  try {
    // Check if user document exists
    const userDocRef = doc(db, "users", userID);
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      initializeUser(userID)
     
    }
    
    // Add collectionInfo to the user's collections array
    var curr_collection = userDoc.data()["collections"]
    curr_collection.push(collectionInfo)

    await updateDoc(userDocRef, {collections: curr_collection})
    
    console.log('Collection added to user successfully');
    return curr_collection
  } catch (error) {
    console.error('Error adding collection to user:', error);
    return []
  }
};

const retrieveCollections = async (userID) => {
    try {
      // Get user document
      const userDocRef = doc(db, "users", userID);
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        initializeUser(userID)
        return [];
      }
  
      // Retrieve collections from user document
      const userData = userDoc.data();
      const collections = userData.collections || [];
  
      console.log('Collections retrieved successfully:', collections);
      return collections;
    } catch (error) {
      console.error('Error retrieving collections:', error);
      return [];
    }
  };

const updateChecked = async (userID, collectionIndex, newChecked) => {
  try {
    // Get user document
    const userDocRef = doc(db, "users", userID);
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      initializeUser(userID)
      return;
    }

    // Retrieve collections from user document
    const userData = userDoc.data();
    var curr_collection = userDoc.data()["collections"]
    curr_collection[collectionIndex].checked = newChecked

    await updateDoc(userDocRef, {collections: curr_collection})
  } catch (error) {
    console.error('Error retrieving collections:', error);
  }
};

const updateSelected = async (userID, collectionIndex, newSelected) => {
  try {
    // Get user document
    const userDocRef = doc(db, "users", userID);
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      initializeUser(userID)
      return;
    }

    // Retrieve collections from user document
    const userData = userDoc.data();
    var curr_collection = userDoc.data()["collections"]
    curr_collection[collectionIndex].selected = newSelected

    await updateDoc(userDocRef, {collections: curr_collection})
  } catch (error) {
    console.error('Error retrieving collections:', error);
  }
};

export { initializeUser, addCollectionToUser, retrieveCollections, updateChecked, updateSelected};
