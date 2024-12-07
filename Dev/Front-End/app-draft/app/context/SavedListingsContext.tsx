import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from '@/components/AuthProvider';

// Define the types for your saved listings and context
interface SavedListing {
  postId: string;
  [key: string]: any; // Add additional fields if necessary
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
      const response = await axios.get<{ savedListings: SavedListing[] }>(
        'https://yardhopperapi.onrender.com/api/users/savedListings',
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      setSavedListings(response.data.savedListings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved listings');
      setSavedListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a listing to saved listings
  const addSavedListing = async (postId: string) => {
    try {
      const idToken = await getIdToken();
      await axios.post(
        'https://yardhopperapi.onrender.com/api/users/savedListings',
        { postId },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      setSavedListings((prev) => [...prev, { postId }]); // Adjust if the API returns more data
    } catch (err: any) {
      console.error('Failed to save listing:', err.message);
    }
  };

  // Remove a listing from saved listings
  const removeSavedListing = async (postId: string) => {
    try {
      const idToken = await getIdToken();
      await axios.delete(
        'https://yardhopperapi.onrender.com/api/users/savedListings',
        {
          headers: { Authorization: `Bearer ${idToken}` },
          data: { postId },
        }
      );
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