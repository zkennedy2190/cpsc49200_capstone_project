// populate-test-users.js
// Node 18+ is required because it uses the Fetch API.

// Replace with the base URL of your deployed API.  The full path should end with /api/register.
const baseApiUrl = 'https://<your-app-name>.azurewebsites.net/api/register';

// Define the eight users and roles you want to create; all use password "test".
const usersToCreate = [
  { username: 'testadmin1', password: 'test', role: 'admin' },
  { username: 'testadmin2', password: 'test', role: 'admin' },
  { username: 'testparent1', password: 'test', role: 'parent' },
  { username: 'testparent2', password: 'test', role: 'parent' },
  { username: 'testguardian1', password: 'test', role: 'guardian' },
  { username: 'testguardian2', password: 'test', role: 'guardian' },
  { username: 'testvolunteer1', password: 'test', role: 'volunteer' },
  { username: 'testvolunteer2', password: 'test', role: 'volunteer' },
];

// Register a single user and log success or failure.
// Handles cases where the API returns text instead of JSON.
async function registerUser(user) {
  const response = await fetch(baseApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  const contentType = response.headers.get('content-type');
  const result = contentType && contentType.includes('application/json')
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

// Main routine that iterates over all test users.
(async () => {
  for (const user of usersToCreate) {
    try {
      await registerUser(user);
    } catch (err) {
      console.error(`Error registering ${user.username}: ${err.message}`);
    }
  }
})();
