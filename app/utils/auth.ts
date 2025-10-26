// utils/auth.ts
export function isTokenExpired(session: any): boolean {
  if (!session?.accessToken) return true;

  try {
    // Decode JWT token (without verification, just to read the payload)
    const token = session.accessToken;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Treat as expired if there's an error
  }
}

export function isAdmin(session: any): boolean {
  if (!session?.accessToken) return false;
  
  // Check if token is expired
  if (isTokenExpired(session)) return false;
  
  // Check if user is admin/superadmin
  return session?.user?.isSuperAdmin === true;
}