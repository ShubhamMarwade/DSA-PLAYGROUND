import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Chart } from 'chart.js/auto';

const fibonacciAlgorithm = `
function fibonacci(n) {
  if (n <= 1) return [0];
  const fibSequence = [0, 1];
  for (let i = 2; i < n; i++) {
    fibSequence.push(fibSequence[i - 1] + fibSequence[i - 2]);
  }
  return fibSequence;
}

// Example usage
const n = 10;
const fibSequence = fibonacci(n);
console.log(fibSequence);
`;

const FibonacciVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [n, setN] = useState(10);
  const [fibSequence, setFibSequence] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleNChange = (event) => {
    setN(parseInt(event.target.value, 10));
  };

  const handleVisualize = () => {
    const sequence = fibonacci(n);
    setFibSequence(sequence);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sequence.map((_, index) => `F(${index})`),
        datasets: [{
          label: 'Fibonacci Sequence',
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

  const fibonacci = (n) => {
    if (n <= 1) return [0];
    const fibSequence = [0, 1];
    for (let i = 2; i < n; i++) {
      fibSequence.push(fibSequence[i - 1] + fibSequence[i - 2]);
    }
    return fibSequence;
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
          <h1 className="text-3xl font-bold text-center text-red-600">FIBONACCI SEQUENCE VISUALIZATION</h1>
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
            value={fibonacciAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="N (number of terms)"
            type="number"
            value={n}
            onChange={handleNChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <canvas ref={chartRef} width="750" height="300" style={{ background: '#f0f0f0', border: '1px solid black' }}></canvas>
        </div>
      </div>
    </div>
  );
};

export default FibonacciVisualizer;