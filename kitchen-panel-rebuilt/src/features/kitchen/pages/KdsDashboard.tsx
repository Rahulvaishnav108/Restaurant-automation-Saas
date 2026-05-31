import React, { useState } from 'react';
import styled from 'styled-components';
import { useKdsOrders } from '../../../core/hooks/useKdsOrders';
import { KdsKanbanBoard } from '../components/KdsKanbanBoard';
import { KdsLoadGauge } from '../components/KdsLoadGauge';
import { KdsPopularItems } from '../components/KdsPopularItems';
import { KdsAlertMarquee } from '../components/KdsAlertMarquee';
import { Button } from '../../../shared/Button';
import { Badge } from '../../../shared/Badge';
import { RefreshCw, Play, AlertOctagon, Flame, CheckCheck, Clock } from 'lucide-react';

const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 20px;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MainTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.title};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.02em;
`;

const SubtitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const ActionsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SecondaryGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  width: 100%;

  @media (max-width: 1279px) {
    grid-template-columns: 1fr;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Metrics Section
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const MiniMetricCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MetricIconBox = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ color }) => color}15;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricLabelArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MetricLabel = styled.span`
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
`;

export function KdsDashboard() {
  const {
    orders,
    load,
    performance,
    isLoading,
    isMutating,
    mutatingOrderId,
    handleAccept,
    handleReady,
    handleDelay,
    handleReject,
    handleAcceptAll,
    handleDelayAll,
    refreshData
  } = useKdsOrders();

  // Active status numbers
  const prepCount = orders.filter(o => o.status === 'PREPARING').length;
  const newCount = orders.filter(o => o.status === 'PLACED').length;

  return (
    <DashboardLayout>
      <HeaderSection>
        <TitleArea>
          <MainTitle>Kitchen Order Display</MainTitle>
          <SubtitleArea>
            <Badge variant="prep">Active Station: Hot Kitchen</Badge>
            <span>•</span>
            <Clock size={13} style={{ color: '#94a3b8' }} />
            <span>Live Auto-Refreshed Stream</span>
          </SubtitleArea>
        </TitleArea>

        <ActionsArea>
          <Button 
            variant="ghost" 
            onClick={() => refreshData()}
            disabled={isLoading || isMutating}
            style={{ borderRadius: '12px', padding: '10px' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
          </Button>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleDelayAll}
            disabled={isMutating || prepCount === 0}
          >
            <AlertOctagon size={14} />
            Delay Active Prep
          </Button>

          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAcceptAll}
            disabled={isMutating || newCount === 0}
          >
            <Play size={14} />
            Accept All Placed
          </Button>
        </ActionsArea>
      </HeaderSection>

      {/* Grid containing central details */}
      <SecondaryGrid>
        <LeftContainer>
          {/* Top miniature statistics display widgets */}
          <MetricsGrid>
            <MiniMetricCard>
              <MetricIconBox color="#ea580c">
                <Flame size={20} />
              </MetricIconBox>
              <MetricLabelArea>
                <MetricValue>{prepCount}</MetricValue>
                <MetricLabel>Items in Prep</MetricLabel>
              </MetricLabelArea>
            </MiniMetricCard>

            <MiniMetricCard>
              <MetricIconBox color="#10b981">
                <CheckCheck size={20} />
              </MetricIconBox>
              <MetricLabelArea>
                <MetricValue>{performance.completedToday}</MetricValue>
                <MetricLabel>Completed Today</MetricLabel>
              </MetricLabelArea>
            </MiniMetricCard>

            <MiniMetricCard>
              <MetricIconBox color="#3b82f6">
                <Clock size={20} />
              </MetricIconBox>
              <MetricLabelArea>
                <MetricValue>{performance.avgPrepTime}</MetricValue>
                <MetricLabel>Avg Prep Time</MetricLabel>
              </MetricLabelArea>
            </MiniMetricCard>
          </MetricsGrid>

          {/* Core Ticket Kanban Panel */}
          <KdsKanbanBoard
            orders={orders}
            onAccept={handleAccept}
            onReady={handleReady}
            onDelay={handleDelay}
            onReject={handleReject}
            isMutating={isMutating}
            mutatingOrderId={mutatingOrderId}
          />
        </LeftContainer>

        <RightContainer>
          {/* Pressure Capacity Gauge */}
          <KdsLoadGauge 
            load={load.load} 
            activeOrdersCount={load.activeOrdersCount} 
          />

          {/* Volume item analytics list */}
          <KdsPopularItems />
        </RightContainer>
      </SecondaryGrid>

      {/* Bottom overlay for active alert stream scrolling */}
      <KdsAlertMarquee orders={orders} />
    </DashboardLayout>
  );
}
