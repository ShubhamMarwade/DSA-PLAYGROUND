import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const bfsAlgorithm = `
def bfs(graph, start):
    visited = []
    queue = [start]

    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            neighbours = graph[node]
            for neighbour in neighbours:
                queue.append(neighbour)
    return visited

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F', 'G'],
    'D': [],
    'E': ['F'],
    'F': [],
    'G': []
}
start_node = 'A'
print(bfs(graph, start_node))
`;

const BFSVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [graph, setGraph] = useState({
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F', 'G'],
    'D': [],
    'E': ['F'],
    'F': [],
    'G': []
  });
  const [startNode, setStartNode] = useState('A');
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState([]);
  const [decorations, setDecorations] = useState([]); // Initialize the decorations state here
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

    const addStep = (line, description, visitedNodes, queueNodes, currentNode) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push({ visited: [...visitedNodes], queue: [...queueNodes], currentNode });
    };

    // BFS Algorithm
    const visitedNodes = new Set();
    const queueNodes = [startNode];
    addStep(1, `Starting BFS from node ${startNode}`, [], queueNodes, startNode);

    while (queueNodes.length > 0) {
      const node = queueNodes.shift();
      if (!visitedNodes.has(node)) {
        visitedNodes.add(node);
        addStep(2, `Visiting node ${node}`, Array.from(visitedNodes), queueNodes, node);

        for (const neighbour of graph[node]) {
          if (!visitedNodes.has(neighbour)) {
            queueNodes.push(neighbour);
            addStep(3, `Adding node ${neighbour} to the queue`, Array.from(visitedNodes), queueNodes, node);
          }
        }
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setVisited([]);
    setQueue([]);
    setStepIndex(0);
    // Do not start the animation automatically
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { visited: visitedNodes, queue: queueNodes, currentNode } = steps[index];
    setVisited(visitedNodes);
    setQueue(queueNodes);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodePositions = {
      'A': { x: 100, y: 50 },
      'B': { x: 50, y: 150 },
      'C': { x: 150, y: 150 },
      'D': { x: 20, y: 250 },
      'E': { x: 80, y: 250 },
      'F': { x: 120, y: 250 },
      'G': { x: 180, y: 250 }
    };

    // Draw edges
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    for (const [node, neighbours] of Object.entries(graph)) {
      for (const neighbour of neighbours) {
        ctx.beginPath();
        ctx.moveTo(nodePositions[node].x, nodePositions[node].y);
        ctx.lineTo(nodePositions[neighbour].x, nodePositions[neighbour].y);
        ctx.stroke();
      }
    }

    // Draw nodes
    for (const [node, position] of Object.entries(nodePositions)) {
      if (node === currentNode) {
        ctx.fillStyle = 'yellow';
      } else if (visitedNodes.includes(node)) {
        ctx.fillStyle = 'green';
      } else if (node === startNode) {
        ctx.fillStyle = 'blue';
      } else {
        ctx.fillStyle = '#fff';
      }
      ctx.beginPath();
      ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#000';
      ctx.fillText(node, position.x - 5, position.y + 5);
    }

    // Draw queue
    ctx.fillStyle = '#000';
    ctx.fillText(`Queue: ${queueNodes.join(', ')}`, 10, canvas.height - 20);

    const newDecorations = editorInstance.editor.deltaDecorations(
      decorations,
      [{
        range: new editorInstance.monaco.Range(highlightLines[index], 1, highlightLines[index], 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line'
        }
      }]
    );
    setDecorations(newDecorations);
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
          <h1 className="text-3xl font-bold text-center text-red-600">BREADTH-FIRST SEARCH VISUALIZATION</h1>
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
            value={bfsAlgorithm}
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

export default BFSVisualizer;