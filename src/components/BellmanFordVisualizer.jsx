import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const bellmanFordAlgorithm = `
def bellman_ford(graph, start):
    distance = {node: float('infinity') for node in graph}
    distance[start] = 0

    for _ in range(len(graph) - 1):
        for node in graph:
            for neighbor, weight in graph[node].items():
                if distance[node] + weight < distance[neighbor]:
                    distance[neighbor] = distance[node] + weight

    for node in graph:
        for neighbor, weight in graph[node].items():
            if distance[node] + weight < distance[neighbor]:
                raise ValueError("Graph contains a negative-weight cycle")

    return distance

# Example usage
graph = {
    'A': {'B': -1, 'C': 4},
    'B': {'C': 3, 'D': 2, 'E': 2},
    'D': {'B': 1, 'C': 5},
    'E': {'D': -3}
}
start_node = 'A'
distances = bellman_ford(graph, start_node)
print(distances)
`;

const BellmanFordVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [graph, setGraph] = useState({
    'A': { 'B': -1, 'C': 4 },
    'B': { 'C': 3, 'D': 2, 'E': 2 },
    'D': { 'B': 1, 'C': 5 },
    'E': { 'D': -3 }
  });
  const [startNode, setStartNode] = useState('A');
  const [distances, setDistances] = useState({});
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

    const addStep = (line, description, distanceDict) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push({ distances: { ...distanceDict } });
    };

    // Bellman-Ford Algorithm
    const distancesDict = {};
    Object.keys(graph).forEach(node => distancesDict[node] = Infinity);
    distancesDict[startNode] = 0;

    addStep(1, `Initial distances from start node ${startNode}`, distancesDict);

    for (let i = 0; i < Object.keys(graph).length - 1; i++) {
      for (let node in graph) {
        for (let neighbor in graph[node]) {
          const newDistance = distancesDict[node] + graph[node][neighbor];
          if (newDistance < distancesDict[neighbor]) {
            distancesDict[neighbor] = newDistance;
            addStep(2, `Updating distance of node ${neighbor} to ${newDistance}`, distancesDict);
          }
        }
      }
    }

    // Check for negative-weight cycles
    for (let node in graph) {
      for (let neighbor in graph[node]) {
        if (distancesDict[node] + graph[node][neighbor] < distancesDict[neighbor]) {
          throw new Error("Graph contains a negative-weight cycle");
        }
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setDistances(distancesDict);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { distances: distanceDict } = steps[index];
    setDistances(distanceDict);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodePositions = {
      'A': { x: 100, y: 50 },
      'B': { x: 50, y: 150 },
      'C': { x: 150, y: 150 },
      'D': { x: 20, y: 250 },
      'E': { x: 80, y: 250 }
    };

    // Draw edges
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    for (const [node, neighbours] of Object.entries(graph)) {
      for (const [neighbour, weight] of Object.entries(neighbours)) {
        ctx.beginPath();
        ctx.moveTo(nodePositions[node].x, nodePositions[node].y);
        ctx.lineTo(nodePositions[neighbour].x, nodePositions[neighbour].y);
        ctx.stroke();
        ctx.fillText(weight, (nodePositions[node].x + nodePositions[neighbour].x) / 2, (nodePositions[node].y + nodePositions[neighbour].y) / 2);
      }
    }

    // Draw nodes
    for (const [node, position] of Object.entries(nodePositions)) {
      ctx.fillStyle = distanceDict[node] < Infinity ? 'green' : '#fff';
      ctx.beginPath();
      ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#000';
      ctx.fillText(node, position.x - 5, position.y + 5);
      ctx.fillText(distanceDict[node] < Infinity ? distanceDict[node] : '∞', position.x - 10, position.y + 30);
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
          <h1 className="text-3xl font-bold text-center text-red-600">BELLMAN-FORD ALGORITHM VISUALIZATION</h1>
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
            value={bellmanFordAlgorithm}
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

export default BellmanFordVisualizer;