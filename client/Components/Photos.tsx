import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import axios from 'axios';
import Photo from './Photo'
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
// type loading = { loading: boolean; setLoading: Dispatch<SetStateAction<boolean>>; file: boolean; setFile: Dispatch<boolean>; }
  // const Form: React.FC<Props> = ({
  //   loading,
  //   setLoading,
  //   file,
  //   setFile,
  // })
  // interface TLoad {
  //   loading: boolean;
  //   setLoading?: (value: boolean | (loading: boolean) => boolean) => void;
  // }
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
    //console.log('file', file);
    data.set("sample_file", file);
    //console.log('data', data)
    try {
      const res = await axios.post("/api/images/upload", data);
      
      //console.log('front end data', data)
      //setRes(res.data);
      saveToDb()
    } catch (error) {
      console.log('upload error', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('outside save', lat, lng)

  //considering this put request as part of our post request due to the multer middleware
  const saveToDb = async () => {
    console.log('inside save', lat, lng)
    saveCreatedPin()
    try{
      const savePic = await axios.put(`/api/images/save/${1}`, {
        options: {
          latitude: lat,
          longitude: lng,
          isThrow: false,
          isCostume: false,
          description
        }
      });
    }catch (error) {
      console.log('upload error', error);
    }
  }

  return (
    <div className="App">
      {previewSource && (
      <img src={previewSource} alt="chosen"
      style={{height: '300'}}/>)}
       <input
        id="file"
        type="file"
        name="image"
        placeholder="Please add a description"
        onChange={handleSelectFile}
        multiple={false}
      />
        <>
        <input
        id="desc"
        type="desc"
        name="descinput"
        onChange={handleDescInput}/>
          <button className="btn-green" onClick={uploadFile}>
            {loading ? "Saving..." : "Save"}
          </button>
        </>
    </div>
  );
}

export default Upload;