import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/notes");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl mb-4">Login to Notes App</h1>
      <button 
        onClick={loginWithGoogle} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
