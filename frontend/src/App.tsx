import { BrowserRouter, Routes, Route } from "react-router-dom"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import Profile from "./pages/Profile"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
