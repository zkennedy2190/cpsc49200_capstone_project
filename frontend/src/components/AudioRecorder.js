// frontend/src/components/AudioRecorder.js
import React, { useState, useContext } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { AuthContext } from '../AuthContext';
import { apiFetch } from '../api'; // uses REACT_APP_API_BASE_URL

function AudioRecorder({
  parentId = '',
  childId = '',
  volunteerId,              // optional; will default to logged-in user
  onUploadComplete,
}) {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const effectiveVolunteerId = volunteerId || user?.id;

  const [uploadStatus, setUploadStatus] = useState('');

  const uploadRecording = async (blobUrl) => {
    setUploadStatus('Uploading...');
    try {
      // Turn the blob URL into a Blob we can send
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Build multipart/form-data
      const formData = new FormData();
      // Append under both common field names to match varied backends
      formData.append('audio', blob, 'recording.webm');
      formData.append('file', blob, 'recording.webm');
      formData.append('parentId', parentId);
      formData.append('childId', childId);
      formData.append('volunteerId', String(effectiveVolunteerId || ''));

      // Post to backend; do NOT set Content-Type when sending FormData
      const res = await apiFetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      // Normalize success handling for either Response or JSON return
      let ok = true;
      let status = 200;
      let data = null;
      let bodyText = '';

      if (res && typeof res.json === 'function') {
        status = res.status;
        ok = res.ok;
        try {
          // Use clone so we can fall back to text if JSON parsing fails
          data = await res.clone().json();
        } catch {
          try {
            bodyText = await res.text();
          } catch {
            bodyText = '';
          }
        }
      } else {
        // apiFetch returned parsed JSON
        data = res;
        // Treat as success unless the payload explicitly says otherwise
        ok = !(data && data.ok === false);
      }

      if (!ok || (status && (status < 200 || status >= 300))) {
        setUploadStatus(
          `Upload failed${status ? `: HTTP ${status}` : ''}${
            data?.message ? ` – ${data.message}` : bodyText ? ` – ${bodyText}` : ''
          }`
        );
        return;
      }

      setUploadStatus('Upload successful');
      onUploadComplete?.(data);
    } catch (error) {
      console.error(error);
      setUploadStatus('Upload error');
    }
  };

  return (
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          <p>Status: {status}</p>
          <button onClick={startRecording}>Start</button>
          <button onClick={stopRecording}>Stop</button>
          {mediaBlobUrl && (
            <>
              <audio src={mediaBlobUrl} controls />
              <button onClick={() => uploadRecording(mediaBlobUrl)}>Upload</button>
            </>
          )}
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>
      )}
    />
  );
}

export default AudioRecorder;
