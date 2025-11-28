import { useEffect, useState } from "react";

import { useAuth } from "./useAuth";

export const useIsAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsAdmin(true);
    setIsLoading(false);
  }, [user, authLoading]);

  return { isAdmin, isLoading, userUid: user?.uid };
};
