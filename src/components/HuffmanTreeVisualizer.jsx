import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Python Huffman Encoding Algorithm
class HuffmanNode:
    def __init__(self, char, freq, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right

def calculate_frequency(text):
    frequency = {}
    for char in text:
        if char not in frequency:
            frequency[char] = 0
        frequency[char] += 1
    return frequency

def build_tree(frequency):
    nodes = [HuffmanNode(char, freq) for char, freq in frequency.items()]
    while len(nodes) > 1:
        nodes = sorted(nodes, key=lambda x: x.freq)
        left = nodes.pop(0)
        right = nodes.pop(0)
        new_node = HuffmanNode(None, left.freq + right.freq, left, right)
        nodes.append(new_node)
    return nodes[0]

def huffman_encoding(text):
    frequency = calculate_frequency(text)
    root = build_tree(frequency)
    return root

text = input("Enter text for Huffman Encoding: ")
root = huffman_encoding(text)
print("Huffman Tree built successfully.")
`,

  c: `
// C Huffman Encoding Algorithm
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct HuffmanNode {
    char char;
    int freq;
    struct HuffmanNode *left, *right;
} HuffmanNode;

HuffmanNode* create_node(char char, int freq) {
    HuffmanNode* node = (HuffmanNode*)malloc(sizeof(HuffmanNode));
    node->char = char;
    node->freq = freq;
    node->left = node->right = NULL;
    return node;
}

void calculate_frequency(const char* text, int* frequency) {
    for (int i = 0; text[i] != '\\0'; i++) {
        frequency[text[i]]++;
    }
}

HuffmanNode* build_tree(int* frequency) {
    HuffmanNode* nodes[256];
    int count = 0;
    for (int i = 0; i < 256; i++) {
        if (frequency[i] > 0) {
            nodes[count++] = create_node(i, frequency[i]);
        }
    }
    while (count > 1) {
        for (int i = 0; i < count - 1; i++) {
            for (int j = i + 1; j < count; j++) {
                if (nodes[i]->freq > nodes[j]->freq) {
                    HuffmanNode* temp = nodes[i];
                    nodes[i] = nodes[j];
                    nodes[j] = temp;
                }
            }
        }
        HuffmanNode* left = nodes[0];
        HuffmanNode* right = nodes[1];
        HuffmanNode* new_node = create_node(0, left->freq + right->freq);
        new_node->left = left;
        new_node->right = right;
        nodes[1] = new_node;
        for (int i = 2; i < count; i++) {
            nodes[i - 1] = nodes[i];
        }
        count--;
    }
    return nodes[0];
}

int main() {
    char text[256];
    printf("Enter text for Huffman Encoding: ");
    fgets(text, sizeof(text), stdin);
    text[strcspn(text, "\\n")] = 0;

    int frequency[256] = {0};
    calculate_frequency(text, frequency);

    HuffmanNode* root = build_tree(frequency);
    printf("Huffman Tree built successfully.\\n");
    return 0;
}
`,

  cpp: `
// C++ Huffman Encoding Algorithm
#include <iostream>
#include <queue>
#include <unordered_map>

struct HuffmanNode {
    char char;
    int freq;
    HuffmanNode *left, *right;
    HuffmanNode(char char, int freq) : char(char), freq(freq), left(NULL), right(NULL) {}
};

struct compare {
    bool operator()(HuffmanNode* l, HuffmanNode* r) {
        return l->freq > r->freq;
    }
};

void calculate_frequency(const std::string &text, std::unordered_map<char, int> &frequency) {
    for (char char : text) {
        frequency[char]++;
    }
}

HuffmanNode* build_tree(std::unordered_map<char, int> &frequency) {
    std::priority_queue<HuffmanNode*, std::vector<HuffmanNode*>, compare> minHeap;
    for (auto pair : frequency) {
        minHeap.push(new HuffmanNode(pair.first, pair.second));
    }
    while (minHeap.size() != 1) {
        HuffmanNode* left = minHeap.top();
        minHeap.pop();
        HuffmanNode* right = minHeap.top();
        minHeap.pop();
        HuffmanNode* newNode = new HuffmanNode('\\0', left->freq + right->freq);
        newNode->left = left;
        newNode->right = right;
        minHeap.push(newNode);
    }
    return minHeap.top();
}

int main() {
    std::string text;
    std::cout << "Enter text for Huffman Encoding: ";
    std::getline(std::cin, text);

    std::unordered_map<char, int> frequency;
    calculate_frequency(text, frequency);

    HuffmanNode* root = build_tree(frequency);
    std::cout << "Huffman Tree built successfully." << std::endl;
    return 0;
}
`,

  java: `
// Java Huffman Encoding Algorithm
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Scanner;

class HuffmanNode {
    char char;
    int freq;
    HuffmanNode left, right;
    HuffmanNode(char char, int freq) {
        this.char = char;
        this.freq = freq;
        this.left = this.right = null;
    }
}

class HuffmanTree {
    public static void calculate_frequency(String text, Map<Character, Integer> frequency) {
        for (char char : text.toCharArray()) {
            frequency.put(char, frequency.getOrDefault(char, 0) + 1);
        }
    }

    public static HuffmanNode build_tree(Map<Character, Integer> frequency) {
        PriorityQueue<HuffmanNode> minHeap = new PriorityQueue<>((l, r) -> l.freq - r.freq);
        for (Map.Entry<Character, Integer> entry : frequency.entrySet()) {
            minHeap.offer(new HuffmanNode(entry.getKey(), entry.getValue()));
        }
        while (minHeap.size() > 1) {
            HuffmanNode left = minHeap.poll();
            HuffmanNode right = minHeap.poll();
            HuffmanNode newNode = new HuffmanNode('\\0', left.freq + right.freq);
            newNode.left = left;
            newNode.right = right;
            minHeap.offer(newNode);
        }
        return minHeap.poll();
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter text for Huffman Encoding: ");
        String text = scanner.nextLine();

        Map<Character, Integer> frequency = new HashMap<>();
        calculate_frequency(text, frequency);

        HuffmanNode root = build_tree(frequency);
        System.out.println("Huffman Tree built successfully.");
    }
}
`,

  javascript: `
// JavaScript Huffman Encoding Algorithm
class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

function calculateFrequency(text) {
    const frequency = {};
    for (const char of text) {
        if (!frequency[char]) {
            frequency[char] = 0;
        }
        frequency[char]++;
    }
    return frequency;
}

function buildTree(frequency) {
    const nodes = Object.entries(frequency).map(([char, freq]) => new HuffmanNode(char, freq));
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const newNode = new HuffmanNode(null, left.freq + right.freq, left, right);
        nodes.push(newNode);
    }
    return nodes[0];
}

const text = prompt("Enter text for Huffman Encoding:");
const frequency = calculateFrequency(text);
const root = buildTree(frequency);
console.log("Huffman Tree built successfully.");
`
};

const HuffmanTreeVisualizer = () => {
  const [language, setLanguage] = useState('python');
  const [editorInstance, setEditorInstance] = useState(null);
  const svgContainerRef = useRef(null);
  const [text, setText] = useState('this is an example for huffman encoding');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightLines, setHighlightLines] = useState([]);
  const [stepDescriptions, setStepDescriptions] = useState([]);
  const stepRefs = useRef([]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    resetState();
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }

  const addStep = (line, description, treeState) => {
    setHighlightLines(prev => [...prev, line]);
    setStepDescriptions(prev => [...prev, description]);
    setSteps(prev => [...prev, JSON.parse(JSON.stringify(treeState))]); // Deep copy
  };

  const handleVisualize = () => {
    if (isVisualizing) return;

    setIsVisualizing(true);

    // Huffman Tree construction steps for visualization
    const calculateFrequency = (text) => {
      const frequency = {};
      for (const char of text) {
        if (!frequency[char]) {
          frequency[char] = 0;
        }
        frequency[char]++;
      }
      return frequency;
    };

    const buildTree = (frequency) => {
      const nodes = Object.entries(frequency).map(([char, freq]) => new HuffmanNode(char, freq));
      const treeState = { nodes: [...nodes] }; // Initial state
      addStep(1, 'Step 1: Calculate the frequency of each character.', treeState);

      while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const newNode = new HuffmanNode(null, left.freq + right.freq, left, right);
        nodes.push(newNode);
        treeState.nodes = [...nodes]; // Update state
        addStep(2, 'Step 2: Combine the two nodes with the lowest frequency.', treeState);
      }
      const root = nodes[0];
      treeState.root = root; // Final state
      addStep(3, 'Step 3: The Huffman Tree is built successfully.', treeState);
      return root;
    };

    const frequency = calculateFrequency(text);
    buildTree(frequency);

    setIsVisualizing(false);
    setStepIndex(0);
  };

  const handleAnimate = (index) => {
    console.log(`Animating step index: ${index}`);

    if (index >= steps.length) {
      console.log('Index out of bounds.');
      return;
    }

    const svgContainer = svgContainerRef.current;
    if (!svgContainer) {
      console.log('SVG container not found.');
      return;
    }

    d3.select(svgContainer).selectAll('*').remove();

    const svgWidth = 800;
    const svgHeight = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select(svgContainer).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('border', '1px solid black')
      .style('margin-top', '20px');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const rootData = steps[index]?.root;
    if (!rootData) {
      console.log('Root data not found.');
      return;
    }

    const root = d3.hierarchy(rootData, node => {
      return node ? [node.left, node.right].filter(n => n) : [];
    });

    const treeLayout = d3.tree().size([width, height]);
    const treeData = treeLayout(root);

    // Links
    g.selectAll('.link')
      .data(treeData.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));

    // Nodes
    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 10)
      .attr('fill', 'steelblue');

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => (d.children ? -13 : 13))
      .style('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => d.data.char !== null ? `${d.data.char}: ${d.data.freq}` : d.data.freq);

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

    console.log('Setting new decorations and step index.');
    setDecorations(newDecorations);
    setStepIndex(index);

    // Scroll the current step into view
    if (stepRefs.current[index]) {
      stepRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleStepForward = () => {
    console.log(`Current step index: ${stepIndex}`);
    console.log(`Total steps: ${steps.length}`);

    if (stepIndex < steps.length - 1) {
      console.log(`Animating step index: ${stepIndex + 1}`);
      handleAnimate(stepIndex + 1);
    } else {
      console.log('No more steps to animate.');
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
    setDecorations([]);
  };

  useEffect(() => {
    console.log('Steps state updated:', steps);
  }, [steps]);

  useEffect(() => {
    console.log('Step index updated:', stepIndex);
  }, [stepIndex]);

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
            <MenuItem value="javascript">JavaScript</MenuItem>
          </Select>
        </FormControl>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h1 className="text-3xl font-bold text-center text-red-600">HUFFMAN TREE VISUALIZATION</h1>
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
          <TextField
            variant="outlined"
            label="Text"
            value={text}
            onChange={handleTextChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <Button variant="contained" onClick={handleStepBackward} disabled={stepIndex === 0} style={{ width: '45%', marginBottom: '10px' }}>
            Step Backward
          </Button>
          <Button variant="contained" onClick={handleStepForward} disabled={stepIndex >= steps.length - 1} style={{ width: '45%', marginBottom: '10px' }}>
            Step Forward
          </Button>
          <div ref={svgContainerRef} style={{ width: '100%', overflowY: 'scroll', height: '100%' }}></div>
          <div style={{ marginTop: '10px', padding: '10px', borderTop: '1px solid #ddd', height: '30vh', overflowY: 'scroll', width: '100%' }}>
            <h3 className="font-bold">Code Execution Steps:</h3>
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

export default HuffmanTreeVisualizer;