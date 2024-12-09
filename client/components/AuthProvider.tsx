import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

type Profile = {
  first: string;
  last: string;
  email: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  getValidIdToken: () => Promise<string | null>;
  deleteUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

async function fetchUserProfile(token: string): Promise<Profile | null> {
  try {
    const response = await fetch("https://yardhopperapi.onrender.com/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null; // No profile found
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

async function getValidIdToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    return await currentUser.getIdToken(true); // Force token refresh
  } catch (error) {
    console.error("Error refreshing ID token:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function refreshProfile() {
    if (user) {
      try {
        console.log("Refreshing profile for user:", user.email); // Debug
        const token = await getValidIdToken();
        if (token) {
          const updatedProfile = await fetchUserProfile(token);
          console.log("Updated Profile:", updatedProfile); // Debug
          setProfile(updatedProfile);
        }
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshProfile();
      } else {
        setProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  async function register(email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user); // Update state with the new user
    return userCredential;
  }

  async function login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user); // Update state with the logged-in user
    return userCredential;
  }

  async function logout() {
    setUser(null);
    setProfile(null);
    return auth.signOut();
  }

  async function deleteUser(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user to delete.");

    try {
      const token = await getValidIdToken(); // Ensure a fresh token is used
      if (!token) throw new Error("Failed to retrieve a valid token.");

      // Delete user profile from backend
      const response = await fetch("https://yardhopperapi.onrender.com/api/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user profile.");
      }

      // Delete the user from Firebase Auth
      await currentUser.delete();
    } catch (error) {
      // console.error("Error during user deletion:", error);
      // throw error; // Propagate error to be handled by the caller
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        register,
        login,
        logout,
        resetPassword: (email: string) => sendPasswordResetEmail(auth, email),
        getValidIdToken,
        deleteUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
