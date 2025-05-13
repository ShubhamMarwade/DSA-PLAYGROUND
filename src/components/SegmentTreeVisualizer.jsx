import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import * as d3 from 'd3';

const segmentTreeAlgorithm = `
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(2 * this.n);
    this.build(arr);
  }

  build(arr) {
    for (let i = 0; i < this.n; i++) {
      this.tree[this.n + i] = arr[i];
    }
    for (let i = this.n - 1; i > 0; --i) {
      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
    }
  }

  update(index, value) {
    index += this.n;
    this.tree[index] = value;
    while (index > 1) {
      index = Math.floor(index / 2);
      this.tree[index] = this.tree[2 * index] + this.tree[2 * index + 1];
    }
  }

  query(left, right) {
    left += this.n;
    right += this.n + 1;
    let sum = 0;
    while (left < right) {
      if (left % 2 === 1) {
        sum += this.tree[left];
        left++;
      }
      if (right % 2 === 1) {
        right--;
        sum += this.tree[right];
      }
      left = Math.floor(left / 2);
      right = Math.floor(right / 2);
    }
    return sum;
  }

  toJSON() {
    return {
      n: this.n,
      tree: this.tree.slice()
    };
  }
}

// Example usage
const arr = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);
console.log(segTree.query(1, 3)); // 15 (3 + 5 + 7)
segTree.update(1, 10);
console.log(segTree.query(1, 3)); // 22 (10 + 5 + 7)
`;

const SegmentTreeVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [values, setValues] = useState('1, 3, 5, 7, 9, 11');
  const [range, setRange] = useState('1, 3');
  const [update, setUpdate] = useState('1, 10');
  const svgRef = useRef();
  const [animationSteps, setAnimationSteps] = useState([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleValuesChange = (event) => {
    setValues(event.target.value);
  };

  const handleRangeChange = (event) => {
    setRange(event.target.value);
  };

  const handleUpdateChange = (event) => {
    setUpdate(event.target.value);
  };

  const handleVisualize = () => {
    const arr = values.split(',').map(Number);
    const segTree = new SegmentTree(arr);
    const steps = [segTree.toJSON()];
    
    const [updateIndex, updateValue] = update.split(',').map(Number);
    segTree.update(updateIndex, updateValue);
    steps.push(segTree.toJSON());

    const [rangeLeft, rangeRight] = range.split(',').map(Number);
    segTree.query(rangeLeft, rangeRight);
    steps.push(segTree.toJSON());

    setAnimationSteps(steps);
    drawTree(steps[0]);
  };

  const drawTree = (data) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    // Flatten the tree array to a hierarchical structure
    const hierarchy = {
      name: 'root',
      children: []
    };
    const buildHierarchy = (index, level) => {
      if (index >= data.tree.length || data.tree[index] === undefined) return null;
      const node = {
        name: `Node ${index}`,
        value: data.tree[index],
        children: []
      };
      const leftChild = buildHierarchy(2 * index, level + 1);
      const rightChild = buildHierarchy(2 * index + 1, level + 1);
      if (leftChild) node.children.push(leftChild);
      if (rightChild) node.children.push(rightChild);
      return node;
    };
    hierarchy.children.push(buildHierarchy(1, 0));

    const root = d3.hierarchy(hierarchy);
    const treemap = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
    const nodes = treemap(root);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    g.selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d.x},${d.y}
                C${d.x},${d.y + (d.parent.y - d.y) / 2}
                ${d.parent.x},${d.y + (d.parent.y - d.y) / 2}
                ${d.parent.x},${d.parent.y}`;
      });

    const node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter().append('g')
      .attr('class', d => `node${d.children ? ' node--internal' : ' node--leaf'}`)
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 10)
      .attr('fill', 'steelblue');

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => (d.children ? -13 : 13))
      .style('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => d.data.value !== undefined ? d.data.value : '');
  };

  useEffect(() => {
    if (animationSteps.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < animationSteps.length) {
          drawTree(animationSteps[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [animationSteps]);

  class SegmentTree {
    constructor(arr) {
      this.n = arr.length;
      this.tree = new Array(2 * this.n);
      this.build(arr);
    }

    build(arr) {
      for (let i = 0; i < this.n; i++) {
        this.tree[this.n + i] = arr[i];
      }
      for (let i = this.n - 1; i > 0; --i) {
        this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
      }
    }

    update(index, value) {
      index += this.n;
      this.tree[index] = value;
      while (index > 1) {
        index = Math.floor(index / 2);
        this.tree[index] = this.tree[2 * index] + this.tree[2 * index + 1];
      }
    }

    query(left, right) {
      left += this.n;
      right += this.n + 1;
      let sum = 0;
      while (left < right) {
        if (left % 2 === 1) {
          sum += this.tree[left];
          left++;
        }
        if (right % 2 === 1) {
          right--;
          sum += this.tree[right];
        }
        left = Math.floor(left / 2);
        right = Math.floor(right / 2);
      }
      return sum;
    }

    toJSON() {
      return {
        tree: this.tree
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
          <h1 className="text-3xl font-bold text-center text-red-600">SEGMENT TREE VISUALIZATION</h1>
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
            value={segmentTreeAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="Values (comma separated)"
            value={values}
            onChange={handleValuesChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Range (comma separated)"
            value={range}
            onChange={handleRangeChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Update (index, value)"
            value={update}
            onChange={handleUpdateChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <svg ref={svgRef} width="800" height="600" style={{ background: '#f0f0f0', border: '1px solid black' }}></svg>
        </div>
      </div>
    </div>
  );
};

export default SegmentTreeVisualizer;