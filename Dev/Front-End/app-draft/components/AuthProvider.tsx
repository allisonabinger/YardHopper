import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
  sendPasswordResetEmail,
  deleteUser as firebaseDeleteUser
} from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Profile = {
  first: string;
  last: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: number;
  createdAt: string;
};

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  getIdToken: () => Promise<string | null>;
  deleteUser: () => Promise<void>;
  user?: User | null;
  profile?: Profile | null;
};

const AuthContext = createContext<AuthContextType>({
  register: async () => Promise.reject("Not implemented"),
  logout: async () => Promise.reject("Not implemented"),
  login: async () => Promise.reject("Not implemented"),
  resetPassword: async () => Promise.reject("Not implemented"),
  getIdToken: async () => Promise.reject("Not implemented"),
  deleteUser: async () => Promise.reject("Not implemented"),
  user: null,
  profile: null,
});

export const useAuth = () => useContext<AuthContextType>(AuthContext);

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
      console.error("Failed to fetch user profile:", response.status, response.statusText);
      return null;
    }

    const profile: Profile = await response.json();
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

function register(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

function logout(): Promise<void> {
  return auth.signOut();
}

function login(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

async function getIdToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.warn("No authenticated user found");
    return null;
  }
  return currentUser.getIdToken();
}

async function deleteUser(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No authenticated user found to delete.");
  }
  await firebaseDeleteUser(currentUser);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        console.log("User signed in:", user);
        const token = await user.getIdToken();
        const fetchedProfile = await fetchUserProfile(token);
        setProfile(fetchedProfile);
      } else {
        console.log("User signed out");
        setProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, register, logout, login, resetPassword, getIdToken, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}
