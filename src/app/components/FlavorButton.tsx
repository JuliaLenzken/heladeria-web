import { IceCream } from 'lucide-react';

interface FlavorButtonProps {
  flavor: {
    name: string;
    color: string;
  };
  onClick: () => void;
}

export function FlavorButton({ flavor, onClick }: FlavorButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border-2 bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
      style={{ borderColor: '#6B21A8' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div 
          className="p-3 rounded-full transition-transform group-hover:rotate-12"
          style={{ backgroundColor: `${flavor.color}40` }}
        >
          <IceCream className="w-8 h-8" style={{ color: flavor.color }} />
        </div>
        <span className="font-medium text-center" style={{ color: '#800020' }}>{flavor.name}</span>
      </div>
    </button>
  );
}