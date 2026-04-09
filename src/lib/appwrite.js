import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

// Your Appwrite credentials (from Step 3)
const PROJECT_ID = "YOUR_PROJECT_ID_HERE"; // Replace with actual Project ID
const ENDPOINT = "https://cloud.appwrite.io/v1";

export const client = new Client();

client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };
