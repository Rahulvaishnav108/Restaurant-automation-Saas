import React, { useState } from 'react';
import { Layout, Menu, ConfigProvider, theme, Switch } from 'antd';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, ChefHat, Layers, Flame, TrendingUp, Sparkles, Sun, Moon } from 'lucide-react';

const { Sider, Content } = Layout;

export default function KitchenLayout(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'dashboard';
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="h-4 w-4" /> 
    },
    { 
      key: 'orders', 
      label: 'Tickets Queue', 
      icon: <ChefHat className="h-4 w-4" /> 
    },
    { 
      key: 'batches', 
      label: 'Cooking Batches', 
      icon: <Layers className="h-4 w-4" /> 
    },
    { 
      key: 'load', 
      label: 'Kitchen Pressure', 
      icon: <Flame className="h-4 w-4" /> 
    },
    { 
      key: 'performance', 
      label: 'Shift Performance', 
      icon: <TrendingUp className="h-4 w-4" /> 
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'dashboard') {
      navigate('/kitchen');
    } else {
      navigate(`/kitchen?view=${key}`);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#f43f5e',
          colorBgBase: isDark ? '#0f172a' : '#ffffff',
          colorBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb',
          fontFamily: 'Inter, Poppins, sans-serif',
        },
      }}
    >
      <Layout className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0f172a] text-stone-50' : 'bg-[#f8fafc] text-slate-800'}`}>
        
        {/* Ant Design Sider (Left Sidebar Navigation) */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width={240}
          style={{
            background: isDark ? 'rgba(15, 23, 42, 0.4)' : '#ffffff',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #e5e7eb',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
          }}
          className="backdrop-blur-xl"
        >
          {/* Logo Brand Header */}
          <div className={`p-6 border-b flex flex-col gap-3.5 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                isDark 
                  ? 'border-white/10 bg-white/10 text-rose-300' 
                  : 'border-rose-100 bg-rose-50 text-rose-600'
              }`}>
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-rose-500" />
                Kitchen KDS
              </div>
              
              {/* Light & Dark Theme Toggle Switch */}
              <Switch
                checkedChildren={<Moon className="h-3 w-3 text-amber-200 mt-1" />}
                unCheckedChildren={<Sun className="h-3 w-3 text-amber-500 mt-1" />}
                checked={isDark}
                onChange={(checked) => setIsDark(checked)}
                className="bg-slate-700 hover:bg-slate-600 border-none"
              />
            </div>
            <div>
              <div className={`text-sm font-black font-heading tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Main Cookstation A
              </div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Live Sync Connected
              </div>
            </div>
          </div>

          {/* Sider Menu Selection */}
          <Menu
            mode="inline"
            selectedKeys={[activeView]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              background: 'transparent',
              borderRight: 0,
              padding: '20px 8px',
            }}
          />
        </Sider>

        {/* Content Wrapper */}
        <Layout 
          className="bg-transparent"
          style={{ 
            marginLeft: collapsed ? '0' : '240px', // Dynamic responsive offset
            transition: 'all 0.2s',
          }}
        >
          <Content className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
