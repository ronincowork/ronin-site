const form = document.querySelector('#survey');
const status = document.querySelector('#formStatus');
const copyButton = document.querySelector('#copyResponse');
const draftKey = 'ronin-first-use-study-v1';
let preparedResponse = '';

const journey = [
  ['expected', 'Before the first screen appeared, what did you expect Ronin to do?'],
  ['first_confusion', 'What was the first moment you hesitated, guessed, or went backward?'],
  ['agent_task', 'Describe what happened while getting your first Agent running.'],
  ['team_task', 'Describe what happened while starting work on a project with a Team.'],
  ['return_task', 'After returning, how did you decide what needed your attention?'],
  ['failure', 'Where did you stop or fail to complete a task? What did you expect instead?'],
  ['surprise', 'What worked differently—or better—than you expected?']
];
const details = [
  ['home_next', 'On Home, what did you think the four choices meant and what order did you expect to use them in?'],
  ['attention', 'How would you tell which Team or Agent needs you without reading every terminal?'],
  ['team_page', 'What would you change first on the Team page, and why?'],
  ['chat', 'What was unclear about Agent messages, questions, status, or the Chat view?'],
  ['missing', 'What instruction, label, empty state, or next action was missing?'],
  ['one_change', 'If we could change only one thing before your next run, what should it be?']
];
const ratingItems = ['Installation instructions','Setup','Home','Models','Workspaces','Teams','Starting the first Agent','Starting work with a Team','Agent status','Finding what needs attention','Terminal and Chat distinction','Knowing what to do next'];

function textarea(name, question) { return `<label>${question}<textarea name="${name}" required></textarea></label>`; }
document.querySelector('#journeyQuestions').innerHTML = journey.map(([name, question]) => textarea(name, question)).join('');
document.querySelector('#detailQuestions').innerHTML = details.map(([name, question]) => textarea(name, question)).join('');
document.querySelector('#ratings').innerHTML = ratingItems.map((item, index) => `<fieldset class="rating"><legend>${item}</legend><div class="choice-row">${['1','2','3','4','5','N/A'].map(value => `<label><input type="radio" name="rating_${index + 1}" value="${value}" required />${value}</label>`).join('')}</div></fieldset>`).join('');

function renderSpecialist() {
  const cohort = form.elements.cohort.value;
  const questions = cohort === 'Developer' ? [
    ['developer_fit', 'How does Ronin fit—or fail to fit—your real coding workflow?'],
    ['developer_tools', 'Which coding Agent, terminal tools, repositories, and project shapes do you normally work with?'],
    ['developer_trust', 'What would you need to see before trusting Ronin with active project work?']
  ] : [
    ['designer_hierarchy', 'Where did visual hierarchy help or hinder scanning a dense work surface?'],
    ['designer_voice', 'Does the interface feel right for a serious developer tool? Point to specific elements.'],
    ['designer_system', 'Which interaction or component pattern needs the most design attention?']
  ];
  document.querySelector('#specialistQuestions').innerHTML = questions.map(([name, question]) => textarea(name, question)).join('');
}

function draft() {
  try {
    const data = {};
    new FormData(form).forEach((value, key) => { data[key] = value; });
    localStorage.setItem(draftKey, JSON.stringify(data));
  } catch (_) {
    // Draft persistence is optional; the survey must still submit without storage.
  }
}
function restore() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(draftKey) || '{}');
  } catch (_) {
    return;
  }
  Object.entries(data).forEach(([name, value]) => { const field = form.elements[name]; if (!field) return; if (field instanceof RadioNodeList) { [...field].forEach(input => { input.checked = input.value === value; }); } else if (field.type === 'checkbox') field.checked = value === 'on'; else field.value = value; });
}
renderSpecialist(); restore(); renderSpecialist(); restore();
form.addEventListener('input', draft);
form.addEventListener('change', event => { draft(); if (event.target.name === 'cohort') { renderSpecialist(); restore(); } });

function markdown() {
  const data = new FormData(form); let output = '# Ronin first-use study response\n\n';
  output += `- **Name:** ${data.get('name')}\n- **Upwork name:** ${data.get('upwork_name')}\n- **Loom:** ${data.get('loom_url')}\n- **OS:** ${data.get('os')}\n- **Perspective:** ${data.get('cohort')}\n- **Coding-Agent experience:** ${data.get('agent_experience')}\n`;
  const sections = [['The first run', journey], ['Look closer', details]];
  sections.forEach(([title, questions]) => { output += `\n## ${title}\n`; questions.forEach(([name, question]) => { output += `\n### ${question}\n\n${data.get(name) || '—'}\n`; }); });
  output += '\n## Clarity ratings\n\n'; ratingItems.forEach((item, index) => { output += `- ${item}: ${data.get(`rating_${index + 1}`) || '—'}\n`; });
  output += '\n## Specialist perspective\n'; document.querySelectorAll('#specialistQuestions textarea').forEach(field => { output += `\n### ${field.parentElement.firstChild.textContent}\n\n${data.get(field.name) || '—'}\n`; });
  return output;
}
form.addEventListener('submit', event => { event.preventDefault(); if (!form.reportValidity()) return; preparedResponse = markdown(); const blob = new Blob([preparedResponse], { type: 'text/markdown' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `ronin-first-use-${form.elements.name.value.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'response'}.md`; link.click(); URL.revokeObjectURL(link.href); copyButton.disabled = false; status.textContent = 'Response downloaded. Attach it and your Loom link to the Upwork submission.'; });
copyButton.addEventListener('click', async () => { if (!preparedResponse) return; await navigator.clipboard.writeText(preparedResponse); status.textContent = 'Response copied to your clipboard.'; });
