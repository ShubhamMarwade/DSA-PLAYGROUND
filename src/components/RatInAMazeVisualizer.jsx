import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Rat in a Maze Algorithm in Python
def is_safe(maze, x, y):
    return x >= 0 and x < len(maze) and y >= 0 and y < len(maze[0]) and maze[x][y] == 1

def solve_maze(maze):
    N = len(maze)
    sol = [[0 for _ in range(N)] for _ in range(N)]
    
    if not solve_maze_util(maze, 0, 0, sol):
        return None
    return sol

def solve_maze_util(maze, x, y, sol):
    if x == len(maze) - 1 and y == len(maze[0]) - 1 and maze[x][y] == 1:
        sol[x][y] = 1
        return True
    
    if is_safe(maze, x, y):
        sol[x][y] = 1
        
        if solve_maze_util(maze, x + 1, y, sol):
            return True
        
        if solve_maze_util(maze, x, y + 1, sol):
            return True
        
        sol[x][y] = 0
        return False

maze = [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
]

solution = solve_maze(maze)
if solution:
    for row in solution:
        print(row)
else:
    print("No solution")
`,

  javascript: `
// Rat in a Maze Algorithm in JavaScript
function isSafe(maze, x, y) {
  return x >= 0 && x < maze.length && y >= 0 && y < maze[0].length && maze[x][y] === 1;
}

function solveMaze(maze) {
  const N = maze.length;
  const sol = Array.from({ length: N }, () => Array(N).fill(0));

  if (!solveMazeUtil(maze, 0, 0, sol)) {
    return null;
  }
  return sol;
}

function solveMazeUtil(maze, x, y, sol) {
  if (x === maze.length - 1 && y === maze[0].length - 1 && maze[x][y] === 1) {
    sol[x][y] = 1;
    return true;
  }

  if (isSafe(maze, x, y)) {
    sol[x][y] = 1;

    if (solveMazeUtil(maze, x + 1, y, sol)) {
      return true;
    }

    if (solveMazeUtil(maze, x, y + 1, sol)) {
      return true;
    }

    sol[x][y] = 0;
    return false;
  }

  return false;
}

const maze = [
  [1, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 1, 0, 0],
  [1, 1, 1, 1]
];

const solution = solveMaze(maze);
if (solution) {
  console.log(solution);
} else {
  console.log("No solution");
}
`,

  java: `
// Rat in a Maze Algorithm in Java
public class RatInAMaze {
    public static boolean isSafe(int[][] maze, int x, int y) {
        return x >= 0 && x < maze.length && y >= 0 && y < maze[0].length && maze[x][y] == 1;
    }

    public static boolean solveMaze(int[][] maze) {
        int N = maze.length;
        int[][] sol = new int[N][N];

        if (!solveMazeUtil(maze, 0, 0, sol)) {
            return false;
        }

        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                System.out.print(sol[i][j] + " ");
            }
            System.out.println();
        }
        return true;
    }

    public static boolean solveMazeUtil(int[][] maze, int x, int y, int[][] sol) {
        if (x == maze.length - 1 && y == maze[0].length - 1 && maze[x][y] == 1) {
            sol[x][y] = 1;
            return true;
        }

        if (isSafe(maze, x, y)) {
            sol[x][y] = 1;

            if (solveMazeUtil(maze, x + 1, y, sol)) {
                return true;
            }

            if (solveMazeUtil(maze, x, y + 1, sol)) {
                return true;
            }

            sol[x][y] = 0;
            return false;
        }

        return false;
    }

    public static void main(String[] args) {
        int[][] maze = {
            {1, 0, 0, 0},
            {1, 1, 0, 1},
            {0, 1, 0, 0},
            {1, 1, 1, 1}
        };

        if (!solveMaze(maze)) {
            System.out.println("No solution");
        }
    }
}
`,

  c: `
// Rat in a Maze Algorithm in C
#include <stdio.h>
#include <stdbool.h>

bool isSafe(int maze[4][4], int x, int y) {
    return x >= 0 && x < 4 && y >= 0 && y < 4 && maze[x][y] == 1;
}

bool solveMazeUtil(int maze[4][4], int x, int y, int sol[4][4]);

bool solveMaze(int maze[4][4]) {
    int sol[4][4] = { {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0} };

    if (!solveMazeUtil(maze, 0, 0, sol)) {
        printf("No solution");
        return false;
    }

    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%d ", sol[i][j]);
        }
        printf("\\n");
    }
    return true;
}

bool solveMazeUtil(int maze[4][4], int x, int y, int sol[4][4]) {
    if (x == 3 && y == 3 && maze[x][y] == 1) {
        sol[x][y] = 1;
        return true;
    }

    if (isSafe(maze, x, y)) {
        sol[x][y] = 1;

        if (solveMazeUtil(maze, x + 1, y, sol)) {
            return true;
        }

        if (solveMazeUtil(maze, x, y + 1, sol)) {
            return true;
        }

        sol[x][y] = 0;
        return false;
    }

    return false;
}

int main() {
    int maze[4][4] = { {1, 0, 0, 0}, {1, 1, 0, 1}, {0, 1, 0, 0}, {1, 1, 1, 1} };

    solveMaze(maze);
    return 0;
}
`,

  cpp: `
// Rat in a Maze Algorithm in C++
#include <iostream>
#include <vector>

bool isSafe(std::vector<std::vector<int>>& maze, int x, int y) {
    return x >= 0 && x < maze.size() && y >= 0 && y < maze[0].size() && maze[x][y] == 1;
}

bool solveMazeUtil(std::vector<std::vector<int>>& maze, int x, int y, std::vector<std::vector<int>>& sol);

bool solveMaze(std::vector<std::vector<int>>& maze) {
    int N = maze.size();
    std::vector<std::vector<int>> sol(N, std::vector<int>(N, 0));

    if (!solveMazeUtil(maze, 0, 0, sol)) {
        std::cout << "No solution" << std::endl;
        return false;
    }

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            std::cout << sol[i][j] << " ";
        }
        std::cout << std::endl;
    }
    return true;
}

bool solveMazeUtil(std::vector<std::vector<int>>& maze, int x, int y, std::vector<std::vector<int>>& sol) {
    if (x == maze.size() - 1 && y == maze[0].size() - 1 && maze[x][y] == 1) {
        sol[x][y] = 1;
        return true;
    }

    if (isSafe(maze, x, y)) {
        sol[x][y] = 1;

        if (solveMazeUtil(maze, x + 1, y, sol)) {
            return true;
        }

        if (solveMazeUtil(maze, x, y + 1, sol)) {
            return true;
        }

        sol[x][y] = 0;
        return false;
    }

    return false;
}

int main() {
    std::vector<std::vector<int>> maze = {
        {1, 0, 0, 0},
        {1, 1, 0, 1},
        {0, 1, 0, 0},
        {1, 1, 1, 1}
    };

    solveMaze(maze);
    return 0;
}
`
};

const RatInAMazeVisualizer = () => {
  const [maze, setMaze] = useState(Array(4).fill(0).map(() => Array(4).fill(0)));
  const [language, setLanguage] = useState('python');
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [result, setResult] = useState('');
  const svgContainerRef = useRef(null);

  const handleInputChange = (row, col, value) => {
    const newMaze = maze.map((r, i) => r.map((cell, j) => (i === row && j === col ? parseInt(value, 10) || 0 : cell)));
    setMaze(newMaze);
  };

  const isSafe = (maze, x, y) => {
    return x >= 0 && x < maze.length && y >= 0 && y < maze[0].length && maze[x][y] === 1;
  };

  const solveMaze = (maze) => {
    const N = maze.length;
    const sol = Array.from({ length: N }, () => Array(N).fill(0));

    if (!solveMazeUtil(maze, 0, 0, sol)) {
      return null;
    }
    return sol;
  };

  const solveMazeUtil = (maze, x, y, sol) => {
    if (x === maze.length - 1 && y === maze[0].length - 1 && maze[x][y] === 1) {
      sol[x][y] = 1;
      return true;
    }

    if (isSafe(maze, x, y)) {
      sol[x][y] = 1;

      if (solveMazeUtil(maze, x + 1, y, sol)) {
        return true;
      }

      if (solveMazeUtil(maze, x, y + 1, sol)) {
        return true;
      }

      sol[x][y] = 0;
      return false;
    }

    return false;
  };

  const handleSolve = () => {
    const solution = solveMaze(maze);
    if (solution) {
      drawMaze(solution);
      setResult('Solved the maze!');
    } else {
      setResult('No solution found.');
    }
  };

  const drawMaze = (solution) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    d3.select(svgContainer).selectAll('*').remove();

    const svgWidth = 300;
    const svgHeight = 300;
    const cellSize = svgWidth / 4;

    const svg = d3.select(svgContainer).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('border', '1px solid black')
      .style('margin-top', '20px');

    svg.selectAll('.cell')
      .data(solution.flat())
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => (i % 4) * cellSize)
      .attr('y', (d, i) => Math.floor(i / 4) * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', (d) => (d ? 'lightgreen' : 'white'))
      .attr('stroke', 'black');

    svg.selectAll('.rat')
      .data(solution.flat())
      .enter().append('text')
      .attr('class', 'rat')
      .attr('x', (d, i) => ((i % 4) + 0.5) * cellSize)
      .attr('y', (d, i) => (Math.floor(i / 4) + 0.5) * cellSize)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .text((d, i) => (d ? '🐀' : ''));
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
            Welcome to the Rat in a Maze Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the maze grid values in the input fields (1 for open path, 0 for blocked path).</li>
            <li>Click "Solve" to find the path through the maze.</li>
            <li>The rat's path will be displayed on the screen.</li>
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
          <h1 className="text-3xl font-bold text-center text-red-600">RAT IN A MAZE</h1>
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
        <Grid container spacing={0} justifyContent="center">
                  {maze.map((row, rowIndex) => (
                    <Grid container item key={rowIndex} spacing={0} justifyContent="center">
                      {row.map((cell, colIndex) => (
                        <Grid item key={`${rowIndex}-${colIndex}`} xs="auto">
                          <TextField
                            variant="outlined"
                            value={cell || ''}
                            onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                            inputProps={{ maxLength: 1, style: { textAlign: 'center', width: '2ch', height: '2ch', fontSize: '16px', padding: '5px'} }}
                            style={{ width: '35px', height: '35px', margin: '0px', padding: '0px'}} // Adjust cell size
                          />
                        </Grid>
                    ))}
                    </Grid>
                ))}
        </Grid>
          <Button variant="contained" color="primary" onClick={handleSolve} style={{ width: '50%', marginTop: '5px' }}>
            Solve
          </Button>
          {result && (
            <Typography color="primary" variant="body1" style={{ marginTop: '5px' }}>
              {result}
            </Typography>
          )}
          <div ref={svgContainerRef} style={{ width: '300px', height: '300px', marginTop: '0px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RatInAMazeVisualizer;