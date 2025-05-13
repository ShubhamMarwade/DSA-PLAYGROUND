import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import './StackVisualizer.css';

const algorithms = {
  js: {
    push: "stack.push(VALUE);",
    pop: "stack.pop();"
  },
  python: {
    push: "stack.append(VALUE)",
    pop: "stack.pop()"
  },
  cpp: {
    push: "stack.push(VALUE);",
    pop: "stack.pop();"
  },
  java: {
    push: "stack.push(VALUE);",
    pop: "stack.pop();"
  },
  c: {
    push: "// No direct equivalent in C",
    pop: "// No direct equivalent in C"
  }
};

const StackVisualizer = () => {
  const [stack, setStack] = useState([1, 2, 3, 4, 5]);
  const [language, setLanguage] = useState('js');
  const [code, setCode] = useState(algorithms['js'].push);
  const [explanation, setExplanation] = useState('');
  const [value, setValue] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    // Update code with the current operation and language
    setCode(algorithms[language].push.replace('VALUE', value));
  }, [language, value]);

  useEffect(() => {
    drawStack();
  }, [stack]);

  const drawStack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width * 0.8;
    const barHeight = height / 10;
    const offsetX = (width - barWidth) / 2;
    const offsetY = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stack.forEach((item, i) => {
      const y = height - offsetY - (i + 1) * barHeight;

      ctx.fillStyle = 'steelblue';
      ctx.fillRect(offsetX, y, barWidth, barHeight - 1);

      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(item, offsetX + barWidth / 2, y + barHeight / 1.5);

      ctx.fillStyle = 'black';
      ctx.fillText(i, offsetX + barWidth + 15, y + barHeight / 1.5);
    });
  };

  const animatePush = (newStack, value, callback) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width * 0.8;
    const barHeight = height / 10;
    const offsetX = (width - barWidth) / 2;
    const targetY = height - 20 - barHeight * newStack.length;

    let currentY = -barHeight; // Start animation from above

    const interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for smooth animation

        newStack.forEach((item, i) => {
            const y = i === newStack.length - 1 && currentY < targetY ? currentY : height - 20 - (i + 1) * barHeight;

            // Draw stack block
            ctx.fillStyle = 'steelblue';
            ctx.fillRect(offsetX, y, barWidth, barHeight - 1);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(offsetX, y, barWidth, barHeight - 1);

            // Draw stack value
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '16px Arial';
            ctx.fillText(item, offsetX + barWidth / 2, y + barHeight / 1.5);

            // Draw index label
            ctx.fillStyle = 'black';
            ctx.fillText(i, offsetX + barWidth + 15, y + barHeight / 1.5);
        });

        // Move animation towards target position
        if (currentY < targetY) {
            currentY += 5;
        } else {
            clearInterval(interval);
            if (callback) callback(); // Update stack state when animation is done
        }
    }, 30);
};



  const updateExplanation = (text) => {
    setExplanation(text);
  };

  const stackPush = () => {
    if (value === '' || isNaN(value)) {
      alert('Please enter a valid value.');
      return;
    }
    const newStack = [...stack, parseInt(value)];
    setStack(newStack);
    animatePush(newStack, value);
    updateExplanation(`Push adds an element to the top of the stack. The new element is ${value}.`);
    setCode(algorithms[language].push.replace('VALUE', value));
    setValue('');
  };

  const stackPop = () => {
    if (stack.length === 0) {
      alert('The stack is empty.');
      return;
    }
    const newStack = stack.slice(0, -1);
    setStack(newStack);
    updateExplanation(`Pop removes the top element from the stack.`);
    setCode(algorithms[language].pop);
    drawStack();
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Stack Visualization</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section visualization">
          <h3 className="text-lg font-semibold mb-2">Visualization</h3>
          <div style={{ 
    width: '100%', 
    overflow: 'auto', 
    resize: 'vertical', 
    border: '1px solid #ccc', 
    minHeight: '200px', // Prevents it from being too small
  }}>
          <canvas ref={canvasRef} className="stack-container" width="450" height="200px"></canvas>
          </div>
          <div className="zoom-controls mt-4 flex justify-center gap-2">
            <Button variant="contained" color="primary" onClick={stackPush}>Push</Button>
            <Button variant="contained" color="secondary" onClick={stackPop}>Pop</Button>
          </div>
        </div>
        <div className="section code">
          <h3 className="text-lg font-semibold mb-2">Code</h3>
          <FormControl variant="outlined" className="w-full mb-2">
            <InputLabel>Language</InputLabel>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)} label="Language">
              <MenuItem value="js">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="c">C</MenuItem>
            </Select>
          </FormControl>
          <Editor
            height="200px"
            defaultLanguage={language}
            value={code}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div className="section explanation">
          <h3 className="text-lg font-semibold mb-2">Explanation</h3>
          <Typography className="bg-gray-200 p-2 rounded-md">{explanation}</Typography>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <TextField
          variant="outlined"
          label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-32"
        />
      </div>
      <div className="instructions mt-4 p-4 bg-white rounded-lg shadow-md">
        <Typography className="text-lg font-semibold text-red-600 text-center mb-2">Instructions</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc list-inside">
            <li>Push: Enter a value to add to the top of the stack.</li>
            <li>Pop: Remove the top element from the stack.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizer;