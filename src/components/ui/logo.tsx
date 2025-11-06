import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const logo = (
    <div className={`flex items-center ${className}`} {...props}>
      {variant !== 'text' && (
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-500" />
          <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
            <div className="h-3/5 w-3/5 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <div className="h-1/2 w-1/2 rounded-full bg-background" />
            </div>
          </div>
        </div>
      )}
      {variant !== 'icon' && (
        <span className={`ml-3 font-bold ${textSizes[size]} bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          CollabForge
        </span>
      )}
    </div>
  );

  return logo;
};

export const LogoText = ({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const textSizes = {
    sm: 'text-xl',
    md: '2xl',
    lg: '4xl',
  };

  return (
    <h1 className={`font-bold ${textSizes[size]} ${className} bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent`}>
      CollabForge
    </h1>
  );
};
