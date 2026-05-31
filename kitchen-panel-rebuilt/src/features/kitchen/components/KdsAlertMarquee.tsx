import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertTriangle, Clock, Flame } from 'lucide-react';
import { KdsOrder } from '../../../core/api/kdsPlaceholder.api';

interface AlertMarqueeProps {
  orders: KdsOrder[];
}

const marqueeAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const AlertBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: linear-gradient(90deg, #18080f 0%, #2a0b12 50%, #18080f 100%);
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 999;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
`;

const MarqueeTrack = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ${marqueeAnimation} 25s linear infinite;
  padding-left: 100%;

  &:hover {
    animation-play-state: paused;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding-right: 32px;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  letter-spacing: 0.02em;
`;

const AlertItemNormal = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f97316;
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  letter-spacing: 0.02em;
`;

export function KdsAlertMarquee({ orders }: AlertMarqueeProps) {
  const delayedOrders = orders.filter((o) => o.status === 'DELAYED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');

  // Build the list of alerts
  const items: React.ReactNode[] = [];

  delayedOrders.forEach((o) => {
    items.push(
      <AlertItem key={`delayed-${o.id}`}>
        <AlertTriangle size={15} />
        ORDER #ORD-{o.id.substring(0, 5).toUpperCase()} DELAYED FOR {o.table} ({o.item} x{o.quantity}) - ACTION REQUIRED
      </AlertItem>
    );
  });

  if (items.length === 0) {
    if (preparingOrders.length > 3) {
      items.push(
        <AlertItemNormal key="high-load">
          <Flame size={15} />
          HIGH VOLUME PREPARING: {preparingOrders.length} TICKETS ACTIVE IN THE KITCHEN PANEL - MAINTAIN HIGH EFFICIENCY
        </AlertItemNormal>
      );
    } else {
      items.push(
        <AlertItemNormal key="all-clear" style={{ color: '#10b981' }}>
          <Clock size={15} />
          KITCHEN STATUS: ALL CLEAR. SPEED OF SERVICE IS OPTIMAL - NO ORDERS DELAYED OR HANGING
        </AlertItemNormal>
      );
    }
  }

  // Duplicate items to ensure smooth infinite loop
  return (
    <AlertBar>
      <MarqueeTrack>
        <Group>
          {items}
          {items}
          {items}
          {items}
        </Group>
        <Group>
          {items}
          {items}
          {items}
          {items}
        </Group>
      </MarqueeTrack>
    </AlertBar>
  );
}
