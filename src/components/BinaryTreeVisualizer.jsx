import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import * as d3 from 'd3';

const binaryTreeAlgorithm = `
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  inOrder(node, result = []) {
    if (node !== null) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }
}

// Example usage
const tree = new BinaryTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);
tree.insert(60);
tree.insert(80);
const inOrderTraversal = tree.inOrder(tree.root);
console.log(inOrderTraversal);
`;

const BinaryTreeVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [values, setValues] = useState('50, 30, 70, 20, 40, 60, 80');
  const svgRef = useRef();

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleValuesChange = (event) => {
    setValues(event.target.value);
  };

  const handleVisualize = () => {
    const valuesArray = values.split(',').map(Number);
    const tree = new BinaryTree();
    valuesArray.forEach(value => tree.insert(value));
    drawTree(tree.root);
  };

  const drawTree = (root) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    const treemap = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    const nodes = d3.hierarchy(root, d => (d ? [d.left, d.right] : []));

    const treeData = treemap(nodes);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    g.selectAll('.link')
      .data(treeData.descendants().slice(1))
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d.x},${d.y}
                C${d.x},${d.y + (d.parent.y - d.y) / 2}
                ${d.parent.x},${d.y + (d.parent.y - d.y) / 2}
                ${d.parent.x},${d.parent.y}`;
      });

    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .enter().append('g')
      .attr('class', d => `node${d.children ? ' node--internal' : ' node--leaf'}`)
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle').attr('r', 10);

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => (d.children ? -13 : 13))
      .style('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => d.data && d.data.value !== undefined ? d.data.value : '');
  };

  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }

  class BinaryTree {
    constructor() {
      this.root = null;
    }

    insert(value) {
      const newNode = new TreeNode(value);
      if (this.root === null) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    }

    insertNode(node, newNode) {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          this.insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          this.insertNode(node.right, newNode);
        }
      }
    }

    inOrder(node, result = []) {
      if (node !== null) {
        this.inOrder(node.left, result);
        result.push(node.value);
        this.inOrder(node.right, result);
      }
      return result;
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
          <h1 className="text-3xl font-bold text-center text-red-600">BINARY TREE VISUALIZATION</h1>
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
            value={binaryTreeAlgorithm}
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
          <svg ref={svgRef} width="800" height="600" style={{ background: '#f0f0f0', border: '1px solid black' }}></svg>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;