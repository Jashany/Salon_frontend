import { Routes,Route } from "react-router-dom"
import Login from "./Pages/Login/Login"
import VerifyOtp from "./Pages/VerifyOtp/VerifyOtp"
import Home from "./Pages/Home/Home"
import SearchPage from "./Pages/Search/SearchPage"
import SalonPage from "./Pages/salon/Salon"
import ServicePage from "./Pages/Service/ServicePage"
import OTP from "./Pages/otpless/otpless"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/salon/:id" element={<SalonPage />} />
        <Route path="/salon/:id/services" element={<ServicePage />} />
      </Routes>
    </>
  )
}

export default App
