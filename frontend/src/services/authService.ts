const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const loginUser = async (usernameOrEmail: string, password: string) => {
  // CustomUser USERNAME_FIELD = 'email' হলে 'email' কী পাঠান
  // যদি পরে username-এ ফিরে যান, তাহলে 'username' ব্যবহার করুন
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: usernameOrEmail,
      password,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('Login failed:', response.status, errBody);
    throw new Error('Invalid credentials');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const fetchUserSubscription = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/subscription/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return await response.json();
};

// টোকেন এক্সপায়ার হলে refresh (ঐচ্ছিক)
export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    logoutUser();
    return null;
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
};