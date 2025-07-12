import React, { useState } from 'react';
import { X } from 'lucide-react';
import styled from 'styled-components';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevelopmentModal: React.FC<DevelopmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <StyledModalOverlay>
      <div className="modal-container">
        <div className="modal-container-header">
          <div className="modal-container-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            We're actively developing
          </div>
          <button className="icon-button" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-container-body rtf">
          <p>
            Our team is constantly updating and improving the comparison database to bring you the most accurate and helpful results.
          </p>
          <p>
            If you notice any incorrect information or have suggestions, please email us at{' '}
            <a href="mailto:info@kontanibo.com" className="text-blue-600 hover:text-blue-700">
              info@kontanibo.com
            </a>{' '}
            – we appreciate your support! 💬
          </p>
          <p className="mt-4 font-medium">
            Thank you for being part of our journey.
          </p>
        </div>
        <div className="modal-container-footer">
          <button className="button is-primary" onClick={onClose}>
            Read
          </button>
        </div>
      </div>
    </StyledModalOverlay>
  );
};

const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-container {
    max-height: 400px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 600px) {
    .modal-container {
      width: 90%;
      max-width: 320px;
      max-height: 280px;
      border-radius: 12px;
    }
  }

  .modal-container-header {
    padding: 16px 32px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 600px) {
    .modal-container-header {
      padding: 12px 16px;
    }
  }

  .modal-container-title {
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
    font-weight: 700;
    font-size: 1.125rem;

    svg {
      width: 32px;
      height: 32px;
      color: #750550;
    }
  }

  @media (max-width: 600px) {
    .modal-container-title {
      font-size: 0.875rem;
      gap: 6px;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .modal-container-body {
    padding: 24px 32px 51px;
    overflow-y: auto;
  }

  @media (max-width: 600px) {
    .modal-container-body {
      padding: 16px 16px 32px;
      font-size: 0.875rem;
      line-height: 1.4;
    }
  }

  .rtf {
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
    }

    h1 {
      font-size: 1.5rem;
      line-height: 1.125;
    }

    h2 {
      font-size: 1.25rem;
      line-height: 1.25;
      margin-top: 1.5em;
    }

    h3 {
      font-size: 1rem;
      line-height: 1.5;
    }

    > * + * {
      margin-top: 1em;
    }

    ul, ol {
      margin-left: 20px;
      list-style-position: inside;
    }

    ol {
      list-style: numeric;
    }

    ul {
      list-style: disc;
    }
  }

  .modal-container-footer {
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid #ddd;
    gap: 12px;
    position: relative;

    &:after {
      content: "";
      display: block;
      position: absolute;
      top: -51px;
      left: 24px;
      right: 24px;
      height: 50px;
      flex-shrink: 0;
      background-image: linear-gradient(to top, rgba(255, 255, 255, 0.75), transparent);
      pointer-events: none;
    }
  }

  @media (max-width: 600px) {
    .modal-container-footer {
      padding: 12px 16px;

      &:after {
        top: -32px;
        left: 16px;
        right: 16px;
        height: 32px;
      }
    }
  }

  .button {
    padding: 12px 20px;
    border-radius: 8px;
    background-color: transparent;
    border: 0;
    font-weight: 600;
    cursor: pointer;
    transition: 0.15s ease;

    &.is-ghost {
      &:hover, &:focus {
        background-color: #dfdad7;
      }
    }

    &.is-primary {
      background-color: #750550;
      color: #fff;

      &:hover, &:focus {
        background-color: #4a0433;
      }
    }
  }

  @media (max-width: 600px) {
    .button {
      padding: 8px 16px;
      font-size: 0.875rem;
    }
  }

  .icon-button {
    padding: 0;
    border: 0;
    background-color: transparent;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    cursor: pointer;
    border-radius: 8px;
    transition: 0.15s ease;

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover, &:focus {
      background-color: #dfdad7;
    }
  }

  @media (max-width: 600px) {
    .icon-button {
      width: 32px;
      height: 32px;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

export default DevelopmentModal; 