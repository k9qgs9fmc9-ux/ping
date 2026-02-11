import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('dashscope_api_key') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatBaseUrl, setChatBaseUrl] = useState(localStorage.getItem('chat_base_url') || 'https://dashscope.aliyuncs.com/compatible-mode/v1');
  
  // Persist settings
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('dashscope_api_key', apiKey);
    } else {
      localStorage.removeItem('dashscope_api_key');
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('chat_base_url', chatBaseUrl);
  }, [chatBaseUrl]);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsContext.Provider value={{
      apiKey,
      setApiKey,
      chatBaseUrl,
      setChatBaseUrl,
      isSettingsOpen,
      openSettings,
      closeSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
