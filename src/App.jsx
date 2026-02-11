import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import Chat from './Chat';
import MainLayout from './components/MainLayout';
import PPTGenerator from './components/PPTGenerator';
import ExcelGenerator from './components/ExcelGenerator';
import FileAnalyzer from './components/FileAnalyzer';
import VideoGenerator from './components/VideoGenerator';
import './App.css';
import TechBackground from './components/TechBackground';
import { SettingsProvider } from './context/SettingsContext';
import GlobalSettingsModal from './components/GlobalSettingsModal';

function App() {
  const [activeModule, setActiveModule] = useState('chat');

  const renderContent = () => {
    switch (activeModule) {
      case 'chat':
        return <Chat />;
      case 'ppt':
        return <PPTGenerator />;
      case 'excel':
        return <ExcelGenerator />;
      case 'file':
        return <FileAnalyzer />;
      case 'video':
        return <VideoGenerator />;
      default:
        return <Chat />;
    }
  };

  return (
    <SettingsProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm, // Switch to default (light) algorithm
          token: {
            colorPrimary: '#0062ff', // Tech Blue
            colorBgContainer: 'rgba(255, 255, 255, 0.6)',
            colorBorder: 'rgba(0, 98, 255, 0.15)',
            colorText: '#1f1f1f',
            fontFamily: "'JetBrains Mono', 'Fira Code', Inter, system-ui, sans-serif",
            borderRadius: 12, // Slightly more rounded
          },
          components: {
            Button: {
              colorPrimary: '#0062ff',
              algorithm: true, 
              borderColorDisabled: 'rgba(0,0,0,0.05)',
              defaultShadow: '0 2px 0 rgba(0, 98, 255, 0.1)',
              primaryShadow: '0 2px 0 rgba(0, 98, 255, 0.1)',
            },
            Input: {
              colorBgContainer: 'rgba(255, 255, 255, 0.6)',
              activeBorderColor: '#0062ff',
              hoverBorderColor: '#0062ff',
              activeShadow: '0 0 0 2px rgba(0, 98, 255, 0.1)',
            },
            Modal: {
              contentBg: '#ffffff',
              headerBg: '#ffffff',
            }
          }
        }}
      >
        <div className="App">
          <TechBackground />
          <MainLayout activeModule={activeModule} onModuleChange={setActiveModule}>
            {renderContent()}
          </MainLayout>
          <GlobalSettingsModal />
        </div>
      </ConfigProvider>
    </SettingsProvider>
  );
}

export default App;
