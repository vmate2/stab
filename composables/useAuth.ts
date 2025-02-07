// useAuth.ts
export const useAuth = () => {
  // Use useState to persist the user data and token across the application
  const user = useState('user', () => null); // User data, including JWT
  const token = useState('token', () => null); // JWT token
  
  const setUser = (payload: any, jwtToken: any) => {
    user.value = payload; // Store the user data (payload)
    token.value = jwtToken; // Store the JWT token
  };

  const clearUser = () => {
    user.value = null;
    token.value = null;
  };

  return { user, token, setUser, clearUser };
};
