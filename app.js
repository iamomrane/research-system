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
      alert('Please complete all fields before continuing.');
      return;
    }

    const summary = `
Research question:
${q}

Decision type:
${d}

Audience:
${a}

Caution level:
${r}
    `.trim();

    const summaryBox = document.getElementById('step1-summary');
    summaryBox.style.display = 'block';
    summaryBox.textContent = summary;

    // Unlock Section 2
    document.querySelectorAll('.section.locked')[0].classList.remove('locked');
  }



let sourceCount = 0;

function addSource() {
  sourceCount++;

  const container = document.getElementById('sources');
  const div = document.createElement('div');
  div.className = 'source';
  div.dataset.included = 'false';

  div.innerHTML = `
    <label>Source Title</label>
    <textarea rows="1" class="source-title" placeholder="e.g. McKinsey AI Productivity Report"></textarea>

    <label>Source Type</label>
    <textarea rows="1" class="source-type" placeholder="Industry report / Academic paper / Blog"></textarea>

    <label>Source Text</label>
    <textarea rows="6" class="source-text" placeholder="Paste the source content here"></textarea>

    <div class="source-actions">
      <button onclick="generateSourcePrompt(this)">Generate Evaluation Prompt</button>
      <span class="include-toggle" onclick="toggleInclude(this)">Exclude</span>
    </div>

    <textarea rows="6" class="evaluation-output" placeholder="Paste LLM evaluation output here"></textarea>
  `;

  container.appendChild(div);
}

function generateSourcePrompt(btn) {
  const source = btn.closest('.source');
  const title = source.querySelector('.source-title').value;
  const type = source.querySelector('.source-type').value;
  const text = source.querySelector('.source-text').value;
  const question = document.getElementById('question').value;

  const prompt = `
You are a research analyst evaluating whether a source should be used.

Research question:
${question}

Source title:
${title}

Source type:
${type}

Source text:
${text}

Evaluate the source strictly.

Output format:
- Relevance: Relevant / Not Relevant
- Credibility: High / Medium / Low
- Bias or limitations:
- Recommendation: Include / Exclude
- Reason (max 2 sentences):
  `.trim();

  alert(prompt);
}

function toggleInclude(span) {
  const source = span.closest('.source');
  const included = source.dataset.included === 'true';

  source.dataset.included = (!included).toString();
  span.textContent = included ? 'Exclude' : 'Include';
  span.classList.toggle('active', !included);
}

function completeStep2() {
  const sources = document.querySelectorAll('.source');
  let includedCount = 0;

  sources.forEach(s => {
    if (s.dataset.included === 'true') includedCount++;
  });

  if (includedCount < 2) {
    alert('Please include at least two credible sources before continuing.');
    return;
  }

  // Unlock Section 3
  document.querySelectorAll('.section.locked')[0].classList.remove('locked');
}
