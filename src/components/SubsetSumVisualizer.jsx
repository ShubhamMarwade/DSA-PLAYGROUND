import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Subset Sum Problem Algorithm in Python
def subset_sum(arr, target):
    result = []
    def backtrack(start, path, target):
        if target == 0:
            result.append(path)
            return
        if target < 0:
            return
        for i in range(start, len(arr)):
            backtrack(i + 1, path + [arr[i]], target - arr[i])
    backtrack(0, [], target)
    return result

arr = [3, 34, 4, 12, 5, 2]
target = 9
print(subset_sum(arr, target))
`,

  javascript: `
// Subset Sum Problem Algorithm in JavaScript
function subsetSum(arr, target) {
  const result = [];
  function backtrack(start, path, target) {
    if (target === 0) {
      result.push([...path]);
      return;
    }
    if (target < 0) return;
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      backtrack(i + 1, path, target - arr[i]);
      path.pop();
    }
  }
  backtrack(0, [], target);
  return result;
}

const arr = [3, 34, 4, 12, 5, 2];
const target = 9;
console.log(subsetSum(arr, target));
`,

  java: `
// Subset Sum Problem Algorithm in Java
import java.util.ArrayList;
import java.util.List;

public class SubsetSum {
    public static List<List<Integer>> subsetSum(int[] arr, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(arr, target, 0, new ArrayList<>(), result);
        return result;
    }

    private static void backtrack(int[] arr, int target, int start, List<Integer> path, List<List<Integer>> result) {
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        if (target < 0) {
            return;
        }
        for (int i = start; i < arr.length; i++) {
            path.add(arr[i]);
            backtrack(arr, target - arr[i], i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        int[] arr = {3, 34, 4, 12, 5, 2};
        int target = 9;
        List<List<Integer>> subsets = subsetSum(arr, target);
        System.out.println(subsets);
    }
}
`,

  c: `
// Subset Sum Problem Algorithm in C
#include <stdio.h>
#include <stdlib.h>

void subsetSum(int* arr, int n, int target, int* path, int pathIndex, int start, int** result, int* resultSize, int* columnSizes) {
    if (target == 0) {
        result[*resultSize] = (int*)malloc(pathIndex * sizeof(int));
        for (int i = 0; i < pathIndex; i++) {
            result[*resultSize][i] = path[i];
        }
        columnSizes[*resultSize] = pathIndex;
        (*resultSize)++;
        return;
    }
    if (target < 0) {
        return;
    }
    for (int i = start; i < n; i++) {
        path[pathIndex] = arr[i];
        subsetSum(arr, n, target - arr[i], path, pathIndex + 1, i + 1, result, resultSize, columnSizes);
    }
}

int main() {
    int arr[] = {3, 34, 4, 12, 5, 2};
    int target = 9;
    int n = sizeof(arr) / sizeof(arr[0]);
    int* path = (int*)malloc(n * sizeof(int));
    int** result = (int**)malloc(100 * sizeof(int*));
    int resultSize = 0;
    int* columnSizes = (int*)malloc(100 * sizeof(int));
    subsetSum(arr, n, target, path, 0, 0, result, &resultSize, columnSizes);

    for (int i = 0; i < resultSize; i++) {
        for (int j = 0; j < columnSizes[i]; j++) {
            printf("%d ", result[i][j]);
        }
        printf("\\n");
        free(result[i]);
    }
    free(path);
    free(result);
    free(columnSizes);
    return 0;
}
`,

  cpp: `
// Subset Sum Problem Algorithm in C++
#include <iostream>
#include <vector>

void subsetSum(std::vector<int>& arr, int target, int start, std::vector<int>& path, std::vector<std::vector<int>>& result) {
    if (target == 0) {
        result.push_back(path);
        return;
    }
    if (target < 0) return;
    for (int i = start; i < arr.size(); i++) {
        path.push_back(arr[i]);
        subsetSum(arr, target - arr[i], i + 1, path, result);
        path.pop_back();
    }
}

int main() {
    std::vector<int> arr = {3, 34, 4, 12, 5, 2};
    int target = 9;
    std::vector<std::vector<int>> result;
    std::vector<int> path;
    subsetSum(arr, target, 0, path, result);

    for (const auto& subset : result) {
        for (int num : subset) {
            std::cout << num << " ";
        }
        std::cout << std::endl;
    }

    return 0;
}
`
};

const SubsetSumVisualizer = () => {
  const [set, setSet] = useState([]);
  const [target, setTarget] = useState('');
  const [language, setLanguage] = useState('python');
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [result, setResult] = useState('');
  const svgContainerRef = useRef(null);

  const handleSetChange = (event) => {
    const value = event.target.value.split(',').map(Number);
    setSet(value);
  };

  const handleTargetChange = (event) => {
    setTarget(parseInt(event.target.value, 10));
  };

  const subsetSum = (arr, target) => {
    const result = [];
    const backtrack = (start, path, target) => {
      if (target === 0) {
        result.push([...path]);
        return;
      }
      if (target < 0) return;
      for (let i = start; i < arr.length; i++) {
        path.push(arr[i]);
        backtrack(i + 1, path, target - arr[i]);
        path.pop();
      }
    };
    backtrack(0, [], target);
    return result;
  };

  const handleSolve = () => {
    const solution = subsetSum(set, target);
    if (solution.length > 0) {
      drawSubsets(solution);
      setResult(`Found ${solution.length} subsets that sum to ${target}`);
    } else {
      setResult('No subsets found.');
    }
  };

  const drawSubsets = (solution) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    d3.select(svgContainer).selectAll('*').remove();

    const svgWidth = 200;
    const svgHeight = 200;
    const cellSize = 40;

    const svg = d3.select(svgContainer).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('margin-top', '20px');

    const subsets = svg.selectAll('.subset')
      .data(solution)
      .enter().append('g')
      .attr('class', 'subset')
      .attr('transform', (d, i) => `translate(0, ${i * cellSize * 1.5})`);

    subsets.selectAll('.cell')
      .data(d => d)
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => i * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', 'lightblue') // Removed stroke to remove the black outline
      .attr('stroke', 'black');

    subsets.selectAll('.number')
      .data(d => d)
      .enter().append('text')
      .attr('class', 'number')
      .attr('x', (d, i) => i * cellSize + cellSize / 2)
      .attr('y', cellSize / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text(d => d);
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
            Welcome to the Subset Sum Problem Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the set of numbers (comma separated) and target sum in the input fields.</li>
            <li>Click "Solve" to find the subsets that sum to the target value.</li>
            <li>The subsets will be displayed on the screen.</li>
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
          <h1 className="text-3xl font-bold text-center text-red-600">SUBSET SUM PROBLEM</h1>
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
            label="Set (comma separated)"
            onChange={handleSetChange}
            style={{ width: '90%', marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            label="Target Sum"
            onChange={handleTargetChange}
            style={{ width: '90%', marginBottom: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleSolve} style={{ width: '50%', marginTop: '20px' }}>
            Solve
          </Button>
          {result && (
            <Typography color="primary" variant="body1" style={{ marginTop: '10px' }}>
              {result}
            </Typography>
          )}
          <div ref={svgContainerRef} style={{ width: '200px', height: '200px', marginTop: '20px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SubsetSumVisualizer;