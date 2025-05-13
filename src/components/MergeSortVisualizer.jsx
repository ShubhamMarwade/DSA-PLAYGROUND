import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the elements: ").split()))
merge_sort(arr)
print("Sorted array is:", arr)`,
  c:
`#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;

    int L[n1], R[n2];

    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

    i = 0;
    j = 0;
    k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;

        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);

        merge(arr, l, m, r);
    }
}

int main() {
    int n;
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    int arr[n];
    printf("Enter the elements: ");
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    mergeSort(arr, 0, n - 1);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;

    int L[n1], R[n2];

    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

    i = 0;
    j = 0;
    k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;

        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);

        merge(arr, l, m, r);
    }
}

int main() {
    int n;
    cout << "Enter the number of elements: ";
    cin >> n;
    int arr[n];
    cout << "Enter the elements: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    mergeSort(arr, 0, n - 1);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}`,
  java:
`import java.util.Scanner;

public class MergeSort {
    public static void merge(int arr[], int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;

        int L[] = new int[n1];
        int R[] = new int[n2];

        for (int i = 0; i < n1; ++i)
            L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j)
            R[j] = arr[m + 1 + j];

        int i = 0, j = 0;

        int k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    public static void mergeSort(int arr[], int l, int r) {
        if (l < r) {
            int m = (l + r) / 2;

            mergeSort(arr, l, m);
            mergeSort(arr, m + 1, r);

            merge(arr, l, m, r);
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
        mergeSort(arr, 0, arr.length - 1);
        System.out.println("Sorted array: ");
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}`
};

const mergeSortDescriptions = {
  python: [
    'Define the merge_sort function to sort an array (arr).',
    'Check if the length of the array is greater than 1.',
    'Calculate the midpoint of the array.',
    'Divide the array into two halves, L and R.',
    'Recursively sort the left half (L).',
    'Recursively sort the right half (R).',
    'Initialize indices for merging.',
    'Merge elements from L and R back into the original array.',
    'If elements remain in L, add them to the original array.',
    'If elements remain in R, add them to the original array.',
    'Prompt the user to enter the number of elements.',
    'Prompt the user to enter the elements of the array.',
    'Sort the array using merge_sort.',
    'Print the sorted array.'
  ],
  c: [
    'Include the necessary header files.',
    'Define the merge function to merge two subarrays.',
    'Calculate sizes of the two subarrays to be merged.',
    'Create temporary arrays L and R.',
    'Copy data to temporary arrays L and R.',
    'Merge the temporary arrays back into the original array.',
    'Copy remaining elements of L, if any.',
    'Copy remaining elements of R, if any.',
    'Define the mergeSort function to sort an array.',
    'Calculate the midpoint of the array.',
    'Recursively sort the left half.',
    'Recursively sort the right half.',
    'Merge the sorted halves.',
    'Start of the main function.',
    'Prompt the user to enter the number of elements.',
    'Get the input for the number of elements.',
    'Declare an array to hold the elements.',
    'Prompt the user to enter the elements.',
    'Get input for each element.',
    'Sort the array using mergeSort.',
    'Print the sorted array.'
  ],
  cpp: [
    'Include necessary header files.',
    'Define the merge function to merge two subarrays.',
    'Calculate sizes of the two subarrays to be merged.',
    'Create temporary arrays L and R.',
    'Copy data to temporary arrays L and R.',
    'Merge the temporary arrays back into the original array.',
    'Copy remaining elements of L, if any.',
    'Copy remaining elements of R, if any.',
    'Define the mergeSort function to sort an array.',
    'Calculate the midpoint of the array.',
    'Recursively sort the left half.',
    'Recursively sort the right half.',
    'Merge the sorted halves.',
    'Start of the main function.',
    'Prompt the user to enter the number of elements.',
    'Get the input for the number of elements.',
    'Declare an array to hold the elements.',
    'Prompt the user to enter the elements.',
    'Get input for each element.',
    'Sort the array using mergeSort.',
    'Print the sorted array.'
  ],
  java: [
    'Define the merge function to merge two subarrays.',
    'Calculate sizes of the two subarrays to be merged.',
    'Create temporary arrays L and R.',
    'Copy data to temporary arrays L and R.',
    'Merge the temporary arrays back into the original array.',
    'Copy remaining elements of L, if any.',
    'Copy remaining elements of R, if any.',
    'Define the mergeSort function to sort an array.',
    'Calculate the midpoint of the array.',
    'Recursively sort the left half.',
    'Recursively sort the right half.',
    'Merge the sorted halves.',
    'Start of the main function.',
    'Create a scanner object for user input.',
    'Prompt the user to enter the number of elements.',
    'Get the input for the number of elements.',
    'Declare an array to hold the elements.',
    'Prompt the user to enter the elements.',
    'Get input for each element.',
    'Sort the array using mergeSort.',
    'Print the sorted array.'
  ]
};

const MergeSortVisualizer = () => {
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

    const mergeSort = (arr, l, r, depth = 0) => {
      if (l < r) {
        const m = Math.floor((l + r) / 2);

        mergeSort(arr, l, m, depth + 1);
        mergeSort(arr, m + 1, r, depth + 1);

        const L = arr.slice(l, m + 1);
        const R = arr.slice(m + 1, r + 1);

        let i = 0, j = 0, k = l;
        while (i < L.length && j < R.length) {
          if (L[i] < R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }
          k++;
        }

        while (i < L.length) {
          arr[k] = L[i];
          i++;
          k++;
        }

        while (j < R.length) {
          arr[k] = R[j];
          j++;
          k++;
        }

        addStep(depth, `Merge step at depth ${depth}: ${arr.slice(l, r + 1)}`, arr, [i, j]);
      }
    };

    addStep(1, mergeSortDescriptions[language][0], arr);
    mergeSort(arr, 0, arr.length - 1);
    addStep(9, mergeSortDescriptions[language][9], arr);
    addStep(10, mergeSortDescriptions[language][10], arr);
    addStep(11, mergeSortDescriptions[language][11], arr);
    addStep(12, mergeSortDescriptions[language][12], arr);

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setSwapIndices(newSwapIndices);
    setIsSorting(false);
    setStepIndex(0);
    // Do not start the animation automatically
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headlen = 10; // length of head in pixels
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentArray = steps[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawArray = (arr, x, y, level, widthFactor) => {
      const barWidth = 30;
      const spacing = 10;
      const totalWidth = arr.length * (barWidth + spacing) - spacing;
      const startX = x - totalWidth / 2;

      for (let i = 0; i < arr.length; i++) {
        const isSwapping = swapIndices[index] && swapIndices[index].includes(i);
        ctx.fillStyle = isSwapping ? 'red' : '#007bff';
        ctx.fillRect(startX + i * (barWidth + spacing), y, barWidth, 30);
        ctx.fillStyle = '#000';
        ctx.fillText(arr[i], startX + i * (barWidth + spacing) + barWidth / 2 - 5, y + 20);
      }

      if (level > 0) {
        const mid = Math.floor(arr.length / 2);
        const leftX = x - widthFactor / 2;
        const rightX = x + widthFactor / 2;
        const newY = y + 60;

        ctx.strokeStyle = '#000';
        ctx.beginPath();
        drawArrow(ctx, x, y + 30, leftX, newY);
        drawArrow(ctx, x, y + 30, rightX, newY);
        ctx.stroke();

        drawArray(arr.slice(0, mid), leftX, newY, level - 1, widthFactor / 2);
        drawArray(arr.slice(mid), rightX, newY, level - 1, widthFactor / 2);
      }
    };

    drawArray(currentArray, canvas.width / 2, 20, steps.length - index - 1, canvas.width / 2);

    if (stepDescriptions[index]) {
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText(stepDescriptions[index], 10, 20);
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

useEffect(() => {
  if (steps.length > 0) {
    handleAnimate(stepIndex);
  }
}, [steps]);

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
        <h1 className="text-3xl font-bold text-center text-red-600">MERGE SORT VISUALIZATION</h1>
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

export default MergeSortVisualizer;