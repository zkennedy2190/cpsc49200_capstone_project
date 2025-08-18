import React from 'react';

function Header() {
  return (
    <header className="app-header">
      <p>&copy; {new Date().getFullYear()} Aunt Mary’s Storybook Portal</p>
    </header>
  );
}

export default Header;
