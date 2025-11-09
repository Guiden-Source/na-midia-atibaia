import { DRINK_TYPES, type EventDrink } from '@/lib/drinks/types';

interface DrinkListProps {
  drinks: EventDrink[];
  compact?: boolean;
}

export function DrinkList({ drinks, compact = false }: DrinkListProps) {
  if (drinks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <span className="text-4xl mb-2 block">🍺</span>
        <p>Nenhuma bebida disponível ainda</p>
      </div>
    );
  }

  // Agrupa por tipo
  const drinksByType = drinks.reduce((acc, item) => {
    const tipo = item.drink?.tipo;
    if (tipo) {
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(item);
    }
    return acc;
  }, {} as Record<string, typeof drinks>);

  if (compact) {
    return (
      <div className="space-y-2">
        {Object.entries(drinksByType).map(([tipo, items]) => {
          const typeInfo = DRINK_TYPES[tipo as keyof typeof DRINK_TYPES];
          return (
            <div key={tipo} className="flex items-center gap-2">
              <span className="text-2xl">{typeInfo.icon}</span>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">{typeInfo.label}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {items.map(i => i.drink?.nome).join(', ')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(drinksByType).map(([tipo, items]) => {
        const typeInfo = DRINK_TYPES[tipo as keyof typeof DRINK_TYPES];
        return (
          <div key={tipo}>
            <h3 className="flex items-center gap-2 text-lg font-baloo2 font-bold mb-3 text-gray-900 dark:text-white">
              <span className="text-2xl">{typeInfo.icon}</span>
              {typeInfo.label}
              <span className="text-sm font-normal text-gray-500">({items.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                    item.destaque
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-600'
                      : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-baloo2 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {item.drink?.nome}
                        {item.destaque && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                            ⭐ Destaque
                          </span>
                        )}
                      </p>
                      {item.drink?.descricao && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.drink.descricao}
                        </p>
                      )}
                    </div>
                    {item.preco_evento && (
                      <p className="text-lg font-baloo2 font-bold text-orange-600 dark:text-orange-400 ml-3">
                        R$ {item.preco_evento.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
