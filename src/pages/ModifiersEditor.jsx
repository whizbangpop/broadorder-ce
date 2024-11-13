// src/pages/ModifiersEditor.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function ModifiersEditor() {
  const [modifiers, setModifiers] = useState({
    milk: [],
    sugar: [],
    syrup: [],
  });
  const [newModifier, setNewModifier] = useState({ type: 'milk', name: '' });

  // Fetch modifiers from Firestore
  useEffect(() => {
    const fetchModifiers = async () => {
      const modifierTypes = ['milk', 'sugar', 'syrup'];
      const fetchedModifiers = {};
      
      for (const type of modifierTypes) {
        const data = await getDocs(collection(db, type));
        fetchedModifiers[type] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      }
      setModifiers(fetchedModifiers);
    };
    
    fetchModifiers();
  }, []);

  // Add a new modifier
  const addModifier = async () => {
    if (!newModifier.name.trim()) return;

    const typeCollection = collection(db, newModifier.type);
    await addDoc(typeCollection, { name: newModifier.name });
    setNewModifier({ ...newModifier, name: '' });
    fetchModifiers();
  };

  // Delete a modifier
  const deleteModifier = async (type, id) => {
    const modifierDoc = doc(db, type, id);
    await deleteDoc(modifierDoc);
    fetchModifiers();
  };

  // Update the modifiers state after adding or deleting
  const fetchModifiers = async () => {
    const modifierTypes = ['milk', 'sugar', 'syrup'];
    const updatedModifiers = {};

    for (const type of modifierTypes) {
      const data = await getDocs(collection(db, type));
      updatedModifiers[type] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }
    setModifiers(updatedModifiers);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Modifiers</h1>
      
      {/* Add new modifier */}
      <select
        value={newModifier.type}
        onChange={(e) => setNewModifier({ ...newModifier, type: e.target.value })}
        className="border p-2 mb-2"
      >
        <option value="milk">Milk</option>
        <option value="sugar">Sugar</option>
        <option value="syrup">Syrup</option>
      </select>
      
      <input
        type="text"
        value={newModifier.name}
        onChange={(e) => setNewModifier({ ...newModifier, name: e.target.value })}
        placeholder="New modifier name"
        className="border p-2 mb-2 w-full"
      />
      
      <button onClick={addModifier} className="btn-primary mb-4 w-full p-2 text-white bg-blue-500 rounded">
        Add Modifier
      </button>

      {/* Display existing modifiers by type */}
      {Object.entries(modifiers).map(([type, items]) => (
        <div key={type} className="mb-4">
          <h2 className="text-xl font-semibold capitalize">{type}</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 border-b">
              <span>{item.name}</span>
              <button
                onClick={() => deleteModifier(type, item.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ModifiersEditor;
