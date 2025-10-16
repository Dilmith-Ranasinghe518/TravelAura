import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./components/Home/home";
//import AdminDashboard from "./components/AdminDashboard/admindash";
import Ddisplay from "./components/Destinationdisplay/destdisplay";
import Adddest from "./components/AddDest/adddest";
import Updatedest from "./components/Updatedest/updatedest";
import AccommodationPage from "./components/Accommadations/Accommadationpage";
import InsertAcc from "./components/Accommadations/InsertAccomadation";
import TravelPackagePage from "./components/Travelpackages/Travelpackages";
import BookingFormPage from "./components/Accommadations/BookingFormPage";

import PaymentPage from "./components/Accommadations/PaymentPage";
import BookingSuccess from "./components/Accommadations/BookingSuccesspPage";

import UpdateTravelPackage from "./components/Accommadations/UpdateTravelPackages";
import UpdateAccommodation from "./components/Accommadations/UpdateAccommdation";



import UserAccommodation from "./components/Accommadations/UserAccommodation";
import UserTravel from "./components/Travelpackages/UserTravel";
import InsertTravelPackage from "./components/Accommadations/InsertTravelpackages";
import AdminDashboard from "./components/AdminDashboard/admindash";

import RegisterUser from "./components/Register copy/RegisterUser";
import LoginUser from "./components/Pages/Login";
import RegisterAdmin from "./components/Register copy/RegisterAdmin";
import UserDashboard from "./components/Dashboards/UserDash";


import ReviewForm from "./components/Reviews/ReviewForm";
import AddBlog from "./components/Blogs/AddBlog";
import ViewBlogs from "./components/Blogs/ViewBlogs";
import ReviewsList from "./components/Reviews/ReviewsList";
import BlogAdminView from "./components/Blogs/BlogAdminView"
import UpdateBlog from "./components/Blogs/UpdateBlog";

import EventsManagementPage from "./components/Pages/EventsManagementPage";
import PublicEventsListPage from "./components/Pages/PublicEventsListPage";
import EventDetailsPage from "./components/Pages/EventDetailsPage";
import DestinationUser from "./components/Pages/DestinationUser";

import Contactus from "./components/Contact/Contact";
import Aboutus from "./components/About/About";

import More from "./components/MDest/Colombo";


// ✅ Import header and footer
// import Header from "./components/Header/header";
// import Fotter from "./components/Fotter/fotter";

export default function App() {
  return (
    // <div className="flex flex-col min-h-screen">
      // {/* Header shown on top */}
     
      // {/* <AdminDashboard> */}
        // {/* <main className="flex-grow"> */}
        <>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mainhome" element={<HomePage />} />
            <Route path="/admindash" element={<AdminDashboard />} />
            <Route path="/adddestination" element={<Adddest />} />
            <Route path="/destinationview" element={<Ddisplay />} />
            <Route path="/destinationview/:id" element={<Updatedest />} />
            <Route path='/useraccommodations' element={<UserAccommodation/>}/>
              <Route path='/usertravelpackages' element={<UserTravel/>}/>
              <Route path='/travelpackages' element={<TravelPackagePage/>}/>
              <Route path='/inserttravelpackage' element={<InsertTravelPackage/>}/>
                <Route path='/accommodation' element={<AccommodationPage/>}/>
                  <Route path='/insertaccommodation' element={<InsertAcc/>}/>
                   <Route path="/register" element={<RegisterUser />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/user-dashboard" element={<UserDashboard/>} />

        <Route path='/addreview' element={<ReviewForm/>}/>
          <Route path='/viewblog' element={<ViewBlogs/>}/>
          <Route path='/addblog' element={<AddBlog/>}/>
          <Route path='/viewreview' element={<ReviewsList/>}/>
          <Route path='/view' element={<BlogAdminView/>}/>
          <Route path='/view-blog' element={<BlogAdminView/>}/>
           <Route path='/update/:id' element={<UpdateBlog/>}/>
          
      <Route path="/admin/events" element={<EventsManagementPage />} />
      <Route path="/events" element={<PublicEventsListPage />} />
      <Route path="/events/:slug" element={<EventDetailsPage />} />
      <Route path="/booking-form" element={<BookingFormPage />} />

      <Route path="/payment" element={<PaymentPage />} />
  <Route path="/booking-success" element={<BookingSuccess />} />
    <Route path="/destinationsuser" element={<DestinationUser />} />

<Route path="/contact" element={<Contactus/>} />
    <Route path="/about" element={<Aboutus/>} />

      <Route path="/destmore" element={<More/>} />


<Route path='/travelpackageupdate/:id' element={<UpdateTravelPackage/>}/>
  <Route path='/accommodationsupdate/:id' element={<UpdateAccommodation/>}/>




          </Routes>
           <ToastContainer position="top-right" autoClose={3000} />
        </>
       
       // {/* </main> */}
          
        // </main>
      // {/* </AdminDashboard> */}

     // {/* Footer fixed at bottom */}
     
    // </div>
  // );

  );
}
