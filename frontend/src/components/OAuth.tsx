import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log(result);
            const res = await axios.post('/api/auth/google', {name: result.user.displayName, email: result.user.email, photo: result.user.photoURL});
            dispatch(signInSuccess(res.data));
            navigate('/');
        } catch (error) {
            console.log('Couldnt login with google ', error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='submit' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Continue with google</button>
  )
}
