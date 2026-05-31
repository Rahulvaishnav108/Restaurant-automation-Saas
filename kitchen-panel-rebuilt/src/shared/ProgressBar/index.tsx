import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
`;

export const ProgressBarFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => Math.min(100, Math.max(0, progress))};
  background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
  border-radius: 9999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.7);
  animation: ${pulse} 2s infinite ease-in-out;
`;
