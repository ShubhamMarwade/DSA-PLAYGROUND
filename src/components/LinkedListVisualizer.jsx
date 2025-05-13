import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import * as d3 from 'd3';

const algorithms = {
  js: {
    insert: "list.insertAt(INDEX, VALUE);",
    remove: "list.removeAt(INDEX);"
  },
  python: {
    insert: "list.insert(INDEX, VALUE)",
    remove: "list.pop(INDEX)"
  },
  cpp: {
    insert: "list.insert(list.begin() + INDEX, VALUE);",
    remove: "list.erase(list.begin() + INDEX);"
  },
  java: {
    insert: "list.add(INDEX, VALUE);",
    remove: "list.remove(INDEX);"
  },
  c: {
    insert: "// No direct equivalent in C",
    remove: "// No direct equivalent in C"
  }
};

const LinkedListVisualizer = () => {
  const [list, setList] = useState([1, 2, 3, 4, 5]);
  const [language, setLanguage] = useState('js');
  const [code, setCode] = useState(algorithms['js'].insert);
  const [explanation, setExplanation] = useState('');
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');
  const svgContainerRef = useRef(null);

  useEffect(() => {
    // Update code with the current operation and language
    setCode(algorithms[language].insert.replace('VALUE', value).replace('INDEX', index));
  }, [language, value, index]);

  useEffect(() => {
    drawList();
  }, [list]);

  const drawList = () => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    const svg = d3.select(svgContainer);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 100;
    const nodeWidth = 40;
    const nodeHeight = 40;
    const nodeSpacing = 20;
    const offsetX = (width - (list.length * (nodeWidth + nodeSpacing) - nodeSpacing)) / 2;

    const nodes = svg.selectAll('g')
      .data(list)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${offsetX + i * (nodeWidth + nodeSpacing)}, ${height / 3})`);

    nodes.append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('fill', 'steelblue')
      .attr('stroke', 'black');

    nodes.append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d);

    nodes.append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight + 15)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text((d, i) => i);

    nodes.append('line')
      .attr('x1', nodeWidth)
      .attr('y1', nodeHeight / 2)
      .attr('x2', nodeWidth + nodeSpacing)
      .attr('y2', nodeHeight / 2)
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  };

  const animateInsert = (newList, value, index) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    const svg = d3.select(svgContainer);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 100;
    const nodeWidth = 40;
    const nodeHeight = 40;
    const nodeSpacing = 20;
    const offsetX = (width - (newList.length * (nodeWidth + nodeSpacing) - nodeSpacing)) / 2;
    const targetY = height / 3;

    let currentY = -50;
    const interval = setInterval(() => {
      svg.selectAll('*').remove();

      const nodes = svg.selectAll('g')
        .data(newList)
        .enter()
        .append('g')
        .attr('transform', (d, i) =>
          `translate(${offsetX + i * (nodeWidth + nodeSpacing)}, ${i === index && currentY < targetY ? currentY : targetY})`
        );

      nodes.append('rect')
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black');

      nodes.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', nodeHeight / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d);

      nodes.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', nodeHeight + 15)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text((d, i) => i);

      nodes.append('line')
        .attr('x1', nodeWidth)
        .attr('y1', nodeHeight / 2)
        .attr('x2', nodeWidth + nodeSpacing)
        .attr('y2', nodeHeight / 2)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

      if (currentY < targetY) {
        currentY += 5;
      } else {
        clearInterval(interval);
        drawList();
      }
    }, 30);
  };

  const updateExplanation = (text) => {
    setExplanation(text);
  };

  const listInsert = () => {
    if (value === '' || isNaN(value) || index === '' || isNaN(index) || index < 0 || index > list.length) {
      alert('Please enter a valid value and index for insertion.');
      return;
    }
    const newList = [...list];
    newList.splice(index, 0, parseInt(value));
    setList(newList);
    animateInsert(newList, value, index);
    updateExplanation(`Insert adds an element at index ${index}. The new element is ${value}.`);
    setCode(algorithms[language].insert.replace('VALUE', value).replace('INDEX', index));
    setValue('');
    setIndex('');
  };

  const listRemove = () => {
    if (index === '' || isNaN(index) || index < 0 || index >= list.length) {
      alert('Please enter a valid index for deletion.');
      return;
    }
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
    updateExplanation(`Remove deletes the element at index ${index}.`);
    setCode(algorithms[language].remove.replace('INDEX', index));
    setIndex('');
    drawList();
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Linked List Visualization</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section visualization">
          <h3 className="text-lg font-semibold mb-2">Visualization</h3>
          <svg ref={svgContainerRef} className="list-container" width="600" height="100"></svg>
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
        <Button variant="contained" color="primary" onClick={listInsert}>Insert</Button>
        <Button variant="contained" color="secondary" onClick={listRemove}>Remove</Button>
      </div>
      <div className="instructions mt-4 p-4 bg-white rounded-lg shadow-md">
        <Typography className="text-lg font-semibold text-red-600 text-center mb-2">Instructions</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc list-inside">
            <li>Insert: Enter a value and an index to insert the value at the specified index.</li>
            <li>Remove: Enter an index to remove the element at the specified index.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;