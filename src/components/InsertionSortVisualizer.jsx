import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Slider } from '@mui/material';

const algorithms = {
  python:
`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

n = int(input("Enter the number of elements: "))
arr = list(map(int, input("Enter the elements: ").split()))
insertion_sort(arr)
print("Sorted array is:", arr)`,
  c:
`#include <stdio.h>

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
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
    insertionSort(arr, n);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
  cpp:
`#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
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
    insertionSort(arr, n);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}`,
  java:
`import java.util.Scanner;

public class InsertionSort {
    public static void insertionSort(int arr[]) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
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
        insertionSort(arr);
        System.out.println("Sorted array: ");
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}`
};

const InsertionSortVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
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
      addStep(1, 'Line 1: Define the insertion_sort function to sort an array (arr).', arr);
      for (let i = 1; i < arr.length; i++) {
        addStep(2, `Line 2: The outer loop runs from 1 to ${arr.length - 1}, iterating over each element starting from the second element.`, arr);
        const key = arr[i];
        let j = i - 1;
        addStep(3, `Line 3: The key variable is set to arr[${i}] (${key}).`, arr);
        while (j >= 0 && arr[j] > key) {
          addStep(4, `Line 4: The inner loop compares the key with the previous elements and shifts larger elements one position to the right.`, arr, [j, j + 1, i]);
          arr[j + 1] = arr[j];
          j -= 1;
          addStep(5, `Line 5: Shift arr[${j + 1}] to arr[${j + 2}].`, arr, [j + 1, j + 2, i]);
        }
        arr[j + 1] = key;
        addStep(6, `Line 6: Place the key at its correct position in the sorted part of the array.`, arr, [j + 1, i]);
      }
      addStep(9, 'Line 9: The user enters the number of elements (n) in the array.', arr);
      addStep(10, 'Line 10: The user enters the array elements, which are converted into integers and stored in a list.', arr);
      addStep(11, 'Line 11: The insertion_sort function is called, and the array is sorted step by step.', arr);
      addStep(12, 'Line 12: The sorted array is displayed to the user.', arr);
    } else if (language === 'c') {
      addStep(1, 'Line 1: Define the insertionSort function to sort an array.', arr);
      for (let i = 1; i < arr.length; i++) {
        addStep(2, `Line 2: The outer loop runs from 1 to ${arr.length - 1}, iterating over each element starting from the second element.`, arr);
        const key = arr[i];
        let j = i - 1;
        addStep(3, `Line 3: The key variable is set to arr[${i}] (${key}).`, arr);
        while (j >= 0 && arr[j] > key) {
          addStep(4, `Line 4: The inner loop compares the key with the previous elements and shifts larger elements one position to the right.`, arr, [j, j + 1, i]);
          arr[j + 1] = arr[j];
          j -= 1;
          addStep(5, `Line 5: Shift arr[${j + 1}] to arr[${j + 2}].`, arr, [j + 1, j + 2, i]);
        }
        arr[j + 1] = key;
        addStep(6, `Line 6: Place the key at its correct position in the sorted part of the array.`, arr, [j + 1, i]);
      }
      addStep(7, 'Line 7: Define the main function.', arr);
      addStep(8, 'Line 8: Declare a variable for the number of elements.', arr);
      addStep(9, 'Line 9: Prompt the user to enter the number of elements.', arr);
      addStep(10, 'Line 10: Get the input for the number of elements.', arr);
      addStep(11, 'Line 11: Declare an array to hold the elements.', arr);
      addStep(12, 'Line 12: Prompt the user to enter the elements.', arr);
      addStep(13, `Line 13: Iterate to get the array elements.`, arr);
      addStep(14, 'Line 14: Get input for each element.', arr);
      addStep(15, 'Line 15: Call the insertionSort function to sort the array.', arr);
      addStep(16, 'Line 16: Print the sorted array.', arr);
      addStep(17, `Line 17: Iterate to print each sorted element.`, arr);
      addStep(18, 'Line 18: Print each sorted element.', arr);
      addStep(19, 'Line 19: End of the main function.', arr);
    } else if (language === 'cpp') {
      addStep(1, 'Line 1: Define the insertionSort function to sort an array.', arr);
      for (let i = 1; i < arr.length; i++) {
        addStep(2, `Line 2: The outer loop runs from 1 to ${arr.length - 1}, iterating over each element starting from the second element.`, arr);
        const key = arr[i];
        let j = i - 1;
        addStep(3, `Line 3: The key variable is set to arr[${i}] (${key}).`, arr);
        while (j >= 0 && arr[j] > key) {
          addStep(4, `Line 4: The inner loop compares the key with the previous elements and shifts larger elements one position to the right.`, arr, [j, j + 1, i]);
          arr[j + 1] = arr[j];
          j -= 1;
          addStep(5, `Line 5: Shift arr[${j + 1}] to arr[${j + 2}].`, arr, [j + 1, j + 2, i]);
        }
        arr[j + 1] = key;
        addStep(6, `Line 6: Place the key at its correct position in the sorted part of the array.`, arr, [j + 1, i]);
      }
      addStep(7, 'Line 7: Define the main function.', arr);
      addStep(8, 'Line 8: Declare a variable for the number of elements.', arr);
      addStep(9, 'Line 9: Prompt the user to enter the number of elements.', arr);
      addStep(10, 'Line 10: Get the input for the number of elements.', arr);
      addStep(11, 'Line 11: Declare an array to hold the elements.', arr);
      addStep(12, 'Line 12: Prompt the user to enter the elements.', arr);
      addStep(13, `Line 13: Iterate to get the array elements.`, arr);
      addStep(14, 'Line 14: Get input for each element.', arr);
      addStep(15, 'Line 15: Call the insertionSort function to sort the array.', arr);
      addStep(16, 'Line 16: Print the sorted array.', arr);
      addStep(17, `Line 17: Iterate to print each sorted element.`, arr);
      addStep(18, 'Line 18: Print each sorted element.', arr);
      addStep(19, 'Line 19: End of the main function.', arr);
    } else if (language === 'java') {
      addStep(1, 'Line 1: Define the insertionSort function to sort an array.', arr);
      for (let i = 1; i < arr.length; i++) {
        addStep(2, `Line 2: The outer loop runs from 1 to ${arr.length - 1}, iterating over each element starting from the second element.`, arr);
        const key = arr[i];
        let j = i - 1;
        addStep(3, `Line 3: The key variable is set to arr[${i}] (${key}).`, arr);
        while (j >= 0 && arr[j] > key) {
          addStep(4, `Line 4: The inner loop compares the key with the previous elements and shifts larger elements one position to the right.`, arr, [j, j + 1, i]);
          arr[j + 1] = arr[j];
          j -= 1;
          addStep(5, `Line 5: Shift arr[${j + 1}] to arr[${j + 2}].`, arr, [j + 1, j + 2, i]);
        }
        arr[j + 1] = key;
        addStep(6, `Line 6: Place the key at its correct position in the sorted part of the array.`, arr, [j + 1, i]);
      }
      addStep(7, 'Line 7: Define the main function.', arr);
      addStep(8, 'Line 8: Create a scanner object for user input.', arr);
      addStep(9, 'Line 9: Prompt the user to enter the number of elements.', arr);
      addStep(10, 'Line 10: Get the input for the number of elements.', arr);
      addStep(11, 'Line 11: Declare an array to hold the elements.', arr);
      addStep(12, 'Line 12: Prompt the user to enter the elements.', arr);
      addStep(13, `Line 13: Iterate to get the array elements.`, arr);
      addStep(14, 'Line 14: Get input for each element.', arr);
      addStep(15, 'Line 15: Call the insertionSort function to sort the array.', arr);
      addStep(16, 'Line 16: Print the sorted array.', arr);
      addStep(17, `Line 17: Iterate to print each sorted element.`, arr);
      addStep(18, 'Line 18: Print each sorted element.', arr);
    }

    setSteps(newSteps);
    setHighlightLines(newHighlightLines);
    setStepDescriptions(newStepDescriptions);
    setSwapIndices(newSwapIndices);
    setIsSorting(false);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    if (index >= steps.length) return;

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
    setDecorations([]);
    if (editorInstance) {
        editorInstance.editor.setValue(algorithms[language]);
    }
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
                <h1 className="text-3xl font-bold text-center text-red-600">Insertion SORT VISUALIZATION</h1>
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
                <div style={{ flex: 1, overflowY: 'scroll', width: '100%', border: '1px solid black', padding: '10px', height: '300px' }}>
                    {steps.slice(0, stepIndex + 1).map((step, idx) => (
                        <div key={idx} style={{ margin: '10px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                {step.map((value, i) => (
                                    <span key={i} ref={el => stepRefs.current[i] = el} style={{ margin: '0 5px', padding: '10px', border: '1px solid #ddd', backgroundColor: swapIndices[idx] && swapIndices[idx].includes(i) ? 'red' : (swapIndices[idx] && swapIndices[idx][2] === i ? 'green' : '#007bff'), color: '#fff' }}>
                                        {value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
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

export default InsertionSortVisualizer;