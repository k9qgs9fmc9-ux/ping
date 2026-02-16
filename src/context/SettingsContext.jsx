import React, { createContext, useState, useEffect, useContext } from 'react';
import { THEMES } from '../config/themes';
import { LAYOUTS } from '../config/layouts';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Default API Key for convenience (Warning: Exposed in frontend source)
  const DEFAULT_API_KEY = 'sk-62c624e8f0f2403da26b02aa348ec860';
  const [apiKey, setApiKey] = useState(localStorage.getItem('dashscope_api_key') || DEFAULT_API_KEY);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatBaseUrl, setChatBaseUrl] = useState(localStorage.getItem('chat_base_url') || 'https://dashscope.aliyuncs.com/compatible-mode/v1');
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('app_theme') || THEMES.DEFAULT);
  const [currentLayout, setCurrentLayout] = useState(localStorage.getItem('app_layout') || LAYOUTS.SIDEBAR);
  
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

  useEffect(() => {
    localStorage.setItem('app_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('app_layout', currentLayout);
  }, [currentLayout]);

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
      closeSettings,
      currentTheme,
      setCurrentTheme,
      currentLayout,
      setCurrentLayout,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
