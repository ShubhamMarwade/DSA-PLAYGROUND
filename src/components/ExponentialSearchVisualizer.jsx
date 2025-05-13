import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def binary_search(arr, low, high, key):
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == key:
            return mid
        elif arr[mid] < key:
            low = mid + 1
        else:
            high = mid - 1
    return -1

def exponential_search(arr, n, key):
    if arr[0] == key:
        return 0
    i = 1
    while i < n and arr[i] <= key:
        i = i * 2
    return binary_search(arr, i // 2, min(i, n-1), key)

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the sorted elements: ").split()))
key = int(input("Enter the key to search: "))
result = exponential_search(arr, n, key)
if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")`,
  c:
`#include <stdio.h>

int binarySearch(int arr[], int low, int high, int key) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

int exponentialSearch(int arr[], int n, int key) {
    if (arr[0] == key)
        return 0;
    int i = 1;
    while (i < n && arr[i] <= key)
        i = i * 2;
    return binarySearch(arr, i / 2, (i < n ? i : n - 1), key);
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
    int result = exponentialSearch(arr, n, key);
    if (result != -1)
        printf("Element found at index: %d\\n", result);
    else
        printf("Element not found\\n");
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

int binarySearch(int arr[], int low, int high, int key) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

int exponentialSearch(int arr[], int n, int key) {
    if (arr[0] == key)
        return 0;
    int i = 1;
    while (i < n && arr[i] <= key)
        i = i * 2;
    return binarySearch(arr, i / 2, min(i, n - 1), key);
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
    int result = exponentialSearch(arr, n, key);
    if (result != -1)
        cout << "Element found at index: " << result << endl;
    else
        cout << "Element not found" << endl;
    return 0;
}`,
  java:
`import java.util.Scanner;

public class ExponentialSearch {
    public static int binarySearch(int arr[], int low, int high, int key) {
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == key)
                return mid;
            else if (arr[mid] < key)
                low = mid + 1;
            else
                high = mid - 1;
        }
        return -1;
    }

    public static int exponentialSearch(int arr[], int n, int key) {
        if (arr[0] == key)
            return 0;
        int i = 1;
        while (i < n && arr[i] <= key)
            i = i * 2;
        return binarySearch(arr, i / 2, Math.min(i, n - 1), key);
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
        int result = exponentialSearch(arr, n, key);
        if (result != -1)
            System.out.println("Element found at index: " + result);
        else
            System.out.println("Element not found");
    }
}`
};

const ExponentialSearchVisualizer = () => {
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
  const [currentLow, setCurrentLow] = useState(null);
  const [currentHigh, setCurrentHigh] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
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

    const addStep = (line, description, arrState, low, high, pos) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push([...arrState]);
      setCurrentLow(low);
      setCurrentHigh(high);
      setCurrentPos(pos);
    };

    // Generate the steps for visualization
    if (language === 'python') {
      addStep(1, 'Line 1: Define the binary_search function.', arr, null, null, null);
      addStep(2, 'Line 2: Define the exponential_search function.', arr, null, null, null);
      if (arr[0] === searchKey) {
        addStep(3, `Line 3: Element found at index 0.`, arr, null, null, 0);
      } else {
        let i = 1;
        while (i < n && arr[i] <= searchKey) {
          addStep(4, `Line 4: Exponential search index: i = ${i}.`, arr, null, null, i);
          i = i * 2;
        }
        addStep(5, `Line 5: Perform binary search in range [${Math.floor(i / 2)}, ${Math.min(i, n - 1)}].`, arr, Math.floor(i / 2), Math.min(i, n - 1), null);
        let low = Math.floor(i / 2);
        let high = Math.min(i, n - 1);
        while (low <= high) {
          let mid = low + Math.floor((high - low) / 2);
          addStep(6, `Line 6: Binary search mid index: mid = ${mid}.`, arr, low, high, mid);
          if (arr[mid] === searchKey) {
            addStep(7, `Line 7: Element found at index ${mid}.`, arr, low, high, mid);
            break;
          } else if (arr[mid] < searchKey) {
            low = mid + 1;
            addStep(8, `Line 8: Move to the right part (low = ${low}).`, arr, low, high, mid);
          } else {
            high = mid - 1;
            addStep(9, `Line 9: Move to the left part (high = ${high}).`, arr, low, high, mid);
          }
        }
        if (low > high) {
          addStep(10, 'Line 10: Element not found.', arr, null, null, null);
        }
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
    const barWidth = canvas.width / n;
    const maxHeight = canvas.height - 100;
    const maxArrayValue = Math.max(...currentArray);
    const barHeightFactor = maxHeight / maxArrayValue;

    // Draw the array bars
    for (let i = 0; i < currentArray.length; i++) {
      ctx.fillStyle = '#007bff';
      ctx.fillRect(i * barWidth, canvas.height - currentArray[i] * barHeightFactor, barWidth - 2, currentArray[i] * barHeightFactor);
      ctx.fillStyle = '#000';
      ctx.fillText(currentArray[i], i * barWidth + barWidth / 2 - 5, canvas.height - currentArray[i] * barHeightFactor - 10);
    }

    // Show the current low, high, and position values
    if (currentLow !== null && currentHigh !== null && currentPos !== null) {
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`low: ${currentLow}`, 10, canvas.height - 80);
      ctx.fillText(`high: ${currentHigh}`, 10, canvas.height - 60);
      ctx.fillText(`pos: ${currentPos}`, 10, canvas.height - 40);
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
          <h1 className="text-3xl font-bold text-center text-red-600">EXPONENTIAL SEARCH VISUALIZATION</h1>
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
                max={50}
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

export default ExponentialSearchVisualizer;