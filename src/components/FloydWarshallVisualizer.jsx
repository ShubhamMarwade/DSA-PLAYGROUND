import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const floydWarshallAlgorithm = `
def floyd_warshall(graph):
    nodes = list(graph.keys())
    distance = {node: {node: float('infinity') for node in nodes} for node in nodes}
    for node in nodes:
        distance[node][node] = 0

    for node, edges in graph.items():
        for neighbor, weight in edges.items():
            distance[node][neighbor] = weight

    for k in nodes:
        for i in nodes:
            for j in nodes:
                distance[i][j] = min(distance[i][j], distance[i][k] + distance[k][j])

    return distance

# Example usage
graph = {
    'A': {'B': 3, 'C': 8, 'D': -4},
    'B': {'A': 3, 'D': 1},
    'C': {'B': 4},
    'D': {'C': 2}
}
shortest_paths = floyd_warshall(graph)
print(shortest_paths)
`;

const FloydWarshallVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const [graph, setGraph] = useState({
    'A': { 'B': 3, 'C': 8, 'D': -4 },
    'B': { 'A': 3, 'D': 1 },
    'C': { 'B': 4 },
    'D': { 'C': 2 }
  });
  const [nodes, setNodes] = useState(['A', 'B', 'C', 'D']);
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
      setNodes(Object.keys(newGraph));
    } catch (e) {
      console.error("Invalid graph format");
    }
  };

  const handleVisualize = () => {
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, distanceMatrix) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push({ distanceMatrix: JSON.parse(JSON.stringify(distanceMatrix)) });
    };

    // Floyd-Warshall Algorithm
    const nodes = Object.keys(graph);
    const distance = {};
    nodes.forEach(node => {
      distance[node] = {};
      nodes.forEach(otherNode => {
        distance[node][otherNode] = node === otherNode ? 0 : (graph[node][otherNode] || Infinity);
      });
    });

    addStep(1, "Initial distance matrix", distance);

    for (let k of nodes) {
      for (let i of nodes) {
        for (let j of nodes) {
          const newDistance = distance[i][k] + distance[k][j];
          if (newDistance < distance[i][j]) {
            distance[i][j] = newDistance;
            addStep(2, `Updating distance from ${i} to ${j} via ${k}`, distance);
          }
        }
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setDistances(distance);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const { distanceMatrix } = steps[index];
    setDistances(distanceMatrix);
    setStepIndex(index);

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
          <h1 className="text-3xl font-bold text-center text-red-600">FLOYD-WARSHALL ALGORITHM VISUALIZATION</h1>
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
            value={floydWarshallAlgorithm}
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
          <div style={{ overflowX: 'auto', width: '100%', marginBottom: '10px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '5px' }}>Nodes</th>
                  {nodes.map(node => (
                    <th key={node} style={{ border: '1px solid black', padding: '5px' }}>{node}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodes.map(node => (
                  <tr key={node}>
                    <td style={{ border: '1px solid black', padding: '5px' }}>{node}</td>
                    {nodes.map(otherNode => (
                      <td key={otherNode} style={{ border: '1px solid black', padding: '5px' }}>
                        {distances[node] && distances[node][otherNode] !== Infinity ? distances[node][otherNode] : '∞'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default FloydWarshallVisualizer;