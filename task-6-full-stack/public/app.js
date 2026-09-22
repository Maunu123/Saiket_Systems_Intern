const list = document.querySelector('#profileList');
const formPanel = document.querySelector('#formPanel');
const form = document.querySelector('#profileForm');
const notice = document.querySelector('#notice');
let profiles = [];

async function loadProfiles() {
  try {
    const response = await fetch('/api/profiles');
    if (!response.ok) throw new Error('Could not load profiles');
    profiles = await response.json();
    renderProfiles();
  } catch (error) { showNotice(error.message, true); }
}
function showNotice(message, error = false) { notice.textContent = message; notice.className = error ? 'error' : ''; }
function renderProfiles() {
  document.querySelector('#profileCount').textContent = `${profiles.length} profile${profiles.length === 1 ? '' : 's'}`;
  list.innerHTML = profiles.length ? profiles.map((profile) => `<article class="profile"><div class="avatar">${profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><h3>${profile.name}</h3><p>${profile.email} · ${profile.age} years old</p></div><div><span class="role">${profile.role}</span><span class="profile-actions"><button data-edit="${profile.id}">Edit</button><button data-delete="${profile.id}">Delete</button></span></div></article>`).join('') : '<p class="empty">No profiles yet. Add the first person.</p>';
}
function openForm(profile = null) { formPanel.classList.remove('hidden'); document.querySelector('#formTitle').textContent = profile ? 'Edit profile' : 'New profile'; document.querySelector('#profileId').value = profile?.id || ''; document.querySelector('#name').value = profile?.name || ''; document.querySelector('#email').value = profile?.email || ''; document.querySelector('#age').value = profile?.age || ''; document.querySelector('#role').value = profile?.role || 'Member'; document.querySelector('#name').focus(); }
function closeForm() { formPanel.classList.add('hidden'); form.reset(); document.querySelector('#profileId').value = ''; }
document.querySelector('#newUserButton').addEventListener('click', () => openForm());
document.querySelector('#closeForm').addEventListener('click', closeForm);
form.addEventListener('submit', async (event) => { event.preventDefault(); const id = document.querySelector('#profileId').value; const body = { name: document.querySelector('#name').value, email: document.querySelector('#email').value, age: document.querySelector('#age').value, role: document.querySelector('#role').value }; const response = await fetch(id ? `/api/profiles/${id}` : '/api/profiles', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) return showNotice(data.error, true); closeForm(); showNotice(id ? 'Profile updated.' : 'Profile added.'); await loadProfiles(); });
list.addEventListener('click', async (event) => { const editId = event.target.dataset.edit; const deleteId = event.target.dataset.delete; if (editId) openForm(profiles.find((profile) => profile.id === Number(editId))); if (deleteId && confirm('Delete this profile?')) { const response = await fetch(`/api/profiles/${deleteId}`, { method: 'DELETE' }); if (!response.ok) return showNotice('Could not delete profile.', true); showNotice('Profile deleted.'); await loadProfiles(); } });
loadProfiles();
