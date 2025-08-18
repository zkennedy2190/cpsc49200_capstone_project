import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={() => navigate('/parent')}>Parent</button>
      <button onClick={() => navigate('/guardian')}>Guardian</button>
      <button onClick={() => navigate('/volunteer')}>Volunteer</button>
      <button onClick={() => navigate('/admin')}>Admin</button>
    </div>
  );
}

export default LoginPage;
