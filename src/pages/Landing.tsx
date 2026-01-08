import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../../components/LandingPage';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return <LandingPage onStart={() => navigate('/login')} />;
};

export default Landing;
