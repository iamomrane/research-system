function setupPills(groupId) {
  const pills = document.querySelectorAll(`#${groupId} .pill`);
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

setupPills('decision-type');
setupPills('audience');
setupPills('risk');

function getActiveText(groupId) {
  const active = document.querySelector(`#${groupId} .pill.active`);
  return active ? active.textContent : null;
}

function completeStep1() {
  const q = document.getElementById('question').value.trim();
  const d = getActiveText('decision-type');
  const a = getActiveText('audience');
  const r = getActiveText('risk');

  if (!q || !d || !a || !r) {
    alert('Please complete all fields.');
    return;
  }

  document.getElementById('step1-summary').style.display = 'block';
  document.getElementById('step1-summary').textContent =
    `Objective:\n${q}\n\nAudience: ${a}\nDecision: ${d}\nCaution: ${r}`;

  document.querySelector('#section-2').classList.remove('locked');
}

let sourceCount = 0;

function addSource() {
  sourceCount++;

  const div = document.createElement('div');
  div.className = 'source';
  div.dataset.included = 'true';

  div.innerHTML = `
    <label>Source content or context</label>
    <textarea rows="5" class="source-content"
      placeholder="Paste URLs, text, notes, or describe the material."></textarea>

    <label>Why this source matters</label>
    <textarea rows="3" class="source-rationale"
      placeholder="Why did you pick this? What signal does it provide?"></textarea>
  `;

  document.getElementById('sources').appendChild(div);
}

function completeStep2() {
  const sources = document.querySelectorAll('.source');
  if (sources.length < 2) {
    alert('Add at least two sources.');
    return;
  }

  alert('Sources locked. Next steps coming soon.');
}
