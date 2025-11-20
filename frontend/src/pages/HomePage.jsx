import React from 'react';
import Navbar from '../components/ui/Navbar';
import Home from '../components/Home';
import Card from '../components/ui/Card';
import Footer from '../components/ui/Footer';

const HomePage = () => {
  const googleAuth = () => {
    window.open("http://localhost:8000/api/v1/users/google", "_self");
  };

  return (
    <>
      <Navbar started={googleAuth} />
      <Home started={googleAuth} />
      <Card />
      <Footer />
    </>
  );
};

export default HomePage;