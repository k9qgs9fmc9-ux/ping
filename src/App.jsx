import React from 'react';
import { ConfigProvider, theme } from 'antd';
import Chat from './Chat';
import './App.css';
import TechBackground from './components/TechBackground';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00f3ff',
          colorBgContainer: 'rgba(30, 30, 40, 0.6)',
          colorBorder: 'rgba(0, 243, 255, 0.2)',
          colorText: '#e0e0e0',
          fontFamily: "'JetBrains Mono', 'Fira Code', Inter, system-ui, sans-serif",
          borderRadius: 8,
        },
        components: {
          Button: {
            colorPrimary: '#00f3ff',
            algorithm: true, 
            borderColorDisabled: 'rgba(255,255,255,0.1)',
          },
          Input: {
            colorBgContainer: 'rgba(0, 0, 0, 0.3)',
            activeBorderColor: '#00f3ff',
            hoverBorderColor: '#00f3ff',
          },
          Modal: {
            contentBg: '#0f172a',
            headerBg: '#0f172a',
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
