import styled, { css } from 'styled-components';

interface CardProps {
  glow?: boolean;
  statusBorder?: 'new' | 'prep' | 'ready' | 'delayed';
  interactive?: boolean;
}

export const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.bg.card};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${({ glow, theme }) =>
    glow &&
    css`
      box-shadow: ${theme.shadows.glow};
    `}

  ${({ statusBorder, theme }) => {
    if (!statusBorder) return '';
    const status = theme.colors.status[statusBorder];
    return css`
      border-color: ${status.border};
      box-shadow: 0 4px 20px ${status.shadow};

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: ${statusBorder === 'new' 
          ? 'linear-gradient(90deg, #94a3b8, #cbd5e1)' 
          : statusBorder === 'prep' 
          ? 'linear-gradient(90deg, #f97316, #fdba74)' 
          : statusBorder === 'ready' 
          ? 'linear-gradient(90deg, #10b981, #6ee7b7)' 
          : 'linear-gradient(90deg, #ef4444, #fca5a5)'};
      }
    `;
  }}

  ${({ interactive, theme }) =>
    interactive &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-4px) scale(1.01);
        border-color: ${theme.colors.border.strong};
        background: ${theme.colors.bg.cardHover};
        box-shadow: ${theme.shadows.lg};
      }
    `}
`;
