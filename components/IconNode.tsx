"use client";

import * as Icons from "lucide-react";

export default function IconNode({ data }: { data: { iconName: string; label: string } }) {
  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons] as React.ElementType;

  if (!IconComponent) return null;
  return <IconComponent className="w-6 h-6 text-gray-700 bg-white" />;

  /* return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        {IconComponent && <IconComponent className="w-6 h-6 text-gray-700" />}
        <span className="text-xs text-gray-600">{data.label}</span>
      </div>
    </div>
  ); */
}
