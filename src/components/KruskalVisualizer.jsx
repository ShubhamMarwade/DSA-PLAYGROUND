import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const kruskalAlgorithm = `
class DisjointSet:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}

    def find(self, item):
        if self.parent[item] == item:
            return item
        else:
            self.parent[item] = self.find(self.parent[item])
            return self.parent[item]

    def union(self, set1, set2):
        root1 = self.find(set1)
        root2 = self.find(set2)

        if root1 != root2:
            if self.rank[root1] > self.rank[root2]:
                self.parent[root2] = root1
            elif self.rank[root1] < self.rank[root2]:
                self.parent[root1] = root2
            else:
                self.parent[root2] = root1
                self.rank[root1] += 1

def kruskal(graph):
    edges = []
    for node in graph:
        for neighbor, weight in graph[node].items():
            edges.append((weight, node, neighbor))
    edges.sort()

    vertices = list(graph.keys())
    disjoint_set = DisjointSet(vertices)
    mst = []

    for edge in edges:
        weight, u, v = edge
        if disjoint_set.find(u) != disjoint_set.find(v):
            disjoint_set.union(u, v)
            mst.append(edge)

    return mst

# Example usage
graph = {
    'A': {'B': 1, 'C': 4},
    'B': {'A': 1, 'C': 2, 'D': 5},
    'C': {'A': 4, 'B': 2, 'D': 3},
    'D': {'B': 5, 'C': 3}
}
mst = kruskal(graph)
print(mst)
`;

const KruskalVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [graph, setGraph] = useState({
    'A': { 'B': 1, 'C': 4 },
    'B': { 'A': 1, 'C': 2, 'D': 5 },
    'C': { 'A': 4, 'B': 2, 'D': 3 },
    'D': { 'B': 5, 'C': 3 }
  });
  const [mst, setMst] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleGraphChange = (event) => {
    try {
      const newGraph = JSON.parse(event.target.value);
      setGraph(newGraph);
    } catch (e) {
      console.error("Invalid graph format");
    }
  };

  const handleVisualize = () => {
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, mstEdges) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push({ mst: [...mstEdges] });
    };

    // Kruskal's Algorithm
    class DisjointSet {
      constructor(vertices) {
        this.parent = {};
        this.rank = {};
        vertices.forEach(v => {
          this.parent[v] = v;
          this.rank[v] = 0;
        });
      }

      find(item) {
        if (this.parent[item] === item) {
          return item;
        } else {
          this.parent[item] = this.find(this.parent[item]);
          return this.parent[item];
        }
      }

      union(set1, set2) {
        const root1 = this.find(set1);
        const root2 = this.find(set2);

        if (root1 !== root2) {
          if (this.rank[root1] > this.rank[root2]) {
            this.parent[root2] = root1;
          } else if (this.rank[root1] < this.rank[root2]) {
            this.parent[root1] = root2;
          } else {
            this.parent[root2] = root1;
            this.rank[root1] += 1;
          }
        }
      }
    }

    const edges = [];
    for (let node in graph) {
      for (let neighbor in graph[node]) {
        if (!edges.some(edge => edge.includes(node) && edge.includes(neighbor))) {
          edges.push([graph[node][neighbor], node, neighbor]);
        }
      }
    }
    edges.sort((a, b) => a[0] - b[0]);

    const vertices = Object.keys(graph);
    const disjointSet = new DisjointSet(vertices);
    const mstEdges = [];
    addStep(1, "Initial state of MST", mstEdges);

    for (let edge of edges) {
      const [weight, u, v] = edge;
      if (disjointSet.find(u) !== disjointSet.find(v)) {
        disjointSet.union(u, v);
        mstEdges.push(edge);
        addStep(2, `Adding edge (${u}, ${v}) with weight ${weight}`, mstEdges);
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setMst([]);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { mst: mstEdges } = steps[index];
    setMst(mstEdges);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodePositions = {
      'A': { x: 100, y: 50 },
      'B': { x: 50, y: 150 },
      'C': { x: 150, y: 150 },
      'D': { x: 100, y: 250 }
    };

    // Draw edges
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    for (const [weight, node, neighbor] of mstEdges) {
      ctx.beginPath();
      ctx.moveTo(nodePositions[node].x, nodePositions[node].y);
      ctx.lineTo(nodePositions[neighbor].x, nodePositions[neighbor].y);
      ctx.stroke();
      ctx.fillText(weight, (nodePositions[node].x + nodePositions[neighbor].x) / 2, (nodePositions[node].y + nodePositions[neighbor].y) / 2);
    }

    // Draw nodes
    for (const [node, position] of Object.entries(nodePositions)) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#000';
      ctx.fillText(node, position.x - 5, position.y + 5);
    }

    const newDecorations = editorInstance.editor.deltaDecorations(
      [],
      [{
        range: new editorInstance.monaco.Range(highlightLines[index], 1, highlightLines[index], 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line'
        }
      }]
    );
    setHighlightLines(newDecorations);
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
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h1 className="text-3xl font-bold text-center text-red-600">KRUSKAL'S ALGORITHM VISUALIZATION</h1>
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
            value={kruskalAlgorithm}
            options={{ readOnly: true, theme: 'vs-dark' }}
            onMount={(editor, monaco) => {
              setEditorInstance({ editor, monaco });
            }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="Graph (JSON format)"
            value={JSON.stringify(graph)}
            onChange={handleGraphChange}
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
          <canvas ref={canvasRef} width="750" height="300" style={{ background: '#f0f0f0', border: '1px solid black' }}></canvas>
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

export default KruskalVisualizer;