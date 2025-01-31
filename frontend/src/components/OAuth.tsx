import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
export default function OAuth() {
    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log(result);
        } catch (error) {
            console.log(error);
            console.log('Couldnt login with google');
        }
    }
  return (
    <button onClick={handleGoogleClick} type='submit' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Continue with google</button>
  )
}
