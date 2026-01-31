const form = document.getElementById('entryForm');
const entriesBody = document.getElementById('entriesBody');
const emptyMessage = document.getElementById('emptyMessage');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');

let currentEditId = null;
const entriesMap = new Map();

// Remplir les listes déroulantes au chargement
document.addEventListener('DOMContentLoaded', () => {
  initSelects();
  loadEntries();
  btnCancel.addEventListener('click', cancelEdit);
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

// Validation des dates (d1 >= d2)
function dateGreaterOrEqual(d1Str, d2Str) {
  if (!d1Str || !d2Str) return true;
  return new Date(d1Str) >= new Date(d2Str);
}

// Validation du formulaire
function validateForm() {
  const dateEntretien = form.dateEntretien.value;
  const passageCAA = form.passageCAA.value;
  const misAJour = form.misAJour.value;
  const passageCAE = form.passageCAE.value;
  const sCEC = form.sCEC.value;

  if (!dateEntretien) {
    showToast('La date entretien est obligatoire.', true);
    return false;
  }
  if (!passageCAA) {
    showToast('Le passage CAA est obligatoire.', true);
    return false;
  }
  if (!dateGreaterOrEqual(passageCAA, dateEntretien)) {
    showToast('Le passage CAA doit être supérieur ou égal à la date entretien.', true);
    return false;
  }
  if (misAJour && !dateGreaterOrEqual(misAJour, passageCAA)) {
    showToast('La date mis à jour doit être supérieure ou égale au passage CAA.', true);
    return false;
  }
  if (misAJour && !form.methodeMisAJour.value) {
    showToast('La méthode mis à jour est obligatoire lorsque la date mis à jour est renseignée.', true);
    return false;
  }
  if (passageCAE) {
    const refCAE = misAJour || passageCAA;
    if (!dateGreaterOrEqual(passageCAE, refCAE)) {
      showToast('Le passage CAE doit être supérieur ou égal à la mis à jour (ou au passage CAA si pas de mis à jour).', true);
      return false;
    }
  }
  if (sCEC && (!passageCAE || !dateGreaterOrEqual(sCEC, passageCAE))) {
    showToast('Le SCEC doit être supérieur ou égal au passage CAE (le passage CAE doit être renseigné).', true);
    return false;
  }
  return true;
}

// Soumission du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

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
    if (currentEditId) {
      const res = await fetch(`/api/entries/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur lors de la modification');
      const updatedEntry = await res.json();
      updateRowInTable(updatedEntry);
      cancelEdit();
      showToast('Ligne modifiée avec succès !');
    } else {
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
    }
  } catch (err) {
    showToast('Erreur : ' + err.message, true);
  }
});

async function loadEntries() {
  try {
    const res = await fetch('/api/entries');
    const entries = await res.json();

    entriesBody.innerHTML = '';
    entriesMap.clear();

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
  entriesMap.set(entry.id, { ...entry });
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
    <td><button type="button" class="btn-edit" onclick="editEntry('${entry.id}')">Modifier</button></td>
  `;
  entriesBody.appendChild(tr);
}

function updateRowInTable(entry) {
  entriesMap.set(entry.id, { ...entry });
  const tr = entriesBody.querySelector(`tr[data-id="${entry.id}"]`);
  if (tr) {
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
      <td><button type="button" class="btn-edit" onclick="editEntry('${entry.id}')">Modifier</button></td>
    `;
  }
}

function editEntry(id) {
  const entry = entriesMap.get(id);
  if (!entry) return;

  currentEditId = id;
  form.prefecture.value = entry.prefecture || '';
  form.dateEntretien.value = entry.dateEntretien || '';
  form.passageCAA.value = entry.passageCAA || '';
  form.misAJour.value = entry.misAJour || '';
  form.typeMisAJour.value = entry.typeMisAJour || '';
  form.methodeMisAJour.value = entry.methodeMisAJour || '';
  form.passageCAE.value = entry.passageCAE || '';
  form.complementCAA.value = entry.complementCAA || '';
  form.complementCAE.value = entry.complementCAE || '';
  form.sCEC.value = entry.sCEC || '';

  btnSubmit.textContent = 'Modifier la ligne';
  btnCancel.classList.remove('hidden');
  form.scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  currentEditId = null;
  form.reset();
  btnSubmit.textContent = 'Ajouter la ligne';
  btnCancel.classList.add('hidden');
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
