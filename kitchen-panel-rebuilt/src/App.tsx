import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle, keyframes } from 'styled-components';
import { kdsTheme } from './core/theme/kdsStylesTheme';
import { KdsSidebar } from './features/kitchen/components/KdsSidebar';
import { KdsDashboard } from './features/kitchen/pages/KdsDashboard';
import { Card } from './shared/Card';
import { ChefHat, History, Info } from 'lucide-react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.colors.bg.body};
    font-family: ${props => props.theme.typography.fontBody};
    color: ${props => props.theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Custom premium scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #090d16;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 9999px;
    border: 2px solid #090d16;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(249, 115, 22, 0.4);
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px; /* space for fixed sidebar */
  padding: 40px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px; /* safe cushion above alert marquee */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    margin-left: 0; /* responsive shift on tablet / mobile devices */
    padding: 24px 16px;
  }
`;

const EmptyStateSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: ${props => props.theme.colors.text.muted};
`;

const DummyPageTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontHeading};
  font-size: ${props => props.theme.typography.sizes.xl};
  font-weight: ${props => props.theme.typography.weights.extrabold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'batches' | 'history'>('dashboard');

  return (
    <ThemeProvider theme={kdsTheme}>
      <GlobalStyle />
      <AppContainer>
        <KdsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <MainContent>
          {activeTab === 'dashboard' && <KdsDashboard />}
          
          {activeTab === 'batches' && (
            <div>
              <DummyPageTitle>Active Batches Monitor</DummyPageTitle>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
                Group active kitchen tickets by common prep requirements to optimize high-volume line operations.
              </p>
              <Card>
                <EmptyStateSection>
                  <ChefHat size={48} style={{ color: '#f97316', marginBottom: '16px', opacity: 0.8 }} />
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>Automatic Batching Optimized</span>
                  <p style={{ maxWidth: '380px', fontSize: '0.75rem', marginTop: '6px', lineHeight: 1.5 }}>
                    High volume items like "Paneer Butter Masala" and "Garlic Naan" are automatically grouped by standard line prep categories under the active monitor panel.
                  </p>
                </EmptyStateSection>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <DummyPageTitle>Archived Orders History</DummyPageTitle>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
                Historical log of finalized tickets completed or rejected within the current service cycle.
              </p>
              <Card>
                <EmptyStateSection>
                  <History size={48} style={{ color: '#10b981', marginBottom: '16px', opacity: 0.8 }} />
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>Orders Completed Safely</span>
                  <p style={{ maxWidth: '380px', fontSize: '0.75rem', marginTop: '6px', lineHeight: 1.5 }}>
                    Completed order tickets are safely flushed into local system memories to keep live Kanban columns highly responsive and clean.
                  </p>
                </EmptyStateSection>
              </Card>
            </div>
          )}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}
