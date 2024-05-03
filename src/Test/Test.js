import { useState, useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from "@tensorflow-models/mobilenet";

function Test() {
  //Fun little easter egg: Changes the tab name when the user goes off of it
  let docTitle = 'Dog Breed Predictor';
  window.addEventListener('blur', () => {
    document.title = 'BARK BARK';
  })
  window.addEventListener('focus', () => {
    document.title = docTitle;
  })

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const uploadTrigger = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
  };

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await tf.loadLayersModel('https://raw.githubusercontent.com/TreyGower7/COE_379L_Projects/main/Project_4/simple_vgg/model.json');
      console.log(model)
      // const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  const detectImage = async () => {
    textInputRef.current.value = "";
    const predictThisPlz = imageRef.current;
    // const predictThisPlz = tf.ones([1, 128, 128, 3])
    const plzWork = tf.browser.fromPixels(predictThisPlz)

    console.log(plzWork)
    console.log(typeof plzWork)
    console.log(plzWork.shape)
    plzWork.size = 128*128*3;

    const reshape = tf.reshape(plzWork, [1, 128, 128, 3]);

    tf.reshape

    // console.log(reshape.shape)

    const results = await model.predict(reshape);
    setResults(results);
  };

  return (
    <div>
      <h1 className="header">Dog Breed Classifier</h1>
      <div className="inputField">
        <input
          type="file"
          accept="image/*"
          capture="camera"
          className="uploadInput"
          onChange={uploadImage}
          ref={fileInputRef}
        />
        <button className="uploadImage" onClick={uploadTrigger}>
          Upload Image
        </button>
        <span className="or">OR</span>
        <input
          type="text"
          placeholder="Enter Image URL"
          ref={textInputRef}
          onChange={handleInputChange}
        />
      </div>
      <div className="imageWrapper">
        <div className="imageContent">
          <div className="imageArea">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Image Preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
          {results.length > 0 && (
            <div className="imageResult">
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="accuracy">
                      Accuracy Level: {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Best Guess</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {imageUrl && (
          <button className="button" onClick={detectImage}>
            Detect Image
          </button>
        )}
      </div>
    </div>
  );
}

export default Test;