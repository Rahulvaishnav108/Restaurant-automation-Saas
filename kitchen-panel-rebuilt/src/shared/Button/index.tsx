import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  transition: ${({ theme }) => theme.transitions.default};
  gap: 8px;
  letter-spacing: 0.02em;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 8px 14px;
          font-size: ${theme.typography.sizes.xs};
          border-radius: 8px;
        `;
      case 'lg':
        return css`
          padding: 16px 28px;
          font-size: ${theme.typography.sizes.base};
          border-radius: 16px;
        `;
      case 'md':
      default:
        return css`
          padding: 12px 20px;
          font-size: ${theme.typography.sizes.sm};
        `;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary.orange} 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.45);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.bg.badge};
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.border.light};

          &:hover:not(:disabled) {
            background: rgba(51, 65, 85, 0.8);
            border-color: ${theme.colors.border.strong};
            transform: translateY(-1px);
          }
        `;
      case 'success':
        return css`
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.2);

          &:hover:not(:disabled) {
            background: #10b981;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
            transform: translateY(-2px);
          }
        `;
      case 'danger':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);

          &:hover:not(:disabled) {
            background: #ef4444;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
            transform: translateY(-2px);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.text.secondary};
          padding: 8px;

          &:hover:not(:disabled) {
            color: ${theme.colors.text.primary};
            background: rgba(255, 255, 255, 0.05);
          }
        `;
    }
  }}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;
