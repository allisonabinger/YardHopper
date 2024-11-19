import { auth } from "@/firebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, User, UserCredential } from "firebase/auth";
import { createContext, ReactNode } from "react";

const AuthContext = createContext({});

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

function logout() {
  return auth.signOut();
}

function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{register, logout, login}}>
    {children}
  </AuthContext.Provider>
}