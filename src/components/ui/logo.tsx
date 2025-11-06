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

  return (
    <div className={`flex items-center ${className}`} {...props}>
      {variant !== 'text' && (
        <img
          src="/logo.png.jpeg"
          alt="Sambhav Hack Energy Logo"
          className={`${sizeClasses[size]} object-contain`}
        />
      )}
      {variant !== 'icon' && (
        <span className={`ml-3 font-bold ${textSizes[size]} text-foreground`}>
          Sambhav Hack Energy
        </span>
      )}
    </div>
  );
};

export const LogoText = ({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <h1 className={`font-bold ${textSizes[size]} ${className} bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent`}>
      Sambhav Hack Energy
    </h1>
  );
};