import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def counting_sort(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
    for i in range(len(arr)):
        arr[i] = output[i]

def radix_sort(arr):
    max1 = max(arr)
    exp = 1
    while max1 // exp > 0:
        counting_sort(arr, exp)
        exp *= 10

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the elements: ").split()))
radix_sort(arr)
print("Sorted array is:", arr)`,
  c:
`#include <stdio.h>

int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

void countingSort(int arr[], int n, int exp) {
    int output[n];
    int i, count[10] = {0};
    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countingSort(arr, n, exp);
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
    radixSort(arr, n);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

void countingSort(int arr[], int n, int exp) {
    int output[n];
    int i, count[10] = {0};
    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countingSort(arr, n, exp);
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
    radixSort(arr, n);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}`,
  java:
`import java.util.Scanner;

public class RadixSort {
    public static int getMax(int arr[], int n) {
        int max = arr[0];
        for (int i = 1; i < n; i++)
            if (arr[i] > max)
                max = arr[i];
        return max;
    }

    public static void countingSort(int arr[], int n, int exp) {
        int output[] = new int[n];
        int count[] = new int[10];
        for (int i = 0; i < 10; i++)
            count[i] = 0;
        for (int i = 0; i < n; i++)
            count[(arr[i] / exp) % 10]++;
        for (int i = 1; i < 10; i++)
            count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }
        for (int i = 0; i < n; i++)
            arr[i] = output[i];
    }

    public static void radixSort(int arr[], int n) {
        int m = getMax(arr, n);
        for (int exp = 1; m / exp > 0; exp *= 10)
            countingSort(arr, n, exp);
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
        radixSort(arr, n);
        System.out.println("Sorted array: ");
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}`
};

const RadixSortVisualizer = () => {
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
  const [currentDigit, setCurrentDigit] = useState(1);
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

    const addStep = (line, description, arrState, digit) => {
      newHighlightLines.push(line);
      newStepDescriptions.push(description);
      newSteps.push([...arrState]);
      setCurrentDigit(digit);
    };

    // Generate the steps for visualization
    if (language === 'python') {
      addStep(1, 'Line 1: Define the counting_sort function to sort the array based on a specific digit.', arr, 1);
      addStep(2, `Line 2: Calculate the length of the array (n = ${arr.length}).`, arr, 1);
      addStep(3, 'Line 3: Initialize the output array and count array.', arr, 1);

      const maxNum = Math.max(...arr);
      let exp = 1;
      while (Math.floor(maxNum / exp) > 0) {
        addStep(4, `Line 4: Start sorting based on the digit at place value ${exp}.`, arr, exp);
        const output = new Array(arr.length).fill(0);
        const count = new Array(10).fill(0);

        // Store count of occurrences in count[]
        for (let i = 0; i < arr.length; i++) {
          const index = Math.floor(arr[i] / exp);
          count[index % 10]++;
        }
        addStep(5, 'Line 5: Count the occurrences of each digit.', [...arr], exp);

        // Change count[i] so that count[i] contains the actual position of this digit in output[]
        for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
        }
        addStep(6, 'Line 6: Modify the count array to contain the positions of each digit.', [...arr], exp);

        // Build the output array
        for (let i = arr.length - 1; i >= 0; i--) {
          const index = Math.floor(arr[i] / exp);
          output[count[index % 10] - 1] = arr[i];
          count[index % 10]--;
        }
        addStep(7, 'Line 7: Build the output array based on the current digit.', [...output], exp);

        // Copy the output array to arr[], so that arr now contains sorted numbers according to the current digit
        for (let i = 0; i < arr.length; i++) {
          arr[i] = output[i];
        }
        addStep(8, 'Line 8: Copy the output array to the original array.', [...arr], exp);

        exp *= 10;
      }

      addStep(9, 'Line 9: Define the radix_sort function.', arr, 1);
      addStep(10, 'Line 10: Find the maximum number to determine the number of digits.', arr, 1);
      addStep(11, `Line 11: Perform counting sort for every digit from least significant to most significant.`, arr, 1);
      addStep(12, 'Line 12: The sorted array is displayed to the user.', arr, 1);
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
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
      ctx.fillStyle = '#007bff';
      ctx.fillRect(i * barWidth, canvas.height - currentArray[i] * barHeightFactor, barWidth - 2, currentArray[i] * barHeightFactor);
      ctx.fillStyle = '#000';
      ctx.fillText(currentArray[i], i * barWidth + barWidth / 2 - 5, canvas.height - currentArray[i] * barHeightFactor - 10);
    }

    /*if (stepDescriptions[index]) {
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText(stepDescriptions[index], 10, 20);
    }*/

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
          <h1 className="text-3xl font-bold text-center text-red-600">RADIX SORT VISUALIZATION</h1>
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
                //<li key={index} style={{ marginBottom: '5px' }}>{description}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadixSortVisualizer;