import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'notes'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setNotes(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
    );

    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;
    await addDoc(collection(db, 'notes'), {
      text: newNote,
      author: user.displayName,
      uid: user.uid,
      createdAt: new Date()
    });
    setNewNote('');
  };

  const handleLogin = () => signInWithPopup(auth, provider);
  const handleLogout = () => signOut(auth);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📝 Notes App</h1>

      {user ? (
        <div>
          <p>Welcome, {user.displayName} <button onClick={handleLogout}>Logout</button></p>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleAddNote}>Add Note</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h2>📋 All Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <strong>{note.author || 'Anonymous'}:</strong> {note.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

