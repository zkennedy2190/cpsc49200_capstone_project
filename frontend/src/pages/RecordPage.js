// frontend/src/pages/RecordPage.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import AudioRecorder from '../components/AudioRecorder';

export default function RecordPage() {
  const { user } = useContext(AuthContext);
  const [parentId, setParentId] = useState('');
  const [childId, setChildId] = useState('');

  return (
    <div style={{ padding: 16 }}>
      <h2>Record a Session</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Parent ID"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        />
        <input
          placeholder="Child ID"
          value={childId}
          onChange={(e) => setChildId(e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </div>

      <AudioRecorder
        volunteerId={user?.id}
        parentId={parentId}
        childId={childId}
      />
    </div>
  );
}
