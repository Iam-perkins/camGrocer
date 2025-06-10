"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { LanguageContext, LanguageContextType } from '@/contexts/language-context';

interface SearchContextType {
  query: string;
  results: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  }>;
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  useEffect(() => {
    if (query.length > 2) {
      search(query);
    } else {
      clearResults();
    }
  }, [query, language]);

  const search = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setQuery(query);

      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        loading,
        error,
        search,
        clearResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
