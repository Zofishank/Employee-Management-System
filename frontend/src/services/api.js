// src/services/api.js - Replace your existing API calls

import { account } from "../lib/appwrite";

// 1. Authentication - Now uses Appwrite
export async function login(email, password) {
  try {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    // Store user in localStorage (for role checking)
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.$id);

    return { success: true, user };
  } catch (error) {
    console.error("Login failed:", error.message);
    return { success: false, error: error.message };
  }
}

export async function signup(email, password, name) {
  try {
    await account.create(ID.unique(), email, password, name);
    // Auto-login after signup
    await login(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logout() {
  await account.deleteSession("current");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

// 2. MongoDB Data - Still call your MongoDB API (but now on Appwrite Functions)
// Instead of calling your Express API on Render, you'll create Appwrite Functions

export async function getTasks(userId) {
  // This will call an Appwrite Function that connects to MongoDB
  const response = await fetch(
    `${process.env.REACT_APP_APPWRITE_FUNCTION_URL}/tasks?userId=${userId}`,
  );
  return response.json();
}

export async function sendMessage(messageData) {
  // Call Appwrite Function for messages
  const response = await fetch(
    `${process.env.REACT_APP_APPWRITE_FUNCTION_URL}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    },
  );
  return response.json();
}
