import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Card({ children, title, subtitle, footer, className, noPadding = false }: CardProps) {
  return (
    <div className={clsx('bg-white shadow rounded-lg overflow-hidden', className)}>
      {(title || subtitle) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={noPadding ? '' : 'px-4 py-5 sm:p-6'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}