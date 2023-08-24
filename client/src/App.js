import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AplicaDoctor from './pages/AplicaDoctor';
import { Button } from 'antd';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Notificari from './pages/Notificari';
import UsersList from './pages/Admin/UsersList';
import DoctorsList from './pages/Admin/DoctorsList';
import DiseaseList from './pages/Admin/DiseaseList';
import CategoriesList from './pages/Admin/CategoriesList';
import Profil from './pages/Doctor/Profil';
import BookAppoiment from './pages/BookAppoiment';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Preturi from './pages/Preturi';
import Location from './pages/Location';
import Disease from './pages/Disease';
import Review from './pages/Reviews';
import HomePage from './pages/HomePage';
import Chat from './pages/Chat';


function App() {
  const { loading } = useSelector(state => state.alerts);

  return (
    <BrowserRouter>
      {loading && (
        <div className='spinner-parent'>
          <div className="spinner-border" role="status">
          </div>
        </div>
      )}
      <Toaster position='top-center' reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" exact element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path='/programare' element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path='/aplica-doctor' element={<ProtectedRoute><AplicaDoctor /></ProtectedRoute>} />
        <Route path='/notificari' element={<ProtectedRoute><Notificari /></ProtectedRoute>} />
        <Route path='/preturi' element={<ProtectedRoute><Preturi /></ProtectedRoute>} />
        <Route path='/afectiuni' element={<ProtectedRoute><Disease /></ProtectedRoute>} />
        <Route path='/location' element={<ProtectedRoute><Location /></ProtectedRoute>} />
        <Route path='/recenzii/:doctorId' element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />


        <Route path='/admin/usersList' element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path='/admin/doctorsList' element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        <Route path='/admin/categoriesList' element={<ProtectedRoute><CategoriesList /></ProtectedRoute>} />
        <Route path='/admin/diseaseList' element={<ProtectedRoute><DiseaseList /></ProtectedRoute>} />

        <Route path='/doctor/profil/:userId' element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path='/book-appointment/:doctorId' element={<ProtectedRoute><BookAppoiment /></ProtectedRoute>} />
        <Route path='/appointments' element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path='/doctor/appointments' element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
        <Route path='/doctor/dashboard' element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
