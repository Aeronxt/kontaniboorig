import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  primaryColor?: string;
  hoverColor?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean; 
}

const Button: React.FC<ButtonProps> = ({ children, primaryColor = '#2563eb', hoverColor = '#1d4ed8', onClick, disabled, type = 'button', isLoading }) => {
  return (
    <StyledWrapper $primaryColor={primaryColor} $hoverColor={hoverColor}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading} 
        className="button"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> 
        ) : (
          children
        )}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $primaryColor: string; $hoverColor: string }>`
  .button {
    line-height: 1;
    text-decoration: none;
    display: inline-flex;
    border: none;
    cursor: pointer;
    align-items: center;
    background-color: ${ (props) => props.$primaryColor};
    color: #fff;
    border-radius: 10rem; 
    font-weight: 600;
    padding: 0.75rem 1rem; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color 0.3s;
    width: 100%; 
    justify-content: center; 
  }

  .button:hover {
    background-color: ${ (props) => props.$hoverColor};
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button; 