export const useAuth = () => {
  // Use useState to persist the user data across the application
  const user = useState('user', () => null);

  const setUser = (payload) => {
    user.value = payload;
  };

  const clearUser = () => {
    user.value = null;
  };

  return { user, setUser, clearUser };
};