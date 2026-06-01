import styled, { css } from 'styled-components';

interface BadgeProps {
  variant?: 'new' | 'prep' | 'ready' | 'delayed' | 'neutral' | 'accent';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: 0.675rem;
  font-weight: ${({ theme }) => theme.typography.weights.extrabold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1px solid transparent;
  white-space: nowrap;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ variant = 'neutral', theme }) => {
    switch (variant) {
      case 'new':
        return css`
          background: rgba(248, 250, 252, 0.06);
          color: #f8fafc;
          border-color: rgba(248, 250, 252, 0.15);
        `;
      case 'prep':
        return css`
          background: rgba(249, 115, 22, 0.12);
          color: #f97316;
          border-color: rgba(249, 115, 22, 0.25);
        `;
      case 'ready':
        return css`
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.25);
        `;
      case 'delayed':
        return css`
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.25);
        `;
      case 'accent':
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary.orange} 0%, #ea580c 100%);
          color: #ffffff;
        `;
      case 'neutral':
      default:
        return css`
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
          border-color: rgba(148, 163, 184, 0.2);
        `;
    }
  }}
`;
