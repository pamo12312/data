"use client"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjI5fNSvLyRE2V4fMx55KcM1khOXoB0FM",
  authDomain: "cars-8295e.firebaseapp.com",
  projectId: "cars-8295e",
  storageBucket: "cars-8295e.appspot.com",
  messagingSenderId: "479646199191",
  appId: "1:479646199191:web:b8fb5278c688be7775a8d2",
  measurementId: "G-5HXKFDLWGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

function App() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "people"));
      const peopleData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPeople(peopleData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addPerson = async () => {
    try {
      const docRef = await addDoc(collection(db, "people"), {
        name,
        age: parseInt(age)
      });
      setPeople([...people, { id: docRef.id, name, age: parseInt(age) }]);
      setName('');
      setAge('');
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const updatePerson = async (id) => {
    try {
      const personRef = doc(db, "people", id);
      await updateDoc(personRef, {
        name,
        age: parseInt(age)
      });
      const updatedPeople = people.map(person =>
          person.id === id ? { id, name, age: parseInt(age) } : person
      );
      setPeople(updatedPeople);
      setName('');
      setAge('');
      setEditing(null);
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  const deletePerson = async (id) => {
    try {
      await deleteDoc(doc(db, "people", id));
      const updatedPeople = people.filter(person => person.id !== id);
      setPeople(updatedPeople);
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const startEdit = (person) => {
    setName(person.name);
    setAge(person.age.toString());
    setEditing(person.id);
  };

  return (
      <div className="App">
        <h1>People Manager</h1>
        <div>
          <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
          <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
          />
          {editing ? (
              <button onClick={() => updatePerson(editing)}>Update Person</button>
          ) : (
              <button onClick={addPerson}>Add Person</button>
          )}
        </div>
        <ul>
          {people.map(person => (
              <li key={person.id}>
                {person.name} ({person.age})
                <button onClick={() => startEdit(person)}>Edit</button>
                <button onClick={() => deletePerson(person.id)}>Delete</button>
              </li>
          ))}
        </ul>
      </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
