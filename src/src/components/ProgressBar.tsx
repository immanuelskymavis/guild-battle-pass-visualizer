import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  showNumbers?: boolean;
  className?: string;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  showNumbers = true,
  className = '',
  animated = true
}) => {
  const percentage = Math.min(100, (current / max) * 100);

  return (
    <div className={`w-full ${className}`}>
      {showNumbers && (
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>{current.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className={`progress-fill ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showNumbers && (
        <div className="text-center text-xs text-gray-400 mt-1">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;