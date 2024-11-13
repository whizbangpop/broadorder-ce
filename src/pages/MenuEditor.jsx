// src/pages/MenuEditor.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

function MenuEditor() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', basePrice: 0 });

  const fetchMenuItems = async () => {
    const menuData = await getDocs(collection(db, 'menu'));
    setMenuItems(menuData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const addMenuItem = async () => {
    if (true) {
      console.log(newItem)
      await addDoc(collection(db, 'menu'), { name: newItem.name, basePrice: newItem.basePrice });
      setNewItem('');
      fetchMenuItems();
    }
  };

  const deleteItem = async (id) => {
    const itemDoc = doc(db, 'menu', id);
    await deleteDoc(itemDoc);
    fetchMenuItems();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Menu</h1>
      
      <input
        type="text"
        value={newItem.name}
        onChange={(e) => setNewItem({name: e.target.value})}
        placeholder="New item"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        value={newItem.basePrice}
        onChange={(e) => setNewItem({basePrice: e.target.value})}
        placeholder="Base price"
        className="border p-2 mb-2 w-full"
      />
      <button onClick={addMenuItem} className="btn-primary mb-4 w-full p-2 text-white bg-blue-500 rounded">
        Add Item
      </button>

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
}

export default MenuEditor;
