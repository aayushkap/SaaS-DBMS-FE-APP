// src/api/query.ts

export const testConnection = async (connectionData: any) => {
  try {
    // console.log("Connection data: ", connectionData);
    const response = await fetch(
      "http://127.0.0.1:8000/query/test-connection",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
