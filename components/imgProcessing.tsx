import {VISION_API_KEY} from "@env"

const callVisionApi = async (imageBase64) => {
  const apiKey = VISION_API_KEY;
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
 
  const base64Formatted = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

  const body = JSON.stringify({
    requests: [
      {
        image: {
          content: base64Formatted,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
          },
        ],
      },
    ],
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });
  
  // Check if the response was not ok to throw a more detailed error
  if (!response.ok) {
    const errorBody = await response.text(); // Or .json() if the error response is JSON
    throw new Error(`Vision API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }
  
  return await response.json();
}

export const processImageWithVisionApi = async (imageBase64) => {
  try {
    const visionResponse = await callVisionApi(imageBase64);
    // Extract text or any other relevant information from the Vision API response
    const detectedText = visionResponse.responses[0].fullTextAnnotation.text;
    console.log(detectedText)
    return detectedText; // Or return the whole response for further processing
  } catch (error) {
    console.error('Error calling Vision API:', error);
    throw error; // Rethrow or handle error as needed
  }
};
