const rapportsBody = document.getElementById('rapportsBody');
const emptyRapports = document.getElementById('emptyRapports');
const resultsCount = document.getElementById('resultsCount');

document.addEventListener('DOMContentLoaded', () => {
  initRapportsSelects();
  loadAndFilter();
  document.getElementById('btnApply').addEventListener('click', loadAndFilter);
  document.getElementById('btnReset').addEventListener('click', resetFilters);
});

function initRapportsSelects() {
  const prefectureSelect = document.getElementById('filterPrefecture');
  PREFECTURES.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    prefectureSelect.appendChild(opt);
  });

  const methodeSelect = document.getElementById('filterMethode');
  METHODES_MISE_A_JOUR.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    methodeSelect.appendChild(opt);
  });
}

function resetFilters() {
  document.getElementById('filterPrefecture').value = '';
  document.getElementById('filterPassageCAE').value = '';
  document.getElementById('filterMisAJour').value = '';
  document.getElementById('filterMethode').value = '';
  document.getElementById('filterSCEC').value = '';
  loadAndFilter();
}

async function loadAndFilter() {
  try {
    const res = await fetch('/api/entries');
    let entries = await res.json();

    const prefecture = document.getElementById('filterPrefecture').value;
    const passageCAE = document.getElementById('filterPassageCAE').value;
    const misAJour = document.getElementById('filterMisAJour').value;
    const methode = document.getElementById('filterMethode').value;
    const sCEC = document.getElementById('filterSCEC').value;

    entries = entries.filter(e => {
      if (prefecture && e.prefecture !== prefecture) return false;
      if (passageCAE && e.passageCAE !== passageCAE) return false;
      if (misAJour && e.misAJour !== misAJour) return false;
      if (methode && e.methodeMisAJour !== methode) return false;
      if (sCEC && e.sCEC !== sCEC) return false;
      return true;
    });

    renderRapports(entries);
  } catch (err) {
    console.error(err);
    rapportsBody.innerHTML = '';
    emptyRapports.classList.remove('hidden');
    emptyRapports.textContent = 'Erreur lors du chargement des données.';
  }
}

function renderRapports(entries) {
  rapportsBody.innerHTML = '';

  if (entries.length === 0) {
    emptyRapports.classList.remove('hidden');
    emptyRapports.textContent = 'Aucun résultat. Ajustez les filtres ou ajoutez des données via le formulaire.';
    resultsCount.textContent = '';
    return;
  }

  emptyRapports.classList.add('hidden');
  resultsCount.textContent = `(${entries.length} ligne${entries.length > 1 ? 's' : ''})`;

  entries.forEach(entry => {
    const tr = document.createElement('tr');
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
    `;
    rapportsBody.appendChild(tr);
  });
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
