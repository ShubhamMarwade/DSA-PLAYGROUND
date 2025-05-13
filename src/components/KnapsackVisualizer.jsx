import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const knapsackAlgorithm = `
def knapsack(capacity, weights, values, n):
    K = [[0 for x in range(capacity + 1)] for x in range(n + 1)]

    for i in range(n + 1):
        for w in range(capacity + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif weights[i-1] <= w:
                K[i][w] = max(values[i-1] + K[i-1][w-weights[i-1]], K[i-1][w])
            else:
                K[i][w] = K[i-1][w]

    return K, K[n][capacity]

# Example usage
capacity = 50
weights = [10, 20, 30]
values = [60, 100, 120]
n = len(weights)
K, max_value = knapsack(capacity, weights, values, n)
print("Maximum value in Knapsack =", max_value)
`;

const KnapsackVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [capacity, setCapacity] = useState(50);
  const [weights, setWeights] = useState([10, 20, 30]);
  const [values, setValues] = useState([60, 100, 120]);
  const [n, setN] = useState(weights.length);
  const [K, setK] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cellSize, setCellSize] = useState(50); // Added state for cell size
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(Number(event.target.value));
  };

  const handleWeightsChange = (event) => {
    const newWeights = event.target.value.split(',').map(num => Number(num.trim()));
    setWeights(newWeights);
    setN(newWeights.length);
  };

  const handleValuesChange = (event) => {
    const newValues = event.target.value.split(',').map(num => Number(num.trim()));
    setValues(newValues);
  };

  const handleCellSizeChange = (event) => {
    setCellSize(Number(event.target.value));
  };

  const handleVisualize = () => {
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];
    const K = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    const addStep = (line, description, K, selectedItems = [], currentItem = null, currentWeight = null, action = '') => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push({
        dpTable: JSON.parse(JSON.stringify(K)),
        selectedItems: [...selectedItems],
        currentItem,
        currentWeight,
        action
      });
    };

    // Knapsack Algorithm
    addStep(1, `Initialize the DP table K with dimensions (${n + 1}, ${capacity + 1})`, K);
    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (i === 0 || w === 0) {
          K[i][w] = 0;
          addStep(2, `K[${i}][${w}] is set to 0 because either i or w is 0`, K, [], i, w);
        } else if (weights[i - 1] <= w) {
          const includeItem = values[i - 1] + K[i - 1][w - weights[i - 1]];
          const excludeItem = K[i - 1][w];
          K[i][w] = Math.max(includeItem, excludeItem);
          addStep(3, `K[${i}][${w}] = max(${excludeItem}, ${values[i - 1]} + K[${i - 1}][${w - weights[i - 1]}])`, K, [], i, w, includeItem >= excludeItem ? 'include' : 'exclude');
        } else {
          K[i][w] = K[i - 1][w];
          addStep(4, `K[${i}][${w}] is set to K[${i - 1}][${w}] because weight of item ${i - 1} (${weights[i - 1]}) is greater than ${w}`, K, [], i, w, 'exclude');
        }
      }
    }

    // Determine selected items
    let w = capacity;
    const selectedItems = [];
    for (let i = n; i > 0 && w > 0; i--) {
      if (K[i][w] !== K[i - 1][w]) {
        selectedItems.push(i - 1);
        w -= weights[i - 1];
      }
    }
    setSelectedItems(selectedItems);
    addStep(5, `Selected items for maximum value in knapsack`, K, selectedItems);

    setK(K);
    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setStepIndex(0);
    // Do not start the animation automatically
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { dpTable: currentK, selectedItems, currentItem, currentWeight, action } = steps[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define dimensions
    const margin = 20;
    const itemTableHeight = 30 + weights.length * 20;
    const highlightWidth = 200;

    // Draw item table
    ctx.fillStyle = '#000';
    ctx.fillText('Items:', margin, margin + 10);
    weights.forEach((weight, i) => {
      ctx.fillText(`Item ${i + 1}: Weight = ${weight}, Value = ${values[i]}`, margin, margin + 30 + i * 20);
    });

    // Draw highlights section
    ctx.fillText('Highlights:', 500, margin + 10);
    if (currentItem !== null) {
      ctx.fillStyle = 'blue';
      ctx.fillText(`Processing Item ${currentItem + 1}`, 500, margin + 30);
    }
    if (action) {
      ctx.fillStyle = action === 'include' ? 'green' : 'red';
      ctx.fillText(`Action: ${action.toUpperCase()}`, 500, margin + 50);
    }

    // Draw the DP table
    const dpTableStartY = margin + itemTableHeight + margin;
    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        // Highlight current cell being processed in yellow
        if (currentItem === i && currentWeight === w) {
          ctx.fillStyle = 'yellow';
        } else if (action === 'include' && i === currentItem && w - weights[i - 1]  >= 0 && currentK[i][w] === values[i - 1] + currentK[i - 1][w - weights[i - 1]]) { 
          ctx.fillStyle = '#5DE23C'; // Highlight action cell in green
        } else {
          ctx.fillStyle = '#fff';
        }
        ctx.fillRect(w * cellSize + margin, dpTableStartY + i * cellSize, cellSize, cellSize);
        ctx.strokeRect(w * cellSize + margin, dpTableStartY + i * cellSize, cellSize, cellSize);
        ctx.fillStyle = '#000';
        ctx.fillText(currentK[i][w], w * cellSize + margin + cellSize / 2 - 5, dpTableStartY + i * cellSize + cellSize / 2 + 5);
      }
    }

    // Draw DP table labels
    ctx.fillStyle = '#000';
    ctx.fillText('Weight', margin, dpTableStartY - 10);
    for (let w = 0; w <= capacity; w++) {
      ctx.fillText(w, w * cellSize + margin + cellSize / 2 - 5, dpTableStartY - 10);
    }
    ctx.fillText('Item', margin - 50, dpTableStartY + cellSize / 2 + 5);
    for (let i = 0; i <= n; i++) {
      ctx.fillText(i, margin - 50, dpTableStartY + i * cellSize + cellSize / 2 + 5);
    }

    // Highlight selected items in the knapsack
    selectedItems.forEach((itemIndex, i) => {
      ctx.fillStyle = 'green';
      ctx.fillText(`Item ${itemIndex + 1} included`, margin, dpTableStartY + (n + 2 + i) * cellSize);
    });

    const newDecorations = editorInstance.editor.deltaDecorations(
      decorations,
      [{
        range: new editorInstance.monaco.Range(highlightLines[index], 1, highlightLines[index], 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line'
        }
      }]
    );
    setDecorations(newDecorations);
    setStepIndex(index);

    // Scroll the current step into view
    if (stepRefs.current[index]) {
      stepRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleStepForward = () => {
    if (stepIndex < steps.length - 1) {
      handleAnimate(stepIndex + 1);
    }
  };

  const handleStepBackward = () => {
    if (stepIndex > 0) {
      handleAnimate(stepIndex - 1);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <FormControl variant="outlined" style={{ margin: '10px' }}>
          <InputLabel>Language</InputLabel>
          <Select value={language} onChange={handleLanguageChange} label="Language">
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h1 className="text-3xl font-bold text-center text-red-600">0/1 KNAPSACK VISUALIZATION</h1>
        </div>
        <Button variant="contained" color="primary" onClick={handleVisualize} style={{ margin: '10px' }}>
          Visualize
        </Button>
      </div>
      <div style={{ display: 'flex', height: '79vh', border: '1px solid #ddd' }}>
        <div style={{ flex: 1, borderRight: '1px solid #ddd' }}>
          <Editor
            height="100%"
            defaultLanguage={language}
            value={knapsackAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
            onMount={(editor, monaco) => {
              setEditorInstance({ editor, monaco });
            }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
          <TextField
            variant="outlined"
            label="Capacity"
            value={capacity}
            onChange={handleCapacityChange}
            style={{ width: '10%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Weights (comma separated)"
            value={weights.join(',')}
            onChange={handleWeightsChange}
            style={{ width: '20%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Values (comma separated)"
            value={values.join(',')}
            onChange={handleValuesChange}
            style={{ width: '20%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Cell Size"
            value={cellSize}
            onChange={handleCellSizeChange}
            style={{ width: '10%', marginBottom: '10px' }}
          />
            <Button variant="contained" onClick={handleStepBackward} disabled={stepIndex === 0} style={{ width: '20%' }}>
              Step Backward
            </Button>
            <Button variant="contained" onClick={handleStepForward} disabled={stepIndex >= steps.length - 1} style={{ width: '20%' }}>
              Step Forward
            </Button>
          </div>
          <div style={{ overflowX: 'scroll', overflowY: 'scroll', border: '1px solid #ddd', width: '750px' }}>
            <canvas ref={canvasRef} width="5000" height="2000" style={{ background: '#f0f0f0' }}></canvas>
          </div>
          <div style={{ marginTop: '10px', padding: '10px', borderTop: '1px solid #ddd', height: '30vh', overflowY: 'scroll', width: '100%' }}>
            <h3 className='font-bold'>Code Execution Steps:</h3>
            <ol>
              {stepDescriptions.map((description, index) => (
                <li
                  key={index}
                  ref={el => stepRefs.current[index] = el}
                  style={{ marginBottom: '5px', backgroundColor: index === stepIndex ? 'yellow' : 'transparent' }}>
                  {description}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnapsackVisualizer;