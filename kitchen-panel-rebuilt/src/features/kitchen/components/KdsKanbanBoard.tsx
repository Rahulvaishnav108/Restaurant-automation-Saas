import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { KdsTicketCard } from './KdsTicketCard';
import { KdsOrder } from '../../../core/api/kdsPlaceholder.api';
import { Clock, Plus, Flame, Check, AlertTriangle, ListFilter } from 'lucide-react';

interface KdsKanbanBoardProps {
  orders: KdsOrder[];
  onAccept: (id: string) => void;
  onReady: (id: string) => void;
  onDelay: (id: string) => void;
  onReject: (id: string) => void;
  isMutating: boolean;
  mutatingOrderId: string | null;
}

const KanbanContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

// Responsive Grid structure matching desktop, tablet, mobile perfectly
const ColumnsGrid = styled.div`
  display: grid;
  gap: 24px;
  width: 100%;
  
  /* Mobile Layout: default 1 column */
  grid-template-columns: 1fr;

  /* Tablet Layout (768px to 1279px): 2x2 grid */
  @media (min-width: 768px) and (max-width: 1279px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Desktop Layout (1280px+): full 4 columns */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Column = styled.div<{ activeInMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 28px;
  padding: 16px;
  min-height: 500px;
  transition: ${({ theme }) => theme.transitions.default};

  /* On mobile, only show the active tab column */
  @media (max-width: 767px) {
    display: ${({ activeInMobile }) => (activeInMobile ? 'flex' : 'none')};
    background: transparent;
    border: none;
    padding: 0;
    min-height: auto;
  }
`;

const ColumnHeader = styled.div<{ status: 'new' | 'prep' | 'ready' | 'delayed' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-bottom: 2px solid;

  ${({ status }) => {
    switch (status) {
      case 'new': return css`border-color: #cbd5e1; color: #cbd5e1;`;
      case 'prep': return css`border-color: #f97316; color: #f97316;`;
      case 'ready': return css`border-color: #10b981; color: #10b981;`;
      case 'delayed': return css`border-color: #ef4444; color: #ef4444;`;
    }
  }}
`;

const ColumnTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColumnTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ColumnCounter = styled.span`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 10px;
  border-radius: 9999px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const EmptyColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  gap: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.005);
`;

const TabContainer = styled.div`
  display: none;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 4px;
  gap: 4px;
  margin-bottom: 8px;

  @media (max-width: 767px) {
    display: flex;
  }
`;

const TabButton = styled.button<{ isActive: boolean; status: 'new' | 'prep' | 'ready' | 'delayed' }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 4px;
  border-radius: 12px;
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weights.black};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  ${({ isActive, status }) =>
    isActive &&
    css`
      background: rgba(255, 255, 255, 0.06);
      color: ${status === 'new' 
        ? '#cbd5e1' 
        : status === 'prep' 
        ? '#f97316' 
        : status === 'ready' 
        ? '#10b981' 
        : '#ef4444'};
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `}
`;

export function KdsKanbanBoard({
  orders,
  onAccept,
  onReady,
  onDelay,
  onReject,
  isMutating,
  mutatingOrderId,
}: KdsKanbanBoardProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'prep' | 'ready' | 'delayed'>('new');

  // Filter orders by columns
  const newOrders = orders.filter((o) => o.status === 'PLACED');
  const prepOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');
  const delayedOrders = orders.filter((o) => o.status === 'DELAYED');

  const renderColumnContent = (
    columnOrders: KdsOrder[],
    statusType: 'new' | 'prep' | 'ready' | 'delayed'
  ) => {
    if (columnOrders.length === 0) {
      return (
        <EmptyColumnWrapper>
          <Clock size={20} style={{ opacity: 0.4 }} />
          <span>No tickets in this column</span>
        </EmptyColumnWrapper>
      );
    }

    return (
      <TicketList>
        {columnOrders.map((order) => (
          <KdsTicketCard
            key={order.id}
            order={order}
            statusType={statusType}
            onAccept={onAccept}
            onReady={onReady}
            onDelay={onDelay}
            onReject={onReject}
            isMutating={isMutating}
            mutatingOrderId={mutatingOrderId}
          />
        ))}
      </TicketList>
    );
  };

  return (
    <KanbanContainer>
      {/* Mobile-only tab switches */}
      <TabContainer>
        <TabButton 
          isActive={activeTab === 'new'} 
          status="new" 
          onClick={() => setActiveTab('new')}
        >
          New ({newOrders.length})
        </TabButton>
        <TabButton 
          isActive={activeTab === 'prep'} 
          status="prep" 
          onClick={() => setActiveTab('prep')}
        >
          Prep ({prepOrders.length})
        </TabButton>
        <TabButton 
          isActive={activeTab === 'ready'} 
          status="ready" 
          onClick={() => setActiveTab('ready')}
        >
          Ready ({readyOrders.length})
        </TabButton>
        <TabButton 
          isActive={activeTab === 'delayed'} 
          status="delayed" 
          onClick={() => setActiveTab('delayed')}
        >
          Delay ({delayedOrders.length})
        </TabButton>
      </TabContainer>

      {/* Grid containing the columns */}
      <ColumnsGrid>
        {/* Placed Columns */}
        <Column activeInMobile={activeTab === 'new'}>
          <ColumnHeader status="new">
            <ColumnTitleGroup>
              <Plus size={16} />
              <ColumnTitle>New Orders</ColumnTitle>
            </ColumnTitleGroup>
            <ColumnCounter>{newOrders.length}</ColumnCounter>
          </ColumnHeader>
          {renderColumnContent(newOrders, 'new')}
        </Column>

        {/* Preparing Columns */}
        <Column activeInMobile={activeTab === 'prep'}>
          <ColumnHeader status="prep">
            <ColumnTitleGroup>
              <Flame size={16} />
              <ColumnTitle>Preparing</ColumnTitle>
            </ColumnTitleGroup>
            <ColumnCounter>{prepOrders.length}</ColumnCounter>
          </ColumnHeader>
          {renderColumnContent(prepOrders, 'prep')}
        </Column>

        {/* Ready Columns */}
        <Column activeInMobile={activeTab === 'ready'}>
          <ColumnHeader status="ready">
            <ColumnTitleGroup>
              <Check size={16} />
              <ColumnTitle>Ready</ColumnTitle>
            </ColumnTitleGroup>
            <ColumnCounter>{readyOrders.length}</ColumnCounter>
          </ColumnHeader>
          {renderColumnContent(readyOrders, 'ready')}
        </Column>

        {/* Delayed Columns */}
        <Column activeInMobile={activeTab === 'delayed'}>
          <ColumnHeader status="delayed">
            <ColumnTitleGroup>
              <AlertTriangle size={16} />
              <ColumnTitle>Delayed</ColumnTitle>
            </ColumnTitleGroup>
            <ColumnCounter>{delayedOrders.length}</ColumnCounter>
          </ColumnHeader>
          {renderColumnContent(delayedOrders, 'delayed')}
        </Column>
      </ColumnsGrid>
    </KanbanContainer>
  );
}
