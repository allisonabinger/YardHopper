import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  getIdToken,
});

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  getIdToken: () => Promise<string | null>
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

async function getIdToken(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("No authenticated user found");
      return null;
    }
    return currentUser.getIdToken();
  }

export function AuthProvider({children}: {children: ReactNode}){
  const [user, setUser] = useState(auth.currentUser);


  // AB - changed log statement.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User signed in:', { email: user.email, uid: user.uid });
          } else {
            console.log('User signed out');
          }
      setUser(user);
    });
    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider value={{user, register, logout, login, resetPassword, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}
