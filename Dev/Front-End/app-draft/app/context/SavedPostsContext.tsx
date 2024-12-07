import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

// Define types for sale and saved posts
interface Sale {
  g: any;
  id: string;
  title: string;
  description: string;
  image: any;
}

interface SavedPostsContextType {
  savedPosts: Sale[];
  loading: boolean;
  error: string | null;
  fetchSavedPosts: (isRefresh?: boolean) => void;
  addSavedPost: (post: Sale) => void;
  removeSavedPost: (id: string) => void;
}

// Create a context with default values
const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

// Provider component to wrap the app and provide context
export const SavedPostsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState<Sale[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedPosts = async (isRefresh = false) => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://yardhopperapi.onrender.com/api/users/savedListings?page=${isRefresh ? 1 : page}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setSavedPosts((prevPosts) =>
        isRefresh ? data.favorites : [...prevPosts, ...data.favorites]
      );
      if (isRefresh) setPage(2); // Reset to page 2 for next fetch
      else setPage(page + 1);
    } catch (error: any) {
      setError(error.message || "Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  };

  const addSavedPost = (post: Sale) => {
    console.log("Adding post:", post);
    setSavedPosts((prev) => [...prev, post]);
  };

  const removeSavedPost = (id: string) => {
    console.log("Removing post with ID:", id);
    setSavedPosts((prev) => prev.filter((post) => post.id !== id));
  };

  useEffect(() => {
    fetchSavedPosts(true); // Fetch initial data
  }, []);

  return (
    <SavedPostsContext.Provider
      value={{ savedPosts, loading, error, fetchSavedPosts, addSavedPost, removeSavedPost }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = (): SavedPostsContextType => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error("useSavedPosts must be used within a SavedPostsProvider");
  }
  return context;
};

export default SavedPostsProvider;
