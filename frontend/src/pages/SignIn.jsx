import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    await axios.post('/api/auth/signin',formData)
    .then( function (response) {
      dispatch(signInSuccess(response.data));
      navigate('/');
    })
    .catch( function (error) {
      dispatch(signInFailure(error.response.data.message));
    })
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign in</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" name="email" id="email" placeholder='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" name="password" id="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} type="submit" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign in'}</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3 text-center font-semibold'>{error}</p>}
    </div>
  )
}
