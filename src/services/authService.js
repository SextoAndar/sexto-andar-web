// Serviço de autenticação integrado com sexto-andar-auth
// Usa proxy do Vite para evitar problemas com cookies cross-origin
const API_URL = '/auth/v1/auth';

export const authService = {
    // Upload de foto de perfil
    async uploadProfilePicture(file) {
      const currentUser = this.getUser();
      if (!currentUser || !currentUser.access_token) {
        console.log('➡️ Request to /profile/picture: No access token found in local storage.');
        throw new Error('No access token found in local storage.');
      }

      console.log('➡️ Request to /profile/picture:', {
        method: 'POST',
        url: `${API_URL}/profile/picture`,
        headers: { 'Authorization': `Bearer ${currentUser.access_token.substring(0, 10)}...` }, // Sanitize token
        body: '[FORM_DATA]' // FormData cannot be easily logged
      });

      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.access_token}`
        },
        credentials: 'include',
        body: formData // NÃO definir Content-Type, o browser faz isso
      });

      console.log('📡 Response from /profile/picture:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails = `Erro ${response.status} (${response.statusText})`;
        try {
          const error = await response.json();
          errorDetails = JSON.stringify(error);
          console.error('❌ Failed to upload profile picture with error details:', error);
        } catch (e) {
          console.error('❌ Failed to upload profile picture, could not parse error response:', e);
        }
        throw new Error(`Erro ao enviar foto de perfil: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('✅ Profile picture uploaded successfully! Data received:', data);
      // Atualiza user local
      const updatedUser = await this.getMe();
      return { ...data, user: updatedUser };
    },

    // Remover foto de perfil
    async deleteProfilePicture() {
      const currentUser = this.getUser();
      if (!currentUser || !currentUser.access_token) {
        console.log('➡️ Request to /profile/picture (DELETE): No access token found in local storage.');
        throw new Error('No access token found in local storage.');
      }

      console.log('➡️ Request to /profile/picture (DELETE):', {
        method: 'DELETE',
        url: `${API_URL}/profile/picture`,
        headers: { 'Authorization': `Bearer ${currentUser.access_token.substring(0, 10)}...` }, // Sanitize token
      });

      const response = await fetch(`${API_URL}/profile/picture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.access_token}`
        },
        credentials: 'include',
      });

      console.log('📡 Response from /profile/picture (DELETE):', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails = `Erro ${response.status} (${response.statusText})`;
        try {
          const error = await response.json();
          errorDetails = JSON.stringify(error);
          console.error('❌ Failed to delete profile picture with error details:', error);
        } catch (e) {
          console.error('❌ Failed to delete profile picture, could not parse error response:', e);
        }
        throw new Error(`Erro ao remover foto de perfil: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('✅ Profile picture deleted successfully! Data received:', data);
      // Atualiza user local
      const updatedUser = await this.getMe();
      return { ...data, user: updatedUser };
    },
  // Login
  async login(credentials) {
    const endpoint = `${API_URL}/login`;
    const requestBody = {
      username: credentials.username,
      password: credentials.password
    };
    const requestHeaders = {
      'Content-Type': 'application/json',
    };

    console.log('-------------------- LOGIN INITIATED --------------------');
    console.log(`🔐 Initiating login for user: ${credentials.username}`);
    console.log(`➡️ Requesting POST ${endpoint}`);
    console.log(`➡️ Request Headers: ${JSON.stringify(requestHeaders)}`);
    console.log(`➡️ Request Body: ${JSON.stringify({ ...requestBody, password: '[REDACTED]' })}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: requestHeaders,
        credentials: 'include', // Important for cookies
        body: JSON.stringify(requestBody),
      });

      console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      const responseBody = await response.json().catch(() => null); // Try to parse, ignore if not JSON

      if (!response.ok) {
        let errorMessage = `Login failed for user ${credentials.username}. Status: ${response.status} ${response.statusText}.`;
        if (responseBody) {
          errorMessage += ` Details: ${JSON.stringify(responseBody)}`;
          console.error(`❌ Login failed! Raw error response:`, responseBody);
        } else {
          console.error(`❌ Login failed! No parsable error response body.`);
        }
        console.error(errorMessage);
        throw new Error(responseBody?.detail || errorMessage);
      }

      console.log('✅ Login successful! Data received:', responseBody);
      
      if (responseBody && responseBody.access_token && responseBody.user) {
        // Combine the user details with the access_token for storage
        const userToStore = { ...responseBody.user, access_token: responseBody.access_token, token_type: responseBody.token_type };
        localStorage.setItem('user', JSON.stringify(userToStore));
        console.log('💾 User data (including access_token) saved to localStorage:', userToStore);
        console.log(`🔑 Access token received: ${responseBody.access_token.substring(0, 10)}...`);

        // Set the access_token as a cookie, as per Postman test
        // WARNING: Manually setting cookies via JS is less secure than HTTP-only cookies
        const cookieValue = `access_token=${responseBody.access_token}; Path=/; SameSite=Lax;`;
        document.cookie = cookieValue + (location.protocol === 'https:' ? ' Secure;' : '');
        console.log('🍪 Access token set as cookie:', cookieValue);
      } else {
        console.log('⚠️ No user data or access_token in login response to save to local storage.');
      }
      console.log('-------------------- LOGIN ENDED --------------------');
      return responseBody;
    } catch (error) {
      console.error(`❌ Global error during login for user ${credentials.username}:`, error);
      throw error;
    }
  },

  // Cadastro
  async register(userData) {
    try {
      const endpoint = userData.userType === 'Proprietário' 
        ? `${API_URL}/register/property-owner`
        : `${API_URL}/register/user`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phone,
          password: userData.password
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Falha no cadastro');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      return { user: data };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },

  // Busca dados do usuário logado
  async getMe() {
    const endpoint = `${API_URL}/me`;
    let userFromLocalStorage = this.getUser();
    let authHeader = {};

    console.log('-------------------- GET ME INITIATED --------------------');
    console.log(`🔍 Attempting to fetch user details from ${endpoint}`);

    if (userFromLocalStorage && userFromLocalStorage.access_token) {
      authHeader = { 'Authorization': `Bearer ${userFromLocalStorage.access_token}` };
      console.log(`🔑 Full Access Token from localStorage (WARNING: Do not log in production!): ${userFromLocalStorage.access_token}`);
      console.log(`➡️ Full Authorization Header Value SENT: ${authHeader['Authorization']}`); // New line for clarity
    } else {
      console.log('⚠️ No access token found in localStorage for /me request.');
    }

    console.log(`➡️ Requesting GET ${endpoint}`);
    console.log(`➡️ Request Headers: ${JSON.stringify(authHeader)}`);

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: authHeader,
        credentials: 'include',
      });

      console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      const responseBody = await response.json().catch(() => null); // Try to parse, ignore if not JSON

      if (!response.ok) {
        let errorMessage = `Failed to fetch user details. Status: ${response.status} ${response.statusText}.`;
        if (responseBody) {
          errorMessage += ` Details: ${JSON.stringify(responseBody)}`;
          console.error(`❌ Failed to fetch user details! Raw error response:`, responseBody);
        } else {
          console.error(`❌ Failed to fetch user details! No parsable error response body.`);
        }
        console.error(errorMessage);
        throw new Error(`Não autenticado: ${responseBody?.detail || errorMessage}`);
      }

      const existingUser = this.getUser(); // Get the current user data from localStorage
      // Ensure existingUser is not null and has access_token, otherwise handle gracefully
      const updatedUserToStore = { 
        ...(existingUser || {}), // Start with existing user data (empty object if null)
        ...responseBody,      // Merge in new user details from getMe response
        access_token: existingUser?.access_token, // Preserve existing access_token
        token_type: existingUser?.token_type // Preserve existing token_type
      };
      localStorage.setItem('user', JSON.stringify(updatedUserToStore));
      console.log('✅ User details fetched and merged with existing token, then saved to localStorage:', updatedUserToStore);
      console.log('-------------------- GET ME ENDED --------------------');
      return responseBody;
    } catch (error) {
      console.error(`❌ Global error during getMe request:`, error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const user = this.getUser();
      const headers = {};
      if (user && user.access_token) {
        headers['Authorization'] = `Bearer ${user.access_token}`;
        console.log('➡️ Request to /logout:', {
          method: 'POST',
          url: `${API_URL}/logout`,
          headers: { 'Authorization': `Bearer ${user.access_token.substring(0, 10)}...` }, // Sanitize token
        });
      } else {
        console.log('➡️ Request to /logout: No access token found for logout.');
      }

      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
      });

      console.log('📡 Response from /logout:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails = `Erro ${response.status} (${response.statusText})`;
        try {
          const error = await response.json();
          errorDetails = JSON.stringify(error);
          console.error('❌ Logout failed with error details:', error);
        } catch (e) {
          console.error('❌ Logout failed, could not parse error response:', e);
        }
        throw new Error(`Erro no logout: ${errorDetails}`);
      }
      console.log('✅ Logout successful!');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error; // Re-throw to ensure finally block is still executed after this.
    } finally {
      localStorage.removeItem('user');
      console.log('🗑️ User removed from localStorage.');
    }
  },

  // Atualizar perfil
  async updateProfile(profileData) {
    try {
      const currentUser = this.getUser();
      if (!currentUser || !currentUser.access_token) {
        console.log('➡️ Request to /profile (PUT): No access token found in local storage.');
        throw new Error('No access token found in local storage.');
      }

      console.log('➡️ Request to /profile (PUT):', {
        method: 'PUT',
        url: `${API_URL}/profile`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token.substring(0, 10)}...` // Sanitize token
        },
        body: profileData,
      });

      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      console.log('📡 Response from /profile (PUT):', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails = `Erro ${response.status} (${response.statusText})`;
        try {
          const error = await response.json();
          errorDetails = JSON.stringify(error);
          console.error('❌ Failed to update profile with error details:', error);
        } catch (e) {
          console.error('❌ Failed to update profile, could not parse error response:', e);
        }
        if (response.status === 401) {
          throw new Error(`SESSION_EXPIRED: ${errorDetails}`);
        }
        throw new Error(`Falha ao atualizar perfil: ${errorDetails}`);
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ Profile updated successfully! Data received:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  isAuthenticated() {
    return !!this.getUser();
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }
};

export default authService;
