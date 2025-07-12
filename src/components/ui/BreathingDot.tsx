import React from 'react';
import styled from 'styled-components';

interface BreathingDotProps {
  className?: string;
}

const BreathingDot: React.FC<BreathingDotProps> = ({ className = '' }) => {
  return (
    <StyledWrapper className={className}>
      <div className="circle">
        <div className="dot" />
        <div className="outline" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;

  .circle {
    --animation: 2s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 12px;
    height: 12px;
    border: solid 2px #dc2626;
    border-radius: 50%;
    background-color: transparent;
    animation: circle-keys var(--animation);
  }

  .circle .dot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #dc2626;
    animation: dot-keys var(--animation);
  }

  .circle .outline {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: outline-keys var(--animation);
  }

  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes outline-keys {
    0% {
      transform: scale(0);
      outline: solid 10px #dc2626;
      outline-offset: 0;
      opacity: 1;
    }

    100% {
      transform: scale(1);
      outline: solid 0 transparent;
      outline-offset: 10px;
      opacity: 0;
    }
  }
`;

export default BreathingDot; 