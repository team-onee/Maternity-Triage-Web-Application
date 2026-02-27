const form = document.getElementById('triageForm');
const assessmentCard = document.getElementById('assessmentCard');
const dashboardCard = document.getElementById('dashboardCard');
const resultBox = document.getElementById('resultBox');
const priorityBadge = document.getElementById('priorityBadge');
const priorityDesc = document.getElementById('priorityDesc');
const timestampEl = document.getElementById('timestamp');
const queueBody = document.getElementById('queueBody');
const queueTable = document.getElementById('queueTable');
const emptyMessage = document.getElementById('emptyMessage');
const searchQueue = document.getElementById('searchQueue');
const formError = document.getElementById('formError');
const queueStats = document.getElementById('queueStats');
const patientModal = document.getElementById('patientModal');

let queue = JSON.parse(localStorage.getItem('maternityTriageQueue')) || [];
let sortField = 'time';
let sortAsc = false;

function saveQueue() {
  localStorage.setItem('maternityTriageQueue', JSON.stringify(queue));
}

function renderQueue(filteredQueue = queue) {
  queueBody.innerHTML = '';
  updateQueueStats(filteredQueue);
  if (filteredQueue.length === 0) {
    queueTable.style.display = 'none';
    emptyMessage.style.display = 'block';
  } else {
    queueTable.style.display = 'table';
    emptyMessage.style.display = 'none';
    filteredQueue.forEach((patient, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${patient.name || 'Unknown'}</td>
        <td><span class="priority-badge priority-${patient.priorityClass}">${patient.priority}</span></td>
        <td>${patient.time}</td>
        <td>
          <button class="btn btn-secondary action-btn" onclick="viewPatient(${index})">View</button>
          <button class="btn btn-secondary action-btn" onclick="removePatient(${index})">Remove</button>
        </td>
      `;
      queueBody.appendChild(tr);
    });
  }
}

function updateQueueStats(filteredQueue) {
  const total = filteredQueue.length;
  const counts = filteredQueue.reduce((acc, p) => {
    acc[p.priorityClass] = (acc[p.priorityClass] || 0) + 1;
    return acc;
  }, {});
  queueStats.textContent = `Total: ${total} (Red: ${counts.red || 0}, Orange: ${counts.orange || 0}, Yellow: ${counts.yellow || 0}, Green: ${counts.green || 0})`;
}

function showDashboard() {
  assessmentCard.style.display = 'none';
  dashboardCard.style.display = 'block';
  renderQueue();
}

function showForm() {
  assessmentCard.style.display = 'block';
  dashboardCard.style.display = 'none';
  resultBox.style.display = 'none';
  form.reset();
  formError.style.display = 'none';
}

function viewPatient(index) {
  const patient = queue[index];
  document.getElementById('modalName').textContent = patient.name;
  document.getElementById('modalGA').textContent = patient.ga;
  document.getElementById('modalBP').textContent = patient.bp;
  document.getElementById('modalFHR').textContent = patient.fhr || 'Not recorded';
  const symptomsList = document.getElementById('modalSymptoms');
  symptomsList.innerHTML = patient.symptoms.map(s => 
    `<li>${s.replace(/-/g, ' ').charAt(0).toUpperCase() + s.replace(/-/g, ' ').slice(1)}</li>`
  ).join('');
  document.getElementById('modalNotes').textContent = patient.notes || 'None';
  document.getElementById('modalPriority').textContent = patient.priority;
  document.getElementById('modalTime').textContent = patient.time;
  patientModal.style.display = 'flex';
}

function closeModal() {
  patientModal.style.display = 'none';
}

function removePatient(index) {
  if (confirm("Remove this patient from queue?")) {
    queue.splice(index, 1);
    saveQueue();
    renderQueue();
  }
}

function clearQueue() {
  if (confirm("Clear entire queue? This cannot be undone.")) {
    queue = [];
    saveQueue();
    renderQueue();
  }
}

function sortQueue(field) {
  sortField = field;
  sortAsc = !sortAsc;
  queue.sort((a, b) => {
    if (field === 'priority') {
      const order = { red: 4, orange: 3, yellow: 2, green: 1 };
      return sortAsc ? order[a.priorityClass] - order[b.priorityClass] : order[b.priorityClass] - order[a.priorityClass];
    } else {
      const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
      const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
      return sortAsc ? timeA - timeB : timeB - timeA;
    }
  });
  renderQueue();
}

function filterQueue() {
  const search = searchQueue.value.toLowerCase();
  const filtered = queue.filter(p => p.name.toLowerCase().includes(search));
  renderQueue(filtered);
}

function exportQueue() {
  if (queue.length === 0) {
    alert('No patients to export.');
    return;
  }
  let csv = 'Name,ID,GA (weeks),BP (mmHg),FHR (bpm),Symptoms,Notes,Priority,Time\n';
  queue.forEach(p => {
    csv += `${p.name},${p.name},${p.ga},${p.bp},${p.fhr || ''},"${p.symptoms.join(', ')}","${p.notes || ''}",${p.priority},${p.time}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `maternity_queue_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function validateForm() {
  formError.style.display = 'none';
  const name = document.getElementById('name').value.trim();
  const ga = document.getElementById('ga').value.trim();
  const bp = document.getElementById('bp').value.trim();
  const bpRegex = /^\d{2,3}\/\d{2,3}$/;
  
  if (!name) {
    formError.textContent = 'Patient Name/ID is required.';
    formError.style.display = 'block';
    return false;
  }
  if (!ga || isNaN(ga) || ga < 0 || ga > 42) {
    formError.textContent = 'Gestational Age must be between 0 and 42 weeks.';
    formError.style.display = 'block';
    return false;
  }
  if (!bpRegex.test(bp)) {
    formError.textContent = 'Blood Pressure must be in format like 120/80.';
    formError.style.display = 'block';
    return false;
  }
  return true;
}

function getPriority(symptoms, ga, bp, fhr) {
  const bpParts = bp.split('/').map(n => parseInt(n.trim()));
  const systolic = bpParts[0];
  const diastolic = bpParts[1];

  if (
    symptoms.includes('heavy-bleeding') ||
    symptoms.includes('severe-pain') ||
    systolic >= 160 ||
    diastolic >= 110 ||
    (fhr && (fhr < 100 || fhr > 170)) ||
    symptoms.includes('blurred-vision') ||
    symptoms.includes('swelling')
  ) {
    return { text: "RED - Immediate (BSOTS Level 1: Life-threatening)", class: "red" };
  }

  if (
    symptoms.includes('high-bp') ||
    (ga < 37 && symptoms.includes('contractions')) ||
    symptoms.includes('reduced-movements') ||
    symptoms.includes('severe-vomiting')
  ) {
    return { text: "ORANGE - Urgent (BSOTS Level 2: Urgent care)", class: "orange" };
  }

  if (
    symptoms.includes('leaking-fluid') ||
    symptoms.includes('fever') ||
    symptoms.includes('mild-pain')
  ) {
    return { text: "YELLOW - Prompt (BSOTS Level 3: Prompt review)", class: "yellow" };
  }

  return { text: "GREEN - Non-urgent (BSOTS Level 4: Standard care)", class: "green" };
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const name = document.getElementById('name').value.trim();
  const ga = parseInt(document.getElementById('ga').value);
  const bp = document.getElementById('bp').value.trim();
  const fhr = parseInt(document.getElementById('fhr').value) || null;
  const symptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked'))
    .map(cb => cb.value);
  const notes = document.getElementById('notes').value.trim();

  const priority = getPriority(symptoms, ga, bp, fhr);
  const now = new Date();
  const time = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  queue.unshift({
    name,
    ga,
    bp,
    fhr,
    symptoms,
    notes,
    priority: priority.text,
    priorityClass: priority.class,
    time
  });

  saveQueue();

  priorityBadge.textContent = priority.text.split(' (')[0];
  priorityBadge.className = `priority-badge priority-${priority.class}`;
  priorityDesc.textContent = priority.text.split(' (')[1].replace(')', '');
  timestampEl.textContent = time;

  resultBox.style.display = 'block';
  setTimeout(showDashboard, 1800);
  form.reset();
});

searchQueue.addEventListener('input', filterQueue);

patientModal.addEventListener('click', (e) => {
  if (e.target === patientModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Initial load
renderQueue();
if (queue.length > 0) {
  showDashboard();
}
