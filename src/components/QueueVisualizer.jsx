import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import * as d3 from 'd3';
import './QueueVisualizer.css';

const algorithms = {
  js: {
    enqueue: "queue.push(VALUE);",
    dequeue: "queue.shift();"
  },
  python: {
    enqueue: "queue.append(VALUE)",
    dequeue: "queue.pop(0)"
  },
  cpp: {
    enqueue: "queue.push(VALUE);",
    dequeue: "queue.pop();"
  },
  java: {
    enqueue: "queue.add(VALUE);",
    dequeue: "queue.remove();"
  },
  c: {
    enqueue: "// No direct equivalent in C",
    dequeue: "// No direct equivalent in C"
  }
};

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([1, 2, 3, 4, 5]);
  const [language, setLanguage] = useState('js');
  const [code, setCode] = useState(algorithms['js'].enqueue);
  const [explanation, setExplanation] = useState('');
  const [value, setValue] = useState('');
  const svgContainerRef = useRef(null);

  useEffect(() => {
    // Update code with the current operation and language
    setCode(algorithms[language].enqueue.replace('VALUE', value));
  }, [language, value]);

  useEffect(() => {
    drawQueue();
  }, [queue]);

  const drawQueue = () => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    const svg = d3.select(svgContainer);
    svg.selectAll('*').remove();

    const width = 450;
    const height = 200;
    const barWidth = width / 10;
    const barHeight = height * 0.8;
    const offsetX = 20;
    const offsetY = (height - barHeight) / 2;

    const queueGroup = svg.selectAll('g')
      .data(queue)
      .enter().append('g')
      .attr('transform', (d, i) => `translate(${offsetX + i * barWidth}, ${offsetY})`);

    queueGroup.append('rect')
      .attr('width', barWidth - 1)
      .attr('height', barHeight)
      .attr('fill', 'steelblue')
      .attr('stroke', 'black');

    queueGroup.append('text')
      .attr('x', (barWidth - 1) / 2)
      .attr('y', barHeight / 1.5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d);

    queueGroup.append('text')
      .attr('x', (barWidth - 1) / 2)
      .attr('y', barHeight + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text((d, i) => i);
  };

  const animateEnqueue = (newQueue, value) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    const svg = d3.select(svgContainer);
    svg.selectAll('*').remove();

    const width = 450;
    const height = 200;
    const barWidth = width / 10;
    const barHeight = height * 0.8;
    const offsetX = 20;
    const offsetY = (height - barHeight) / 2;

    let currentX = width + barWidth;
    const interval = setInterval(() => {
      svg.selectAll('*').remove();

      const queueGroup = svg.selectAll('g')
        .data(newQueue)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(${i === newQueue.length - 1 && currentX > offsetX + i * barWidth ? currentX : offsetX + i * barWidth}, ${offsetY})`);

      queueGroup.append('rect')
        .attr('width', barWidth - 1)
        .attr('height', barHeight)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black');

      queueGroup.append('text')
        .attr('x', (barWidth - 1) / 2)
        .attr('y', barHeight / 1.5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d);

      queueGroup.append('text')
        .attr('x', (barWidth - 1) / 2)
        .attr('y', barHeight + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text((d, i) => i);

      if (currentX > offsetX + (newQueue.length - 1) * barWidth) {
        currentX -= 5;
      } else {
        clearInterval(interval);
        drawQueue();
      }
    }, 30);
  };

  const animateDequeue = (newQueue) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    const svg = d3.select(svgContainer);
    svg.selectAll('*').remove();

    const width = 450;
    const height = 200;
    const barWidth = width / 10;
    const barHeight = height * 0.8;
    const offsetX = 20;
    const offsetY = (height - barHeight) / 2;

    let currentX = offsetX;
    const interval = setInterval(() => {
      svg.selectAll('*').remove();

      const queueGroup = svg.selectAll('g')
        .data(newQueue)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(${i === 0 && currentX < offsetX + i * barWidth ? currentX : offsetX + i * barWidth}, ${offsetY})`);

      queueGroup.append('rect')
        .attr('width', barWidth - 1)
        .attr('height', barHeight)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black');

      queueGroup.append('text')
        .attr('x', (barWidth - 1) / 2)
        .attr('y', barHeight / 1.5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d);

      queueGroup.append('text')
        .attr('x', (barWidth - 1) / 2)
        .attr('y', barHeight + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text((d, i) => i);

      if (currentX < width + barWidth) {
        currentX += 5;
      } else {
        clearInterval(interval);
        drawQueue();
      }
    }, 30);
  };

  const updateExplanation = (text) => {
    setExplanation(text);
  };

  const queueEnqueue = () => {
    if (value === '' || isNaN(value)) {
      alert('Please enter a valid value.');
      return;
    }
    const newQueue = [...queue, parseInt(value)];
    setQueue(newQueue);
    animateEnqueue(newQueue, value);
    updateExplanation(`Enqueue adds an element to the end of the queue. The new element is ${value}.`);
    setCode(algorithms[language].enqueue.replace('VALUE', value));
    setValue('');
  };

  const queueDequeue = () => {
    if (queue.length === 0) {
      alert('The queue is empty.');
      return;
    }
    const newQueue = queue.slice(1);
    setQueue(newQueue);
    animateDequeue(newQueue);
    updateExplanation(`Dequeue removes the front element from the queue.`);
    setCode(algorithms[language].dequeue);
    drawQueue();
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Queue Visualization</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section visualization">
          <h3 className="text-lg font-semibold mb-2">Visualization</h3>
          <svg ref={svgContainerRef} className="queue-container" width="450" height="200"></svg>
          
          <div className="zoom-controls mt-4 flex justify-center gap-2">
            <Button variant="contained" color="primary" onClick={queueEnqueue}>Enqueue</Button>
            <Button variant="contained" color="secondary" onClick={queueDequeue}>Dequeue</Button>
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
            <li>Enqueue: Enter a value to add to the end of the queue.</li>
            <li>Dequeue: Remove the front element from the queue.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;