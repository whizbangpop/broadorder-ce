// src/pages/MenuEditor.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const MenuEditor = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', basePrice: 0 });

  const fetchMenuItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMenuItems(items);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleAddItem = async () => {
    if (newItem.name && newItem.basePrice) {
      await addDoc(collection(db, 'menuItems'), newItem);
      setNewItem({ name: '', basePrice: 0 });
    }
  };

  const handleModifierChange = (modifierCategory, option, value) => {
    setNewItem((prev) => ({
      ...prev,
      modifiers: {
        ...prev.modifiers,
        [modifierCategory]: {
          ...prev.modifiers[modifierCategory],
          [option]: value,
        },
      },
    }));
  };

  const deleteItem = async (id) => {
    const itemDoc = doc(db, 'menu', id);
    await deleteDoc(itemDoc);
    fetchMenuItems();
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Menu Editor</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={newItem.name}
        className='border p-2 mb-2 w-full'
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Base Price"
        value={newItem.basePrice}
        className='border p-2 mb-2 w-full'
        onChange={(e) => setNewItem({ ...newItem, basePrice: (e.target.value) })}
      />
      
      <button onClick={handleAddItem} className="btn-primary mb-4 w-full p-2 text-white bg-blue-500 rounded">Add Item</button>
    
      {menuItems.map((item) => (
        <div key={item.id} className="flex justify-between items-center border p-2 mb-2">
          <span>{item.name}</span>
          <button onClick={() => deleteItem(item.id)} className="btn-danger p-1 text-white bg-red-500 rounded">
            Remove
          </button>
        </div>
      ))}
    
    </div>

    
  );
};

export default MenuEditor;
