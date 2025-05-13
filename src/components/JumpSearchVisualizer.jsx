import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`import math

def jump_search(arr, n, key):
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < key:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    while arr[prev] < key:
        prev += 1
        if prev == min(step, n):
            return -1
    if arr[prev] == key:
        return prev
    return -1

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the sorted elements: ").split()))
key = int(input("Enter the key to search: "))
result = jump_search(arr, n, key)
if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")`,
  c:
`#include <stdio.h>
#include <math.h>

int jumpSearch(int arr[], int n, int key) {
    int step = sqrt(n);
    int prev = 0;
    while (arr[fmin(step, n) - 1] < key) {
        prev = step;
        step += sqrt(n);
        if (prev >= n)
            return -1;
    }
    while (arr[prev] < key) {
        prev++;
        if (prev == fmin(step, n))
            return -1;
    }
    if (arr[prev] == key)
        return prev;
    return -1;
}

int main() {
    int n, key;
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    int arr[n];
    printf("Enter the sorted elements: ");
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    printf("Enter the key to search: ");
    scanf("%d", &key);
    int result = jumpSearch(arr, n, key);
    if (result != -1)
        printf("Element found at index: %d\\n", result);
    else
        printf("Element not found\\n");
    return 0;
}`,
  cpp:
`#include <iostream>
#include <cmath>
using namespace std;

int jumpSearch(int arr[], int n, int key) {
    int step = sqrt(n);
    int prev = 0;
    while (arr[min(step, n) - 1] < key) {
        prev = step;
        step += sqrt(n);
        if (prev >= n)
            return -1;
    }
    while (arr[prev] < key) {
        prev++;
        if (prev == min(step, n))
            return -1;
    }
    if (arr[prev] == key)
        return prev;
    return -1;
}

int main() {
    int n, key;
    cout << "Enter the number of elements: ";
    cin >> n;
    int arr[n];
    cout << "Enter the sorted elements: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    cout << "Enter the key to search: ";
    cin >> key;
    int result = jumpSearch(arr, n, key);
    if (result != -1)
        cout << "Element found at index: " << result << endl;
    else
        cout << "Element not found" << endl;
    return 0;
}`,
  java:
`import java.util.Scanner;

public class JumpSearch {
    public static int jumpSearch(int arr[], int n, int key) {
        int step = (int)Math.sqrt(n);
        int prev = 0;
        while (arr[Math.min(step, n) - 1] < key) {
            prev = step;
            step += (int)Math.sqrt(n);
            if (prev >= n)
                return -1;
        }
        while (arr[prev] < key) {
            prev++;
            if (prev == Math.min(step, n))
                return -1;
        }
        if (arr[prev] == key)
            return prev;
        return -1;
    }

    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number of elements: ");
        int n = sc.nextInt();
        int arr[] = new int[n];
        System.out.print("Enter the sorted elements: ");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.print("Enter the key to search: ");
        int key = sc.nextInt();
        int result = jumpSearch(arr, n, key);
        if (result != -1)
            System.out.println("Element found at index: " + result);
        else
            System.out.println("Element not found");
    }
}`
};

const JumpSearchVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [array, setArray] = useState([]);
  const [n, setN] = useState(10);
  const [key, setKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [currentPrev, setCurrentPrev] = useState(null);
  const [currentStepSize, setCurrentStepSize] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [error, setError] = useState('');
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    resetState();
  };

  const handleArrayChange = (event) => {
    const newArray = event.target.value.split(',').map(num => num.trim());
    if (newArray.length === n && newArray.every(num => !isNaN(num))) {
      setArray(newArray);
      setError('');
    } else {
      setError(`Please enter exactly ${n} numbers, separated by commas.`);
    }
  };

  const handleNChange = (event, newValue) => {
    setN(newValue);
    setArray(Array(newValue).fill(''));
    setError('');
  };

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const handleVisualize = () => {
    if (isSearching || array.length !== n || array.includes('') || key === '') {
      setError(`Please enter exactly ${n} numbers and a key to search before visualizing.`);
      return;
    }

    setIsSearching(true);
    const arr = [...array].map(Number); // Ensure the array elements are numbers
    const searchKey = Number(key);
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, arrState, stepSize, prev, index) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push([...arrState]);
      setCurrentStep(stepSize);
      setCurrentPrev(prev);
      setCurrentIndex(index);
    };

    // Generate the steps for visualization
    if (language === 'python') {
      addStep(1, 'Line 1: Import the math module.', arr, null, null, null);
      addStep(2, 'Line 2: Define the jump_search function.', arr, null, null, null);
      let step = Math.floor(Math.sqrt(n));
      let prev = 0;
      addStep(3, `Line 3: Initialize step size as the square root of the array length: step = ${step}.`, arr, step, prev, null);
      while (arr[Math.min(step, n) - 1] < searchKey) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) {
          addStep(4, `Line 4: Element not found in the array.`, arr, step, prev, null);
          break;
        }
        addStep(4, `Line 4: Update step size and previous index: step = ${step}, prev = ${prev}.`, arr, step, prev, null);
      }
      while (arr[prev] < searchKey) {
        prev++;
        if (prev === Math.min(step, n)) {
          addStep(5, `Line 5: Element not found in the array.`, arr, step, prev, null);
          break;
        }
        addStep(5, `Line 5: Increment previous index: prev = ${prev}.`, arr, step, prev, null);
      }
      if (arr[prev] === searchKey) {
        addStep(6, `Line 6: Element found at index ${prev}.`, arr, step, prev, prev);
      } else {
        addStep(7, 'Line 7: Element not found in the array.', arr, step, prev, null);
      }
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setIsSearching(false);
    setStepIndex(0);
    // Do not start the animation automatically
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentArray = steps[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elementWidth = canvas.width / n;
    const elementHeight = 50;
    const maxArrayValue = Math.max(...currentArray);
    const elementHeightFactor = elementHeight / maxArrayValue;

    // Draw the array elements
    for (let i = 0; i < currentArray.length; i++) {
      ctx.fillStyle = i === currentIndex ? '#ffeb3b' : '#007bff';
      ctx.fillRect(i * elementWidth, canvas.height / 2 - elementHeight / 2, elementWidth - 2, elementHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(currentArray[i], i * elementWidth + elementWidth / 2 - 5, canvas.height / 2);
    }

    // Show the current step, previous index, and current index values
    if (currentStep !== null && currentPrev !== null && currentIndex !== null) {
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`step: ${currentStep}`, 10, 20);
      ctx.fillText(`prev: ${currentPrev}`, 10, 40);
      ctx.fillText(`index: ${currentIndex}`, 10, 60);
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
    setCurrentStep(null);
    setCurrentPrev(null);
    setCurrentIndex(null);
    setArray(Array(n).fill(''));
    setError('');
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
          <h1 className="text-3xl font-bold text-center text-red-600">JUMP SEARCH VISUALIZATION</h1>
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
              <Typography variant="body1">Number of Elements (n):</Typography>
              <Slider
                value={n}
                onChange={handleNChange}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
            </div>
            <TextField
              variant="outlined"
              label="Array elements (comma separated)"
              value={array.join(',')}
              onChange={handleArrayChange}
              style={{ width: '24%' }}
            />
            <TextField
              variant="outlined"
              label="Key to search"
              value={key}
              onChange={handleKeyChange}
              style={{ width: '24%' }}
            />
            <Button variant="contained" onClick={handleStepBackward} disabled={stepIndex === 0} style={{ width: '24%' }}>
              Step Backward
            </Button>
            <Button variant="contained" onClick={handleStepForward} disabled={stepIndex >= steps.length - 1} style={{ width: '24%' }}>
              Step Forward
            </Button>
          </div>
          {error && (
            <Typography color="error" variant="body1" style={{ marginBottom: '10px' }}>
              {error}
            </Typography>
          )}
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
                //<li key={index} style={{ marginBottom: '5px' }}>{description}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpSearchVisualizer;