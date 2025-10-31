import React from 'react';
import { Shield, User, Crown } from 'lucide-react';
import { User as UserType } from '../types';


interface UserRoleIndicatorProps {
  user: UserType;
  compact?: boolean;
}

export function UserRoleIndicator({ user, compact = false }: UserRoleIndicatorProps) {


  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: Crown,
          color: 'bg-purple-500 text-white',
          label: 'Quản lý',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          textColor: 'text-purple-800 dark:text-purple-200'
        };
      case 'staff':
        return {
          icon: Shield,
          color: 'bg-green-500 text-white',
          label: 'Nhân viên',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-200'
        };
      default:
        return {
          icon: User,
          color: 'bg-blue-500 text-white',
          label: 'Khách hàng',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-200'
        };
    }
  };

  const config = getRoleConfig(user.role);
  const IconComponent = config.icon;

  if (compact) {
    return (
      <div
        className={`p-1 rounded-full ${config.color} stable-layout`}
        title={config.label}
      >
        <IconComponent className="h-3 w-3" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} stable-layout`}
    >
      <div className={`p-1 rounded-full ${config.color}`}>
        <IconComponent className="h-3 w-3" />
      </div>
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}