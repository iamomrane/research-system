function setupPills(id) {
  document.querySelectorAll(`#${id} .pill`).forEach(p => {
    p.onclick = () => {
      document.querySelectorAll(`#${id} .pill`).forEach(x => x.classList.remove('active'));
      p.classList.add('active');
    };
  });
}

setupPills('decision-type');
setupPills('audience');
setupPills('risk');

function getActive(id) {
  const el = document.querySelector(`#${id} .pill.active`);
  return el ? el.textContent : null;
}

function completeStep1() {
  if (
    !question.value.trim() ||
    !getActive('decision-type') ||
    !getActive('audience') ||
    !getActive('risk')
  ) {
    alert('Complete all fields.');
    return;
  }
  document.getElementById('section-2').classList.remove('locked');
}

let sourceCount = 0;

function addSource() {
  sourceCount++;
  const div = document.createElement('div');
  div.className = 'source';
  div.dataset.included = 'false';

  div.innerHTML = `
    <label>Source content or context</label>
    <textarea rows="5" class="source-content"
      placeholder="URLs, text, notes, PDFs, screenshots…"></textarea>

    <label>Why did you include this?</label>
    <textarea rows="3" class="source-why"
      placeholder="What signal are you hoping to extract?"></textarea>

    <button onclick="generatePrompt(this)">Generate evaluation prompt</button>
    <button onclick="toggleInclude(this)">Exclude</button>
  `;

  document.getElementById('sources').appendChild(div);
}

function toggleInclude(btn) {
  const s = btn.closest('.source');
  const inc = s.dataset.included === 'true';
  s.dataset.included = (!inc).toString();
  btn.textContent = inc ? 'Exclude' : 'Include';
}

function generatePrompt(btn) {
  const s = btn.closest('.source');
  const prompt = `
Research objective:
${question.value}

Why included:
${s.querySelector('.source-why').value}

Source content:
${s.querySelector('.source-content').value}

Evaluate strictly.
`.trim();

  alert(prompt);
}

function completeStep2() {
  const included = [...document.querySelectorAll('.source')]
    .filter(s => s.dataset.included === 'true').length;

  if (included < 2) {
    alert('Include at least two sources.');
    return;
  }

  document.querySelectorAll('.section.locked')[0].classList.remove('locked');
}
