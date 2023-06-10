import React, { useState } from 'react';
import './App.css';

function App() {
  const [containers, setContainers] = useState([
    {
      id: 1,
      name: 'Container 1',
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
      ],
    },
    {
      id: 2,
      name: 'Container 2',
      items: [],
    },
  ]);
  const dragStart = (e, containerId, itemId) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ containerId, itemId }));
    e.currentTarget.classList.add('dragging');
  };

  const dragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const drop = (e, targetContainerId) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { containerId, itemId } = data;

    if (containerId === targetContainerId) {
      // Reorder items within the same container
      const container = containers.find((c) => c.id === containerId);
      const { items } = container;
      const itemIndex = items.findIndex((item) => item.id === itemId);
      const draggedItem = items[itemIndex];

      const updatedItems = [...items];
      updatedItems.splice(itemIndex, 1);
      updatedItems.splice(e.currentTarget.dataset.index, 0, draggedItem);

      const updatedContainers = containers.map((c) => {
        if (c.id === containerId) {
          return { ...c, items: updatedItems };
        }
        return c;
      });

      setContainers(updatedContainers);
      setIsSuccess(true);
      setSuccessMessage('Success! Item reordered within the same container.');
    } else {
      // Move item between containers
      const sourceContainer = containers.find((c) => c.id === containerId);
      const targetContainer = containers.find((c) => c.id === targetContainerId);

      const sourceItems = [...sourceContainer.items];
      const targetItems = [...targetContainer.items];
      const draggedItem = sourceItems.find((item) => item.id === itemId);

      if (draggedItem) {
        const updatedSourceItems = sourceItems.filter((item) => item.id !== itemId);
        const updatedTargetItems = [...targetItems, draggedItem];

        const updatedContainers = containers.map((c) => {
          if (c.id === containerId) {
            return { ...c, items: updatedSourceItems };
          } else if (c.id === targetContainerId) {
            return { ...c, items: updatedTargetItems };
          }
          return c;
        });

        setContainers(updatedContainers);
        setIsSuccess(true);
        setSuccessMessage('Success! Item moved to Container 2.');
      }
    }
  };

  const removeItem = (containerId, itemId) => {
    const updatedContainers = containers.map((c) => {
      if (c.id === containerId) {
        const updatedItems = c.items.filter((item) => item.id !== itemId);
        return { ...c, items: updatedItems };
      }
      return c;
    });

    setContainers(updatedContainers);
  };

  const updateItemName = (containerId, itemId, newName) => {
    const updatedContainers = containers.map((c) => {
      if (c.id === containerId) {
        const updatedItems = c.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, name: newName };
          }
          return item;
        });
        return { ...c, items: updatedItems };
      }
      return c;
    });

    setContainers(updatedContainers);
  };

  const reset = () => {
    const initialContainers = [
      {
        id: 1,
        name: 'Container 1',
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 4, name: 'Item 4' },
        ],
      },
      {
        id: 2,
        name: 'Container 2',
        items: [],
      },
    ];

    setContainers(initialContainers);
    setIsSuccess(false);
    setSuccessMessage('');
  };

  return (
    <div className="App">
      {containers.map((container) => (
        <div className="container" key={container.id} onDrop={(e) => drop(e, container.id)} onDragOver={allowDrop}>
          <h2>{container.name}</h2>
          {container.items.length > 0 ? (
            <div className="items-container">
              {container.items.map((item, index) => (
                <div
                  className="item"
                  key={item.id}
                  draggable
                  onDragStart={(e) => dragStart(e, container.id, item.id)}
                  onDragEnd={dragEnd}
                  data-index={index}
                >
                  {item.name}
                  <button onClick={() => removeItem(container.id, item.id)}>Remove</button>
                  {container.id === 2 && (
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItemName(container.id, item.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Drag items here</p>
          )}
        </div>
      ))}
      {isSuccess && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default App;




