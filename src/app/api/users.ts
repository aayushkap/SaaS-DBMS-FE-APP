// src/api/user.js

// Fetch user data (GET request)
// export const fetchUserData = async () => {
//   try {
//     console.log("Fetching user data...");
//     const response = await fetch("http://127.0.0.1:8000/query/get-drivers"); // Adjust the endpoint URL to your backend API
//     if (!response.ok) {
//       throw new Error("Failed to fetch user data");
//     }
//     const data = await response.json(); // Store the response data
//     console.log(data); // Log the data
//     return data; // Return the data
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     throw error;
//   }
// };

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
    console.error("Error creating user:", error);
    throw error;
  }
};

export const fetchAccessToken = async (userData: any) => {
  try {
    console.log("Fetching access token...");
    console.log(userData);
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
    console.error("Error creating user:", error);
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
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchUserByOAuth = async (userData: any) => {
  try {
    console.log("Fetching user data OAuth..." + JSON.stringify(userData));

    const response = await fetch("http://127.0.0.1:8000/users/OAuthLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Log response status
    console.log("Response status: ", response.status);

    if (!response.ok) {
      const errorMessage = `Server responded with status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const res = await response.json();
    console.log("Response from OAuthLogin: ", res);
    return res;
  } catch (error: any) {
    console.error("Error caught in catch block:", error.message);
    console.error("Stack trace:", error.stack);
    throw error;
  }
};
