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
  savedListings: { listings: SavedListing[] };
  loading: boolean;
  error: string | null;
  addSavedListing: (postId: string) => Promise<void>;
  removeSavedListing: (postId: string) => Promise<void>;
  fetchSavedListings: () => Promise<void>,
}

interface SavedListingsProviderProps {
  children: ReactNode;
}

// Create the context with a default value of undefined
const SavedListingsContext = createContext<SavedListingsContextType | undefined>(undefined);

// Context Provider component
export const SavedListingsProvider: React.FC<SavedListingsProviderProps> = ({ children }) => {
  const [savedListings, setSavedListings] = useState<{ listings: SavedListing[] }>({ listings: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getValidIdToken, user } = useAuth();


  // Fetch saved listings from the backend
  const fetchSavedListings = async () => {
    try {
      setLoading(true);
      const idToken = await getValidIdToken();
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

      // Transform saved listings to match HomeFeed format
      const transformedListings = data.savedListings.map((item: ListingItem) => ({
        ...item,
        address: item.address || { street: 'Unknown', city: 'Unknown', zip: 0, state: 'Unknown' },
        dates: item.dates || ['Unknown date'],
        images: item.images || [{ uri: '', caption: 'No image available' }],
      }));

      // Wrap the listings in a "listings" array
      setSavedListings({ listings: transformedListings });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved listings');
      setSavedListings({ listings: [] }); // Ensure consistent format even on failure
    } finally {
      setLoading(false);
    }
  };

  const addSavedListing = async (postId: string) => {
    try {
      const idToken = await getValidIdToken();
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

      // setSavedListings((prev) => ({
      //   listings: [...prev.listings, { postId } as SavedListing],
      // }));
      fetchSavedListings();
    } catch (err: any) {
      console.error('Failed to save listing:', err.message);
    }
  };

  const removeSavedListing = async (postId: string) => {
    try {
      const idToken = await getValidIdToken();
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

      // setSavedListings((prev) => ({
      //   listings: prev.listings.filter((listing) => listing.postId !== postId),
      // }));
      fetchSavedListings();
    } catch (err: any) {
      console.error('Failed to remove listing:', err.message);
    }
  };
  // Fetch saved listings on initial load
  const transformSavedListings = (listings: SavedListing[]): { listings: SavedListing[] } => ({
    listings: listings.map((item) => ({
      ...item,
      address: item.address || { street: 'Unknown', city: 'Unknown', zip: 0, state: 'Unknown' },
      dates: item.dates || ['Unknown date'],
      images: item.images || [{ uri: '', caption: 'No image available' }],
    })),
  });

  useEffect(() => {
    fetchSavedListings(); // Already transforms and sets savedListings
  }, []);

  return (
    <SavedListingsContext.Provider
      value={{
        savedListings,
        loading,
        error,
        addSavedListing,
        removeSavedListing,
        fetchSavedListings,
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
