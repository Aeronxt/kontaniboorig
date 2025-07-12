import React, { useEffect, useRef } from 'react';

interface SpeedometerProps {
  value: number;
  maxValue: number;
  size: number;
  label?: string;
  color?: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ value, maxValue, size, label, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeedColor = (value: number, max: number): string => {
    if (color) return color;
    const percentage = (value / max) * 100;
    if (percentage < 30) return '#ef4444'; // red for < 30%
    if (percentage < 60) return '#f59e0b'; // yellow for 30-60%
    return '#22c55e'; // green for > 60%
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Set up dimensions
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8;

    // Draw background arc (full semicircle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();

    // Draw value arc
    const percentage = Math.min(value / maxValue, 1);
    const startAngle = Math.PI;
    const endAngle = startAngle + (percentage * Math.PI);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineWidth = 8;
    ctx.strokeStyle = getSpeedColor(value, maxValue);
    ctx.stroke();

    // Draw value text
    ctx.fillStyle = '#374151';
    ctx.font = `${size * 0.2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}`, centerX, centerY);

    // Draw label text
    ctx.font = `${size * 0.12}px sans-serif`;
    ctx.fillStyle = '#6b7280';
    ctx.fillText(label || '', centerX, centerY + (size * 0.15));

  }, [value, maxValue, size, label, color]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
};

export default Speedometer; 