// src/api/user.js

export const createUser = async (userData: any) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchAccessToken = async (userData: any) => {
  try {
    const encodedFormData = new URLSearchParams(userData).toString();

    const response = await fetch("http://127.0.0.1:8000/users/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodedFormData,
    });
    if (!response.ok) {
      throw new Error("Failed to get auth token");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchUserData = async (idToken: string) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`, // Set the JWT token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data.");
    }

    const data = await response.json();
    return data; // Expecting the user data from the response
  } catch (error) {
    throw error;
  }
};

export const fetchUserByOAuth = async (userData: any) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/users/OAuthLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorMessage = `Server responded with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const res = await response.json();
    //
    return res;
  } catch (error: any) {
    throw error;
  }
};
