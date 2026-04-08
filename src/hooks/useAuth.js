/**
 * useAuth.js — Firebase Authentication hook
 */
import { useState, useEffect, useCallback } from 'react';
import { onAuthChange, signInWithGoogle, signOutUser } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      // Check if user exists and explicitly isn't an leftover anonymous session.
      if (firebaseUser && !firebaseUser.isAnonymous) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      console.error('Sign in error:', err);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await signOutUser();
    } catch (err) {
      setError(err.message);
      console.error('Sign out error:', err);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signInWithGoogle: signIn, // alias for backwards compatibility
    signOutUser: signOut,    // alias
    signIn,
    signOut,
  };
}
