import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);

  const navigateTo = (path, state = null) => {
    setHistory(prevHistory => [...prevHistory, { path, state }]);
    setCurrentStep({ path, state });
  };

  const goBack = () => {
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory.pop();
      const lastStep = newHistory[newHistory.length - 1];
      setCurrentStep(lastStep);
      return newHistory;
    });
  };

  return (
    <NavigationContext.Provider value={{ history, currentStep, navigateTo, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};
