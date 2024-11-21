// src/pages/OrdersPage.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [sentOutOrders, setSentOutOrders] = useState([]);

  useEffect(() => {
    const ordersCollection = collection(db, 'orders');
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const ordersArray = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setOrders(ordersArray);
      
      // Update sent out orders
      const filteredSentOutOrders = ordersArray.filter(order => order.status === 'sent out');
      setSentOutOrders(filteredSentOutOrders);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    const orderRef = doc(db, 'orders', orderId);
    
    // Update the order status in Firestore
    await updateDoc(orderRef, { status });

    // Update the local state to remove the order from active orders if status is sent out
    if (status === 'sent out') {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const deleteOrder = async (orderId) => {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  };

  const renderModifiers = (modifiers) => {
    // Create a consistent display for each modifier
    const staticModifiers = {
      milk: modifiers.milk || 'None',
      sugar: modifiers.sugar || 'None',
      syrup: modifiers.syrup || 'None',
      iced: modifiers.isIced ? 'Yes' : 'No',
      allergens: modifiers.allergens ? 'Yes' : 'No'
    };

    return (
      <div>
        <div className="flex space-x-4">
          <div><strong>Milk:</strong> {staticModifiers.milk}</div>
          <div><strong>Sugar:</strong> {staticModifiers.sugar}</div>
          <div><strong>Syrup:</strong> {staticModifiers.syrup}</div>
          <div><strong>Iced:</strong> {staticModifiers.iced}</div>
          <div><strong>Allergens:</strong> {staticModifiers.allergens}</div>
        </div>
        <div className="mt-2"><strong>Notes:</strong> {modifiers.otherNotes || 'None'}</div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Active Orders Section */}
      <h2 className="text-xl font-semibold mb-2">Active Orders</h2>
      {orders.length === 0 ? (
        <p>No active orders.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className={`border p-4 mb-2 flex justify-between items-center rounded shadow-md ${!order.status ? 'pulse' : ''}`}>
            <div>
              <h3 className="font-semibold">{order.itemName}</h3>
              <p>Customer: {order.customerName}</p>
              <p>Department: {order.department || 'None'}</p>
              <p>Room Number: {order.roomNumber || 'None'}</p>
              <hr className="my-2" />
              <div>
                <p className="font-semibold">Modifiers:</p>
                {renderModifiers(order.modifiers)}
              </div>
              <p>Status: {order.status || 'received'}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateOrderStatus(order.id, 'received')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200"
              >
                Received
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'in progress')}
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200"
                disabled={!order.status || order.status === 'sent out'}
              >
                In Progress
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'sent out')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                disabled={!order.status || order.status === 'sent out'}
              >
                Sent Out
              </button>
            </div>
          </div>
      )))}

      {/* Sent Out Orders Section */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Sent Out Orders</h2>
      {sentOutOrders.length === 0 ? (
        <p>No sent out orders.</p>
      ) : (
        sentOutOrders.map(order => (
          <div key={order.id} className="border p-4 mb-2 rounded shadow-md">
            <h3 className="font-semibold">{order.itemName}</h3>
            <p>Customer: {order.customerName}</p>
            <p>Department: {order.department || 'None'}</p>
            <p>Room Number: {order.roomNumber || 'None'}</p>
            <hr className="my-2" />
            <div>
              <p className="font-semibold">Modifiers:</p>
              {renderModifiers(order.modifiers)}
            </div>
            <p>Status: sent out</p>
            <button
              onClick={() => deleteOrder(order.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200 mt-2"
            >
              Delete Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;
