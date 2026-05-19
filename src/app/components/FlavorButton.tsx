import { IceCream } from 'lucide-react';

interface FlavorButtonProps {
  flavor: {
    name: string;
    color: string;
  };
  onClick: () => void;
}

export function FlavorButton({ flavor, onClick }: FlavorButtonProps) {
  // Map flavor names to CSS class names
  const getFlavorClasses = (flavorName: string) => {
    const normalizedName = flavorName.toLowerCase().replace(/\s+/g, '-');
    return {
      bg: `flavor-bg-${normalizedName}`,
      icon: `flavor-icon-${normalizedName}`
    };
  };

  const classes = getFlavorClasses(flavor.name);

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border-2 bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 flavor-button ${classes.bg}`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="p-3 rounded-full transition-transform group-hover:rotate-12 flavor-icon-bg"
        >
          <IceCream className={`w-8 h-8 flavor-icon ${classes.icon}`} />
        </div>
        <span className="font-medium text-center flavor-name">{flavor.name}</span>
      </div>
    </button>
  );
}