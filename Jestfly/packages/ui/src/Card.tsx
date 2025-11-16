import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = true,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyle = shadow ? 'shadow-lg' : '';

  return (
    <div className={`bg-white rounded-lg ${shadowStyle} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};
