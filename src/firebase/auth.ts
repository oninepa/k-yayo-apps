import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google Sign-In successful:", result.user.displayName);
    return result;
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Email Sign-In successful:", result.user.displayName);
    return result;
  } catch (error) {
    console.error("Error during Email Sign-In:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Email Sign-Up successful:", result.user.displayName);
    return result;
  } catch (error) {
    console.error("Error during Email Sign-Up:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
