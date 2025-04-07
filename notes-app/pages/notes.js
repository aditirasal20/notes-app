import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function NotesPage() {
  const [user, setUser] = useState(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const snapshot = await getDocs(collection(db, "notes"));
        setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (note.trim() === "") return;
    await addDoc(collection(db, "notes"), {
      text: note,
      user: user.displayName,
      email: user.email,
    });
    setNote("");
    const snapshot = await getDocs(collection(db, "notes"));
    setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome {user?.displayName}</h1>
        <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-3 py-1 rounded">
          Sign Out
        </button>
      </div>
      <div className="mt-4">
        <input 
          type="text" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          placeholder="Write a note..." 
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleAddNote} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Note
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">All Notes</h2>
        <ul className="list-disc pl-6">
          {notes.map(n => (
            <li key={n.id}>
              <strong>{n.user}:</strong> {n.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
