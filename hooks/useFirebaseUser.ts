import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, token };
}
