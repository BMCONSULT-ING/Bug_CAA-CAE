const form = document.getElementById('entryForm');
const entriesBody = document.getElementById('entriesBody');
const emptyMessage = document.getElementById('emptyMessage');

// Remplir les listes déroulantes au chargement
document.addEventListener('DOMContentLoaded', () => {
  initSelects();
  loadEntries();
});

function initSelects() {
  const prefectureSelect = document.getElementById('prefecture');
  PREFECTURES.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    prefectureSelect.appendChild(opt);
  });

  const complementSelects = ['complementCAA', 'complementCAE'];
  complementSelects.forEach(id => {
    const sel = document.getElementById(id);
    COMPLEMENTS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });
  });

  const typeSelect = document.getElementById('typeMisAJour');
  TYPES_MISE_A_JOUR.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    typeSelect.appendChild(opt);
  });

  const methodeSelect = document.getElementById('methodeMisAJour');
  METHODES_MISE_A_JOUR.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    methodeSelect.appendChild(opt);
  });
}

// Soumission du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    prefecture: form.prefecture.value,
    dateEntretien: form.dateEntretien.value,
    passageCAA: form.passageCAA.value,
    misAJour: form.misAJour.value,
    typeMisAJour: form.typeMisAJour.value,
    methodeMisAJour: form.methodeMisAJour.value,
    passageCAE: form.passageCAE.value,
    complementCAA: form.complementCAA.value,
    complementCAE: form.complementCAE.value,
    sCEC: form.sCEC.value
  };

  try {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) throw new Error('Erreur lors de l\'envoi');

    const newEntry = await res.json();
    addRowToTable(newEntry);
    form.reset();
    showToast('Ligne ajoutée avec succès !');
    emptyMessage.classList.add('hidden');
  } catch (err) {
    showToast('Erreur : ' + err.message, true);
  }
});

async function loadEntries() {
  try {
    const res = await fetch('/api/entries');
    const entries = await res.json();

    entriesBody.innerHTML = '';

    if (entries.length === 0) {
      emptyMessage.classList.remove('hidden');
      return;
    }

    emptyMessage.classList.add('hidden');
    entries.forEach(entry => addRowToTable(entry));
  } catch (err) {
    console.error(err);
    showToast('Erreur lors du chargement des données', true);
  }
}

function addRowToTable(entry) {
  const tr = document.createElement('tr');
  tr.dataset.id = entry.id;
  tr.innerHTML = `
    <td>${escapeHtml(entry.prefecture)}</td>
    <td>${formatDate(entry.dateEntretien)}</td>
    <td>${formatDate(entry.passageCAA)}</td>
    <td>${formatDate(entry.misAJour)}</td>
    <td>${escapeHtml(entry.typeMisAJour)}</td>
    <td>${escapeHtml(entry.methodeMisAJour)}</td>
    <td>${formatDate(entry.passageCAE)}</td>
    <td>${escapeHtml(entry.complementCAA)}</td>
    <td>${escapeHtml(entry.complementCAE)}</td>
    <td>${formatDate(entry.sCEC)}</td>
    <td>
      <button class="btn-delete" onclick="deleteEntry('${entry.id}')">Supprimer</button>
    </td>
  `;
  entriesBody.appendChild(tr);
}

async function deleteEntry(id) {
  if (!confirm('Supprimer cette ligne ?')) return;

  try {
    const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur');

    const row = entriesBody.querySelector(`tr[data-id="${id}"]`);
    if (row) row.remove();

    if (entriesBody.children.length === 0) {
      emptyMessage.classList.remove('hidden');
    }
    showToast('Ligne supprimée');
  } catch (err) {
    showToast('Erreur lors de la suppression', true);
  }
}

function escapeHtml(text) {
  if (!text) return '-';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function showToast(message, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  if (isError) {
    toast.style.background = '#ef4444';
    toast.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.3)';
  }
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
