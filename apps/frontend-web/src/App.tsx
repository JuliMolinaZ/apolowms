import React from 'react';
import Notifications from './components/Notification/Notification';
import AuthFlipCard from './components/Auth/AuthFlipCard';
import { Warehouse } from "./components/Locations/Warehouse";

const App: React.FC = () => {
  return (
    <>
      <Notifications />
      <AuthFlipCard />
      <Warehouse />
    </>
  );
};

export default App;


