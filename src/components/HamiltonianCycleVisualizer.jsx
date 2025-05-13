import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Hamiltonian Cycle Algorithm in Python
def is_safe(v, pos, path, graph):
    if graph[path[pos - 1]][v] == 0:
        return False
    if v in path:
        return False
    return True

def hamiltonian_cycle_util(graph, path, pos):
    if pos == len(graph):
        if graph[path[pos - 1]][path[0]] == 1:
            return True
        else:
            return False

    for v in range(1, len(graph)):
        if is_safe(v, pos, path, graph):
            path[pos] = v
            if hamiltonian_cycle_util(graph, path, pos + 1):
                return True
            path[pos] = -1
    return False

def hamiltonian_cycle(graph):
    path = [-1] * len(graph)
    path[0] = 0
    if not hamiltonian_cycle_util(graph, path, 1):
        return None
    return path

graph = [
    [0, 1, 0, 1, 0],
    [1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 1, 1, 1, 0]
]

cycle = hamiltonian_cycle(graph)
if cycle:
    print("Hamiltonian Cycle exists:", cycle)
else:
    print("No Hamiltonian Cycle found")
`,

  javascript: `
// Hamiltonian Cycle Algorithm in JavaScript
function isSafe(v, pos, path, graph) {
  if (graph[path[pos - 1]][v] === 0) return false;
  if (path.includes(v)) return false;
  return true;
}

function hamiltonianCycleUtil(graph, path, pos) {
  if (pos === graph.length) {
    return graph[path[pos - 1]][path[0]] === 1;
  }

  for (let v = 1; v < graph.length; v++) {
    if (isSafe(v, pos, path, graph)) {
      path[pos] = v;
      if (hamiltonianCycleUtil(graph, path, pos + 1)) return true;
      path[pos] = -1;
    }
  }
  return false;
}

function hamiltonianCycle(graph) {
  const path = Array(graph.length).fill(-1);
  path[0] = 0;
  if (!hamiltonianCycleUtil(graph, path, 1)) {
    return null;
  }
  return path;
}

const graph = [
  [0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1],
  [0, 1, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [0, 1, 1, 1, 0]
];

const cycle = hamiltonianCycle(graph);
if (cycle) {
  console.log("Hamiltonian Cycle exists:", cycle);
} else {
  console.log("No Hamiltonian Cycle found");
}
`,

  java: `
// Hamiltonian Cycle Algorithm in Java
import java.util.Arrays;

public class HamiltonianCycle {
    public static boolean isSafe(int v, int pos, int[] path, int[][] graph) {
        if (graph[path[pos - 1]][v] == 0) return false;
        for (int i = 0; i < pos; i++) {
            if (path[i] == v) return false;
        }
        return true;
    }

    public static boolean hamiltonianCycleUtil(int[][] graph, int[] path, int pos) {
        if (pos == graph.length) {
            return graph[path[pos - 1]][path[0]] == 1;
        }

        for (int v = 1; v < graph.length; v++) {
            if (isSafe(v, pos, path, graph)) {
                path[pos] = v;
                if (hamiltonianCycleUtil(graph, path, pos + 1)) return true;
                path[pos] = -1;
            }
        }
        return false;
    }

    public static int[] hamiltonianCycle(int[][] graph) {
        int[] path = new int[graph.length];
        Arrays.fill(path, -1);
        path[0] = 0;
        if (!hamiltonianCycleUtil(graph, path, 1)) {
            return null;
        }
        return path;
    }

    public static void main(String[] args) {
        int[][] graph = {
            {0, 1, 0, 1, 0},
            {1, 0, 1, 1, 1},
            {0, 1, 0, 0, 1},
            {1, 1, 0, 0, 1},
            {0, 1, 1, 1, 0}
        };

        int[] cycle = hamiltonianCycle(graph);
        if (cycle != null) {
            System.out.println("Hamiltonian Cycle exists: " + Arrays.toString(cycle));
        } else {
            System.out.println("No Hamiltonian Cycle found");
        }
    }
}
`,

  c: `
// Hamiltonian Cycle Algorithm in C
#include <stdio.h>
#include <stdbool.h>

bool isSafe(int v, int pos, int path[], int graph[5][5]) {
    if (graph[path[pos - 1]][v] == 0) return false;
    for (int i = 0; i < pos; i++) {
        if (path[i] == v) return false;
    }
    return true;
}

bool hamiltonianCycleUtil(int graph[5][5], int path[], int pos) {
    if (pos == 5) {
        return graph[path[pos - 1]][path[0]] == 1;
    }

    for (int v = 1; v < 5; v++) {
        if (isSafe(v, pos, path, graph)) {
            path[pos] = v;
            if (hamiltonianCycleUtil(graph, path, pos + 1)) return true;
            path[pos] = -1;
        }
    }
    return false;
}

bool hamiltonianCycle(int graph[5][5]) {
    int path[5];
    for (int i = 0; i < 5; i++) {
        path[i] = -1;
    }
    path[0] = 0;
    if (!hamiltonianCycleUtil(graph, path, 1)) {
        return false;
    }
    printf("Hamiltonian Cycle exists: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", path[i]);
    }
    printf("\n");
    return true;
}

int main() {
    int graph[5][5] = {
        {0, 1, 0, 1, 0},
        {1, 0, 1, 1, 1},
        {0, 1, 0, 0, 1},
        {1, 1, 0, 0, 1},
        {0, 1, 1, 1, 0}
    };

    if (!hamiltonianCycle(graph)) {
        printf("No Hamiltonian Cycle found\n");
    }
    return 0;
}
`,

  cpp: `
// Hamiltonian Cycle Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>

bool isSafe(int v, int pos, std::vector<int>& path, std::vector<std::vector<int>>& graph) {
    if (graph[path[pos - 1]][v] == 0) return false;
    if (std::find(path.begin(), path.end(), v) != path.end()) return false;
    return true;
}

bool hamiltonianCycleUtil(std::vector<std::vector<int>>& graph, std::vector<int>& path, int pos) {
    if (pos == graph.size()) {
        return graph[path[pos - 1]][path[0]] == 1;
    }

    for (int v = 1; v < graph.size(); v++) {
        if (isSafe(v, pos, path, graph)) {
            path[pos] = v;
            if (hamiltonianCycleUtil(graph, path, pos + 1)) return true;
            path[pos] = -1;
        }
    }
    return false;
}

std::vector<int> hamiltonianCycle(std::vector<std::vector<int>>& graph) {
    std::vector<int> path(graph.size(), -1);
    path[0] = 0;
    if (!hamiltonianCycleUtil(graph, path, 1)) {
        return std::vector<int>();
    }
    return path;
}

int main() {
    std::vector<std::vector<int>> graph = {
        {0, 1, 0, 1, 0},
        {1, 0, 1, 1, 1},
        {0, 1, 0, 0, 1},
        {1, 1, 0, 0, 1},
        {0, 1, 1, 1, 0}
    };

    std::vector<int> cycle = hamiltonianCycle(graph);
    if (!cycle.empty()) {
        std::cout << "Hamiltonian Cycle exists: ";
        for (int v : cycle) {
            std::cout << v << " ";
        }
        std::cout << std::endl;
    } else {
        std::cout << "No Hamiltonian Cycle found" << std::endl;
    }
    return 0;
}
`
};

const HamiltonianCycleVisualizer = () => {
  const [vertices, setVertices] = useState('');
  const [edges, setEdges] = useState('');
  const [language, setLanguage] = useState('python');
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [result, setResult] = useState('');
  const svgContainerRef = useRef(null);

  const handleVerticesChange = (event) => {
    setVertices(event.target.value);
  };

  const handleEdgesChange = (event) => {
    setEdges(event.target.value);
  };

  const parseGraph = () => {
    const vertexCount = parseInt(vertices, 10);
    const edgeList = edges.split(',').map(edge => edge.trim().split('-').map(Number));
    const graph = Array.from({ length: vertexCount }, () => Array(vertexCount).fill(0));
    edgeList.forEach(([u, v]) => {
      graph[u][v] = 1;
      graph[v][u] = 1;
    });
    return graph;
  };

  const isSafe = (v, pos, path, graph) => {
    if (graph[path[pos - 1]][v] === 0) return false;
    if (path.includes(v)) return false;
    return true;
  };

  const hamiltonianCycleUtil = (graph, path, pos) => {
    if (pos === graph.length) {
      return graph[path[pos - 1]][path[0]] === 1;
    }

    for (let v = 1; v < graph.length; v++) {
      if (isSafe(v, pos, path, graph)) {
        path[pos] = v;
        if (hamiltonianCycleUtil(graph, path, pos + 1)) return true;
        path[pos] = -1;
      }
    }
    return false;
  };

  const hamiltonianCycle = (graph) => {
    const path = Array(graph.length).fill(-1);
    path[0] = 0;
    if (!hamiltonianCycleUtil(graph, path, 1)) {
      return null;
    }
    return path;
  };

  const handleSolve = () => {
    const graph = parseGraph();
    const cycle = hamiltonianCycle(graph);
    if (cycle) {
      drawGraph(graph, cycle);
      setResult(`Hamiltonian Cycle exists: ${cycle.join(' -> ')}`);
    } else {
      setResult('No Hamiltonian Cycle found');
    }
  };

  const drawGraph = (graph, cycle) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    d3.select(svgContainer).selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = 150;
    const angleStep = (2 * Math.PI) / graph.length;

    const svg = d3.select(svgContainer).append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid black')
      .style('margin-top', '20px')
      .call(d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform);
      }))
      .append('g');

    const nodes = graph.map((_, i) => ({
      x: width / 2 + radius * Math.cos(i * angleStep),
      y: height / 2 + radius * Math.sin(i * angleStep),
      id: i
    }));

    const edges = [];
    graph.forEach((row, i) => {
      row.forEach((connected, j) => {
        if (connected && i < j) {
          edges.push({ source: i, target: j });
        }
      });
    });

    svg.selectAll('.edge')
      .data(edges)
      .enter().append('line')
      .attr('class', 'edge')
      .attr('x1', d => nodes[d.source].x)
      .attr('y1', d => nodes[d.source].y)
      .attr('x2', d => nodes[d.target].x)
      .attr('y2', d => nodes[d.target].y)
      .attr('stroke', 'black');

    svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 10)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    svg.selectAll('.label')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.id);

    const cycleEdges = [];
    for (let i = 0; i < cycle.length; i++) {
      cycleEdges.push({
        source: cycle[i],
        target: cycle[(i + 1) % cycle.length]
      });
    }

    svg.selectAll('.cycle-edge')
      .data(cycleEdges)
      .enter().append('line')
      .attr('class', 'cycle-edge')
      .attr('x1', d => nodes[d.source].x)
      .attr('y1', d => nodes[d.source].y)
      .attr('x2', d => nodes[d.target].x)
      .attr('y2', d => nodes[d.target].y)
      .attr('stroke', 'red')
      .attr('stroke-width', 2);
  };

  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <Dialog open={instructionsOpen} onClose={handleCloseInstructions}>
        <DialogTitle>Instructions</DialogTitle>
        <DialogContent>
          <Typography>
            Welcome to the Hamiltonian Cycle Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the number of vertices and the edges of the graph.</li>
            <li>Click "Solve" to find the Hamiltonian cycle in the graph.</li>
            <li>The Hamiltonian cycle will be displayed on the screen.</li>
          </ol>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructions} color="primary">Got it!</Button>
        </DialogActions>
      </Dialog>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <FormControl variant="outlined" style={{ margin: '10px' }}>
          <InputLabel>Language</InputLabel>
          <Select value={language} onChange={handleLanguageChange} label="Language">
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red', flex: 1 }}>
          <h1 className="text-3xl font-bold text-center text-red-600">HAMILTONIAN CYCLE</h1>
        </div>
      </div>
      <div style={{ display: 'flex', height: '79vh', border: '1px solid #ddd' }}>
        <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '10px' }}>
          <Editor
            height="100%"
            defaultLanguage={language}
            value={algorithms[language]}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <TextField
            variant="outlined"
            label="Number of Vertices"
            onChange={handleVerticesChange}
            style={{ width: '90%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Edges (comma separated, format: u-v)"
            onChange={handleEdgesChange}
            style={{ width: '90%', marginBottom: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleSolve} style={{ width: '50%', marginTop: '10px' }}>
            Solve
          </Button>
          {result && (
            <Typography color="primary" variant="body1" style={{ marginTop: '10px' }}>
              {result}
            </Typography>
          )}
          <div ref={svgContainerRef} style={{ width: '300px', height: '300px', marginTop: '0px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default HamiltonianCycleVisualizer;