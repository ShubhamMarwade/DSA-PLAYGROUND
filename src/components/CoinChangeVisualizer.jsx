import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const coinChangeAlgorithm = `
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Example usage
const coins = [1, 2, 5];
const amount = 11;
const minCoins = coinChange(coins, amount);
console.log(minCoins);
`;

const CoinChangeVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [coins, setCoins] = useState('1, 2, 5');
  const [amount, setAmount] = useState(11);
  const [dpTable, setDpTable] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCoinsChange = (event) => {
    setCoins(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(parseInt(event.target.value, 10));
  };

  const handleVisualize = () => {
    const coinsArray = coins.split(',').map(Number);
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, table) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push([...table]);
    };

    // Coin Change Algorithm
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    addStep(1, 'Initialize dp array', dp);

    for (const coin of coinsArray) {
      for (let i = coin; i <= amount; i++) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        addStep(2, `Update dp[${i}] with coin ${coin}`, dp);
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setDpTable(dp);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    setDpTable(steps[index]);
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
          <h1 className="text-3xl font-bold text-center text-red-600">COIN CHANGE PROBLEM VISUALIZATION</h1>
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
            value={coinChangeAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="Coins (comma separated)"
            value={coins}
            onChange={handleCoinsChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
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
                  <th style={{ border: '1px solid black', padding: '5px' }}>Index</th>
                  {dpTable.map((_, index) => (
                    <th key={index} style={{ border: '1px solid black', padding: '5px' }}>{index}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid black', padding: '5px' }}>dp</td>
                  {dpTable.map((cell, index) => (
                    <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                      {cell === Infinity ? '∞' : cell}
                    </td>
                  ))}
                </tr>
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

export default CoinChangeVisualizer;