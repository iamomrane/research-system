/* -----------------------------
   INITIAL SETUP
----------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  setupPills('decision-type');
  setupPills('audience');
  setupPills('risk');

  const addSourceBtn = document.getElementById('add-source');
  const lockStep2Btn = document.getElementById('lock-step-2');

  if (addSourceBtn) addSourceBtn.addEventListener('click', addSource);
  if (lockStep2Btn) lockStep2Btn.addEventListener('click', completeStep2);
});

/* -----------------------------
   PILL LOGIC (STEP 1)
----------------------------- */

function setupPills(groupId) {
  const pills = document.querySelectorAll(`#${groupId} .pill`);
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

function getActiveText(groupId) {
  const active = document.querySelector(`#${groupId} .pill.active`);
  return active ? active.textContent : null;
}

/* -----------------------------
   STEP 1 — RESEARCH OBJECTIVE
----------------------------- */

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
  document.getElementById('section-2').classList.remove('locked');
}

/* -----------------------------
   STEP 2 — SOURCE INPUT
----------------------------- */

let sourceCount = 0;

function addSource() {
  sourceCount++;

  const container = document.getElementById('sources');
  const div = document.createElement('div');
  div.className = 'source';
  div.dataset.included = 'false';

  div.innerHTML = `
    <label>Source content or context</label>
    <textarea
      class="source-content"
      rows="6"
      placeholder="Paste anything relevant here:
• URLs
• excerpts from PDFs or reports
• copied text
• notes or descriptions of images

Precision is not required."
    ></textarea>

    <label>Why did you include this?</label>
    <textarea
      class="source-rationale"
      rows="3"
      placeholder="What made this stand out?
What do you expect it to help answer?
What signal are you hoping to extract?"
    ></textarea>

    <div class="source-actions">
      <button onclick="generateSourcePrompt(this)">
        Generate evaluation prompt
      </button>

      <span class="include-toggle" onclick="toggleInclude(this)">
        Exclude
      </span>
    </div>

    <textarea
      class="evaluation-output"
      rows="6"
      placeholder="Paste LLM evaluation output here"
    ></textarea>
  `;

  container.appendChild(div);
}

function generateSourcePrompt(btn) {
  const source = btn.closest('.source');
  const content = source.querySelector('.source-content').value.trim();
  const rationale = source.querySelector('.source-rationale').value.trim();
  const question = document.getElementById('question').value.trim();

  if (!content || !rationale) {
    alert('Please provide both the source content and why you included it.');
    return;
  }

  const prompt = `
You are a research analyst reviewing whether a source deserves to be used.

Research objective:
${question}

Why the user included this source:
${rationale}

Source content or context:
${content}

Your task:
1. Infer what kind of source this is (report, opinion, data, anecdote, marketing, analysis, etc.).
2. Decide whether it is directly relevant to the research objective.
3. Assess credibility, incentives, and limitations.
4. Make a clear inclusion decision.

Be strict.
Default to exclusion unless there is clear value.

Output format:
- Inferred source type:
- Relevance: Relevant / Not Relevant
- Credibility: High / Medium / Low
- Key limitation or bias:
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
    alert('Please include at least two sources before continuing.');
    return;
  }

  // Unlock Section 3
  document.querySelectorAll('.section.locked')[0].classList.remove('locked');
}
