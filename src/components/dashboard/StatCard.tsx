import React, { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  mainValue?: string;
  subValue?: string;
  trend?: {
    value: string;
    label: string;
    isPositive: boolean;
  };
  children?: ReactNode;
}

export default function StatCard({ 
  icon, 
  iconBgColor, 
  title, 
  mainValue,
  subValue,
  trend,
  children 
}: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-start">
          <div className={`${iconBgColor} rounded-md p-3 mr-4`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            {mainValue && (
              <div className="mt-1">
                <p className="text-2xl font-semibold text-gray-900">
                  {mainValue}
                </p>
                {subValue && (
                  <p className="mt-1 text-sm text-gray-600">
                    {subValue}
                  </p>
                )}
                {trend && (
                  <p className={`mt-2 text-sm flex items-center ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span className="font-medium">{trend.value}</span>
                    <span className="ml-2">{trend.label}</span>
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}