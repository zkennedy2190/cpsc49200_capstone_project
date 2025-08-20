// populate-users.js
// Registers a set of users against your Azure backend.
// Requires Node 18+ for native fetch support.

// Azure API endpoint for registration – update if your backend URL changes
const baseApiUrl =
  'https://cpsc49200capstonebackend-chgrc2e5aae7cvdp.centralus-01.azurewebsites.net/api/register';

// User definitions
const usersToCreate = [
  { username: 'testadmin1', password: 'secret123', role: 'admin' },
  { username: 'testadmin2', password: 'secret123', role: 'admin' },
  { username: 'testparent1', password: 'secret123', role: 'parent' },
  { username: 'testparent2', password: 'secret123', role: 'parent' },
  { username: 'testvolunteer1', password: 'secret123', role: 'volunteer' },
  { username: 'testguardian1', password: 'secret123', role: 'guardian' },
];

// Helper to register a single user
async function registerUser(user) {
  const response = await fetch(baseApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  // Check if the response is JSON; otherwise fall back to plain text
  const contentType = response.headers.get('content-type');
  let result;
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (response.ok) {
    // If JSON, try to print the message; otherwise print the raw text
    const msg =
      typeof result === 'object'
        ? result.message || JSON.stringify(result)
        : result;
    console.log(`Registered ${user.username}: ${msg}`);
  } else {
    // Log the error returned by the server or the raw text
    const msg =
      typeof result === 'object'
        ? result.message || JSON.stringify(result)
        : result;
    console.error(`Failed to register ${user.username}: ${msg}`);
  }
}

// Main routine to register all users
(async () => {
  for (const user of usersToCreate) {
    try {
      await registerUser(user);
    } catch (err) {
      console.error(`Error registering ${user.username}: ${err.message}`);
    }
  }
})();
