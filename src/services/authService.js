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
    try {
      console.log('🔐 Iniciando login para:', credentials.username);
      console.log('➡️ Request to /login:', {
        method: 'POST',
        url: `${API_URL}/login`,
        headers: { 'Content-Type': 'application/json' },
        body: { username: credentials.username, password: '[REDACTED]' }, // Sanitize password
      });

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      console.log('📡 Response from /login:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails = `Erro ${response.status} (${response.statusText})`;
        try {
          const error = await response.json();
          errorDetails = error.detail || JSON.stringify(error);
          console.error('❌ Login failed with error details:', error);
        } catch (e) {
          console.error('❌ Login failed, could not parse error response:', e);
        }
        throw new Error(`Login failed: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('✅ Login bem-sucedido! Dados recebidos:', data);
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('💾 Usuário salvo no localStorage');
      }

      return data;
    } catch (error) {
      console.error('❌ Erro no login:', error);
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
    try {
      const user = this.getUser();
      if (!user || !user.access_token) {
        console.log('➡️ Request to /me: No access token found in local storage.');
        throw new Error('No access token found in local storage.');
      }

      console.log('➡️ Request to /me:', {
        method: 'GET',
        url: `${API_URL}/me`,
        headers: { 'Authorization': `Bearer ${user.access_token.substring(0, 10)}...` }, // Sanitize token
      });

      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        },
        credentials: 'include',
      });

      console.log('📡 Response from /me:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorDetails = `Erro ${response.status} (${response.statusText})`;
        try {
          const error = await response.json();
          errorDetails = JSON.stringify(error);
          console.error('❌ Failed to fetch user details with error details:', error);
        } catch (e) {
          console.error('❌ Failed to fetch user details, could not parse error response:', e);
        }
        throw new Error(`Não autenticado: ${errorDetails}`);
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ User details fetched successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
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
