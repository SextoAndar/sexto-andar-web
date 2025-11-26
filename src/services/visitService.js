// src/services/visitService.js
import logger from '../utils/logger';

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

export async function getUpcomingVisits({ page = 1, size = 10 } = {}) {
  const url = new URL('/api/api/visits/upcoming', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar próximas visitas');
  return await res.json();
}

export async function updateVisit(visitId, visitData) {
  const res = await fetch(`/api/api/visits/${visitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(visitData),
  });
  if (!res.ok) throw new Error('Erro ao atualizar visita');
  return await res.json();
}

export async function completeVisit(visitId, notes = '') {
  const res = await fetch(`/api/api/visits/${visitId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Erro ao concluir visita');
  return await res.json();
}

export async function getPublicPropertyVisits(propertyId, { page = 1, size = 10, include_cancelled = false } = {}) {
  const url = new URL(`/api/api/visits/property/${propertyId}/visits`, window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  url.searchParams.set('include_cancelled', include_cancelled);

  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include', // Frontend will ignore if not authenticated, backend handles public/private
  });
  if (!res.ok) throw new Error('Erro ao buscar horários de visita públicos');
  return await res.json();
}

