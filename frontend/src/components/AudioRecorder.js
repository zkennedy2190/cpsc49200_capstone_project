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
    // Front-end validation to match backend requirements
    if (!token) {
      setUploadStatus('Not authenticated.');
      return;
    }
    if (!effectiveVolunteerId) {
      setUploadStatus('Missing required data: volunteerId.');
      return;
    }
    if (!parentId || !childId) {
      setUploadStatus('Missing required data: parentId and/or childId.');
      return;
    }

    setUploadStatus('Uploading...');
    try {
      // Convert blob URL to Blob
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Build multipart/form-data — field name must be "audio"
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('parentId', String(parentId));
      formData.append('childId', String(childId));
      formData.append('volunteerId', String(effectiveVolunteerId));

      // POST to backend; do NOT set Content-Type when sending FormData
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
          data = await res.clone().json();
        } catch {
          try { bodyText = await res.text(); } catch { bodyText = ''; }
        }
      } else {
        // apiFetch returned parsed JSON
        data = res;
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
