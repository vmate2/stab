// middleware/auth.ts
import { jwtVerify, decodeJwt } from 'jose'; // Import necessary functions from `jose`
import { useAuth } from '~/composables/useAuth'; // Import your composable for auth handling

export default defineNuxtRouteMiddleware(async (to) => {
  // Only apply this middleware to routes under /stab/
  if (!to.path.startsWith('/stab')) { //! WHEN DEPLOYED CHECK FOR !to.path.startsWith('/stab') !\\ 
    return;
  }

  // Get the token from the cookie
  const tokenCookie = useCookie('token') as Ref<{
    token: string ; value: { token: string | undefined} 
}>;
  
  if (!tokenCookie.value) {
    return navigateTo('/login');
  }

  try {
    const runtimeConfig = useRuntimeConfig();

    // Verify the token (JWT example using `jose`)
    const secretKey = new TextEncoder().encode(runtimeConfig.public.jwtSecret);

    // Decode token (optional for logging or inspection)
    const decoded = decodeJwt(tokenCookie.value.token);

    // Verify the JWT token's authenticity
    const { payload } = await jwtVerify(tokenCookie.value.token, secretKey);
    

    // Set the authenticated user data and token using the composable
    const { setUser } = useAuth();
    
    setUser(payload, tokenCookie.value.token);
    
  } catch (error: any) {
    // Handle specific errors for expired or invalid tokens
    if (error.code === 'ERR_JWT_EXPIRED') {
      // Clear the expired token cookie
      tokenCookie.value = { token: '', value: { token: undefined } };

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
