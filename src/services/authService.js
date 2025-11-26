import errorService from './errorService';
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

      const bodyData = {
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phone,
        password: userData.password
      };

      console.log('➡️ Request to /register: Payload being sent (for debugging purposes):', bodyData);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorBody = await response.clone().json().catch(() => null);
        let publicErrorMessage = errorBody?.detail || `Erro ${response.status}: ${response.statusText}`;
        let fullErrorText = `Endpoint: ${endpoint}\nMensagem: ${publicErrorMessage}\n\n--- Resposta do Servidor ---\n`;

        if (errorBody) {
          console.error('❌ Erro no cadastro! Resposta de erro do servidor (JSON):', errorBody);
          fullErrorText += JSON.stringify(errorBody, null, 2);
        } else {
          const textResponse = await response.text();
          console.error('❌ Erro no cadastro! Resposta de erro do servidor (não-JSON):', textResponse);
          console.error('❌ Erro no cadastro! Resposta de erro do servidor (não-JSON):', textResponse);
          fullErrorText += textResponse;
          // Se a resposta for HTML (como um erro de proxy), o usuário não precisa ver o HTML inteiro.
          // A mensagem pública permanece mais limpa.
          if (textResponse.trim().startsWith('<!DOCTYPE html>') || textResponse.trim().startsWith('<html>')) {
            publicErrorMessage = `Erro ${response.status}: A resposta do servidor não foi um JSON válido, possivelmente um erro de proxy ou de rede.`;
          }
        }
        
        errorService.showError({ message: fullErrorText, title: "Erro de Cadastro" });
        throw new Error(publicErrorMessage);
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
    let userFromLocalStorage = this.getUser(); // Check for existing user BEFORE fetch
    let authHeader = {};
    const wasAuthenticatedAttempt = userFromLocalStorage && userFromLocalStorage.access_token; // <--- THIS LINE MUST BE PRESENT

    console.log('-------------------- GET ME INITIATED --------------------');
    console.log(`🔍 Attempting to fetch user details from ${endpoint}`);

    if (wasAuthenticatedAttempt) {
      authHeader = { 'Authorization': `Bearer ${userFromLocalStorage.access_token}` };
      console.log(`🔑 Full Access Token from localStorage (WARNING: Do not log in production!): ${userFromLocalStorage.access_token}`);
      console.log(`➡️ Full Authorization Header Value SENT: ${authHeader['Authorization']}`);
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

      const responseBody = await response.json().catch(() => null);

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

      // ONLY update localStorage if an authenticated call was made and successful.
      // If no token was originally found, and it still got 200 OK, it's a public endpoint fetch,
      // and we shouldn't overwrite the authenticated user's data from login.
      if (wasAuthenticatedAttempt) {
        const existingUser = this.getUser(); // Re-fetch to ensure latest state
        const updatedUserToStore = {
          ...(existingUser || {}),
          ...responseBody,
          access_token: existingUser?.access_token,
          token_type: existingUser?.token_type
        };
        localStorage.setItem('user', JSON.stringify(updatedUserToStore));
        console.log('✅ User details fetched and merged with existing token, then saved to localStorage:', updatedUserToStore);
      } else {
        // If no token was sent and we got a 200 OK, it means it's a public user profile.
        // We should NOT save this to localStorage as 'user' if a proper authenticated user
        // might exist or is about to exist. This prevents overwriting the access_token.
        console.log('✅ Public user details fetched (no token used). localStorage not updated to avoid overwriting auth data.');
        // If you need to store this public user data, it should be in a separate localStorage key or state.
      }
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
      // Explicitly remove the access_token cookie
      document.cookie = "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
      console.log('🗑️ User removed from localStorage and access_token cookie cleared.');
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
