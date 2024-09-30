// src/api/query.ts

export const testConnection = async (connectionData: any) => {
  try {
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
    throw error;
  }
};

export const executeQuery = async (queryData: any) => {
  try {
    console.log("Executing query...");
    console.log("Query data:", queryData);
    const response = await fetch("http://127.0.0.1:8000/query/execute-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryData),
    });

    if (!response.ok) {
      throw new Error("Failed to execute query");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
