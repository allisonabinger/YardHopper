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
  startDate?: string;
  endDate?: string;
  startTime: Date;
  endTime: Date;
  categories: string[];
  subcategories: Record<string, string[]>;
  userId: string;
  images: ImageData[]; // Array of image objects
  postId?: string; // Added this for referencing posts
}

// Define the context value type
interface ListingContextType {
  listingData: ListingData;
  updateListingData: (newData: Partial<ListingData>) => void;
  addImage: (imageData: ImageData) => void;
  updateListing: (postId: string, updatedFields: Partial<ListingData>, token: string) => Promise<void>;
}

// Create the context with a default value
const ListingContext = createContext<ListingContextType | undefined>(undefined);

const getDatesInRange = (start: string, end: string): string[] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates: string[] = [];

  while (startDate <= endDate) {
    dates.push(startDate.toISOString().split("T")[0]); // Format as "yyyy-mm-dd"
    startDate.setDate(startDate.getDate() + 1); // Increment by 1 day
  }

  return dates;
};

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
    startTime: new Date(),
    endTime: new Date(),
    categories: [],
    subcategories: {},
    userId: "",
    images: [],
  });

  const updateListingData = (newData: Partial<ListingData>) => {
    setListingData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      console.log("Updating listingData:", updatedData);
      // If startDate and endDate are present, calculate the dates array
      if (newData.startDate && newData.endDate) {
        updatedData.dates = getDatesInRange(newData.startDate, newData.endDate);
        console.log("Updating listingData:", updatedData);
      }

      return updatedData;
    });
  };

  const addImage = (imageData: ImageData) => {
    setListingData((prevData) => ({
      ...prevData,
      images: [...prevData.images, imageData],
    }));
  };

  // Update a listing using `fetch`
  const updateListing = async (
    postId: string,
    updatedFields: Partial<ListingData>,
    token: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `https://yardhopperapi.onrender.com/api/listings/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update listing");
      }

      const data = await response.json();

      // Update local state
      setListingData((prevData) => {
        if (prevData.postId === postId) {
          return { ...prevData, ...data.listing };
        }
        return prevData;
      });

      console.log("Listing updated successfully:", data);
    } catch (error) {
      console.error("Error updating listing:", error);
      throw error;
    }
  };


  return (
    <ListingContext.Provider
      value={{ listingData, updateListingData, addImage, updateListing }}
    >
      {children}
    </ListingContext.Provider>
  );
};