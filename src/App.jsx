import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from "./pages/Home";
import Login from "./auth/login";
import Register from "./auth/register";
import Results from './pages/trainResults';
import BookingPage from './pages/booking';
import PaymentPage from './payment/pay';
import MyTicketsPage from './pages/my-ticket';
import FilterSidebar from './pages/filter';
import TrainDetails from './pages/trainDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="results" element={<Results />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="my-tickets" element={<MyTicketsPage />} />
          <Route path="filter" element={<FilterSidebar />} />
          <Route path="trainDetails" element={<TrainDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
