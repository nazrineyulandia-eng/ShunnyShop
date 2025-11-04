import React, { createContext, useContext, useState } from 'react';

type CategoryContextType = {
    category: string;
    setCategory: (category: string) => void;
};

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};
export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [category, setCategory] = useState<string>('all');

    return (
        <CategoryContext.Provider value={{ category, setCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryContext;