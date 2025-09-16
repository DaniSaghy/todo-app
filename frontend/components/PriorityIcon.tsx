'use client';

interface PriorityIconProps {
  priority: number; // 0=low, 1=medium, 2=high
  size?: number;
  className?: string;
}

export default function PriorityIcon({ priority, size = 16, className = "" }: PriorityIconProps) {
  const getPriorityConfig = (priority: number) => {
    switch (priority) {
        case 0: // Low
          return {
            lines: 1,
            color: 'text-blue-600',
            bgColor: 'bg-blue-200',
            label: 'Low'
          };
      case 1: // Medium
        return {
          lines: 2,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Medium'
        };
      case 2: // High
        return {
          lines: 3,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'High'
        };
      default:
        return {
          lines: 1,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          label: 'Low'
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <div 
      className={`inline-flex items-center justify-center rounded border ${config.bgColor} ${className}`}
      title={`${config.label} Priority`}
      style={{ width: size, height: size }}
    >
      <div className={`flex flex-col gap-0.5 ${config.color}`}>
        {Array.from({ length: config.lines }).map((_, index) => (
          <div
            key={index}
            className="w-3 h-0.5 bg-current rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}
