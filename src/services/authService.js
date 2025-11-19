// Serviço de autenticação integrado com sexto-andar-auth
// Usa proxy do Vite para evitar problemas com cookies cross-origin
const API_URL = '/api/auth';

export const authService = {
    // Upload de foto de perfil
    async uploadProfilePicture(file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/profile/picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData // NÃO definir Content-Type, o browser faz isso
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao enviar foto de perfil');
      }
      // Atualiza user local
      const user = await this.getMe();
      return { ...data, user };
    },

    // Remover foto de perfil
    async deleteProfilePicture() {
      const response = await fetch(`${API_URL}/profile/picture`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao remover foto de perfil');
      }
      // Atualiza user local
      const user = await this.getMe();
      return { ...data, user };
    },
  // Login
  async login(credentials) {
    try {
      console.log('🔐 Iniciando login para:', credentials.username);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para cookies
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      console.log('📡 Status do login:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Falha na autenticação');
      }

      const data = await response.json();
      console.log('✅ Login bem-sucedido! Dados recebidos:', data);
      
      // Salva dados do usuário no localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('💾 Usuário salvo no localStorage');
      } else {
        console.warn('⚠️ Resposta não contém data.user:', data);
      }

      // Verifica se cookie foi recebido testando /me
      console.log('🔍 Verificando se cookie foi salvo...');
      const meResponse = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('📡 Status /me após login:', meResponse.status);
      
      if (meResponse.ok) {
        console.log('✅ Cookie funcionando! Autenticação OK');
      } else {
        console.error('❌ Cookie NÃO foi salvo! Status:', meResponse.status);
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
      // Define o endpoint baseado no tipo de usuário
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
      
      // API retorna o usuário diretamente (AuthUser)
      localStorage.setItem('user', JSON.stringify(data));

      return { user: data }; // Normaliza o retorno
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },

  // Busca dados do usuário logado
  async getMe() {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include', // Envia o cookie automaticamente
      });

      if (!response.ok) {
        throw new Error('Não autenticado');
      }

      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('user');
    }
  },

  // Atualizar perfil
  async updateProfile(profileData) {
    try {
      console.log('📝 Tentando atualizar perfil...');
      console.log('🍪 Documento cookies:', document.cookie);
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      console.log('📡 Status atualização:', response.status);
      console.log('📋 Headers da resposta:', [...response.headers.entries()]);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Erro ao atualizar:', error);
        
        // Se erro 401, sessão expirou
        if (response.status === 401) {
          console.error('❌ 401 = Cookie não enviado ou inválido!');
          console.log('🔍 Verifique: DevTools → Application → Cookies → localhost:8001');
          localStorage.removeItem('user');
          throw new Error('SESSION_EXPIRED');
        }
        
        throw new Error(error.detail || 'Falha ao atualizar perfil');
      }

      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  // Verifica se está autenticado
  isAuthenticated() {
    return !!this.getUser();
  },

  // Retorna usuário do localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verifica role do usuário
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }
};

export default authService;
