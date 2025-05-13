import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Graph Coloring Algorithm in Python
def is_safe(graph, colors, v, c):
    for i in range(len(graph)):
        if graph[v][i] == 1 and colors[i] == c:
            return False
    return True

def graph_coloring_util(graph, m, colors, v):
    if v == len(graph):
        return True

    for c in range(1, m + 1):
        if is_safe(graph, colors, v, c):
            colors[v] = c
            if graph_coloring_util(graph, m, colors, v + 1):
                return True
            colors[v] = 0

    return False

def graph_coloring(graph, m):
    colors = [0] * len(graph)
    if not graph_coloring_util(graph, m, colors, 0):
        return None
    return colors

graph = [
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 0]
]
m = 3  # Number of colors

colors = graph_coloring(graph, m)
if colors:
    print("Solution exists with colors:", colors)
else:
    print("No solution found")
`,

  javascript: `
// Graph Coloring Algorithm in JavaScript
function isSafe(graph, colors, v, c) {
  for (let i = 0; i < graph.length; i++) {
    if (graph[v][i] === 1 && colors[i] === c) return false;
  }
  return true;
}

function graphColoringUtil(graph, m, colors, v) {
  if (v === graph.length) return true;

  for (let c = 1; c <= m; c++) {
    if (isSafe(graph, colors, v, c)) {
      colors[v] = c;
      if (graphColoringUtil(graph, m, colors, v + 1)) return true;
      colors[v] = 0;
    }
  }
  return false;
}

function graphColoring(graph, m) {
  const colors = Array(graph.length).fill(0);
  if (!graphColoringUtil(graph, m, colors, 0)) return null;
  return colors;
}

const graph = [
  [0, 1, 1, 1],
  [1, 0, 1, 0],
  [1, 1, 0, 1],
  [1, 0, 1, 0]
];
const m = 3;  // Number of colors

const colors = graphColoring(graph, m);
if (colors) {
  console.log("Solution exists with colors:", colors);
} else {
  console.log("No solution found");
}
`,

  java: `
// Graph Coloring Algorithm in Java
import java.util.Arrays;

public class GraphColoring {
    public static boolean isSafe(int[][] graph, int[] colors, int v, int c) {
        for (int i = 0; i < graph.length; i++) {
            if (graph[v][i] == 1 && colors[i] == c) return false;
        }
        return true;
    }

    public static boolean graphColoringUtil(int[][] graph, int m, int[] colors, int v) {
        if (v == graph.length) return true;

        for (int c = 1; c <= m; c++) {
            if (isSafe(graph, colors, v, c)) {
                colors[v] = c;
                if (graphColoringUtil(graph, m, colors, v + 1)) return true;
                colors[v] = 0;
            }
        }
        return false;
    }

    public static int[] graphColoring(int[][] graph, int m) {
        int[] colors = new int[graph.length];
        Arrays.fill(colors, 0);
        if (!graphColoringUtil(graph, m, colors, 0)) {
            return null;
        }
        return colors;
    }

    public static void main(String[] args) {
        int[][] graph = {
            {0, 1, 1, 1},
            {1, 0, 1, 0},
            {1, 1, 0, 1},
            {1, 0, 1, 0}
        };
        int m = 3;  // Number of colors

        int[] colors = graphColoring(graph, m);
        if (colors != null) {
            System.out.println("Solution exists with colors: " + Arrays.toString(colors));
        } else {
            System.out.println("No solution found");
        }
    }
}
`,

  c: `
// Graph Coloring Algorithm in C
#include <stdio.h>
#include <stdbool.h>

bool isSafe(int graph[4][4], int colors[], int v, int c) {
    for (int i = 0; i < 4; i++) {
        if (graph[v][i] == 1 && colors[i] == c) return false;
    }
    return true;
}

bool graphColoringUtil(int graph[4][4], int m, int colors[], int v) {
    if (v == 4) return true;

    for (int c = 1; c <= m; c++) {
        if (isSafe(graph, colors, v, c)) {
            colors[v] = c;
            if (graphColoringUtil(graph, m, colors, v + 1)) return true;
            colors[v] = 0;
        }
    }
    return false;
}

bool graphColoring(int graph[4][4], int m) {
    int colors[4] = {0};
    if (!graphColoringUtil(graph, m, colors, 0)) return false;

    printf("Solution exists with colors: ");
    for (int i = 0; i < 4; i++) {
        printf("%d ", colors[i]);
    }
    printf("\n");
    return true;
}

int main() {
    int graph[4][4] = {
        {0, 1, 1, 1},
        {1, 0, 1, 0},
        {1, 1, 0, 1},
        {1, 0, 1, 0}
    };
    int m = 3;  // Number of colors

    if (!graphColoring(graph, m)) {
        printf("No solution found\n");
    }
    return 0;
}
`,

  cpp: `
// Graph Coloring Algorithm in C++
#include <iostream>
#include <vector>

bool isSafe(std::vector<std::vector<int>>& graph, std::vector<int>& colors, int v, int c) {
    for (int i = 0; i < graph.size(); i++) {
        if (graph[v][i] == 1 && colors[i] == c) return false;
    }
    return true;
}

bool graphColoringUtil(std::vector<std::vector<int>>& graph, int m, std::vector<int>& colors, int v) {
    if (v == graph.size()) return true;

    for (int c = 1; c <= m; c++) {
        if (isSafe(graph, colors, v, c)) {
            colors[v] = c;
            if (graphColoringUtil(graph, m, colors, v + 1)) return true;
            colors[v] = 0;
        }
    }
    return false;
}

std::vector<int> graphColoring(std::vector<std::vector<int>>& graph, int m) {
    std::vector<int> colors(graph.size(), 0);
    if (!graphColoringUtil(graph, m, colors, 0)) {
        return std::vector<int>();
    }
    return colors;
}

int main() {
    std::vector<std::vector<int>> graph = {
        {0, 1, 1, 1},
        {1, 0, 1, 0},
        {1, 1, 0, 1},
        {1, 0, 1, 0}
    };
    int m = 3;  // Number of colors

    std::vector<int> colors = graphColoring(graph, m);
    if (!colors.empty()) {
        std::cout << "Solution exists with colors: ";
        for (int c : colors) {
            std::cout << c << " ";
        }
        std::cout << std::endl;
    } else {
        std::cout << "No solution found" << std::endl;
    }
    return 0;
}
`
};

const GraphColoringVisualizer = () => {
  const [vertices, setVertices] = useState('');
  const [edges, setEdges] = useState('');
  const [numColors, setNumColors] = useState('');
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

  const handleNumColorsChange = (event) => {
    setNumColors(event.target.value);
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

  const isSafe = (graph, colors, v, c) => {
    for (let i = 0; i < graph.length; i++) {
      if (graph[v][i] === 1 && colors[i] === c) return false;
    }
    return true;
  };

  const graphColoringUtil = (graph, m, colors, v) => {
    if (v === graph.length) return true;

    for (let c = 1; c <= m; c++) {
      if (isSafe(graph, colors, v, c)) {
        colors[v] = c;
        if (graphColoringUtil(graph, m, colors, v + 1)) return true;
        colors[v] = 0;
      }
    }
    return false;
  };

  const graphColoring = (graph, m) => {
    const colors = Array(graph.length).fill(0);
    if (!graphColoringUtil(graph, m, colors, 0)) return null;
    return colors;
  };

  const handleSolve = () => {
    const graph = parseGraph();
    const colors = graphColoring(graph, parseInt(numColors, 10));
    if (colors) {
      drawGraph(graph, colors);
      setResult(`Solution exists with colors: ${colors.join(', ')}`);
    } else {
      setResult('No solution found');
    }
  };

  const drawGraph = (graph, colors) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    d3.select(svgContainer).selectAll('*').remove();

    const width = 200;
    const height = 200;
    const radius = 150;
    const angleStep = (2 * Math.PI) / graph.length;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
      id: i,
      color: colors[i]
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
      .attr('fill', d => colorScale(d.color))
      .attr('stroke', 'black')
      .style('filter', 'url(#neon)');

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

    svg.append('defs').append('filter')
      .attr('id', 'neon')
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('stdDeviation', 4)
      .attr('flood-color', '#00ff00');
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
            Welcome to the Graph Coloring Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the number of vertices and the edges of the graph.</li>
            <li>Enter the number of colors.</li>
            <li>Click "Solve" to find the graph coloring solution.</li>
            <li>The colored graph will be displayed on the screen.</li>
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
          <h1 className="text-3xl font-bold text-center text-red-600">GRAPH COLORING</h1>
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
          <TextField
            variant="outlined"
            label="Number of Colors"
            onChange={handleNumColorsChange}
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
          <div ref={svgContainerRef} style={{ width: '250px', height: '250px', marginTop: '0px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GraphColoringVisualizer;