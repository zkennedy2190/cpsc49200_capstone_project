import React, { useEffect, useState } from 'react';

function RecordingsLibraryPage() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/recordings')
            .then((res) => res.json())
            .then((data) => setFiles(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h2>Recordings Library</h2>
            {files.length === 0 && <p>No recordings available.</p>}
            <ul>
                {files.map((file) => (
                    <li key={file}>
                        <audio src={`http://localhost:4000/uploads/${file}`} controls />
                        <span>{file}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecordingsLibraryPage;