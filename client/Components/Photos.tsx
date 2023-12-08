import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import axios from 'axios';
import Photo from './Photo'
import { arrayBuffer } from 'stream/consumers';
//capturing an image and sending via axios to my backend. on backend making another call to cloudinary to post or retrieve image. So if I need that photo on the front end

const Upload: React.FC = () => {
  const [fileInputState, setFileInputState] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [previewSource, setPreviewSource] = useState();
  const [loading, setLoading] = useState<boolean>(false)
  const [res, setRes] = useState({});
  const [file, setFile] = useState(null);
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
      setRes(res.data);
    } catch (error) {
      console.log('upload error', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
 
    // <h1>Upload</h1>
    // <form onSubmit={handleSubmitFile}
    // className="form">

    <div className="App">
      <label htmlFor="file" className="btn-grey">
        {" "}
        select file
      </label>
      <input
        id="file"
        type="file"
        name="image"
       //onChange={previewSource}
    //     value={fileInputState}
    //     className="form-input" />
    //   <button className="btn" type="submit">Submit</button>
    // </form>
    

        onChange={handleSelectFile}
        multiple={false}
      />
      {file && <p className="file_name">{file.name}</p>}
      
      {/* <code>
        {Object.keys(res).map(
          (key) =>
            key && (
              <p className="output-item" key={key}>
                <span>{key}:</span>
                <span>
                  {typeof res[key] === "object" ? "object" : res[key]}
                </span>
              </p>
            )
        )}
      </code> */}
      {file && (
        <>
          <button className="btn-green" onClick={uploadFile}>
            {loading ? "uploading..." : "upload to Cloudinary"}
          </button>
        </>
      )}
      {/* <Photo 
      loading={loading} 
      setLoading={setLoading}
      file={file}
      setFile={setFile}
      
      /> */}
      {previewSource && (
      <img src={previewSource} alt="chosen"
      style={{height: '400px'}}/>)}
    </div>
  );
}

export default Upload;