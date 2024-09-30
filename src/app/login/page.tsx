"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { fetchUserByOAuth } from "@/app/api/users";
import { useMutation } from "@tanstack/react-query";
import styles from "./login.module.scss";
import { Loader } from "@/app/components/Loader1/Loader";

function OAuthCallback() {
  const [loginStatus, setLoginStatus] = useState("Loading");
  const [isMutated, setIsMutated] = useState(false);
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: fetchUserByOAuth,
    onSuccess: (data: any) => {
      if (data?.success) {
        const userData = data?.response;

        dispatch(
          setUser({
            name: userData?.name,
            email: userData?.email,
            isAdmin: userData?.isAdmin === 1,
            accessToken: userData?.access_token,
          })
        );
        setLoginStatus("Login successful. Redirecting...");
        window.location.href = "/DBMS";
      } else {
        setLoginStatus("Failed to authenticate user: " + data?.message);
      }
    },
    onError: (error) => {
      setLoginStatus("Failed to authenticate user: " + error);
    },
  });

  useEffect(() => {
    async function updateUserFromQuery() {
      const queryParams = new URLSearchParams(window.location.search);
      const username = queryParams.get("username");
      const email = queryParams.get("email");

      if (username && email && !isMutated) {
        setIsMutated(true);
        setLoginStatus("Authenticating");
        mutation.mutate({
          name: username,
          email: email,
          login_method: queryParams.get("provider")?.toUpperCase(), // "GITHUB" or "GOOGLE"
        });
      } else if (!username || !email) {
        setLoginStatus("Failed to get user data from query parameters.");
      }
    }

    updateUserFromQuery();
  }, [dispatch, mutation, isMutated]);

  return (
    <main className={styles.container}>
      {loginStatus === "Loading" || loginStatus === "Authenticating" ? (
        <Loader />
      ) : (
        <section className={styles.loginSection}>
          <div className={styles.loginStatus}>{loginStatus}</div>
          <div className={styles.loginRedirect}>
            If you are not redirected, click <a href="/DBMS">here</a>.
          </div>
        </section>
      )}
    </main>
  );
}

export default OAuthCallback;
