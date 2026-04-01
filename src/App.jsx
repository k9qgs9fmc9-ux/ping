import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme, message } from 'antd';
import Chat from './Chat';
import MainLayout from './components/MainLayout';
import PPTGenerator from './components/PPTGenerator';
import ExcelGenerator from './components/ExcelGenerator';
import FileAnalyzer from './components/FileAnalyzer';
import VideoGenerator from './components/VideoGenerator';
import LifeTimelineVideo from './components/LifeTimelineVideo';
import AiHairstyle from './components/AiHairstyle';
import StockAnalyzer from './components/StockAnalyzer';
import DestinyAnalyzer from './components/DestinyAnalyzer';
import HomeDashboard from './components/HomeDashboard';
import BillManager from './components/BillManager';
import './App.css';
import TechBackground from './components/TechBackground';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import GlobalSettingsModal from './components/GlobalSettingsModal';
import AccessKeyModal from './components/AccessKeyModal';
import { getAntTheme, THEME_COLORS } from './config/themes';
import { LAYOUTS } from './config/layouts';
import { isModuleAvailable } from './config/versions';

function AppContent() {
  const [activeModule, setActiveModule] = useState('chat');
  const [accessKeyModalOpen, setAccessKeyModalOpen] = useState(false);
  const { currentTheme, currentLayout, handleAccessKeySubmit, version } = useSettings();

  // 检查模块权限
  useEffect(() => {
    if (!isModuleAvailable(version, activeModule)) {
      message.warning('您没有权限访问此模块，请输入正确的访问密钥');
      setActiveModule('chat');
    }
  }, [version, activeModule]);

  const handleModuleChange = (key) => {
    setActiveModule(key);
  };

  const renderContent = () => {
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
      case 'destiny':
        return <DestinyAnalyzer />;
      case 'life-timeline':
        return <LifeTimelineVideo />;
      case 'hairstyle':
        return <AiHairstyle />;
      default:
        return <Chat />;
    }
  };

  const antTheme = getAntTheme(currentTheme);
  const isDark = currentTheme !== 'grand' && currentTheme !== 'default';

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
