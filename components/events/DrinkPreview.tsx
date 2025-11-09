import { DRINK_TYPES, type EventDrink } from '@/lib/drinks/types';

interface DrinkPreviewProps {
  drinks: EventDrink[];
  maxDisplay?: number;
  showLabel?: boolean;
}

export function DrinkPreview({ 
  drinks, 
  maxDisplay = 4,
  showLabel = true 
}: DrinkPreviewProps) {
  const displayDrinks = drinks.slice(0, maxDisplay);
  const remainingCount = drinks.length - maxDisplay;

  // Agrupa por tipo para mostrar ícones únicos
  const drinksByType = displayDrinks.reduce((acc, item) => {
    const tipo = item.drink?.tipo;
    if (tipo && DRINK_TYPES[tipo]) {
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(item);
    }
    return acc;
  }, {} as Record<string, typeof displayDrinks>);

  if (drinks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          🍺 Bebidas:
        </span>
      )}
      
      <div className="flex items-center gap-1.5">
        {Object.entries(drinksByType).map(([tipo, items]) => {
          const typeInfo = DRINK_TYPES[tipo as keyof typeof DRINK_TYPES];
          return (
            <div
              key={tipo}
              className="flex items-center gap-0.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg"
              title={`${items.length} ${typeInfo.label.toLowerCase()}(s)`}
            >
              <span className="text-xl">{typeInfo.icon}</span>
              {items.length > 1 && (
                <span className="text-xs font-bold text-white">
                  {items.length}
                </span>
              )}
            </div>
          );
        })}
        
        {remainingCount > 0 && (
          <span className="text-sm font-medium text-white/80 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
}
