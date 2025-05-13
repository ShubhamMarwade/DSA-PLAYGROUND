import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [int(x) for x in input("Enter sorted array elements: ").split()]
target = int(input("Enter target element: "))
result = binary_search(arr, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`,
  c:
`#include <stdio.h>

int binarySearch(int arr[], int left, int right, int target) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)
            return mid;
        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1;
}

int main() {
    int n, target;
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    int arr[n];
    printf("Enter sorted array elements: ");
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    printf("Enter target element: ");
    scanf("%d", &target);
    int result = binarySearch(arr, 0, n - 1, target);
    if (result != -1)
        printf("Element found at index %d\\n", result);
    else
        printf("Element not found\\n");
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

int binarySearch(int arr[], int left, int right, int target) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)
            return mid;
        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1;
}

int main() {
    int n, target;
    cout << "Enter the number of elements: ";
    cin >> n;
    int arr[n];
    cout << "Enter sorted array elements: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    cout << "Enter target element: ";
    cin >> target;
    int result = binarySearch(arr, 0, n - 1, target);
    if (result != -1)
        cout << "Element found at index " << result << endl;
    else
        cout << "Element not found" << endl;
    return 0;
}`,
  java:
`import java.util.Scanner;

public class BinarySearch {
    public static int binarySearch(int arr[], int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target)
                return mid;
            if (arr[mid] < target)
                left = mid + 1;
            else
                right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number of elements: ");
        int n = sc.nextInt();
        int arr[] = new int[n];
        System.out.print("Enter sorted array elements: ");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.print("Enter target element: ");
        int target = sc.nextInt();
        int result = binarySearch(arr, target);
        if (result != -1)
            System.out.println("Element found at index " + result);
        else
            System.out.println("Element not found");
    }
}`
};

const BinarySearchVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [n, setN] = useState(8);
  const [isSearching, setIsSearching] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
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

  const handleTargetChange = (event) => {
    setTarget(event.target.value);
  };

  const handleNChange = (event, newValue) => {
    setN(newValue);
    setArray(Array(newValue).fill(''));
    setError('');
  };

  const handleVisualize = () => {
    if (isSearching || array.length !== n || array.includes('') || target === '') {
      setError(`Please enter exactly ${n} numbers and a target number before visualizing.`);
      return;
    }

    setIsSearching(true);
    const arr = [...array].map(Number); // Ensure the array elements are numbers
    const tgt = Number(target);
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];

    const addStep = (line, description, arrState, left, right, mid) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push({ arrState: [...arrState], left, right, mid });
    };

    // Generate the steps for visualization
    let left = 0;
    let right = arr.length - 1;
    addStep(1, 'Line 1: Define the binary_search function to search for a target in a sorted array.', arr, left, right, null);
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      addStep(2, `Line 2: Calculate the middle index (mid = ${mid}).`, arr, left, right, mid);
      addStep(3, `Line 3: Compare the target (${tgt}) with the middle element (arr[${mid}] = ${arr[mid]}).`, arr, left, right, mid);

      if (arr[mid] === tgt) {
        addStep(4, `Line 4: Target found at index ${mid}.`, arr, left, right, mid);
        break;
      } else if (arr[mid] < tgt) {
        addStep(5, `Line 5: Target is greater than the middle element, search in the right half (left = ${mid + 1}).`, arr, mid + 1, right, mid);
        left = mid + 1;
      } else {
        addStep(6, `Line 6: Target is smaller than the middle element, search in the left half (right = ${mid - 1}).`, arr, left, mid - 1, mid);
        right = mid - 1;
      }
    }

    if (left > right) {
      addStep(7, `Line 7: Target not found in the array.`, arr, left, right, null);
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

    const { arrState, left, right, mid } = steps[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elementWidth = canvas.width / n;
    const elementHeight = 40;

    for (let i = 0; i < arrState.length; i++) {
      ctx.fillStyle = '#007bff'; // Default color
      if (i === mid) {
        ctx.fillStyle = 'green'; // Middle element
      } else if (i >= left && i <= right) {
        ctx.fillStyle = 'skyblue'; // Current search space
      } else {
        ctx.fillStyle = 'red'; // Elements outside search space
      }
      ctx.fillRect(i * elementWidth, canvas.height / 2 - elementHeight / 2, elementWidth - 2, elementHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(arrState[i], i * elementWidth + elementWidth / 2 - 5, canvas.height / 2);
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
    setArray(Array(n).fill(''));
    setTarget('');
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
          <h1 className="text-3xl font-bold text-center text-red-600">BINARY SEARCH VISUALIZATION</h1>
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
                max={8}
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
              label="Target element"
              value={target}
              onChange={handleTargetChange}
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
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;