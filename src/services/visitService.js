// src/services/visitService.js

export async function getVisitsForUser({ page = 1, size = 10, status = '' } = {}) {
  const url = new URL('/api/api/visits/my-visits', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  if (status) url.searchParams.set('status', status);

  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar minhas visitas');
  return await res.json();
}

export async function getAllOwnerVisits({ page = 1, size = 10, status = '' } = {}) {
  const url = new URL('/api/api/visits/my-properties/visits', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  if (status) url.searchParams.set('status', status);

  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar visitas recebidas');
  return await res.json();
}

export async function getVisitsForSpecificProperty(propertyId, { page = 1, size = 10, status = '' } = {}) {
  const url = new URL(`/api/api/visits/property/${propertyId}`, window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  if (status) url.searchParams.set('status', status);

  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar visitas para o imóvel');
  return await res.json();
}

export async function getVisitById(visitId) {
  const res = await fetch(`/api/api/visits/${visitId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar detalhes da visita');
  return await res.json();
}

export async function scheduleVisit(visitData) {
  const res = await fetch('/api/api/visits/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(visitData),
  });
  if (!res.ok) throw new Error('Erro ao agendar visita');
  return await res.json();
}

export async function cancelVisit(visitId) {
  const res = await fetch(`/api/api/visits/${visitId}/cancel`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao cancelar visita');
  // 204 No Content for successful cancellation
  if (res.status === 204) {
    return;
  }
  return await res.json();
}
