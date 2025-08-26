// middleware/auth.ts
import { useAuth } from '~/composables/useAuth'; // Import your composable for auth handling

export default defineNuxtRouteMiddleware(async (to) => {
  // Only apply this middleware to routes under /stab/
  if (!to.path.startsWith('/stab')) {
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

    // Decode token (optional for logging or inspection)

    console.log(tokenCookie.value);
    const decodedJWT = await $fetch('/api/verifyJWT', {
      headers: {
        'Authorization': `Bearer ${tokenCookie.value}`,
      },
    });
    // Verify the JWT token's authenticity
    
    

    // Set the authenticated user data and token using the composable
    const { setUser } = useAuth();
    
    setUser(decodedJWT, tokenCookie.value);
    
  } catch (error: any) {
    // Handle specific errors for expired or invalid tokens
    if (error.code === 'ERR_JWT_EXPIRED') {
      // Clear the expired token cookie
      tokenCookie.value = undefined;

      const refreshToken = useCookie('refreshToken');
      if (refreshToken.value) {
        try {


          const response = await $fetch('/api/genNewAccessToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${refreshToken.value}`,
            }
          });

          if (response.accessToken) {
            // Set the new access token in the cookie
            tokenCookie.value = response.accessToken;
            
            // Retry the request or redirect to the original route
            return navigateTo(to.fullPath);
          }

        } catch (error) {
          console.error('Refresh token verification error:', error);
        }
      }


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
