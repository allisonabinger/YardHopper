import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  UserCredential,
  getAuth,
  sendPasswordResetEmail
} from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>({
  register,
  logout,
  login,
  resetPassword,
  user: null,
});

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  user?: User | null;
}

export const useAuth = () => useContext<AuthContextType>(AuthContext)

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

function logout() {
  return auth.signOut();
}

function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function AuthProvider({children}: {children: ReactNode}){
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
    });
    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider value={{user, register, logout, login, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}