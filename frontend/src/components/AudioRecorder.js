import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

function AudioRecorder() {
  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({
          status,
          startRecording,
          stopRecording,
          mediaBlobUrl,
        }) => (
          <div>
            <p>Status: {status}</p>
            <button onClick={startRecording}>Start</button>
            <button onClick={stopRecording}>Stop</button>
            {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
          </div>
        )}
      />
    </div>
  );
}

export default AudioRecorder;