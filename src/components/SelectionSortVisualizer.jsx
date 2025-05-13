import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the elements: ").split()))
selection_sort(arr)
print("Sorted array is:", arr)`,
  c:
`#include <stdio.h>

void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}

void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(&arr[min_idx], &arr[i]);
    }
}

int main() {
    int n;
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    int arr[n];
    printf("Enter the elements: ");
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    selectionSort(arr, n);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}

void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(&arr[min_idx], &arr[i]);
    }
}

int main() {
    int n;
    cout << "Enter the number of elements: ";
    cin >> n;
    int arr[n];
    cout << "Enter the elements: ";
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    selectionSort(arr, n);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}`,
  java:
`import java.util.Scanner;

public class SelectionSort {
    public static void selectionSort(int arr[]) {
        for (int i = 0; i < arr.length - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                }
            }
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number of elements: ");
        int n = sc.nextInt();
        int arr[] = new int[n];
        System.out.print("Enter the elements: ");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        selectionSort(arr);
        System.out.println("Sorted array: ");
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}`
};

const SelectionSortVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const canvasRef = useRef(null);
  const [array, setArray] = useState([]);
  const [n, setN] = useState(8);
  const [isSorting, setIsSorting] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
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

  const handleVisualize = () => {
    if (isSorting || array.length !== n || array.includes('')) {
      setError(`Please enter exactly ${n} numbers before visualizing.`);
      return;
    }

    setIsSorting(true);
    const arr = [...array].map(Number); // Ensure the array elements are numbers
    const newSteps = [];
    const newHighlightLines = [];
    const newStepDescriptions = [];
    const newSwapIndices = [];

    const addStep = (line, description, arrState, swapIdx = []) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push([...arrState]);
      newSwapIndices.push([...swapIdx]);
    };

    // Generate the steps for visualization
    if (language === 'python') {
      addStep(1, 'Line 1: Define the selection_sort function to sort an array (arr).', arr);
      for (let i = 0; i < arr.length; i++) {
        addStep(2, `Line 2: Set min_idx to ${i}.`, arr);
        let min_idx = i;
        for (let j = i + 1; j < arr.length; j++) {
          addStep(3, `Line 3: Compare arr[${min_idx}] (${arr[min_idx]}) with arr[${j}] (${arr[j]}).`, arr, [min_idx, j]);
          if (arr[min_idx] > arr[j]) {
            min_idx = j;
            addStep(4, `Line 4: Update min_idx to ${j}.`, arr, [min_idx]);
          }
        }
        if (min_idx !== i) {
          [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
          addStep(5, `Line 5: Swap arr[${i}] (${arr[i]}) with arr[${min_idx}] (${arr[min_idx]}).`, arr, [i, min_idx]);
        }
      }
      addStep(6, 'Line 6: The user enters the number of elements (n) in the array.', arr);
      addStep(7, 'Line 7: The user enters the array elements, which are converted into integers and stored in a list.', arr);
      addStep(8, 'Line 8: The selection_sort function is called, and the array is sorted step by step.', arr);
      addStep(9, 'Line 9: The sorted array is displayed to the user.', arr);
    } else if (language === 'c') {
      addStep(1, 'Line 1: Define the swap function to swap two elements.', arr);
      addStep(2, `Line 2: Declare a temporary variable for swapping.`, arr);
      addStep(3, 'Line 3: Perform the swap operation.', arr);
      addStep(4, 'Line 4: Complete the swap operation.', arr);
      addStep(5, 'Line 5: Define the selectionSort function to sort an array.', arr);
      addStep(6, `Line 6: Declare variables for the loop indices and min_idx.`, arr);
      for (let i = 0; i < arr.length; i++) {
        addStep(7, `Line 7: Set min_idx to ${i}.`, arr);
        let min_idx = i;
        for (let j = i + 1; j < arr.length; j++) {
          addStep(8, `Line 8: Compare arr[${min_idx}] (${arr[min_idx]}) with arr[${j}] (${arr[j]}).`, arr, [min_idx, j]);
          if (arr[min_idx] > arr[j]) {
            min_idx = j;
            addStep(9, `Line 9: Update min_idx to ${j}.`, arr, [min_idx]);
          }
        }
        if (min_idx !== i) {
          [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
          addStep(10, `Line 10: Swap arr[${i}] (${arr[i]}) with arr[${min_idx}] (${arr[min_idx]}).`, arr, [i, min_idx]);
        }
      }
      addStep(11, 'Line 11: Define the main function.', arr);
      addStep(12, 'Line 12: Declare a variable for the number of elements.', arr);
      addStep(13, 'Line 13: Prompt the user to enter the number of elements.', arr);
      addStep(14, 'Line 14: Get the input for the number of elements.', arr);
      addStep(15, 'Line 15: Declare an array to hold the elements.', arr);
      addStep(16, 'Line 16: Prompt the user to enter the elements.', arr);
      addStep(17, `Line 17: Iterate to get the array elements.`, arr);
      addStep(18, 'Line 18: Get input for each element.', arr);
      addStep(19, 'Line 19: Call the selectionSort function to sort the array.', arr);
      addStep(20, 'Line 20: Print the sorted array.', arr);
      addStep(21, `Line 21: Iterate to print each sorted element.`, arr);
      addStep(22, 'Line 22: Print each sorted element.', arr);
      addStep(23, 'Line 23: End of the main function.', arr);
    } else if (language === 'cpp') {
      addStep(1, 'Line 1: Define the swap function to swap two elements.', arr);
      addStep(2, `Line 2: Declare a temporary variable for swapping.`, arr);
      addStep(3, 'Line 3: Perform the swap operation.', arr);
      addStep(4, 'Line 4: Complete the swap operation.', arr);
      addStep(5, 'Line 5: Define the selectionSort function to sort an array.', arr);
      addStep(6, `Line 6: Declare variables for the loop indices and min_idx.`, arr);
      for (let i = 0; i < arr.length; i++) {
        addStep(7, `Line 7: Set min_idx to ${i}.`, arr);
        let min_idx = i;
        for (let j = i + 1; j < arr.length; j++) {
          addStep(8, `Line 8: Compare arr[${min_idx}] (${arr[min_idx]}) with arr[${j}] (${arr[j]}).`, arr, [min_idx, j]);
          if (arr[min_idx] > arr[j]) {
            min_idx = j;
            addStep(9, `Line 9: Update min_idx to ${j}.`, arr, [min_idx]);
          }
        }
        if (min_idx !== i) {
          [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
          addStep(10, `Line 10: Swap arr[${i}] (${arr[i]}) with arr[${min_idx}] (${arr[min_idx]}).`, arr, [i, min_idx]);
        }
      }
      addStep(11, 'Line 11: Define the main function.', arr);
      addStep(12, 'Line 12: Declare a variable for the number of elements.', arr);
      addStep(13, 'Line 13: Prompt the user to enter the number of elements.', arr);
      addStep(14, 'Line 14: Get the input for the number of elements.', arr);
      addStep(15, 'Line 15: Declare an array to hold the elements.', arr);
      addStep(16, 'Line 16: Prompt the user to enter the elements.', arr);
      addStep(17, `Line 17: Iterate to get the array elements.`, arr);
      addStep(18, 'Line 18: Get input for each element.', arr);
      addStep(19, 'Line 19: Call the selectionSort function to sort the array.', arr);
      addStep(20, 'Line 20: Print the sorted array.', arr);
      addStep(21, `Line 21: Iterate to print each sorted element.`, arr);
      addStep(22, 'Line 22: Print each sorted element.', arr);
      addStep(23, 'Line 23: End of the main function.', arr);
    } else if (language === 'java') {
      addStep(1, 'Line 1: Define the selectionSort function to sort an array.', arr);
      for (let i = 0; i < arr.length; i++) {
        addStep(2, `Line 2: Set min_idx to ${i}.`, arr);
        let min_idx = i;
        for (let j = i + 1; j < arr.length; j++) {
          addStep(3, `Line 3: Compare arr[${min_idx}] (${arr[min_idx]}) with arr[${j}] (${arr[j]}).`, arr, [min_idx, j]);
          if (arr[min_idx] > arr[j]) {
            min_idx = j;
            addStep(4, `Line 4: Update min_idx to ${j}.`, arr, [min_idx]);
          }
        }
        if (min_idx !== i) {
          [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
          addStep(5, `Line 5: Swap arr[${i}] (${arr[i]}) with arr[${min_idx}] (${arr[min_idx]}).`, arr, [i, min_idx]);
        }
      }
      addStep(6, 'Line 6: Define the main function.', arr);
      addStep(7, 'Line 7: Create a scanner object for user input.', arr);
      addStep(8, 'Line 8: Prompt the user to enter the number of elements.', arr);
      addStep(9, 'Line 9: Get the input for the number of elements.', arr);
      addStep(10, 'Line 10: Declare an array to hold the elements.', arr);
      addStep(11, 'Line 11: Prompt the user to enter the elements.', arr);
      addStep(12, `Line 12: Iterate to get the array elements.`, arr);
      addStep(13, 'Line 13: Get input for each element.', arr);
      addStep(14, 'Line 14: Call the selectionSort function to sort the array.', arr);
      addStep(15, 'Line 15: Print the sorted array.', arr);
      addStep(16, `Line 16: Iterate to print each sorted element.`, arr);
      addStep(17, 'Line 17: Print each sorted element.', arr);
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setSwapIndices(newSwapIndices);
    setIsSorting(false);
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
    const maxHeight = canvas.height - 20;
    const maxArrayValue = Math.max(...currentArray);
    const barHeightFactor = maxHeight / maxArrayValue;

    for (let i = 0; i < currentArray.length; i++) {
      const isSwapping = swapIndices[index] && swapIndices[index].includes(i); 
      const isSorted = i < stepIndex;
      ctx.fillStyle = isSwapping ? 'red' : (isSorted ? 'green' : '#007bff');
      ctx.fillRect(i * barWidth, canvas.height - currentArray[i] * barHeightFactor, barWidth - 2, currentArray[i] * barHeightFactor);
      ctx.fillStyle = '#000';
      ctx.fillText(currentArray[i], i * barWidth + barWidth / 2 - 5, canvas.height - currentArray[i] * barHeightFactor - 10);
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
        setSwapIndices([]);
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
              <h1 className="text-3xl font-bold text-center text-red-600">SELECTION SORT VISUALIZATION</h1>
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
    
export default SelectionSortVisualizer;