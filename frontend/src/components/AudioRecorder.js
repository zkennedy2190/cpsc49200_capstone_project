import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

function AudioRecorder() {
  const [uploadStatus, setUploadStatus] = useState('');

  const uploadRecording = async (blobUrl) => {
    setUploadStatus('Uploading...');
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadStatus('Upload successful');
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
          <button
            onClick={() => {
              stopRecording();
            }}
          >
            Stop
          </button>
          {mediaBlobUrl && (
            <div>
              <audio src={mediaBlobUrl} controls />
              <button onClick={() => uploadRecording(mediaBlobUrl)}>
                Upload
              </button>
            </div>
          )}
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>
      )}
    />
  );
}

export default AudioRecorder;