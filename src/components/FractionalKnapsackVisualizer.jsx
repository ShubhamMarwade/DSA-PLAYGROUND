import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Fractional Knapsack Problem Algorithm in Python
def fractional_knapsack(weights, values, capacity):
    index = list(range(len(values)))
    ratio = [v/w for v, w in zip(values, weights)]
    index.sort(key=lambda i: ratio[i], reverse=True)
    
    max_value = 0
    fractions = [0] * len(values)
    for i in index:
        if weights[i] <= capacity:
            fractions[i] = 1
            max_value += values[i]
            capacity -= weights[i]
        else:
            fractions[i] = capacity / weights[i]
            max_value += values[i] * fractions[i]
            break
    
    return max_value, fractions

weights = [10, 20, 30]
values = [60, 100, 120]
capacity = 50
print(fractional_knapsack(weights, values, capacity))
`,

  javascript: `
// Fractional Knapsack Problem Algorithm in JavaScript
function fractionalKnapsack(weights, values, capacity) {
  const items = weights.map((weight, index) => ({ weight, value: values[index], ratio: values[index] / weight }));
  items.sort((a, b) => b.ratio - a.ratio);

  let maxValue = 0;
  const fractions = Array(weights.length).fill(0);

  for (const item of items) {
    if (item.weight <= capacity) {
      fractions[weights.indexOf(item.weight)] = 1;
      maxValue += item.value;
      capacity -= item.weight;
    } else {
      fractions[weights.indexOf(item.weight)] = capacity / item.weight;
      maxValue += item.value * fractions[weights.indexOf(item.weight)];
      break;
    }
  }

  return { maxValue, fractions };
}

const weights = [10, 20, 30];
const values = [60, 100, 120];
const capacity = 50;
console.log(fractionalKnapsack(weights, values, capacity));
`,

  java: `
// Fractional Knapsack Problem Algorithm in Java
import java.util.Arrays;
import java.util.Comparator;

class Item {
    int weight;
    int value;
    double ratio;
    
    Item(int weight, int value) {
        this.weight = weight;
        this.value = value;
        this.ratio = (double) value / weight;
    }
}

public class FractionalKnapsack {
    public static void main(String[] args) {
        int[] weights = {10, 20, 30};
        int[] values = {60, 100, 120};
        int capacity = 50;
        
        double maxValue = fractionalKnapsack(weights, values, capacity);
        System.out.println("Max value we can obtain = " + maxValue);
    }
    
    public static double fractionalKnapsack(int[] weights, int[] values, int capacity) {
        Item[] items = new Item[weights.length];
        for (int i = 0; i < weights.length; i++) {
            items[i] = new Item(weights[i], values[i]);
        }
        
        Arrays.sort(items, Comparator.comparingDouble(i -> -i.ratio));
        
        double maxValue = 0;
        for (Item item : items) {
            if (item.weight <= capacity) {
                maxValue += item.value;
                capacity -= item.weight;
            } else {
                maxValue += item.value * ((double) capacity / item.weight);
                break;
            }
        }
        
        return maxValue;
    }
}
`,

  c: `
// Fractional Knapsack Problem Algorithm in C
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int weight;
    int value;
    double ratio;
} Item;

int compare(const void* a, const void* b) {
    return (((Item*)b)->ratio - ((Item*)a)->ratio) > 0 ? 1 : -1;
}

double fractionalKnapsack(int weights[], int values[], int n, int capacity) {
    Item* items = (Item*)malloc(n * sizeof(Item));
    for (int i = 0; i < n; i++) {
        items[i].weight = weights[i];
        items[i].value = values[i];
        items[i].ratio = (double)values[i] / weights[i];
    }
    
    qsort(items, n, sizeof(Item), compare);
    
    double maxValue = 0;
    for (int i = 0; i < n; i++) {
        if (items[i].weight <= capacity) {
            maxValue += items[i].value;
            capacity -= items[i].weight;
        } else {
            maxValue += items[i].value * ((double)capacity / items[i].weight);
            break;
        }
    }
    
    free(items);
    return maxValue;
}

int main() {
    int weights[] = {10, 20, 30};
    int values[] = {60, 100, 120};
    int capacity = 50;
    int n = sizeof(weights) / sizeof(weights[0]);
    
    printf("Max value we can obtain = %.2f\\n", fractionalKnapsack(weights, values, n, capacity));
    return 0;
}
`,

  cpp: `
// Fractional Knapsack Problem Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>

struct Item {
    int weight, value;
    double ratio;
};

bool compare(Item a, Item b) {
    return a.ratio > b.ratio;
}

double fractionalKnapsack(std::vector<Item>& items, int capacity) {
    std::sort(items.begin(), items.end(), compare);
    
    double maxValue = 0;
    for (const auto& item : items) {
        if (item.weight <= capacity) {
            maxValue += item.value;
            capacity -= item.weight;
        } else {
            maxValue += item.value * ((double)capacity / item.weight);
            break;
        }
    }
    
    return maxValue;
}

int main() {
    std::vector<Item> items = {{10, 60}, {20, 100}, {30, 120}};
    int capacity = 50;
    
    std::cout << "Max value we can obtain = " << fractionalKnapsack(items, capacity) << std::endl;
    return 0;
}
`
};

const FractionalKnapsackVisualizer = () => {
  const [weights, setWeights] = useState('');
  const [values, setValues] = useState('');
  const [capacity, setCapacity] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState('');
  const svgContainerRef = useRef(null);

  const handleAddItems = () => {
    const weightArray = weights.split(',').map(Number);
    const valueArray = values.split(',').map(Number);
    const newItems = weightArray.map((weight, index) => ({
      weight,
      value: valueArray[index],
      ratio: valueArray[index] / weight
    }));
    setItems(newItems);
  };

  const fractionalKnapsack = (items, capacity) => {
    items.sort((a, b) => b.ratio - a.ratio);
    let maxValue = 0;
    const selectedItems = [];

    for (const item of items) {
      if (item.weight <= capacity) {
        selectedItems.push({ ...item, fraction: 1 });
        maxValue += item.value;
        capacity -= item.weight;
      } else {
        selectedItems.push({ ...item, fraction: capacity / item.weight });
        maxValue += item.value * (capacity / item.weight);
        break;
      }
    }

    return { maxValue, selectedItems };
  };

  const handleVisualize = () => {
    const { maxValue, selectedItems } = fractionalKnapsack(items, parseInt(capacity));
    setSelectedItems(selectedItems);
    drawVisualization(selectedItems);
    setResult(`Maximum value: ${maxValue}`);
  };

  const drawVisualization = (selectedItems) => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    d3.select(svgContainer).selectAll('*').remove();

    const svgWidth = 750;
    const svgHeight = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select(svgContainer).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('border', '1px solid black')
      .style('margin-top', '20px');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(items, d => d.weight)])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(items.length))
      .range([0, height])
      .padding(0.1);

    g.selectAll('.item')
      .data(items)
      .enter().append('rect')
      .attr('class', 'item')
      .attr('x', 0)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.weight))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'lightgray');

    g.selectAll('.selected-item')
      .data(selectedItems)
      .enter().append('rect')
      .attr('class', 'selected-item')
      .attr('x', 0)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.weight * d.fraction))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'steelblue');

    g.selectAll('.item-label')
      .data(items)
      .enter().append('text')
      .attr('class', 'item-label')
      .attr('x', d => xScale(d.weight) + 5)
      .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => `Value: ${d.value}, W: ${d.weight}`)
      .attr('fill', 'black');
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
            Welcome to the Fractional Knapsack Problem Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the weights and values of items, and the capacity of the knapsack.</li>
            <li>Click "Add Items" to add the items to the list.</li>
            <li>Once all items are added, click "Visualize" to see the selected items.</li>
            <li>The selected items will be highlighted in blue on the chart.</li>
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
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red', flex: 1 }}>
          <h1 className="text-3xl font-bold text-center text-red-600">FRACTIONAL KNAPSACK PROBLEM</h1>
        </div>
      </div>
      <div style={{ display: 'flex', height: '79vh', border: '1px solid #ddd' }}>
        <div style={{ flex: 1, borderRight: '1px solid #ddd' }}>
          <Editor
            height="100%"
            defaultLanguage={language}
            value={algorithms[language]}
            options={{ readOnly: true, theme: 'vs-dark' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <TextField
              variant="outlined"
              label="Weights (comma separated)"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
              style={{ width: '30%', marginBottom: '10px' }}
            />
            <TextField
              variant="outlined"
              label="Values (comma separated)"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              style={{ width: '30%', marginBottom: '10px' }}
            />
            <TextField
              variant="outlined"
              label="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={{ width: '30%', marginBottom: '10px' }}
            />
          </div>
          <Button variant="contained" onClick={handleAddItems} style={{ width: '90%', marginBottom: '10px' }}>
            Add Items
          </Button>
          <Button variant="contained" color="primary" onClick={handleVisualize} style={{ width: '90%', marginBottom: '10px' }}>
            Visualize
          </Button>
          {result && (
            <Typography color="primary" variant="body1" style={{ marginBottom: '10px' }}>
              {result}
            </Typography>
          )}
          <div ref={svgContainerRef} style={{ width: '750px', height: '300px', overflowY: 'scroll' }}></div>
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackVisualizer;