// src/pages/Menu.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Modal Component
const Modal = ({ isOpen, onClose, item, modifiers, onOrderPlace }) => {
  const [selectedModifiers, setSelectedModifiers] = useState({
    milk: 'none',
    sugar: 'none',
    syrup: 'none',
    isIced: false,
    allergens: false,
    otherNotes: '',
  });
  const [customerName, setCustomerName] = useState('');
  const [department, setDepartment] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const handleOrder = () => {
    onOrderPlace(item.id, item.name, selectedModifiers, customerName, department, roomNumber);
    onClose(); // Close the modal after placing the order
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-lg font-bold mb-2">{item.name} ({Intl.NumberFormat('en-GB', {style: 'currency', currency: "GBP"}).format(item.basePrice)})</h2>

          {/* Customer Name Input */}
          <div className="mb-2">
            <label className="block">Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter name"
              className="border p-1 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Department:</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department"
              className="border p-1 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Room No.:</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="Enter room number"
              className="border p-1 w-full"
            />
          </div>


          {/* Milk Modifier */}
          <div className="mb-2">
            <label className="block">Milk:</label>
            <select
              value={selectedModifiers.milk}
              onChange={(e) => setSelectedModifiers({ ...selectedModifiers, milk: e.target.value })}
              className="border p-1 w-full"
            >
              {console.log(modifiers.milk)}
              <option selected value="">None</option>
              {modifiers.milk.sort().map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Sugar Modifier */}
          <div className="mb-2">
            <label className="block">Sugar:</label>
            <select
              value={selectedModifiers.sugar}
              onChange={(e) => setSelectedModifiers({ ...selectedModifiers, sugar: e.target.value })}
              className="border p-1 w-full"
            >
              <option selected value="">None</option>
              {modifiers.sugar.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Syrup Modifier */}
          <div className="mb-2">
            <label className="block">Syrup:</label>
            <select
              value={selectedModifiers.syrup}
              onChange={(e) => setSelectedModifiers({ ...selectedModifiers, syrup: e.target.value })}
              className="border p-1 w-full"
            >
              <option selected value="">None</option>
              {modifiers.syrup.sort().map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <p>All syrups are priced at <strong>20p per pump</strong>.</p>
          </div>

          {/* Iced Option */}
          <div className="flex items-center mb-2">
            <label className="mr-2">Iced:</label>
            <input
              type="checkbox"
              checked={selectedModifiers.isIced}
              onChange={(e) => setSelectedModifiers({ ...selectedModifiers, isIced: e.target.checked })}
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="mr-2">Allergies (Please Specify):</label>
            <input
              type="checkbox"
              checked={selectedModifiers.allergens}
              onChange={(e) => setSelectedModifiers({ ...selectedModifiers, allergens: e.target.checked })}
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-2">
            <label className="block">Other Notes:</label>
            <textarea
              value={selectedModifiers.otherNotes}
              onChange={(e) => setSelectedModifiers({ ...selectedModifiers, otherNotes: e.target.value })}
              placeholder="Additional notes"
              className="border p-1 w-full"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleOrder}
              className="btn-primary p-2 text-white bg-blue-500 rounded"
            >
              Place Order
            </button>
            <button
              onClick={onClose}
              className="p-2 ml-2 text-gray-500 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [modifiers, setModifiers] = useState({ milk: [], sugar: [] });
  const [syrups, setSyrups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      const menuData = await getDocs(collection(db, 'menuItems'));
      const items = menuData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(items.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
      setMenuItems(items);
      setFilteredMenuItems(items); // Initialize filtered menu items
    };

    const fetchModifiers = async () => {
      const modifierTypes = ['milk', 'sugar', 'syrup'];
      const fetchedModifiers = {};
      
      for (const type of modifierTypes) {
        const data = await getDocs(collection(db, type));
        fetchedModifiers[type] = data.docs.map((doc) => doc.data().name);
      }
      setModifiers(fetchedModifiers);
    };

    fetchMenuItems();
    fetchModifiers();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredItems = menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
    setFilteredMenuItems(filteredItems);
  };

  const placeOrder = async (itemId, itemName, selectedModifiers, customerName, department, roomNumber) => {
    console.log(selectedModifiers)
    const orderData = {
      customerName,
      department,
      roomNumber,
      itemName,
      modifiers: selectedModifiers,
      timestamp: new Date(),
    };
    await addDoc(collection(db, 'orders'), orderData);
    alert("Order placed successfully!");
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-4">
      <div className="flow-root">
        <h1 className="text-2xl font-bold mb-4 float-left">Order Drink</h1>
        <h2 className='text-xl font-bold mb-4 float-right'>BroardOrder CE (Alpha 0.1.1)</h2>
      </div>
      
      {/* Search Input */}
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search drinks..."
        className="border p-2 mb-4 w-full"
      />

      {/* Menu Items */}
      {/* {filteredMenuItems.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))} */}
      
      {filteredMenuItems.map((item) => (
        <div key={item.id} className="border p-4 mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <button
            onClick={() => openModal(item)}
            className="btn-primary p-2 text-white bg-blue-500 rounded"
          >
            Select
          </button>
        </div>
      ))}

      {/* Modal for Modifiers */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        item={selectedItem}
        modifiers={modifiers}
        syrups={syrups}
        onOrderPlace={placeOrder}
      />
    </div>
  );
}

export default Menu;
