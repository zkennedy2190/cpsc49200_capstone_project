import React, { useState, useContext } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { AuthContext } from '../AuthContext';

function AudioRecorder({ parentId, childId, volunteerId, onUploadComplete }) {
  const { token } = useContext(AuthContext);
  const [uploadStatus, setUploadStatus] = useState('');

  const uploadRecording = async (blobUrl) => {
    setUploadStatus('Uploading...');
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('parentId', parentId);
      formData.append('childId', childId);
      formData.append('volunteerId', volunteerId);

      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setUploadStatus('Upload successful');
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        setUploadStatus('Upload failed');
      }
    } catch (error) {
      setUploadStatus('Upload error');
      console.error(error);
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