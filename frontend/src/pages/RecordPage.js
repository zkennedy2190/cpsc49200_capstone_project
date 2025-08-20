import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import AudioRecorder from '../components/AudioRecorder';

export default function RecordPage() {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: 16 }}>
      <h2>Record a Session</h2>
      <AudioRecorder volunteerId={user?.id} />
    </div>
  );
}
