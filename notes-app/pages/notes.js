import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const router = useRouter();

  const notesRef = collection(db, "notes");

  useEffect(() => {
    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    });

    return unsubscribe;
  }, []);

  const addNote = async () => {
    await addDoc(notesRef, {
      content: note,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      created: new Date()
    });
    setNote('');
  };

  const logout = () => {
    signOut(auth);
    router.push('/login');
  };

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={logout}>Logout</button>
      <input placeholder="Type a note..." value={note} onChange={e => setNote(e.target.value)} />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map(n => (
          <li key={n.id}>{n.content} — <i>{n.email}</i></li>
        ))}
      </ul>
    </div>
  );
}
