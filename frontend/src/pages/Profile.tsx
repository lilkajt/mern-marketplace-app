import {useSelector} from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {currentUser} = useSelector(state => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  useEffect( () => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      }, 
      (error) => {
        console.log(error);
        setfileUploadError(true);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL});
        });
      }
    );
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} name="" id="" hidden accept='image/*'/>
        <img onClick={() => fileRef.current?.click()} src={formData.avatar || currentUser.avatar} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center' >
          {fileUploadError ?
          (<span className='text-red-700' >Erorr image upload. Image must be less than 2 MBs</span>)
          : 
          filePerc > 0 && filePerc < 100 ? (
            <span className='text-green-700' >Uploading {filePerc}%</span>)
          :
          filePerc === 100 ? (
            <span className='text-green-700' >Uploaded</span>
          )
          : ""}
        </p>
        <input id='username' type="text" placeholder='username' className='border p-3 rounded-lg'/>
        <input id='email' type="email" placeholder='email' className='border p-3 rounded-lg'/>
        <input id='password' type="text" placeholder='password' className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
