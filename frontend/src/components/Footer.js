import React from 'react';

function Footer() {
  return (
    <footer className="app-footer" style={{ textAlign: 'center', padding: '10px' }}>
      © {new Date().getFullYear()} StoryBridge - Aunt Mary’s Storybook Portal
    </footer>
  );
}

export default Footer;