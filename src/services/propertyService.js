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

export async function fetchOwnerProperties() {
  const res = await fetch('/api/api/properties/owner/my-properties', {
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

