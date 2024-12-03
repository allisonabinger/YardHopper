import React, { createContext, useState, useContext } from "react";

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
  addSavedPost: (post: Sale) => void;
  removeSavedPost: (id: string) => void;
}

// Create a context with default values
const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

// Provider component to wrap the app and provide context
export const SavedPostsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState<Sale[]>([]);

  const addSavedPost = (post: Sale) => {
    console.log("Adding post:", post);
    setSavedPosts((prev) => [...prev, post]);
  };

  const removeSavedPost = (id: string) => {
    console.log("Removing post with ID:", id);
    setSavedPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, addSavedPost, removeSavedPost }}>
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
