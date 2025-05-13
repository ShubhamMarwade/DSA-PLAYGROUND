import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import './ArrayVisualizer.css';

const algorithms = {
  js: {
    push: "array.push(VALUE);",
    pop: "array.pop();",
    shift: "array.shift();",
    unshift: "array.unshift(VALUE);",
    sort: "array.sort((a, b) => a - b);",
    reverse: "array.reverse();"
  },
  python: {
    push: "array.append(VALUE)",
    pop: "array.pop()",
    shift: "array.pop(0)",
    unshift: "array.insert(0, VALUE)",
    sort: "array.sort()",
    reverse: "array.reverse()"
  },
  cpp: {
    push: "arr.push_back(VALUE);",
    pop: "arr.pop_back();",
    shift: "// No direct equivalent in C++",
    unshift: "// No direct equivalent in C++",
    sort: "std::sort(arr.begin(), arr.end());",
    reverse: "std::reverse(arr.begin(), arr.end());"
  },
  java: {
    push: "arr.add(VALUE);",
    pop: "arr.remove(arr.size() - 1);",
    shift: "arr.remove(0);",
    unshift: "arr.add(0, VALUE);",
    sort: "Collections.sort(arr);",
    reverse: "Collections.reverse(arr);"
  },
  c: {
    push: "// No direct equivalent in C",
    pop: "// No direct equivalent in C",
    shift: "// No direct equivalent in C",
    unshift: "// No direct equivalent in C",
    sort: "// No direct equivalent in C",
    reverse: "// No direct equivalent in C"
  }
};

const ArrayVisualizer = () => {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const [language, setLanguage] = useState('js');
  const [code, setCode] = useState(algorithms['js'].push);
  const [explanation, setExplanation] = useState('');
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Update code with the current operation and language
    setCode(algorithms[language].push.replace('VALUE', value));
  }, [language, value]);

  useEffect(() => {
    drawArray();
  }, [array, zoomLevel]);

  const drawArray = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / array.length) * zoomLevel;
    const offsetX = (width - barWidth * array.length) / 2;
    const barHeight = height * 0.6; // Adjust the height of the bars
    const barY = (height - barHeight) / 2; // Center the bars vertically

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    array.forEach((item, i) => {
      ctx.fillStyle = 'steelblue';
      ctx.fillRect(offsetX + i * barWidth, barY, barWidth - 1, barHeight);

      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(item, offsetX + i * barWidth + barWidth / 2, barY + barHeight / 1.5);

      ctx.fillStyle = 'black';
      ctx.fillText(i, offsetX + i * barWidth + barWidth / 2, barY + barHeight + 15);
    });
  };

  const animatePush = (newArray, value, index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / newArray.length) * zoomLevel;
    const offsetX = (width - barWidth * newArray.length) / 2;
    const barHeight = height * 0.6; // Adjust the height of the bars
    const targetY = (height - barHeight) / 2;

    let currentY = -50;
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      newArray.forEach((item, i) => {
        ctx.fillStyle = 'steelblue';
        if (i === index && currentY < targetY) {
          ctx.fillRect(offsetX + i * barWidth, currentY, barWidth - 1, barHeight);
        } else {
          ctx.fillRect(offsetX + i * barWidth, targetY, barWidth - 1, barHeight);
        }

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(item, offsetX + i * barWidth + barWidth / 2, currentY < targetY && i === index ? currentY + barHeight / 1.5 : targetY + barHeight / 1.5);

        ctx.fillStyle = 'black';
        ctx.fillText(i, offsetX + i * barWidth + barWidth / 2, targetY + barHeight + 15);
      });

      if (currentY < targetY) {
        currentY += 5;
      } else {
        clearInterval(interval);
        drawArray();
      }
    }, 30);
  };

  const updateExplanation = (text) => {
    setExplanation(text);
  };

  const arrayPush = () => {
    if (value === '' || isNaN(value) || index === '' || isNaN(index) || index < 0 || index > array.length) {
      alert('Please enter a valid value and index for insertion.');
      return;
    }
    const newArray = [...array];
    newArray.splice(index, 0, parseInt(value));
    setArray(newArray);
    animatePush(newArray, value, index);
    updateExplanation(`Push adds an element at index ${index}. The new element is ${value}.`);
    setCode(algorithms[language].push.replace('VALUE', value));
    setValue('');
    setIndex('');
  };

  const arrayPop = () => {
    if (index === '' || isNaN(index) || index < 0 || index >= array.length) {
      alert('Please enter a valid index for deletion.');
      return;
    }
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
    updateExplanation(`Pop removes the element at index ${index}.`);
    setCode(algorithms[language].pop);
    setIndex('');
    drawArray();
  };

  const arrayShift = () => {
    if (array.length > 0) {
      const newArray = array.slice(1);
      setArray(newArray);
      updateExplanation("Shift removes the first element and shifts all elements left.");
      setCode(algorithms[language].shift);
      drawArray();
    }
  };

  const arrayUnshift = () => {
    if (value === '' || isNaN(value)) {
      alert('Please enter a valid value for insertion.');
      return;
    }
    const newArray = [parseInt(value), ...array];
    setArray(newArray);
    updateExplanation(`Unshift adds an element at the beginning. The new element is ${value}.`);
    setCode(algorithms[language].unshift.replace('VALUE', value));
    setValue('');
    drawArray();
  };

  const arraySort = () => {
    const newArray = [...array].sort((a, b) => a - b);
    setArray(newArray);
    updateExplanation("Sort arranges the elements in ascending order.");
    setCode(algorithms[language].sort);
    drawArray();
  };

  const arrayReverse = () => {
    const newArray = [...array].reverse();
    setArray(newArray);
    updateExplanation("Reverse changes the order of elements to the opposite.");
    setCode(algorithms[language].reverse);
    drawArray();
  };

  const zoomIn = () => {
    setZoomLevel(prevZoom => prevZoom * 1.1);
  };

  const zoomOut = () => {
    setZoomLevel(prevZoom => prevZoom / 1.1);
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Array Visualization</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section visualization">
          <h3 className="text-lg font-semibold mb-2">Visualization</h3>
          <canvas ref={canvasRef} className="array-container" width="400" height="200"></canvas>
          
          <div className="zoom-controls mt-4 flex justify-center gap-2">
            <Button variant="contained" color="primary" onClick={zoomIn}>Zoom In</Button>
            <Button variant="contained" color="secondary" onClick={zoomOut}>Zoom Out</Button>
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
        <TextField
          variant="outlined"
          label="Index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          className="w-32"
        />
        <Button variant="contained" color="primary" onClick={arrayPush}>Push</Button>
        <Button variant="contained" color="secondary" onClick={arrayPop}>Pop</Button>
        <Button variant="contained" color="primary" onClick={arrayShift}>Shift</Button>
        <Button variant="contained" color="secondary" onClick={arrayUnshift}>Unshift</Button>
        <Button variant="contained" color="primary" onClick={arraySort}>Sort</Button>
        <Button variant="contained" color="secondary" onClick={arrayReverse}>Reverse</Button>
      </div>
      <div className="instructions mt-4 p-4 bg-white rounded-lg shadow-md">
        <Typography className="text-lg font-semibold text-red-600 text-center mb-2">Instructions</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc list-inside">
            <li>Push: Enter a value and an index to insert the value at the specified index.</li>
            <li>Pop: Enter an index to remove the element at the specified index.</li>
            <li>Shift: Removes the first element of the array.</li>
          </ul>
          <ul className="list-disc list-inside">
            <li>Unshift: Enter a value to add it to the beginning of the array.</li>
            <li>Sort: Sorts the array in ascending order.</li>
            <li>Reverse: Reverses the order of the array.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;