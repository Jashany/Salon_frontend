import { Routes,Route } from "react-router-dom"
import Login from "./Pages/Login/Login"
import VerifyOtp from "./Pages/VerifyOtp/VerifyOtp"
import Home from "./Pages/Home/Home"
import SearchPage from "./Pages/Search/SearchPage"
import SalonPage from "./Pages/salon/Salon"
import ServicePage from "./Pages/Service/ServicePage"
import OTP from "./Pages/otpless/otpless"
import { Provider } from "react-redux"
import store from "./Store"
import ArtistPage from "./Pages/Artist/Artist"
import Booking from "./Pages/Booking/Booking"
import Timeslot from "./Pages/TimeSlot/TimeSlot"
import Profile from "./Pages/Profile/Profile"
import History from "./Pages/History/History"
import Appointment from "./Pages/Appointments/Appointments"
import Reschedule from "./Pages/Appointments/Reschedule/Reschedule"
import Review from "./Pages/Review/Review"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Success from "./Components/SuccessPage/Success"
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute"
import AccountDelete from "./Pages/AccountDelete/AccountDelete"

function App() {

  return (
    <>
    <ToastContainer />
      <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginn" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<OTP />} />
        <Route path="/salon/:id" element={<SalonPage />} />
        <Route path="/salon/:id/services" element={<ServicePage />} />
        <Route path="/salon/:salonid/artists" element={<ArtistPage />} />
        <Route path="/salon/:salonid/:artistid" element={<Timeslot />} />
        <Route path="/delete-owner" element={<AccountDelete />} />
        <Route path="" element={<PrivateRoute />} >
        <Route path="/bookAppointment/:salonid" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/appointment/:appointmentId" element={<Appointment />} />
        <Route path="/review/:appointmentId" element={<Review />} />
        <Route path="/reschedule/:appointmentId" element={<Reschedule />} />
        <Route path="/success/:appointmentId" element={<Success />} />

        </Route>
      </Routes>
      </Provider>
    </>
  )
}

export default App
