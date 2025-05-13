import React, { useState, useRef} from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def ternary_search(arr, low, high, key):
    if high < low:
        return -1
    mid1 = low + (high - low) // 3
    mid2 = high - (high - low) // 3
    if arr[mid1] == key:
        return mid1
    if arr[mid2] == key:
        return mid2
    if key < arr[mid1]:
        return ternary_search(arr, low, mid1 - 1, key)
    elif key > arr[mid2]:
        return ternary_search(arr, mid2 + 1, high, key)
    else:
        return ternary_search(arr, mid1 + 1, mid2 - 1, key)

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the sorted elements: ").split()))
key = int(input("Enter the key to search: "))
result = ternary_search(arr, 0, n - 1, key)
if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")`,
  c:
`#include <stdio.h>

int ternarySearch(int arr[], int low, int high, int key) {
    if (high < low)
        return -1;
    int mid1 = low + (high - low) / 3;
    int mid2 = high - (high - low) / 3;
    if (arr[mid1] == key)
        return mid1;
    if (arr[mid2] == key)
        return mid2;
    if (key < arr[mid1])
        return ternarySearch(arr, low, mid1 - 1, key);
    else if (key > arr[mid2])
        return ternarySearch(arr, mid2 + 1, high, key);
    else
        return ternarySearch(arr, mid1 + 1, mid2 - 1, key);
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
    int result = ternarySearch(arr, 0, n - 1, key);
    if (result != -1)
        printf("Element found at index: %d\\n", result);
    else
        printf("Element not found\\n");
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

int ternarySearch(int arr[], int low, int high, int key) {
    if (high < low)
        return -1;
    int mid1 = low + (high - low) / 3;
    int mid2 = high - (high - low) / 3;
    if (arr[mid1] == key)
        return mid1;
    if (arr[mid2] == key)
        return mid2;
    if (key < arr[mid1])
        return ternarySearch(arr, low, mid1 - 1, key);
    else if (key > arr[mid2])
        return ternarySearch(arr, mid2 + 1, high, key);
    else
        return ternarySearch(arr, mid1 + 1, mid2 - 1, key);
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
    int result = ternarySearch(arr, 0, n - 1, key);
    if (result != -1)
        cout << "Element found at index: " << result << endl;
    else
        cout << "Element not found" << endl;
    return 0;
}`,
  java:
`import java.util.Scanner;

public class TernarySearch {
    public static int ternarySearch(int arr[], int low, int high, int key) {
        if (high < low)
            return -1;
        int mid1 = low + (high - low) / 3;
        int mid2 = high - (high - low) / 3;
        if (arr[mid1] == key)
            return mid1;
        if (arr[mid2] == key)
            return mid2;
        if (key < arr[mid1])
            return ternarySearch(arr, low, mid1 - 1, key);
        else if (key > arr[mid2])
            return ternarySearch(arr, mid2 + 1, high, key);
        else
            return ternarySearch(arr, mid1 + 1, mid2 - 1, key);
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
        int result = ternarySearch(arr, 0, n - 1, key);
        if (result != -1)
            System.out.println("Element found at index: " + result);
        else
            System.out.println("Element not found");
    }
}`
};

const TernarySearchVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [array, setArray] = useState([]);
  const [n, setN] = useState(8);
  const [key, setKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const [mid1, setMid1] = useState(null);
  const [mid2, setMid2] = useState(null);
  const [currentLow, setCurrentLow] = useState(null);
  const [currentHigh, setCurrentHigh] = useState(null);
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

    const addStep = (line, description, arrState, mid1, mid2, low, high) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push([...arrState]);
      setMid1(mid1);
      setMid2(mid2);
      setCurrentLow(low);
      setCurrentHigh(high);
    };

    // Generate the steps for visualization
    if (language === 'python') {
      addStep(1, 'Line 1: Define the ternary_search function.', arr, null, null, 0, n - 1);
      addStep(2, `Line 2: Initialize low and high indices (low = 0, high = ${n - 1}).`, arr, null, null, 0, n - 1);
      let low = 0;
      let high = n - 1;
      while (high >= low) {
        let mid1 = low + Math.floor((high - low) / 3);
        let mid2 = high - Math.floor((high - low) / 3);
        addStep(3, `Line 3: Calculate the midpoints using the ternary search formula: mid1 = ${mid1}, mid2 = ${mid2}.`, arr, mid1, mid2, low, high);
        if (arr[mid1] === searchKey) {
          addStep(4, `Line 4: Element found at index ${mid1}.`, arr, mid1, mid2, low, high);
          break;
        }
        if (arr[mid2] === searchKey) {
          addStep(5, `Line 5: Element found at index ${mid2}.`, arr, mid1, mid2, low, high);
          break;
        }
        if (searchKey < arr[mid1]) {
          high = mid1 - 1;
          addStep(6, `Line 6: Move to the left part (high = ${high}).`, arr, mid1, mid2, low, high);
        } else if (searchKey > arr[mid2]) {
          low = mid2 + 1;
          addStep(7, `Line 7: Move to the right part (low = ${low}).`, arr, mid1, mid2, low, high);
        } else {
          low = mid1 + 1;
          high = mid2 - 1;
          addStep(8, `Line 8: Search in the middle part (low = ${low}, high = ${high}).`, arr, mid1, mid2, low, high);
        }
      }
      if (low > high) {
        addStep(9, 'Line 9: Element not found.', arr, null, null, low, high);
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
      ctx.fillStyle = i === mid1 || i === mid2 ? '#ffeb3b' : '#007bff';
      if (i === mid1 && mid1 === stepDescriptions[index].split(' ')[stepDescriptions[index].split(' ').length - 1]) {
          ctx.fillStyle = 'green';
      } else if (i === mid2 && mid2 === stepDescriptions[index].split(' ')[stepDescriptions[index].split(' ').length - 1]) {
          ctx.fillStyle = 'green';
      }
      ctx.fillRect(i * barWidth, canvas.height - currentArray[i] * barHeightFactor, barWidth - 2, currentArray[i] * barHeightFactor);
      ctx.fillStyle = '#000';
      ctx.fillText(currentArray[i], i * barWidth + barWidth / 2 - 5, canvas.height - currentArray[i] * barHeightFactor - 10);
    }

    // Show the current low, high, mid1, and mid2 values
    if (currentLow !== null && currentHigh !== null && mid1 !== null && mid2 !== null) {
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`low: ${currentLow}`, 10, canvas.height - 80);
      ctx.fillText(`high: ${currentHigh}`, 10, canvas.height - 60);
      ctx.fillText(`mid1: ${mid1}`, 10, canvas.height - 40);
      ctx.fillText(`mid2: ${mid2}`, 10, canvas.height - 20);
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
          <h1 className="text-3xl font-bold text-center text-red-600">TERNARY SEARCH VISUALIZATION</h1>
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

export default TernarySearchVisualizer;