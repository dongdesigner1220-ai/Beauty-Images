import React from 'react';
import { EnhancementMode, UpscaleLevel } from '../types';
import { Mountain, User, Package, Sparkles } from 'lucide-react';

interface ControlPanelProps {
  mode: EnhancementMode;
  setMode: (mode: EnhancementMode) => void;
  upscale: UpscaleLevel;
  setUpscale: (upscale: UpscaleLevel) => void;
  disabled?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  setMode,
  upscale,
  setUpscale,
  disabled
}) => {
  const modes = [
    { id: EnhancementMode.LANDSCAPE, label: 'Landscape', icon: Mountain },
    { id: EnhancementMode.PORTRAIT, label: 'Portrait', icon: User },
    { id: EnhancementMode.PRODUCT, label: 'Product', icon: Package },
    { id: EnhancementMode.RETOUCH, label: 'Retouch (Beauty)', icon: Sparkles },
  ];

  const upscaleLevels = [UpscaleLevel.OG, UpscaleLevel.X2, UpscaleLevel.X4, UpscaleLevel.X8];

  return (
    <div className="space-y-6">
      {/* Upscale Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Upscale Level</label>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {upscaleLevels.map((level) => (
            <button
              key={level}
              onClick={() => setUpscale(level)}
              disabled={disabled}
              className={`
                flex-1 py-2 text-sm font-medium rounded-md transition-all
                ${upscale === level 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Enhancement Mode</label>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              disabled={disabled}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all h-28
                ${mode === item.id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-gray-50'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <item.icon className={`w-6 h-6 mb-2 ${mode === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};