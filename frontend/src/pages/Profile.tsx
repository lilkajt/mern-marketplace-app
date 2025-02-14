import {useDispatch, useSelector} from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { app } from '../firebase';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserSuccess, deleteUserStart, LogoutStart, LogoutSuccess, LogoutFailure } from '../redux/user/userSlice.js';

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {currentUser, loading, error } = useSelector(state => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess ] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

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

  const handleChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateUserStart());
    try {
      await axios.post(`/api/user/update/${currentUser._id}`, formData).then( function (response){
        dispatch(updateUserSuccess(response.data));
        setUpdateSuccess(true);
      })
      .catch( function (error) {
        dispatch(updateUserFailure(error.response.data.message));
        return;
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/user/delete/${currentUser._id}`)
      .then( function (response){
        dispatch(deleteUserSuccess(response.data));
      })
      .catch( function (error) {
        dispatch(deleteUserFailure(error.response.data.message));
        return;
      });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleLogoutUser = async () => {
    try {
      dispatch(LogoutStart());
      await axios.get(`/api/auth/logout`)
      .then( function (response){
        dispatch(LogoutSuccess(response.data));
      })
      .catch( function (error) {
        dispatch(LogoutFailure(error.response.data.message));
        return;
      });
    } catch (error) {
      dispatch(LogoutFailure(error.message));
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <input id='username' onChange={handleChange} type="text" placeholder='username' className='border p-3 rounded-lg' defaultValue={currentUser.username}/>
        <input id='email' onChange={handleChange} type="email" placeholder='email' className='border p-3 rounded-lg' defaultValue={currentUser.email}/>
        <input id='password' onChange={handleChange} type="password" placeholder='password' className='border p-3 rounded-lg'/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading..." : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleLogoutUser} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error? error : ''}</p>
      <p className="text-green-700 mt-5 text-center">{updateSuccess? 'Account updated!' : ''}</p>
    </div>
  )
}
