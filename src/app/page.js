"use client"
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const savedPeople = localStorage.getItem('people');
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    } else {
      const initialPeople = [
        { id: 1, name: 'John Doe', age: 30 },
        { id: 2, name: 'Jane Smith', age: 25 },
      ];
      setPeople(initialPeople);
    }
  }, []);

  const savePeople = (people) => {
    localStorage.setItem('people', JSON.stringify(people));
  };

  const addPerson = () => {
    const newPerson = { id: Date.now(), name, age };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    savePeople(updatedPeople);
    setName('');
    setAge('');
  };

  const updatePerson = (id) => {
    const updatedPeople = people.map(person =>
        person.id === id ? { ...person, name, age } : person
    );
    setPeople(updatedPeople);
    savePeople(updatedPeople);
    setName('');
    setAge('');
    setEditing(null);
  };

  const deletePerson = (id) => {
    const updatedPeople = people.filter(person => person.id !== id);
    setPeople(updatedPeople);
    savePeople(updatedPeople);
  };

  const startEdit = (person) => {
    setName(person.name);
    setAge(person.age);
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

export default App;
