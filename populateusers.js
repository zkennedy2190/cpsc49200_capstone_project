// populate-users.js
// Node 18+ required for native fetch support.

const baseApiUrl =
  'https://cpsc49200capstonebackend-chgrc2e5aae7cvdp.centralus-01.azurewebsites.net/api/register';

const usersToCreate = [
  { username: 'testadmin1', password: 'test', role: 'admin' },
  { username: 'testadmin2', password: 'test', role: 'admin' },
  { username: 'testparent1', password: 'test', role: 'parent' },
  { username: 'testparent2', password: 'test', role: 'parent' },
  { username: 'testguardian1', password: 'test', role: 'guardian' },
  { username: 'testguardian2', password: 'test', role: 'guardian' },
  { username: 'testvolunteer1', password: 'test', role: 'volunteer' },
  { username: 'testvolunteer2', password: 'test', role: 'volunteer' }
];

async function registerUser(user) {
  const response = await fetch(baseApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  const contentType = response.headers.get('content-type');
  const result =
    contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

  if (response.ok) {
    const message =
      typeof result === 'object' ? result.message || 'OK' : result;
    console.log(`Registered ${user.username}: ${message}`);
  } else {
    const message =
      typeof result === 'object' ? result.message : result;
    console.error(`Failed to register ${user.username}: ${message}`);
  }
}

(async () => {
  for (const user of usersToCreate) {
    try {
      await registerUser(user);
    } catch (err) {
      console.error(`Error registering ${user.username}: ${err.message}`);
    }
  }
})();
