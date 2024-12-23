import React, { useState } from 'react';
import Tree from 'react-d3-tree';

export function CreatAST() {
  const [inputRule, setinputRule] = useState("");
  const [treeData, setTreeData] = useState(null);  // Use useState to store tree data

  const handleInputChange = (event) => {
    setinputRule(event.target.value);
  }

  const sendData = () => {
    fetch("http://localhost:8000/rules/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputRule }) // Sending inputRule as JSON
    })
    .then(response => response.json()) // Assuming the response is in JSON format
    .then(data => {
      console.log("Success:", data);
      setTreeData(JSON.parse(data)); // Update the treeData state with the received data
    })
    .catch((e) => console.log("Error:", e));
  }

  return (
    <div>
      <input 
        type="text" 
        value={inputRule} 
        onChange={handleInputChange} 
      />
      <button onClick={sendData}>Send Rule</button>
      <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
        {/* Conditional rendering of Tree component */}
        {treeData ? (
          <Tree data={treeData} />
        ) : (
          <div>No data to display</div>
        )}
      </div>
    </div>
  );
}
