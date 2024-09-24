export const authConfig = {
    pages: {
      signIn: '/login', // Custom sign-in page route
    },
  };
  
  // Protect your routes with the `authorized` callback
  authConfig.callbacks = {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/ui');
  
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to the login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/ui/dashboard', nextUrl));
      }
      return true;
    },
  };
  
  // Empty providers array, to be populated later
  authConfig.providers = [];
  