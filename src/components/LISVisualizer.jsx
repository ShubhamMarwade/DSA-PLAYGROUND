import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Chart } from 'chart.js/auto';

const lisAlgorithm = `
function lis(arr) {
  const n = arr.length;
  const lisArray = Array(n).fill(1);
  const sequences = Array(n).fill(null).map(() => []);

  for (let i = 0; i < n; i++) {
    sequences[i].push(arr[i]);
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j] && lisArray[i] < lisArray[j] + 1) {
        lisArray[i] = lisArray[j] + 1;
        sequences[i] = [...sequences[j], arr[i]];
      }
    }
  }

  const maxLength = Math.max(...lisArray);
  const maxIndex = lisArray.indexOf(maxLength);
  return sequences[maxIndex];
}

// Example usage
const arr = [10, 22, 9, 33, 21, 50, 41, 60, 80];
const lisSequence = lis(arr);
console.log(lisSequence);
`;

const LISVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [array, setArray] = useState('10, 22, 9, 33, 21, 50, 41, 60, 80');
  const [lisSequence, setLisSequence] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleArrayChange = (event) => {
    setArray(event.target.value);
  };

  const handleVisualize = () => {
    const arr = array.split(',').map(Number);
    const sequence = lis(arr);
    setLisSequence(sequence);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sequence.map((_, index) => `Element ${index}`),
        datasets: [{
          label: 'Longest Increasing Subsequence',
          data: sequence,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const lis = (arr) => {
    const n = arr.length;
    const lisArray = Array(n).fill(1);
    const sequences = Array(n).fill(null).map(() => []);

    for (let i = 0; i < n; i++) {
      sequences[i].push(arr[i]);
      for (let j = 0; j < i; j++) {
        if (arr[i] > arr[j] && lisArray[i] < lisArray[j] + 1) {
          lisArray[i] = lisArray[j] + 1;
          sequences[i] = [...sequences[j], arr[i]];
        }
      }
    }

    const maxLength = Math.max(...lisArray);
    const maxIndex = lisArray.indexOf(maxLength);
    return sequences[maxIndex];
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <FormControl variant="outlined" style={{ margin: '10px' }}>
          <InputLabel>Language</InputLabel>
          <Select value={language} onChange={handleLanguageChange} label="Language">
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h1 className="text-3xl font-bold text-center text-red-600">LONGEST INCREASING SUBSEQUENCE VISUALIZATION</h1>
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
            value={lisAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="Array (comma separated)"
            value={array}
            onChange={handleArrayChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <canvas ref={chartRef} width="750" height="300" style={{ background: '#f0f0f0', border: '1px solid black' }}></canvas>
        </div>
      </div>
    </div>
  );
};

export default LISVisualizer;