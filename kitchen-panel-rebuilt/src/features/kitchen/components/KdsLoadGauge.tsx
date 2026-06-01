import React from 'react';
import styled from 'styled-components';
import { Card } from '../../../shared/Card';
import { AlertCircle, Flame, Droplets } from 'lucide-react';

interface LoadGaugeProps {
  load: 'Low' | 'Medium' | 'High';
  activeOrdersCount: number;
}

const GaugeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SvgWrapper = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 8px;
`;

const CircleFill = styled.circle<{ percentage: number; color: string }>`
  fill: none;
  stroke: ${({ color }) => color};
  stroke-width: 8px;
  stroke-linecap: round;
  stroke-dasharray: 251.2;
  stroke-dashoffset: ${({ percentage }) => 251.2 - (251.2 * percentage) / 100};
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.8s ease-out, stroke 0.5s ease;
  filter: drop-shadow(0 0 6px ${({ color }) => color}80);
`;

const InnerLabel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainNumber = styled.span`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
`;

const SubText = styled.span`
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 6px 0;
`;

const StatusIndicator = styled.div<{ load: 'Low' | 'Medium' | 'High' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  
  color: ${({ load }) => 
    load === 'High' ? '#ef4444' : load === 'Medium' ? '#f97316' : '#10b981'
  };
`;

const Description = styled.p`
  margin: 4px 0 0 0;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 1.4;
`;

export function KdsLoadGauge({ load, activeOrdersCount }: LoadGaugeProps) {
  // Let's compute a dynamic mock capacity percentage (e.g. 10 orders = 100% load)
  const maxCapacity = 10;
  const percentage = Math.min(100, (activeOrdersCount / maxCapacity) * 100);

  const getLoadColor = () => {
    if (load === 'High') return '#ef4444';
    if (load === 'Medium') return '#f97316';
    return '#10b981';
  };

  const getLoadIcon = () => {
    if (load === 'High') return <Flame size={18} />;
    if (load === 'Medium') return <AlertCircle size={18} />;
    return <Droplets size={18} />;
  };

  return (
    <Card>
      <GaugeContainer>
        <SvgWrapper>
          <svg width="90" height="90">
            <CircleBackground cx="45" cy="45" r="40" />
            <CircleFill 
              cx="45" 
              cy="45" 
              r="40" 
              percentage={percentage || 10} 
              color={getLoadColor()} 
            />
          </svg>
          <InnerLabel>
            <MainNumber>{activeOrdersCount}</MainNumber>
            <SubText>Active</SubText>
          </InnerLabel>
        </SvgWrapper>
        
        <Details>
          <Title>Kitchen Pressure</Title>
          <StatusIndicator load={load}>
            {getLoadIcon()}
            {load} Load
          </StatusIndicator>
          <Description>
            {load === 'High' 
              ? 'Extreme ticket density. Avoid adding batches.' 
              : load === 'Medium' 
              ? 'Steady ticket volume. Flow is stable.' 
              : 'Relaxed operation. High output capability.'}
          </Description>
        </Details>
      </GaugeContainer>
    </Card>
  );
}
