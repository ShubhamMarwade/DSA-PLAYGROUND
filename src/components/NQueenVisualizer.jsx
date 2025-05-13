import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def solve_n_queens(n):
    def is_safe(board, row, col):
        for i in range(col):
            if board[row][i] == 1:
                return False
        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
            if board[i][j] == 1:
                return False
        for i, j in zip(range(row, len(board), 1), range(col, -1, -1)):
            if board[i][j] == 1:
                return False
        return True

    def solve(board, col):
        if col >= len(board):
            return True
        for i in range(len(board)):
            if is_safe(board, i, col):
                board[i][col] = 1
                if solve(board, col + 1):
                    return True
                board[i][col] = 0
        return False

    board = [[0 for _ in range(n)] for _ in range(n)]
    solve(board, 0)
    return board

n = int(input("Enter the value of N: "))
board = solve_n_queens(n)
for row in board:
    print(row)
`,
  c:
`#include <stdio.h>
#include <stdbool.h>

bool is_safe(int** board, int row, int col, int N) {
    for (int i = 0; i < col; i++)
        if (board[row][i])
            return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j])
            return false;
    for (int i = row, j = col; j >= 0 && i < N; i++, j--)
        if (board[i][j])
            return false;
    return true;
}

bool solve(int** board, int col, int N) {
    if (col >= N)
        return true;
    for (int i = 0; i < N; i++) {
        if (is_safe(board, i, col, N)) {
            board[i][col] = 1;
            if (solve(board, col + 1, N))
                return true;
            board[i][col] = 0;
        }
    }
    return false;
}

void print_board(int** board, int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++)
            printf(" %d ", board[i][j]);
        printf("\n");
    }
}

int main() {
    int N;
    scanf("%d", &N);
    int** board = (int**)malloc(N * sizeof(int*));
    for (int i = 0; i < N; i++)
        board[i] = (int*)malloc(N * sizeof(int));
    solve(board, 0, N);
    print_board(board, N);
    for (int i = 0; i < N; i++)
        free(board[i]);
    free(board);
    return 0;
}
`,
  cpp:
`#include <iostream>
#define N 8
using namespace std;

bool is_safe(int board[N][N], int row, int col) {
    for (int i = 0; i < col; i++)
        if (board[row][i])
            return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j])
            return false;
    for (int i = row, j = col; j >= 0 && i < N; i++, j--)
        if (board[i][j])
            return false;
    return true;
}

bool solve(int board[N][N], int col) {
    if (col >= N)
        return true;
    for (int i = 0; i < N; i++) {
        if (is_safe(board, i, col)) {
            board[i][col] = 1;
            if (solve(board, col + 1))
                return true;
            board[i][col] = 0;
        }
    }
    return false;
}

void print_board(int board[N][N]) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++)
            cout << " " << board[i][j] << " ";
        cout << endl;
    }
}

int main() {
    int board[N][N] = {0};
    solve(board, 0);
    print_board(board);
    return 0;
}
`,
  java:
`public class NQueen {
    final int N = 8;

    boolean is_safe(int board[][], int row, int col) {
        for (int i = 0; i < col; i++)
            if (board[row][i] == 1)
                return false;
        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] == 1)
                return false;
        for (int i = row, j = col; j >= 0 && i < N; i++, j--)
            if (board[i][j] == 1)
                return false;
        return true;
    }

    boolean solve(int board[][], int col) {
        if (col >= N)
            return true;
        for (int i = 0; i < N; i++) {
            if (is_safe(board, i, col)) {
                board[i][col] = 1;
                if (solve(board, col + 1))
                    return true;
                board[i][col] = 0;
            }
        }
        return false;
    }

    void print_board(int board[][]) {
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++)
                System.out.print(" " + board[i][j] + " ");
            System.out.println();
        }
    }

    public static void main(String args[]) {
        NQueen Queen = new NQueen();
        int board[][] = new int[Queen.N][Queen.N];
        Queen.solve(board, 0);
        Queen.print_board(board);
    }
}
`
};

const NQueenVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [n, setN] = useState(8);
  const [isSolving, setIsSolving] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    resetState();
  };

  const handleNChange = (event, newValue) => {
    setN(newValue);
    resetState();
  };

  const handleVisualize = () => {
    if (isSolving) return;

    setIsSolving(true);
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, boardState) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push(boardState.map(row => [...row]));
    };

    // Generate the steps for visualization
    if (language === 'python') {
      const solveNQueens = (n) => {
        const isSafe = (board, row, col) => {
          for (let i = 0; i < col; i++)
            if (board[row][i] === 1)
              return false;
          for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] === 1)
              return false;
          for (let i = row, j = col; j >= 0 && i < n; i++, j--)
            if (board[i][j] === 1)
              return false;
          return true;
        };

        const solve = (board, col) => {
          if (col >= n) return true;
          for (let i = 0; i < n; i++) {
            if (isSafe(board, i, col)) {
              board[i][col] = 1;
              addStep(4, `Placing queen at row ${i}, column ${col}`, board);
              if (solve(board, col + 1)) return true;
              board[i][col] = 0;
              addStep(4, `Removing queen from row ${i}, column ${col}`, board);
            }
          }
          return false;
        };

        const board = Array.from({ length: n }, () => Array(n).fill(0));
        solve(board, 0);
        return board;
      };

      addStep(1, 'Line 1: Define the function to solve the N-Queens problem.', []);
      solveNQueens(n);
      addStep(9, 'Line 9: The user enters the value of N.', []);
      addStep(10, 'Line 10: The solveNQueens function is called, and the board is updated step by step.', []);
      addStep(11, 'Line 11: The final board configuration is displayed to the user.', []);
    } else if (language === 'c') {
      const solveNQueens = (n) => {
        const isSafe = (board, row, col) => {
          for (let i = 0; i < col; i++)
            if (board[row][i] === 1)
              return false;
          for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] === 1)
              return false;
          for (let i = row, j = col; j >= 0 && i < n; i++, j--)
            if (board[i][j] === 1)
              return false;
          return true;
        };

        const solve = (board, col) => {
          if (col >= n) return true;
          for (let i = 0; i < n; i++) {
            if (isSafe(board, i, col)) {
              board[i][col] = 1;
              addStep(4, `Placing queen at row ${i}, column ${col}`, board);
              if (solve(board, col + 1)) return true;
              board[i][col] = 0;
              addStep(4, `Removing queen from row ${i}, column ${col}`, board);
            }
          }
          return false;
        };

        const board = Array.from({ length: n }, () => Array(n).fill(0));
        solve(board, 0);
        return board;
      };

      addStep(1, 'Line 1: Define the function to solve the N-Queens problem.', []);
      solveNQueens(n);
      addStep(9, 'Line 9: The user enters the value of N.', []);
      addStep(10, 'Line 10: The solveNQueens function is called, and the board is updated step by step.', []);
      addStep(11, 'Line 11: The final board configuration is displayed to the user.', []);
    } else if (language === 'cpp') {
      const solveNQueens = (n) => {
        const isSafe = (board, row, col) => {
          for (let i = 0; i < col; i++)
            if (board[row][i] === 1)
              return false;
          for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] === 1)
              return false;
          for (let i = row, j = col; j >= 0 && i < n; i++, j--)
            if (board[i][j] === 1)
              return false;
          return true;
        };

        const solve = (board, col) => {
          if (col >= n) return true;
          for (let i = 0; i < n; i++) {
            if (isSafe(board, i, col)) {
              board[i][col] = 1;
              addStep(4, `Placing queen at row ${i}, column ${col}`, board);
              if (solve(board, col + 1)) return true;
              board[i][col] = 0;
              addStep(4, `Removing queen from row ${i}, column ${col}`, board);
            }
          }
          return false;
        };

        const board = Array.from({ length: n }, () => Array(n).fill(0));
        solve(board, 0);
        return board;
      };

      addStep(1, 'Line 1: Define the function to solve the N-Queens problem.', []);
      solveNQueens(n);
      addStep(9, 'Line 9: The user enters the value of N.', []);
      addStep(10, 'Line 10: The solveNQueens function is called, and the board is updated step by step.', []);
      addStep(11, 'Line 11: The final board configuration is displayed to the user.', []);
    } else if (language === 'java') {
      const solveNQueens = (n) => {
        const isSafe = (board, row, col) => {
          for (let i = 0; i < col; i++)
            if (board[row][i] === 1)
              return false;
          for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] === 1)
              return false;
          for (let i = row, j = col; j >= 0 && i < n; i++, j--)
            if (board[i][j] === 1)
              return false;
          return true;
        };

        const solve = (board, col) => {
          if (col >= n) return true;
          for (let i = 0; i < n; i++) {
            if (isSafe(board, i, col)) {
              board[i][col] = 1;
              addStep(4, `Placing queen at row ${i}, column ${col}`, board);
              if (solve(board, col + 1)) return true;
              board[i][col] = 0;
              addStep(4, `Removing queen from row ${i}, column ${col}`, board);
            }
          }
          return false;
        };

        const board = Array.from({ length: n }, () => Array(n).fill(0));
        solve(board, 0);
        return board;
      };

      addStep(1, 'Line 1: Define the function to solve the N-Queens problem.', []);
      solveNQueens(n);
      addStep(9, 'Line 9: The user enters the value of N.', []);
      addStep(10, 'Line 10: The solveNQueens function is called, and the board is updated step by step.', []);
      addStep(11, 'Line 11: The final board configuration is displayed to the user.', []);
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setIsSolving(false);
    setStepIndex(0);
    // Do not start the animation automatically
  };

  const handleAnimate = (index) => {
    if (!steps || steps.length === 0 || index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentBoard = steps[index];
    if (!currentBoard) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellSize = canvas.width / n;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863';
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        if (currentBoard[i][j] === 1) {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(j * cellSize + cellSize / 2, i * cellSize + cellSize / 2, cellSize / 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

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

  const resetState = () => {
    setStepIndex(0);
    setSteps([]);
    setHighlightLines([]);
    setStepDescriptions([]);
    setDecorations([]);
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
  <h1 className="text-3xl font-bold text-center text-red-600">N-QUEEN VISUALIZATION</h1>
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
      value={algorithms[language]}
      options={{ readOnly: true, theme: 'vs-dark' }}
      onMount={(editor, monaco) => {
        setEditorInstance({ editor, monaco });
      }}
    />
  </div>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
      <div style={{ width: '24%', textAlign: 'center' }}>
        <Typography variant="body1">N:</Typography>
        <Slider
          value={n}
          onChange={handleNChange}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          step={null}
          marks={[
            { value: 4, label: '4' },
            { value: 6, label: '6' },
            { value: 8, label: '8' },
          ]}
          min={4}
          max={8}
        />
      </div>
      <Button variant="contained" onClick={handleStepBackward} disabled={stepIndex === 0} style={{ width: '24%' }}>
        Step Backward
      </Button>
      <Button variant="contained" onClick={handleStepForward} disabled={stepIndex >= steps.length - 1} style={{ width: '24%' }}>
        Step Forward
      </Button>
    </div>
    <canvas ref={canvasRef} width="300" height="300" style={{ background: '#f0f0f0', border: '1px solid black' }}></canvas>
    <div style={{ marginTop: '10px', padding: '10px', borderTop: '1px solid #ddd', height: '30vh', overflowY: 'scroll', width: '100%' }}>
      <h3 className='font-bold'>Code Execution Steps:</h3>
      <ol>
        {stepDescriptions.map((description, index) => (
          <li
            key={index}
            ref={el => stepRefs.current[index] = el} 
            style={{ marginBottom: '5px', backgroundColor: index === stepIndex ? 'yellow' : 'transparent' }}
          >
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

export default NQueenVisualizer;