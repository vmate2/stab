import CryptoJS from 'crypto-js';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1]; // Get the token from the Authorization header

  

  if (!token) {
    throw createError({ statusCode: 401, message: 'No token provided', statusMessage: 'Unauthorized' });
  }

  try {
    const runtimeConfig = useRuntimeConfig();
    const bytes = CryptoJS.AES.decrypt(token, runtimeConfig.jwtSecret);
    const decoded = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Check token expiration (if applicable)
    if (decoded.exp && decoded.exp < Date.now()) {
      throw new Error('Token expired');
    }

    // Fetch user data from the database
    const user = await fetchUserFromDatabase(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return { user };
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token', statusMessage: 'Unauthorized' });
  }
});

async function fetchUserFromDatabase(userId: number) {
  // Replace this with your actual database query
  const users = [
    { id: 1, username: 'admin' }, // Example user
    { id: 2, username: 'vmate' }
  ];

  return users.find((u) => u.id === userId) || null;
}