import React, {useState, useEffect} from 'react';
import axios from 'axios'

export default function Upload() {
  const [fileInputState, setFileInputState] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [previewSource, setPreviewSource] = useState()
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };
  const previewFile = (file) => {
      const reader = new FileReader(); //built into JS API
      reader.readAsDataURL(file) //convert image to a string
      reader.onloadend = () => {
        setPreviewSource(reader.result); //if set we want to display it
      }
  };
//set up a useEffect that makes an axios request
  const handleSubmitFile = (e) => {
    e.preventDefault();
    if(!previewSource) return;
    uploadImage(previewSource);
  };
  const uploadImage = async (base64EncodedImage: any) => {
    console.log(base64EncodedImage);
    try {
      await axios.post('/api/images/upload', {
        method: 'POST',
        body: JSON.stringify({data: base64EncodedImage})
        //Headers: {'Content-type': 'application/json'}),
      })
    } catch (error) {
      console.error('failed to upload', error);
    }
  };
  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleSubmitFile}
      className="form">
        <input
          type="file"
          name="image"
          onChange={handleFileInputChange}
          value={fileInputState}
          className="form-input" />
        <button className="btn" type="submit">Submit</button>
      </form>
      {previewSource && (
        <img src={previewSource} alt="chosen"
        style={{height: '400px'}}/>
      )}
    </div>
  )
}