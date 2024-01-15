import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './App.css'; // Import your CSS file for styling

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8000/api/items/')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleAddItem = () => {
    const url = selectedItemId
      ? `http://localhost:8000/api/items/${selectedItemId}/`
      : 'http://localhost:8000/api/items/';
    const method = selectedItemId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: itemName }),
    })
      .then(response => response.json())
      .then(data => {
        setItemName('');
        setSelectedItemId(null);
        fetchData(); // Refresh the item list after adding/updating a new item
      })
      .catch(error => console.error('Error adding/updating item:', error));
  };

  const handleEditItem = itemId => {
    const selectedItem = items.find(item => item.id === itemId);
    setItemName(selectedItem.name);
    setSelectedItemId(itemId);
  };

  const handleDeleteItem = itemId => {
    fetch(`http://localhost:8000/api/items/${itemId}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          fetchData(); // Refresh the item list after deleting an item
        }
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <div className="app-container">
      <h1>Notes Taking App</h1>

      <div className="input-container">
        <textarea
          placeholder="Enter your note here"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
        />
        <button onClick={handleAddItem}>{selectedItemId ? 'Update Note' : 'Add Note'}</button>
      </div>

      <div className="card-list">
        {items.map(item => (
          <div key={item.id} className="card">
            <p>{item.name}</p>
            <div className="button-container">
              <button className="edit-button" onClick={() => handleEditItem(item.id)}>
                <FaEdit />
              </button>
              <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
