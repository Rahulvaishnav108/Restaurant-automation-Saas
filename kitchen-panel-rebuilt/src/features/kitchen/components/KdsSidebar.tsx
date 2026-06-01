import React from 'react';
import styled, { css } from 'styled-components';
import { ChefHat, LayoutDashboard, Clock, History, Settings, LogOut, User } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'batches' | 'history';
  onTabChange: (tab: 'dashboard' | 'batches' | 'history') => void;
}

const SidebarContainer = styled.aside`
  background: ${({ theme }) => theme.colors.bg.sidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    display: none; /* Hide sidebar on small/medium viewport adapters */
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
`;

const LogoIconCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
`;

const LogoText = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: 0.02em;
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MenuItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid transparent;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  ${({ active, theme }) =>
    active &&
    css`
      background: rgba(249, 115, 22, 0.08) !important;
      color: #f97316 !important;
      border-color: rgba(249, 115, 22, 0.15);
      box-shadow: 0 4px 15px rgba(249, 115, 22, 0.03);
    `}
`;

const OperatorCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  margin-bottom: 24px; /* safe separation from alert marquee at the bottom */
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const ProfileName = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileRole = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

export function KdsSidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <SidebarContainer>
      <LogoSection>
        <LogoIconCircle>
          <ChefHat size={22} />
        </LogoIconCircle>
        <LogoText>Graphura KDS</LogoText>
      </LogoSection>

      <MenuList>
        <MenuItem 
          active={activeTab === 'dashboard'} 
          onClick={() => onTabChange('dashboard')}
        >
          <LayoutDashboard size={18} />
          Active Monitor
        </MenuItem>
        <MenuItem 
          active={activeTab === 'batches'} 
          onClick={() => onTabChange('batches')}
        >
          <Clock size={18} />
          Prep Batches
        </MenuItem>
        <MenuItem 
          active={activeTab === 'history'} 
          onClick={() => onTabChange('history')}
        >
          <History size={18} />
          Orders History
        </MenuItem>
        <MenuItem>
          <Settings size={18} />
          Station Config
        </MenuItem>
      </MenuList>

      <OperatorCard>
        <Avatar>
          <User size={18} />
        </Avatar>
        <ProfileInfo>
          <ProfileName>Chef Aniket S.</ProfileName>
          <ProfileRole>Head Station Lead</ProfileRole>
        </ProfileInfo>
        <LogOut size={16} color="#64748b" style={{ cursor: 'pointer' }} />
      </OperatorCard>
    </SidebarContainer>
  );
}
