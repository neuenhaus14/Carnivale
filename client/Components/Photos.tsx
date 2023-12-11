import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import axios from 'axios';
import Photo from './Photo'
import { Modal, Button, Form } from 'react-bootstrap'
import { arrayBuffer } from 'stream/consumers';
//capturing an image and sending via axios to my backend. on backend making another call to cloudinary to post or retrieve image. So if I need that photo on the front end

interface Props {
  lng: any
  lat: any
  saveCreatedPin: any
}

const Upload: React.FC<Props> = ({lng, lat, saveCreatedPin}) => {
  const [fileInputState, setFileInputState] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [previewSource, setPreviewSource] = useState();
  const [loading, setLoading] = useState<boolean>(false)
  const [res, setRes] = useState({});
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState<string>('');

  const handleDescInput = (e:any) => {
    const desc = e.target.value;
    setDescription(desc);
    //console.log('description', desc, description)
  }

  const handleSelectFile = (e: any) => {
    //console.log('handleSelect', e)
    const file = e.target.files[0];
    setFile(file);
    previewFile(file);
  };

  const previewFile = (file: any) => {
      const reader = new FileReader(); //built into JS API
      reader.readAsDataURL(file) //convert image to a string
      reader.onloadend = () => {
        //console.log('reader.result', reader.result)
        const res: any = reader.result
        setPreviewSource(res); //if set we want to display it
      }
  };
//set up a useEffect that makes an axios request
  const uploadFile = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    console.log('file', file);
    data.set("sample_file", file);
    //console.log('data', data)
    try {
      const res = await axios.post("/api/images/upload", data);
      
      console.log('front end data',  res, data)
      //setRes(res.data);
      savePinToDb()
    } catch (error) {
      console.log('upload error', error);
    } finally {
      setLoading(false);
    }
  };


  //considering this put request as part of our post request due to the multer middleware
  const saveToDb = async () => {
    saveCreatedPin()
    try{
      const savePic = await axios.put(`/api/images/save/${1}`, {
        options: {
          latitude: lat,
          longitude: lng,
          isThrow: false,
          isCostume: false,
          isPin: true,
          description
        }
      });
    }catch (error) {
      console.log('upload error', error);
    }
  }

  return (
    <div className="App">
      <Form.Label><b>Add a picture below!</b></Form.Label><br />
          {previewSource && (
          <img src={previewSource} alt="chosen"
          style={{width: '100%', height: '50vh'}}/>)}
          <input  id="file" type="file" name="image"
            onChange={handleSelectFile} multiple={false}
          /><br />
          <Form.Label><b>Description is Mandatory</b></Form.Label>
          <Form.Control as="textarea" rows={1} placeholder="Please add a description"
            name="descinput" onChange={handleDescInput}/> <br />
          <Button variant="dark" onClick={uploadFile}> {loading ? "Saving..." : "Save"} </Button>

        {/* <>
        <input
        id="desc"
        type="desc"
        name="descinput"
        onChange={handleDescInput}/>
          <button className="btn-green" onClick={uploadFile}>
            {loading ? "Saving..." : "Save"}
          </button>
        </> */}
    </div>
  );
}

export default Upload;