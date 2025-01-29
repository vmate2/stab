import { jwtVerify, decodeJwt } from 'jose'; // For JWT verification (using `jose` library)
import { useAuth } from '~/composables/useAuth'; // Import the composable

export default defineNuxtRouteMiddleware(async (to) => {
  // Only apply this middleware to routes under /stab/
  if (to.path.startsWith('/stab')) { //! WHEN DEPLOYED CHECK FOR !to.path.startsWith('/stab') !\\ 
    return;
  }

  // Get the token from the cookie
  const tokenCookie = useCookie('token');

  if (!tokenCookie.value) {
    return navigateTo('/login');
  }

  try {
    const runtimeConfig = useRuntimeConfig();

    // Verify the token (JWT example using `jose`)
    const secretKey = new TextEncoder().encode(runtimeConfig.public.jwtSecret);

    // Decode the token for debugging
    const decoded = decodeJwt(tokenCookie.value);

    const { payload } = await jwtVerify(tokenCookie.value, secretKey);

    // Set the authenticated user data using the composable
    const { setUser } = useAuth();
    setUser(payload);
  } catch (error) {

    // Handle expired tokens
    if (error.code === 'ERR_JWT_EXPIRED') {

      // Clear the expired token cookie
      tokenCookie.value = null;

      // Clear the authenticated user data
      const { clearUser } = useAuth();
      clearUser();
    } else if (error.code === 'ERR_JWS_INVALID') {
      console.error('Invalid token signature');
    } else {
      console.error('Token verification error:', error);
    }

    // Redirect to login page
    return navigateTo('/login');
  }
});