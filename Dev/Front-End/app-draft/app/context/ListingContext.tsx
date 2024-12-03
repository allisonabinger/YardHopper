import React, { createContext, useContext, useState, ReactNode } from "react";

interface Address {
  zip: string;
  city: string;
  street: string;
  state: string;
}

interface ImageData {
  file: File;
  caption: string;
}

interface ListingData {
  title: string;
  description: string;
  address: Address;
  dates: string[];
  startTime: string;
  endTime: string;
  categories: string[];
  subcategories: Record<string, boolean>;
  userId: string;
  images: ImageData[]; // Array of image objects
}

// Define the context value type
interface ListingContextType {
  listingData: ListingData;
  updateListingData: (newData: Partial<ListingData>) => void;
  addImage: (imageData: ImageData) => void;
}

// Create the context with a default value
const ListingContext = createContext<ListingContextType | undefined>(undefined);

// Hook for accessing the context
export const useListingContext = (): ListingContextType => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
};

interface ListingProviderProps {
  children: ReactNode;
}

export const ListingProvider: React.FC<ListingProviderProps> = ({ children }) => {
  const [listingData, setListingData] = useState<ListingData>({
    title: "",
    description: "",
    address: {
      zip: "",
      city: "",
      street: "",
      state: "",
    },
    dates: [],
    startTime: "",
    endTime: "",
    categories: [],
    subcategories: {},
    userId: "",
    images: [],
  });

  const updateListingData = (newData: Partial<ListingData>) => {
    setListingData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const addImage = (imageData: ImageData) => {
    setListingData((prevData) => ({
      ...prevData,
      images: [...prevData.images, imageData],
    }));
  };

  return (
    <ListingContext.Provider value={{ listingData, updateListingData, addImage }}>
      {children}
    </ListingContext.Provider>
  );
};