import React from 'react';
import styled from 'styled-components';
import { Card } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Button } from '../../../shared/Button';
import { ProgressBarContainer, ProgressBarFill } from '../../../shared/ProgressBar';
import { Clock, AlertTriangle, Check, ArrowRight, Ban } from 'lucide-react';
import { KdsOrder } from '../../../core/api/kdsPlaceholder.api';

interface KdsTicketCardProps {
  order: KdsOrder;
  statusType: 'new' | 'prep' | 'ready' | 'delayed';
  onAccept: (id: string) => void;
  onReady: (id: string) => void;
  onDelay: (id: string) => void;
  onReject: (id: string) => void;
  isMutating: boolean;
  mutatingOrderId: string | null;
}

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const OrderIdText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 0.05em;
`;

const TimeMarkerText = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 12px 0;
  width: 100%;
`;

const QuantityIndicator = styled.span<{ high: boolean }>`
  display: flex;
  height: 38px;
  width: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  line-height: 1;
  flex-shrink: 0;

  background: ${({ high, theme }) => 
    high ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'rgba(255,255,255,0.06)'
  };
  color: ${({ high }) => (high ? '#ffffff' : '#f8fafc')};
  border: 1px solid ${({ high }) => (high ? 'transparent' : 'rgba(255,255,255,0.1)')};
  box-shadow: ${({ high }) => high ? '0 4px 10px rgba(249,115,22,0.3)' : 'none'};
`;

const DishTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
  word-break: break-word;
  flex: 1;
`;

const NoteBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  padding: 10px 14px;
  border-radius: 12px;
  margin-top: 12px;
  line-height: 1.4;
  border: 1px solid rgba(249, 115, 22, 0.15);
  background: rgba(249, 115, 22, 0.04);
  color: rgba(253, 186, 116, 0.85);
`;

const NoteLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: #fdba74;
  text-transform: uppercase;
  font-size: 0.65rem;
  margin-top: 1px;
`;

const ProgressWrapper = styled.div`
  margin: 16px 0 12px 0;
  width: 100%;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: 6px;
`;

const ActionFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 16px;
`;

export function KdsTicketCard({
  order,
  statusType,
  onAccept,
  onReady,
  onDelay,
  onReject,
  isMutating,
  mutatingOrderId,
}: KdsTicketCardProps) {
  const isCurrentMutating = isMutating && mutatingOrderId === order.id;

  // Render format for Order ID
  const formattedId = `#ORD-${order.id.padStart(4, '0')}`;

  // Service Type Dine-in or Takeaway
  const serviceType = parseInt(order.id) % 2 === 0 ? 'Dine-in' : 'Takeaway';

  // Format Elapsed Time since creation
  const getElapsedTime = () => {
    const start = new Date(order.createdAt).getTime();
    const now = Date.now();
    const diffMins = Math.floor((now - start) / 60000);
    if (diffMins <= 0) return 'Just now';
    return `${diffMins} min ago`;
  };

  // Mock progress for PREPARING tickets
  const getProgressPercentage = () => {
    const start = new Date(order.createdAt).getTime();
    const now = Date.now();
    const diffMins = Math.floor((now - start) / 60000);
    // Mimic progression (target prep time is 15 minutes)
    return Math.min(95, Math.max(10, Math.floor((diffMins / 15) * 100)));
  };

  return (
    <Card statusBorder={statusType} interactive>
      <CardHeader>
        <OrderIdText>{formattedId}</OrderIdText>
        <TimeMarkerText>
          <Clock size={12} />
          {getElapsedTime()}
        </TimeMarkerText>
      </CardHeader>

      <ContentRow>
        <QuantityIndicator high={order.quantity > 1}>
          {order.quantity}
        </QuantityIndicator>
        <DishTitle>{order.item}</DishTitle>
      </ContentRow>

      {/* Notes block if present */}
      {order.notes && (
        <NoteBox>
          <NoteLabel>Note:</NoteLabel>
          <span style={{ flex: 1 }}>{order.notes}</span>
        </NoteBox>
      )}

      {/* Progress tracking wrapper for preparing orders */}
      {statusType === 'prep' && (
        <ProgressWrapper>
          <ProgressHeader>
            <span>Progress Gauge</span>
            <span style={{ color: '#f97316' }}>{getProgressPercentage()}% Ready</span>
          </ProgressHeader>
          <ProgressBarContainer>
            <ProgressBarFill progress={getProgressPercentage()} />
          </ProgressBarContainer>
        </ProgressWrapper>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{ fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
          Type: {serviceType}
        </span>
        <span style={{ fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
          Table: {order.table}
        </span>
      </div>

      {/* Interactive Actions wrapper */}
      <ActionFooter>
        {statusType === 'new' && (
          <>
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth 
              onClick={() => onAccept(order.id)}
              disabled={isCurrentMutating}
            >
              <ArrowRight size={14} />
              Accept
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onReject(order.id)}
              disabled={isCurrentMutating}
            >
              <Ban size={14} />
            </Button>
          </>
        )}

        {statusType === 'prep' && (
          <>
            <Button 
              variant="success" 
              size="sm" 
              fullWidth 
              onClick={() => onReady(order.id)}
              disabled={isCurrentMutating}
            >
              <Check size={14} />
              Mark Ready
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => onDelay(order.id)}
              disabled={isCurrentMutating}
            >
              <AlertTriangle size={14} />
              Delay
            </Button>
          </>
        )}

        {statusType === 'delayed' && (
          <>
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth 
              onClick={() => onAccept(order.id)}
              disabled={isCurrentMutating}
            >
              <ArrowRight size={14} />
              Resume Prep
            </Button>
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => onReady(order.id)}
              disabled={isCurrentMutating}
            >
              <Check size={14} />
            </Button>
          </>
        )}

        {statusType === 'ready' && (
          <Badge variant="ready" style={{ width: '100%', padding: '10px' }}>
            <Check size={12} style={{ marginRight: '6px' }} />
            Ready for Pickup
          </Badge>
        )}
      </ActionFooter>
    </Card>
  );
}
