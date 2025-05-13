import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const primAlgorithm = `
function prim(graph, start) {
  const mst = [];
  const visited = new Set([start]);
  const edges = [];

  for (const [to, cost] of Object.entries(graph[start])) {
    edges.push([cost, start, to]);
  }

  edges.sort((a, b) => a[0] - b[0]);

  while (edges.length) {
    const [cost, frm, to] = edges.shift();
    if (!visited.has(to)) {
      visited.add(to);
      mst.push([frm, to, cost]);

      for (const [to_next, cost] of Object.entries(graph[to])) {
        if (!visited.has(to_next)) {
          edges.push([cost, to, to_next]);
          edges.sort((a, b) => a[0] - b[0]);
        }
      }
    }
  }

  return mst;
}

// Example usage
const graph = {
  'A': { 'B': 1, 'C': 4 },
  'B': { 'A': 1, 'C': 2, 'D': 5 },
  'C': { 'A': 4, 'B': 2, 'D': 3 },
  'D': { 'B': 5, 'C': 3 }
};
const startNode = 'A';
const mst = prim(graph, startNode);
console.log(mst);
`;

const PrimVisualizer = () => {
  const [language, setLanguage] = useState('javascript');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [graph, setGraph] = useState({
    'A': { 'B': 1, 'C': 4 },
    'B': { 'A': 1, 'C': 2, 'D': 5 },
    'C': { 'A': 4, 'B': 2, 'D': 3 },
    'D': { 'B': 5, 'C': 3 }
  });
  const [startNode, setStartNode] = useState('A');
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

  const handleStartNodeChange = (event) => {
    setStartNode(event.target.value.trim());
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

    // Prim's Algorithm
    const visited = new Set([startNode]);
    const mstEdges = [];
    const edges = Object.entries(graph[startNode]).map(([to, cost]) => [cost, startNode, to]);
    edges.sort((a, b) => a[0] - b[0]);

    addStep(1, `Starting MST with node ${startNode}`, mstEdges);

    while (edges.length > 0) {
      const [cost, frm, to] = edges.shift();
      if (!visited.has(to)) {
        visited.add(to);
        mstEdges.push([frm, to, cost]);
        addStep(2, `Adding edge (${frm}, ${to}) with weight ${cost}`, mstEdges);

        for (const [to_next, cost] of Object.entries(graph[to])) {
          if (!visited.has(to_next)) {
            edges.push([cost, to, to_next]);
            edges.sort((a, b) => a[0] - b[0]);
          }
        }
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
    for (const [frm, to, weight] of mstEdges) {
      ctx.beginPath();
      ctx.moveTo(nodePositions[frm].x, nodePositions[frm].y);
      ctx.lineTo(nodePositions[to].x, nodePositions[to].y);
      ctx.stroke();
      ctx.fillText(weight, (nodePositions[frm].x + nodePositions[to].x) / 2, (nodePositions[frm].y + nodePositions[to].y) / 2);
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
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h1 className="text-3xl font-bold text-center text-red-600">PRIM'S ALGORITHM VISUALIZATION</h1>
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
            value={primAlgorithm}
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
          <TextField
            variant="outlined"
            label="Start node"
            value={startNode}
            onChange={handleStartNodeChange}
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

export default PrimVisualizer;