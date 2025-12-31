"use client";

interface ApartmentInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function ApartmentInput({ value, onChange, error }: ApartmentInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Permite apenas números
        const newValue = e.target.value.replace(/\D/g, '');
        onChange(newValue);
    };

    return (
        <div className="space-y-2">
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-900 dark:text-white">
                Número do Apartamento <span className="text-red-500">*</span>
            </label>

            <input
                type="text"
                id="apartment"
                value={value}
                onChange={handleChange}
                placeholder="Ex: 101, 501, 1002"
                maxLength={4}
                className={`
          w-full px-4 py-3 rounded-xl font-baloo2 text-lg
          bg-white dark:bg-gray-800
          border-2 transition-all
          ${error
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    }
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-orange-500/20
        `}
            />

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
                Digite apenas o número do apartamento (apenas números)
            </p>
        </div>
    );
}
