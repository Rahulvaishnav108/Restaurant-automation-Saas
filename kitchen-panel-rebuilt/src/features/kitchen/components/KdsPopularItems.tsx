import React from 'react';
import styled from 'styled-components';
import { Card } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { TrendingUp, Flame, ChefHat } from 'lucide-react';

interface PopularItem {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'steady';
  type: string;
}

const mockPopularItems: PopularItem[] = [
  { name: 'Paneer Butter Masala', count: 18, trend: 'up', type: 'Curry' },
  { name: 'Garlic Naan (Basket)', count: 14, trend: 'up', type: 'Bread' },
  { name: 'Veg Biryani Special', count: 10, trend: 'steady', type: 'Rice' },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  flex: 1;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ItemName = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemCategory = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const Count = styled.span`
  font-family: ${({ theme }) => theme.typography.fontHeading};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export function KdsPopularItems() {
  return (
    <Card>
      <Container>
        <Header>
          <TrendingUp size={16} color="#f97316" />
          <Title>High Volume Items</Title>
          <ChefHat size={16} color="#64748b" />
        </Header>

        <ItemList>
          {mockPopularItems.map((item) => (
            <ItemRow key={item.name}>
              <LeftSide>
                <IconCircle>
                  <Flame size={14} />
                </IconCircle>
                <NameWrapper>
                  <ItemName>{item.name}</ItemName>
                  <ItemCategory>{item.type}</ItemCategory>
                </NameWrapper>
              </LeftSide>

              <RightSide>
                <Count>{item.count} sold</Count>
                <Badge variant={item.trend === 'up' ? 'prep' : 'neutral'}>
                  {item.trend === 'up' ? 'Hot' : 'Steady'}
                </Badge>
              </RightSide>
            </ItemRow>
          ))}
        </ItemList>
      </Container>
    </Card>
  );
}
