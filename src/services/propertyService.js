// Serviço para buscar propriedades
export async function fetchProperties({ page = 1, size = 12, ...params } = {}) {
  const url = new URL('/api/properties/', window.location.origin.replace(':5173', ':8000'));
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar propriedades');
  return await res.json();
}
