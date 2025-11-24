// Serviço para buscar propriedades
export async function fetchProperties({ page = 1, size = 12, ...params } = {}) {
  const url = new URL('/api/api/properties/', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar propriedades');
  return await res.json();
}

export async function fetchOwnerProperties({ active_only = true } = {}) {
  const url = new URL('/api/api/properties/owner/my-properties', window.location.origin);
  url.searchParams.set('active_only', active_only);
  
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (res.status === 401) {
    throw new Error('Não autenticado');
  }
  if (!res.ok) {
    throw new Error('Erro ao buscar as propriedades do proprietário');
  }
  return await res.json();
}

export async function fetchPropertyById(propertyId) {
  const res = await fetch(`/api/api/properties/${propertyId}`);
  if (!res.ok) {
    throw new Error('Erro ao buscar os detalhes da propriedade');
  }
  return await res.json();
}

export async function getFavoriteStatus(propertyId) {
  const res = await fetch(`/api/api/favorites/${propertyId}/status`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    // A 404 here might just mean it's not favorited, so we don't throw.
    if (res.status === 404) {
      return { is_favorited: false };
    }
    throw new Error('Erro ao verificar status de favorito');
  }
  return await res.json();
}

export async function createProperty(payload) {
  const endpoint = payload.propertyType === 'apartment'
    ? '/api/api/properties/apartments'
    : '/api/api/properties/houses';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = 'Erro ao cadastrar imóvel';
    try {
      const errJson = await res.json();
      msg += ': ' + (errJson.detail || JSON.stringify(errJson));
    } catch {
      // Intentionally left blank
    }
    throw new Error(msg);
  }
  return await res.json();
}

export async function updateProperty(propertyId, data) {
  const res = await fetch(`/api/api/properties/${propertyId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar propriedade');
  return await res.json();
}

export async function addImage(propertyId, imageData) {
  const res = await fetch(`/api/api/properties/${propertyId}/images`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData),
  });
  if (!res.ok) throw new Error('Erro ao adicionar imagem');
  return await res.json();
}

export async function deleteImage(imageId) {
  const res = await fetch(`/api/api/images/${imageId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao apagar imagem');
}

export async function reorderImages(propertyId, imageOrders) {
  const res = await fetch(`/api/api/properties/${propertyId}/images/reorder`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_orders: imageOrders }),
  });
  if (!res.ok) throw new Error('Erro ao reordenar imagens');
  return await res.json();
}

export async function setPrimaryImage(propertyId, imageId) {
  const res = await fetch(`/api/api/properties/${propertyId}/images/${imageId}/set-primary`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao definir imagem principal');
  return await res.json();
}

export async function favoriteProperty(propertyId) {
  const res = await fetch(`/api/api/favorites/${propertyId}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao favoritar propriedade');
  return await res.json();
}

export async function unfavoriteProperty(propertyId) {
  const res = await fetch(`/api/api/favorites/${propertyId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao desfavoritar propriedade');
}

export async function fetchFavoriteProperties({ page = 1, size = 10, active_only = true } = {}) {
  const url = new URL('/api/api/favorites/', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  url.searchParams.set('active_only', active_only);
  
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar propriedades favoritas');
  return await res.json();
}

export async function deleteProperty(propertyId) {
  const res = await fetch(`/api/api/properties/${propertyId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao excluir propriedade');
}

export async function getPortfolioStats() {
  const res = await fetch('/api/api/properties/owner/portfolio-stats', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar estatísticas do portfólio');
  return await res.json();
}

export async function activateProperty(propertyId) {
  const res = await fetch(`/api/api/properties/${propertyId}/activate`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao reativar propriedade');
  return await res.json();
}

export async function getFavoritesCount() {
  const res = await fetch('/api/api/favorites/count/total', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar a contagem de favoritos');
  return await res.json();
}

