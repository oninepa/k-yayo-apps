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

  // Firebase 설정 확인
  if (!auth) {
    console.error("Firebase Auth is not initialized");
    throw new Error("Authentication service is not available");
  }

  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google Sign-In successful:", result.user.displayName);
    return result;
  } catch (error: any) {
    console.error("Error during Google Sign-In:", error);

    // 구체적인 에러 메시지 제공
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Login was cancelled by user");
    } else if (error.code === "auth/popup-blocked") {
      throw new Error(
        "Popup was blocked by browser. Please allow popups for this site."
      );
    } else if (error.code === "auth/unauthorized-domain") {
      throw new Error(
        "This domain is not authorized for Google Sign-In. Please contact administrator."
      );
    } else if (error.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your internet connection.");
    } else {
      throw new Error(`Google Sign-In failed: ${error.message}`);
    }
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Email Sign-In successful:", result.user.displayName);
    return result;
  } catch (error) {
    console.error("Error during Email Sign-In:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
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
