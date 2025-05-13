import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import * as d3 from 'd3';

const fenwickTreeAlgorithm = `
class FenwickTree {
  constructor(size) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0);
  }

  update(index, value) {
    while (index <= this.size) {
      this.tree[index] += value;
      index += index & -index;
    }
  }

  query(index) {
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & -index;
    }
    return sum;
  }

  toJSON() {
    return {
      size: this.size,
      tree: this.tree.slice(1) // Exclude the first element (0th index)
    };
  }
}

// Example usage
const fenwickTree = new FenwickTree(10);
fenwickTree.update(1, 3);
fenwickTree.update(2, 2);
fenwickTree.update(3, -1);
fenwickTree.update(4, 6);
fenwickTree.update(5, 5);
console.log(fenwickTree.query(5)); // 15
`;

const FenwickTreeVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [size, setSize] = useState('10');
  const [updates, setUpdates] = useState('1,3; 2,2; 3,-1; 4,6; 5,5');
  const [query, setQuery] = useState('5');
  const svgContainerRef = useRef(null);
  const [animationSteps, setAnimationSteps] = useState([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleUpdatesChange = (event) => {
    setUpdates(event.target.value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleVisualize = () => {
    const sizeNum = parseInt(size, 10);
    const fenwickTree = new FenwickTree(sizeNum);
    const steps = [fenwickTree.toJSON()];

    const updatePairs = updates.split(';').map(pair => pair.split(',').map(Number));
    updatePairs.forEach(([index, value]) => {
      fenwickTree.update(index, value);
      steps.push(fenwickTree.toJSON());
    });

    const queryIndex = parseInt(query, 10);
    fenwickTree.query(queryIndex);
    steps.push(fenwickTree.toJSON());

    setAnimationSteps(steps);
    drawTree(steps[0], 0);
  };

  const drawTree = (data, step) => {
    const svgContainer = d3.select(svgContainerRef.current);
    const svgWidth = 800;
    const svgHeight = 150;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = svgContainer.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('border', '1px solid black')
      .style('margin-top', '20px');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const nodeData = data.tree.map((value, index) => ({
      name: `Index ${index + 1}`,
      value,
      x: (index + 1) * (width / (data.tree.length + 1)),
      y: height / 2
    }));

    // Add nodes
    const node = g.selectAll('.node')
      .data(nodeData)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 20)
      .attr('fill', 'steelblue');

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .text(d => d.value);
  };

  useEffect(() => {
    if (animationSteps.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < animationSteps.length) {
          drawTree(animationSteps[i], i);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [animationSteps]);

  class FenwickTree {
    constructor(size) {
      this.size = size;
      this.tree = new Array(size + 1).fill(0);
    }

    update(index, value) {
      while (index <= this.size) {
        this.tree[index] += value;
        index += index & -index;
      }
    }

    query(index) {
      let sum = 0;
      while (index > 0) {
        sum += this.tree[index];
        index -= index & -index;
      }
      return sum;
    }

    toJSON() {
      return {
        size: this.size,
        tree: this.tree.slice(1) // Exclude the first element (0th index)
      };
    }
  }

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
          <h1 className="text-3xl font-bold text-center text-red-600">FENWICK TREE VISUALIZATION</h1>
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
            value={fenwickTreeAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="Size"
            value={size}
            onChange={handleSizeChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Updates (index,value;...)"
            value={updates}
            onChange={handleUpdatesChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Query Index"
            value={query}
            onChange={handleQueryChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div ref={svgContainerRef} style={{ width: '100%', overflowY: 'scroll', height: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default FenwickTreeVisualizer;