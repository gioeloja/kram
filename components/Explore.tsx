import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addCollectionToUser } from '../firestore';
import { auth } from '../firebase';
import { runChatWithInput } from '../gemini';
const Explore = () => {
  const [modalVisible, setModalVisible] = useState(Array(8).fill(false));
  const [currentModalIndex, setCurrentModalIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [addingCollection, setAddingCollection] = useState(false)
  
  useEffect(() => {
    const currentUser = auth.currentUser
    setUser(currentUser.uid)
  }, []);
  const boxContentHeaders = [
    ["Cell Biology", "Genetics", "Ecology", "Evolution", "Anatomy and Physiology"],
    ["Our Solar System", "Stars and Galaxies", "Space Exploration", "Space Technology"],
    ["Physical Geography", "Human Geography", "Environmental Geography", "Cultural Geography"],
    ["Nutrition", "Exercise and Fitness", "Mental Health", "Personal Hygiene"],
    ["Ancient Civilizations", "Medieval Times", "Exploration and Discovery", "Revolutionary Periods"],
    ["Creative Writing", "Narrative Writing", "Descriptive Writing", "Persuasive Writing"],
    ["Fiction", "Non-fiction", "Poetry", "Drama"],
    ["Number Sense", "Algebra", "Geometry", "Statistics"]
  ];
  
  const boxContentBullets = [
    [
      ["Basics of cell structure and function.", "Cell division processes: mitosis and meiosis."],
      ["Heredity and inheritance patterns.", "DNA structure and its role in genetics."],
      ["Ecosystem components and interactions.", "Food chains, food webs, and energy flow."],
      ["Principles of natural selection.", "Evidence for evolution and human evolution."],
      ["Major body systems and their functions.", "Homeostasis and feedback mechanisms."]
    ],
    [
      ["Overview of planets and their characteristics.", "Earth's moon and its phases."],
      ["Types of stars and their life cycles.", "Galaxies and their classifications."],
      ["Milestones in space exploration.", "Rockets, satellites, and space stations."],
      ["How technology aids space exploration.", "Applications of space technology on Earth."]
    ],
    [
      ["Physical features of Earth.", "Climate zones and weather patterns."],
      ["Population distribution and settlement patterns.", "Cultural landscapes and regions."],
      ["Human impact on the environment.", "Conservation efforts and sustainability."],
      ["Languages, religions, and traditions of different regions.", "Globalization and its effects on cultures."]
    ],
    [
      ["Essential nutrients and their functions.", "Balanced diet and healthy eating habits."],
      ["Benefits of physical activity and exercise routines.", "Factors influencing mental well-being."],
      ["Stress management techniques.", "Importance of personal hygiene and cleanliness."],
      ["Preventive healthcare measures.", "Basic first aid procedures."]
    ],
    [
      ["Civilizations of Mesopotamia, Egypt, and the Indus Valley.", "Contributions of ancient Greece and Rome."],
      ["Feudalism, knights, and castles.", "The Black Death and its impact on Europe."],
      ["Voyages of exploration by Columbus, Magellan, and others.", "Discoveries and encounters with the New World."],
      ["American and French Revolutions.", "Industrial Revolution and its effects on society."]
    ],
    [
      ["Elements of storytelling.", "Character development and plot structure."],
      ["Creating engaging narratives.", "Using descriptive language and sensory details."],
      ["Techniques for persuading an audience.", "Crafting effective arguments and counterarguments."],
      ["Writing to influence opinions and actions.", "Call to action and conclusion strategies."]
    ],
    [
      ["Different genres and their characteristics.", "Elements of fiction writing: plot, setting, characters."],
      ["Facts and information presentation styles.", "Biographies, autobiographies, and memoirs."],
      ["Exploring emotions and experiences through verse.", "Forms of poetry: rhyme, meter, stanza."],
      ["Scriptwriting for stage and screen.", "Exploring themes and conflicts through drama."]
    ],
    [
      ["Understanding numbers and their relationships.", "Basic arithmetic operations: addition, subtraction, multiplication, division."],
      ["Algebraic expressions and equations.", "Linear and quadratic functions."],
      ["Geometric shapes, properties, and measurements.", "Solving geometric problems and proofs."],
      ["Data collection, organization, and interpretation.", "Probability and statistical analysis."]
    ]
  ];

  const boxHeaders = [
    "Biology",
    "Space Science",
    "Geography",
    "Health Education",
    "History",
    "Writing",
    "Reading",
    "Mathematics",
  ];

  const boxIcons = [
    "leaf", 
    "globe",
    "earth",  
    "medical", 
    "map",   
    "pencil", 
    "book", 
    "calculator", 
  ];

const boxColors = [
  "#FF6666", 
  "#FF9933", 
  "#FFCC66", 
  "#669966", 
  "#66CCCC", 
  "#6666FF", 
  "#CC66FF", 
  "#FF66FF", 
];

  const toggleModal = (index) => {
    setModalVisible((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
    setCurrentModalIndex(index);
  };
  const addTopicToCollections = async (index) => {
    setAddingCollection(true)
    console.log("adding to collection")
    // Prepare the new collection based on the selected topic
    const newCollectionName = boxHeaders[index]; // Using the topic name as the collection name
    console.log(JSON.stringify(boxContentBullets[index]))
    const generativeResponse = await runChatWithInput(JSON.stringify(boxContentBullets[index]));
    const newResponse = "[" + generativeResponse + "]";
  
    const responseArray = JSON.parse(newResponse);
    const newCollection = {
      name: newCollectionName,
      questions: responseArray,
      selected: Array.from({ length: responseArray.length }, () => 0),
      checked: Array.from({ length: responseArray.length }, () => false)
    };
    console.log(newCollection)
    // Assuming addCollectionToUser adds the collection and returns the updated collections array
    const updatedCollections = await addCollectionToUser(user, newCollection);
    setAddingCollection(false)
    if (updatedCollections) {
      // Here you might want to update state or give some feedback to the user
      console.log('Collection added successfully');
    } else {
      console.log('Failed to add collection');
    }
  };
  return (
      <View className="flex-row py-5 justify-center items-center bg-white-800 h-full">
        <View className="grid grid-cols-3 gap-4 items-center w-1/2 h-full">
          {[0, 1, 2, 3].map((index) => (
            <View className="w-4/5 h-1/5" key={index}>
              <TouchableOpacity
                style={{backgroundColor: boxColors[index]}} // Dynamically set background color
                className='w-full h-full justify-center items-center rounded-xl'
                onPress={() => toggleModal(index)}
              >
                {/* Render Ionicon above the header */}
                <Ionicons name={boxIcons[index]} size={48} color="white" />
                <Text className="text-white text-[17px] font-bold mt-3">{boxHeaders[index]}</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible[index]}
                onRequestClose={() => toggleModal(index)}
              >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <View className="flex-1 justify-end items-center">
                    <View className="bg-white w-full h-[80%] p-4 rounded-t-3xl relative">
                      <TouchableOpacity onPress={() => toggleModal(index)} className="absolute top-2 p-2 right-2">
                        <Ionicons name="close-circle" size={36} color="gray" />
                      </TouchableOpacity>
                      <Text className='font-bold text-slate-800 my-2 mb-6 text-[28px]'>Content Summary:</Text>
                      {boxContentHeaders[index].map((header, headerIndex) => (
                      <View key={headerIndex} style={{ marginBottom: 10 }}>
                        <Text className='font-bold text-lg'>{header}</Text>
                        {boxContentBullets[index][headerIndex].map((bullet, bulletIndex) => (
                          <Text key={bulletIndex} className='text-md my-1 ml-4'>{'\u2022'} {bullet}</Text>
                        ))}
                      </View>
                    ))}
                      <View className="absolute bottom-10 items-center h-[60px] justify-center left-0 right-0 flex justify-center">
                        <TouchableOpacity onPress={() => addTopicToCollections(currentModalIndex)} className='w-2/3' disabled={addingCollection}>
                          {addingCollection ? (
                            <View className="bg-slate-600 py-2 items-center h-full justify-center px-4 rounded-full">
                              <ActivityIndicator size="small" color="white" />
                            </View>
                          ) : (
                            <View className="bg-slate-600 py-2 items-center h-full justify-center px-4 rounded-full">
                              <Text className="text-white text-xl font-bold">Add to collections</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>

              </Modal>
            </View>
          ))}
        </View>
        <View className="grid grid-cols-3 gap-4 w-1/2 h-full items-center">
          {[4, 5, 6, 7].map((index) => (
            <View className="w-4/5 h-1/5" key={index}>
              <TouchableOpacity
                style={{backgroundColor: boxColors[index]}} // Dynamically set background color
                className='w-full h-full justify-center items-center rounded-xl'
                onPress={() => toggleModal(index)}
              >
                {/* Render Ionicon above the header */}
                <Ionicons name={boxIcons[index]} size={48} color="white" />
                <Text className="text-white text-[17px] font-bold mt-3">{boxHeaders[index]}</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible[index]}
                onRequestClose={() => toggleModal(index)}
              >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <View className="flex-1 justify-end items-center">
                    <View className="bg-white w-full h-[80%] p-4 rounded-t-3xl relative">
                      <TouchableOpacity onPress={() => toggleModal(index)} className="absolute top-2 p-2 right-2">
                        <Ionicons name="close-circle" size={36} color="gray" />
                      </TouchableOpacity>
                      <Text className='font-bold text-slate-800 my-2 mb-6 text-[28px]'>Content Summary:</Text>
                      {boxContentHeaders[index].map((header, headerIndex) => (
                      <View key={headerIndex} style={{ marginBottom: 10 }}>
                        <Text className='font-bold text-lg'>{header}</Text>
                        {boxContentBullets[index][headerIndex].map((bullet, bulletIndex) => (
                          <Text key={bulletIndex} className='text-md my-1 ml-4'>{'\u2022'} {bullet}</Text>
                        ))}
                      </View>
                    ))}
                      <View className="absolute bottom-10 items-center h-[60px] justify-center left-0 right-0 flex justify-center shadow-xl">
                        <TouchableOpacity onPress={() => addTopicToCollections(currentModalIndex)} className='w-2/3' disabled={addingCollection}>
                          {addingCollection ? (
                            <View className="bg-slate-600 py-2 items-center h-full justify-center px-4 rounded-full">
                              <ActivityIndicator size="small" color="white" />
                            </View>
                          ) : (
                            <View className="bg-slate-600 py-2 items-center h-full justify-center px-4 rounded-full">
                              <Text className="text-white text-xl font-bold">Add to collections</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </Modal>
            </View>
          ))}
        </View>
      </View>
  );
};

export default Explore;
