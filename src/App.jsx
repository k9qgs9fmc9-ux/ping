import React from 'react';
import { ConfigProvider, theme } from 'antd';
import Chat from './Chat';
import './App.css';
import TechBackground from './components/TechBackground';

function App() {
  return (
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
        <Chat />
      </div>
    </ConfigProvider>
  );
}

export default App;
