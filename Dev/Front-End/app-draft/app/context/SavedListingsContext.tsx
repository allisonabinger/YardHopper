import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';

type ListingItem = {
  title: string;
  description: string;
  address: {
    zip: number;
    city: string;
    street: string;
    state: string;
  };
  dates: string[];
  images: { uri: string; caption: string }[];
  categories: string[];
  postId: string;
  g: {
    geopoint: {
      _latitude: number;
      _longitude: number;
    };
  };
};
// Define the types for your saved listings and context
interface SavedListing extends ListingItem {
  postId: string;
  // [key: string]: any; // Add additional fields if necessary
}

interface SavedListingsContextType {
  savedListings: SavedListing[];
  loading: boolean;
  error: string | null;
  addSavedListing: (postId: string) => Promise<void>;
  removeSavedListing: (postId: string) => Promise<void>;
}

interface SavedListingsProviderProps {
  children: ReactNode;
}

// Create the context with a default value of undefined
const SavedListingsContext = createContext<SavedListingsContextType | undefined>(undefined);

// Context Provider component
export const SavedListingsProvider: React.FC<SavedListingsProviderProps> = ({ children }) => {
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getIdToken, user } = useAuth();


  // Fetch saved listings from the backend
  const fetchSavedListings = async () => {
    try {
      setLoading(true);
      const idToken = await getIdToken();
      const response = await fetch('https://yardhopperapi.onrender.com/api/users/savedListings', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setSavedListings(data.savedListings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved listings');
      setSavedListings([]);
    } finally {
      setLoading(false);
    }
  };

  const addSavedListing = async (postId: string) => {
    try {
      const idToken = await getIdToken();
      const response = await fetch('https://yardhopperapi.onrender.com/api/users/savedListings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Optionally, update the state if needed based on the server response
      setSavedListings((prev) => [...prev, { postId } as SavedListing]);
    } catch (err: any) {
      console.error('Failed to save listing:', err.message);
    }
  };

  const removeSavedListing = async (postId: string) => {
    try {
      const idToken = await getIdToken();
      const response = await fetch('https://yardhopperapi.onrender.com/api/users/savedListings', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSavedListings((prev) =>
        prev.filter((listing) => listing.postId !== postId)
      );
    } catch (err: any) {
      console.error('Failed to remove listing:', err.message);
    }
  };
  // Fetch saved listings on initial load
  useEffect(() => {
    fetchSavedListings();
  }, []);

  return (
    <SavedListingsContext.Provider
      value={{
        savedListings,
        loading,
        error,
        addSavedListing,
        removeSavedListing,
      }}
    >
      {children}
    </SavedListingsContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSavedListings = (): SavedListingsContextType => {
  const context = useContext(SavedListingsContext);
  if (!context) {
    throw new Error('useSavedListings must be used within a SavedListingsProvider');
  }
  return context;
};