import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const lcsAlgorithm = `
function lcs(X, Y) {
  const m = X.length;
  const n = Y.length;
  const L = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) {
        L[i][j] = L[i - 1][j - 1] + 1;
      } else {
        L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
      }
    }
  }

  return L;
}

// Example usage
const X = 'AGGTAB';
const Y = 'GXTXAYB';
const lcsMatrix = lcs(X, Y);
console.log(lcsMatrix);
`;

const LCSVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [X, setX] = useState('AGGTAB');
  const [Y, setY] = useState('GXTXAYB');
  const [lcsMatrix, setLcsMatrix] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleXChange = (event) => {
    setX(event.target.value);
  };

  const handleYChange = (event) => {
    setY(event.target.value);
  };

  const handleVisualize = () => {
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, matrix) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push(matrix.map((row) => [...row]));
    };

    // LCS Algorithm
    const m = X.length;
    const n = Y.length;
    const L = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    addStep(1, 'Initialize LCS matrix', L);

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (X[i - 1] === Y[j - 1]) {
          L[i][j] = L[i - 1][j - 1] + 1;
        } else {
          L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
        }
        addStep(2, `Update L[${i}][${j}]`, L);
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setLcsMatrix(L);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    setLcsMatrix(steps[index]);
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
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h1 className="text-3xl font-bold text-center text-red-600">LONGEST COMMON SUBSEQUENCE VISUALIZATION</h1>
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
            value={lcsAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="String X"
            value={X}
            onChange={handleXChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="String Y"
            value={Y}
            onChange={handleYChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
            <Button variant="contained" onClick={handleStepBackward} disabled={stepIndex === 0} style={{ width: '48%' }}>
              Step Backward
            </Button>
            <Button variant="contained" onClick={handleStepForward} disabled={stepIndex >= steps.length - 1} style={{ width: '48%' }}>
              Step Forward
            </Button>
          </div>
          <div style={{ overflowX: 'auto', width: '100%', marginBottom: '10px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '5px' }}> </th>
                  {Y.split('').map((char, index) => (
                    <th key={index} style={{ border: '1px solid black', padding: '5px' }}>{char}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lcsMatrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td style={{ border: '1px solid black', padding: '5px' }}>{X[rowIndex - 1]}</td>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{ border: '1px solid black', padding: '5px' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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

export default LCSVisualizer;