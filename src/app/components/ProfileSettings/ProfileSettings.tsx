import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import styles from "./ProfileSettings.module.scss";
import { userType } from "@/app/interfaces/users";
import { IoIosEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";

import { setUser } from "@/store/slices/userSlice";

import { useQuery } from "@tanstack/react-query";
import { fetchUserData, createUser, fetchAccessToken } from "@/app/api/users";
import { useMutation } from "@tanstack/react-query"; // For react-query v4
import { persistor } from "@/store/index";

import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

export default function ProfileSettings() {
  const [showSignIn, setShowSignIn] = useState(true);

  const { username, email, isAdmin } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <div className={styles.profileSettings}>
      {username ? (
        <UserInfo username={username} email={email} isAdmin={isAdmin} />
      ) : showSignIn ? (
        <SignInForm setShowSignIn={setShowSignIn} />
      ) : (
        <SignUpForm setShowSignIn={setShowSignIn} />
      )}
    </div>
  );
}

const UserInfo = ({ username, email, isAdmin }: any) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(
      setUser({
        username: null,
        email: null,
        isAdmin: false,
        accessToken: null,
      })
    );
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Your Profile</h3>

      <div className={styles.textField}>Username: {username}</div>
      <div className={styles.textField}>Email: {email}</div>
      <div className={styles.textField}>
        Admin Access: {isAdmin ? "Yes" : "No"}
      </div>

      <button className={styles.formButton} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

// SignInForm with validation logic
const SignInForm = ({
  setShowSignIn,
}: {
  setShowSignIn: (val: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const dispatch = useDispatch();

  // First mutation to get access token. Here, we pass the email as username.
  const accessTokenMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      fetchAccessToken(credentials),
    onSuccess: (data) => {
      if (data?.success) {
        const accessToken = data.access_token;

        // Trigger the second mutation to fetch user data
        fetchUserDataMutation.mutate(accessToken);
      } else {
        setError("Failed to sign in.");
      }
    },
    onError: () => {
      setError("Invalid email or password.");
    },
  });

  // Second mutation to fetch user data with the token
  const fetchUserDataMutation = useMutation({
    mutationFn: (accessToken: string) => fetchUserData(accessToken),
    onSuccess: (data) => {
      // Dispatch user data to the Redux store

      if (data?.success) {
        const userData = data.response;
        dispatch(
          setUser({
            name: userData.username,
            email: userData.email,
            isAdmin: userData.isAdmin === 1 ? true : false,
            accessToken: accessTokenMutation.data?.access_token,
          })
        );
      }

      setLoginResponse("Login successful.");
      setEmail("");
      setPassword("");
    },
    onError: () => {
      setError("Failed to fetch user data.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    // Clear previous errors and login response
    setError("");
    setLoginResponse("");

    // Trigger the access token mutation
    accessTokenMutation.mutate({
      username: email,
      password: password,
    });
  };

  function signInWithGitHub() {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email&state=github`;

    window.location.href = githubAuthUrl;
  }

  function signInWithGoogle() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&state=google`;

    window.location.href = googleAuthUrl;
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>Login</h3>

      {error && <div className={styles.error}>{error}</div>}
      {loginResponse && <div className={styles.success}>{loginResponse}</div>}

      <div className={styles.formField}>
        <label>Email</label>
        <input
          type="text"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label>Password</label>
        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <IoEyeOff
              className={styles.eyeIcon}
              size={25}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoIosEye
              className={styles.eyeIcon}
              size={25}
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
      </div>

      <button
        className={styles.formButton}
        type="submit"
        disabled={
          accessTokenMutation.isPending || fetchUserDataMutation.isPending
        }
      >
        {accessTokenMutation.isPending || fetchUserDataMutation.isPending
          ? "Signing In..."
          : "Sign In"}
      </button>

      <div className={styles.separator}></div>

      <button
        type="button"
        onClick={signInWithGitHub}
        className={styles.oAuthButton}
      >
        <FaGithub size={25} />
        Login with GitHub
      </button>
      <button
        type="button"
        onClick={signInWithGoogle}
        className={styles.oAuthButton}
      >
        <FaGoogle size={25} />
        Login with Google
      </button>

      <div className={styles.separator}></div>

      <div className={styles.switchButton} onClick={() => setShowSignIn(false)}>
        Don\'t have an account?
        <button className={styles.switch}>Sign Up.</button>
      </div>
    </form>
  );
};

// SignUpForm with validation logic
const SignUpForm = ({
  setShowSignIn,
}: {
  setShowSignIn: (val: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [signUpResponse, setSignUpResponse] = useState("");

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setSignUpResponse(data?.message);

      if (data?.success == true) {
        const userData = data?.response;

        dispatch(
          setUser({
            name: userData?.name,
            email: userData?.email,
            isAdmin: userData?.isAdmin == 1 ? true : false,
            accessToken: userData?.access_token,
          })
        );
      }

      setUsername("");
      setEmail("");
      setPassword("");
    },
    onError: (error) => {
      console.error("Unable to create user. Please try again.");
      setError("Failed to create user.");
    },
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password.length > 20) {
      setError("Password must be at most 20 characters long.");
      return;
    }

    setError("");
    mutation.mutate({ name: username, email: email, password: password });
  };

  function signUpWithGitHub() {
    //

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email&state=github`;

    window.location.href = githubAuthUrl;
  }

  function signUpWithGoogle() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&state=google`;

    window.location.href = googleAuthUrl;
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>Sign Up</h3>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.formField}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className={styles.formField}>
        <label>Email Address</label>
        <input
          type="text"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.formField}>
        <label>Password</label>
        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <IoEyeOff
              className={styles.eyeIcon}
              size={25}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoIosEye
              className={styles.eyeIcon}
              size={25}
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
      </div>
      {signUpResponse && <div>{signUpResponse}</div>}
      <button
        className={styles.formButton}
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Signing Up..." : "Sign Up"}
      </button>

      <div className={styles.separator}></div>

      <button
        type="button"
        onClick={signUpWithGitHub}
        className={styles.oAuthButton}
      >
        <FaGithub size={25} />
        Sign Up with GitHub
      </button>
      <button
        type="button"
        onClick={signUpWithGoogle}
        className={styles.oAuthButton}
      >
        <FaGoogle size={25} />
        Sign Up with Google
      </button>

      <div className={styles.separator}></div>
      <div className={styles.switchButton} onClick={() => setShowSignIn(true)}>
        Have an account?{" "}
        <button className={styles.switch} disabled={mutation.isPending}>
          Login.
        </button>
      </div>
    </form>
  );
};
