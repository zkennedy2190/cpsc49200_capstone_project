import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function RecordingsLibraryPage() {
    const [files, setFiles] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetch('http://localhost:4000/api/recordings')
            .then((res) => res.json())
            .then((data) => setFiles(data))
            .catch((err) => console.error(err));
    }, []);

    const submitRating = async (file, rating) => {
        if (!user) return;
        await fetch('http://localhost:4000/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ recording: file, rating }),
        });
        alert('Rating submitted');
    };

    return (
        <div>
            <h2>Recordings Library</h2>
            {files.length === 0 && <p>No recordings available.</p>}
            <ul>
                {files.map((file) => (
                    <li key={file}>
                        <audio src={`http://localhost:4000/uploads/${file}`} controls />
                        <span>{file}</span>
                        {user && (
                            <select onChange={(e) => submitRating(file, e.target.value)} defaultValue="">
                                <option value="" disabled>
                                    Rate this recording
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecordingsLibraryPage;