import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import * as d3 from 'd3';

const redBlackTreeAlgorithm = `
class TreeNode {
  constructor(value, color = 'red') {
    this.value = value;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
      this.root.color = 'black';
    } else {
      this._insertNode(this.root, newNode);
    }
    this._fixInsert(newNode);
  }

  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
        newNode.parent = node;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
        newNode.parent = node;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  _rotateLeft(node) {
    const temp = node.right;
    node.right = temp.left;
    if (temp.left !== null) {
      temp.left.parent = node;
    }
    temp.parent = node.parent;
    if (node.parent === null) {
      this.root = temp;
    } else if (node === node.parent.left) {
      node.parent.left = temp;
    } else {
      node.parent.right = temp;
    }
    temp.left = node;
    node.parent = temp;
  }

  _rotateRight(node) {
    const temp = node.left;
    node.left = temp.right;
    if (temp.right !== null) {
      temp.right.parent = node;
    }
    temp.parent = node.parent;
    if (node.parent === null) {
      this.root = temp;
    } else if (node === node.parent.right) {
      node.parent.right = temp;
    } else {
      node.parent.left = temp;
    }
    temp.right = node;
    node.parent = temp;
  }

  _fixInsert(node) {
    while (node !== this.root && node.parent.color === 'red') {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;
        if (uncle && uncle.color === 'red') {
          node.parent.color = 'black';
          uncle.color = 'black';
          node.parent.parent.color = 'red';
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this._rotateLeft(node);
          }
          node.parent.color = 'black';
          node.parent.parent.color = 'red';
          this._rotateRight(node.parent.parent);
        }
      } else {
        const uncle = node.parent.parent.left;
        if (uncle && uncle.color === 'red') {
          node.parent.color = 'black';
          uncle.color = 'black';
          node.parent.parent.color = 'red';
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this._rotateRight(node);
          }
          node.parent.color = 'black';
          node.parent.parent.color = 'red';
          this._rotateLeft(node.parent.parent);
        }
      }
    }
    this.root.color = 'black';
  }

  inOrder(node, result = []) {
    if (node !== null) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }

  // Create a simplified non-circular representation of the tree
  toJSON(node) {
    if (node === null) return null;
    return {
      value: node.value,
      color: node.color,
      left: this.toJSON(node.left),
      right: this.toJSON(node.right)
    };
  }
}

// Example usage
const tree = new RedBlackTree();
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

const RedBlackTreeVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [values, setValues] = useState('50, 30, 70, 20, 40, 60, 80');
  const svgRef = useRef();
  const [animationSteps, setAnimationSteps] = useState([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleValuesChange = (event) => {
    setValues(event.target.value);
  };

  const handleVisualize = () => {
    const valuesArray = values.split(',').map(Number);
    const tree = new RedBlackTree();
    const steps = [];
    valuesArray.forEach(value => {
      tree.insert(value);
      steps.push(tree.toJSON(tree.root));
    });
    setAnimationSteps(steps);
    if (steps.length > 0) {
      drawTree(steps[steps.length - 1]);
    }
  };

  const drawTree = (root) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    const treemap = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
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

    node.append('circle')
      .attr('r', 10)
      .attr('fill', d => d.data && d.data.color ? d.data.color : 'black');

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => (d.children ? -13 : 13))
      .style('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => d.data && d.data.value !== undefined ? d.data.value : '');
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

  class TreeNode {
    constructor(value, color = 'red') {
      this.value = value;
      this.color = color;
      this.left = null;
      this.right = null;
      this.parent = null;
    }
  }

  class RedBlackTree {
    constructor() {
      this.root = null;
    }

    insert(value) {
      const newNode = new TreeNode(value);
      if (this.root === null) {
        this.root = newNode;
        this.root.color = 'black';
      } else {
        this._insertNode(this.root, newNode);
      }
      this._fixInsert(newNode);
    }

    _insertNode(node, newNode) {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
          newNode.parent = node;
        } else {
          this._insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
          newNode.parent = node;
        } else {
          this._insertNode(node.right, newNode);
        }
      }
    }

    _rotateLeft(node) {
      const temp = node.right;
      node.right = temp.left;
      if (temp.left !== null) {
        temp.left.parent = node;
      }
      temp.parent = node.parent;
      if (node.parent === null) {
        this.root = temp;
      } else if (node === node.parent.left) {
        node.parent.left = temp;
      } else {
        node.parent.right = temp;
      }
      temp.left = node;
      node.parent = temp;
    }

    _rotateRight(node) {
      const temp = node.left;
      node.left = temp.right;
      if (temp.right !== null) {
        temp.right.parent = node;
      }
      temp.parent = node.parent;
      if (node.parent === null) {
        this.root = temp;
      } else if (node === node.parent.right) {
        node.parent.right = temp;
      } else {
        node.parent.left = temp;
      }
      temp.right = node;
      node.parent = temp;
    }

    _fixInsert(node) {
      while (node !== this.root && node.parent.color === 'red') {
        if (node.parent === node.parent.parent.left) {
          const uncle = node.parent.parent.right;
          if (uncle && uncle.color === 'red') {
            node.parent.color = 'black';
            uncle.color = 'black';
            node.parent.parent.color = 'red';
            node = node.parent.parent;
          } else {
            if (node === node.parent.right) {
              node = node.parent;
              this._rotateLeft(node);
            }
            node.parent.color = 'black';
            node.parent.parent.color = 'red';
            this._rotateRight(node.parent.parent);
          }
        } else {
          const uncle = node.parent.parent.left;
          if (uncle && uncle.color === 'red') {
            node.parent.color = 'black';
            uncle.color = 'black';
            node.parent.parent.color = 'red';
            node = node.parent.parent;
          } else {
            if (node === node.parent.left) {
              node = node.parent;
              this._rotateRight(node);
            }
            node.parent.color = 'black';
            node.parent.parent.color = 'red';
            this._rotateLeft(node.parent.parent);
          }
        }
      }
      this.root.color = 'black';
    }

    inOrder(node, result = []) {
      if (node !== null) {
        this.inOrder(node.left, result);
        result.push(node.value);
        this.inOrder(node.right, result);
      }
      return result;
    }

    // Create a simplified non-circular representation of the tree
    toJSON(node) {
      if (node === null) return null;
      return {
        value: node.value,
        color: node.color,
        left: this.toJSON(node.left),
        right: this.toJSON(node.right)
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
          <h1 className="text-3xl font-bold text-center text-red-600">RED-BLACK TREE VISUALIZATION</h1>
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
            value={redBlackTreeAlgorithm}
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

export default RedBlackTreeVisualizer;