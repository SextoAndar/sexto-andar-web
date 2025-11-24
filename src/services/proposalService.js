export async function getReceivedProposals({ page = 1, size = 10 } = {}) {
  const url = new URL('/api/api/proposals/received', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar propostas recebidas');
  return await res.json();
}

export async function acceptProposal(proposalId, response_message = '') {
  const res = await fetch(`/api/api/proposals/${proposalId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ response_message }),
  });
  if (!res.ok) throw new Error('Erro ao aceitar proposta');
  return await res.json();
}

export async function rejectProposal(proposalId, response_message = '') {
  const res = await fetch(`/api/api/proposals/${proposalId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ response_message }),
  });
  if (!res.ok) throw new Error('Erro ao rejeitar proposta');
  return await res.json();
}

export async function submitProposal(proposalData) {
  const res = await fetch('/api/api/proposals/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(proposalData),
  });
  if (!res.ok) throw new Error('Erro ao enviar proposta');
  return await res.json();
}

export async function getMyProposals({ page = 1, size = 10 } = {}) {
  const url = new URL('/api/api/proposals/my-proposals', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar minhas propostas');
  return await res.json();
}

export async function withdrawProposal(proposalId) {
  const res = await fetch(`/api/api/proposals/${proposalId}/withdraw`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao retirar proposta');
  return await res.json();
}
