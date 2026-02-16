import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import Chat from './Chat';
import MainLayout from './components/MainLayout';
import PPTGenerator from './components/PPTGenerator';
import ExcelGenerator from './components/ExcelGenerator';
import FileAnalyzer from './components/FileAnalyzer';
import VideoGenerator from './components/VideoGenerator';
import StockAnalyzer from './components/StockAnalyzer';
import HomeDashboard from './components/HomeDashboard';
import BillManager from './components/BillManager';
import './App.css';
import TechBackground from './components/TechBackground';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import GlobalSettingsModal from './components/GlobalSettingsModal';
import AccessKeyModal from './components/AccessKeyModal';
import { getAntTheme, THEME_COLORS } from './config/themes';
import { LAYOUTS } from './config/layouts';

function AppContent() {
  const [activeModule, setActiveModule] = useState('home');
  const [accessKeyModalOpen, setAccessKeyModalOpen] = useState(false);
  const { currentTheme, currentLayout, handleAccessKeySubmit } = useSettings();

  const handleModuleChange = (key) => {
    setActiveModule(key);
  };

  const renderContent = () => {
    // 大气科幻布局默认显示首页仪表板
    if (currentLayout === LAYOUTS.SCIFI && activeModule === 'home') {
      return <HomeDashboard onModuleChange={handleModuleChange} />;
    }
    
    switch (activeModule) {
      case 'home':
        return <HomeDashboard onModuleChange={handleModuleChange} />;
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
      case 'stock':
        return <StockAnalyzer />;
      case 'bill':
        return <BillManager />;
      default:
        return <HomeDashboard onModuleChange={handleModuleChange} />;
    }
  };

  const antTheme = getAntTheme(currentTheme);
  const isDark = currentTheme !== 'grand';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        ...antTheme,
      }}
    >
      <div 
        className="App"
        style={{
          background: THEME_COLORS[currentTheme]?.gradient || 'transparent',
          minHeight: '100vh',
        }}
      >
        <TechBackground theme={currentTheme} />
        <MainLayout 
          activeModule={activeModule} 
          onModuleChange={setActiveModule}
          onOpenAccessKeyModal={() => setAccessKeyModalOpen(true)}
        >
          {renderContent()}
        </MainLayout>
        <GlobalSettingsModal />
        <AccessKeyModal 
          visible={accessKeyModalOpen} 
          onClose={() => setAccessKeyModalOpen(false)}
          onKeySubmit={(key) => {
            handleAccessKeySubmit(key);
            setAccessKeyModalOpen(false);
          }}
        />
      </div>
    </ConfigProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
