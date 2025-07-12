import React from 'react';
import styled from 'styled-components';
import { LucideIcon } from 'lucide-react';

interface ProductCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  minAmount?: string;
  maxAmount?: string;
  interestRate?: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  title,
  description,
  minAmount,
  maxAmount,
  interestRate,
  onClick
}) => {
  return (
    <StyledWrapper onClick={onClick}>
      <div className="card">
        <div className="content">
          <div className="icon">
            {icon}
          </div>
          <div className="info">
            <h3 className="title">{title}</h3>
            <p className="description">{description}</p>
            {interestRate && (
              <div className="rate">
                <span className="label">Interest Rate:</span>
                <span className="value">{interestRate}</span>
              </div>
            )}
            {minAmount && maxAmount && (
              <div className="amount">
                <span className="label">Amount Range:</span>
                <span className="value">{minAmount} - {maxAmount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 24px;
    line-height: 1.6;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 36px;
    border-radius: 22px;
    color: #ffffff;
    overflow: hidden;
    background: #0a3cff;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    width: 100%;
  }

  .content::before {
    position: absolute;
    content: "";
    top: -4%;
    left: 50%;
    width: 90%;
    height: 90%;
    transform: translate(-50%);
    background: #ced8ff;
    z-index: -1;
    transform-origin: bottom;
    border-radius: inherit;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .content::after {
    position: absolute;
    content: "";
    top: -8%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%);
    background: #e7ecff;
    z-index: -2;
    transform-origin: bottom;
    border-radius: inherit;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .icon {
    width: 48px;
    height: 48px;
    color: #ffffff;
  }

  .info {
    width: 100%;
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .description {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 16px;
  }

  .rate, .amount {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-top: 8px;
  }

  .label {
    opacity: 0.8;
  }

  .value {
    font-weight: 500;
  }

  .card:hover {
    transform: translate(0px, -16px);
  }

  .card:hover .content::before {
    rotate: -8deg;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .card:hover .content::after {
    rotate: 8deg;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

export default ProductCard; 