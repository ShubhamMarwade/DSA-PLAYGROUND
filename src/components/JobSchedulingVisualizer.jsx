import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Job Scheduling Problem Algorithm in Python
def job_scheduling(jobs):
    jobs.sort(key=lambda x: x['profit'], reverse=True)
    max_deadline = max(job['deadline'] for job in jobs)
    slots = [False] * max_deadline
    selected_jobs = [None] * max_deadline
    total_profit = 0

    for job in jobs:
        for j in range(min(max_deadline, job['deadline']) - 1, -1, -1):
            if not slots[j]:
                slots[j] = True
                selected_jobs[j] = job
                total_profit += job['profit']
                break

    return total_profit, [job for job in selected_jobs if job]

jobs = [{'id': 'a', 'deadline': 2, 'profit': 100}, {'id': 'b', 'deadline': 1, 'profit': 19}, {'id': 'c', 'deadline': 2, 'profit': 27}, {'id': 'd', 'deadline': 1, 'profit': 25}, {'id': 'e', 'deadline': 3, 'profit': 15}]
print(job_scheduling(jobs))
`,

  javascript: `
// Job Scheduling Problem Algorithm in JavaScript
function jobScheduling(jobs) {
  jobs.sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  const slots = Array(maxDeadline).fill(false);
  const selectedJobs = Array(maxDeadline).fill(null);
  let totalProfit = 0;

  for (const job of jobs) {
    for (let j = Math.min(maxDeadline, job.deadline) - 1; j >= 0; j--) {
      if (!slots[j]) {
        slots[j] = true;
        selectedJobs[j] = job;
        totalProfit += job.profit;
        break;
      }
    }
  }

  return { totalProfit, selectedJobs: selectedJobs.filter(job => job) };
}

const jobs = [{ id: 'a', deadline: 2, profit: 100 }, { id: 'b', deadline: 1, profit: 19 }, { id: 'c', deadline: 2, profit: 27 }, { id: 'd', deadline: 1, profit: 25 }, { id: 'e', deadline: 3, profit: 15 }];
console.log(jobScheduling(jobs));
`,

  java: `
// Job Scheduling Problem Algorithm in Java
import java.util.*;

class Job {
    char id;
    int deadline, profit;
    
    Job(char id, int deadline, int profit) {
        this.id = id;
        this.deadline = deadline;
        this.profit = profit;
    }
}

public class JobScheduling {
    public static void main(String[] args) {
        List<Job> jobs = Arrays.asList(
            new Job('a', 2, 100), new Job('b', 1, 19), new Job('c', 2, 27),
            new Job('d', 1, 25), new Job('e', 3, 15)
        );
        
        double maxProfit = jobScheduling(jobs);
        System.out.println("Max profit we can obtain = " + maxProfit);
    }
    
    public static double jobScheduling(List<Job> jobs) {
        jobs.sort((a, b) -> b.profit - a.profit);
        int maxDeadline = jobs.stream().mapToInt(job -> job.deadline).max().orElse(0);
        boolean[] slots = new boolean[maxDeadline];
        Job[] selectedJobs = new Job[maxDeadline];
        double totalProfit = 0;

        for (Job job : jobs) {
            for (int j = Math.min(maxDeadline, job.deadline) - 1; j >= 0; j--) {
                if (!slots[j]) {
                    slots[j] = true;
                    selectedJobs[j] = job;
                    totalProfit += job.profit;
                    break;
                }
            }
        }
        
        return totalProfit;
    }
}
`,

  c: `
// Job Scheduling Problem Algorithm in C
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char id;
    int deadline;
    int profit;
} Job;

int compare(const void* a, const void* b) {
    return ((Job*)b)->profit - ((Job*)a)->profit;
}

void jobScheduling(Job jobs[], int n) {
    qsort(jobs, n, sizeof(Job), compare);
    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        if (jobs[i].deadline > maxDeadline) {
            maxDeadline = jobs[i].deadline;
        }
    }
    int* slots = (int*)malloc(maxDeadline * sizeof(int));
    Job* selectedJobs = (Job*)malloc(maxDeadline * sizeof(Job));
    for (int i = 0; i < maxDeadline; i++) {
        slots[i] = 0;
    }
    int totalProfit = 0;

    for (int i = 0; i < n; i++) {
        for (int j = jobs[i].deadline - 1; j >= 0; j--) {
            if (!slots[j]) {
                slots[j] = 1;
                selectedJobs[j] = jobs[i];
                totalProfit += jobs[i].profit;
                break;
            }
        }
    }

    printf("Selected Jobs:\\n");
    for (int i = 0; i < maxDeadline; i++) {
        if (slots[i]) {
            printf("(%c, %d, %d) ", selectedJobs[i].id, selectedJobs[i].deadline, selectedJobs[i].profit);
        }
    }
    printf("\\nTotal Profit: %d\\n", totalProfit);

    free(slots);
    free(selectedJobs);
}

int main() {
    Job jobs[] = {{'a', 2, 100}, {'b', 1, 19}, {'c', 2, 27}, {'d', 1, 25}, {'e', 3, 15}};
    int n = sizeof(jobs) / sizeof(jobs[0]);
    
    jobScheduling(jobs, n);
    return 0;
}
`,

  cpp: `
// Job Scheduling Problem Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>

struct Job {
    char id;
    int deadline, profit;
};

bool compare(Job a, Job b) {
    return a.profit > b.profit;
}

void jobScheduling(std::vector<Job>& jobs) {
    std::sort(jobs.begin(), jobs.end(), compare);
    int maxDeadline = 0;
    for (const auto& job : jobs) {
        if (job.deadline > maxDeadline) {
            maxDeadline = job.deadline;
        }
    }
    std::vector<bool> slots(maxDeadline, false);
    std::vector<Job> selectedJobs(maxDeadline);
    int totalProfit = 0;

    for (const auto& job : jobs) {
        for (int j = job.deadline - 1; j >= 0; j--) {
            if (!slots[j]) {
                slots[j] = true;
                selectedJobs[j] = job;
                totalProfit += job.profit;
                break;
            }
        }
    }

    std::cout << "Selected Jobs:\\n";
    for (int i = 0; i < maxDeadline; i++) {
        if (slots[i]) {
            std::cout << "(" << selectedJobs[i].id << ", " << selectedJobs[i].deadline << ", " << selectedJobs[i].profit << ") ";
        }
    }
    std::cout << "\\nTotal Profit: " << totalProfit << "\\n";
}

int main() {
    std::vector<Job> jobs = {{'a', 2, 100}, {'b', 1, 19}, {'c', 2, 27}, {'d', 1, 25}, {'e', 3, 15}};
    
    jobScheduling(jobs);
    return 0;
}
`
};

const JobSchedulingVisualizer = () => {
  const [deadlines, setDeadlines] = useState('');
  const [profits, setProfits] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState('');
  const svgContainerRef = useRef(null);

  const handleAddJobs = () => {
    const deadlineArray = deadlines.split(',').map(Number);
    const profitArray = profits.split(',').map(Number);
    const newJobs = deadlineArray.map((deadline, index) => ({
      id: String.fromCharCode(97 + index + jobs.length), // 'a', 'b', 'c', ...
      deadline,
      profit: profitArray[index],
    }));
    setJobs([...jobs, ...newJobs]);
  };

  const jobScheduling = (jobs) => {
    jobs.sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(job => job.deadline));
    const slots = Array(maxDeadline).fill(false);
    const selectedJobs = Array(maxDeadline).fill(null);
    let totalProfit = 0;

    for (const job of jobs) {
      for (let j = Math.min(maxDeadline, job.deadline) - 1; j >= 0; j--) {
        if (!slots[j]) {
          slots[j] = true;
          selectedJobs[j] = job;
          totalProfit += job.profit;
          break;
        }
      }
    }

    return { totalProfit, selectedJobs: selectedJobs.filter(job => job) };
  };

  const handleVisualize = () => {
    const { totalProfit, selectedJobs } = jobScheduling(jobs);
    setSelectedJobs(selectedJobs);
    drawVisualization(selectedJobs);
    setResult(`Total profit: ${totalProfit}`);
  };

  const drawVisualization = (selectedJobs) => {
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
      .domain([0, d3.max(jobs, d => d.deadline)])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(jobs.length))
      .range([0, height])
      .padding(0.1);

    g.selectAll('.job')
      .data(jobs)
      .enter().append('rect')
      .attr('class', 'job')
      .attr('x', d => xScale(d.deadline) - xScale(1))
      .attr('y', (d, i) => yScale(i))
      .attr('width', xScale(1))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'lightgray');

    g.selectAll('.selected-job')
      .data(selectedJobs)
      .enter().append('rect')
      .attr('class', 'selected-job')
      .attr('x', d => xScale(d.deadline) - xScale(1))
      .attr('y', (d, i) => yScale(i))
      .attr('width', xScale(1))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'steelblue');

    g.selectAll('.job-label')
      .data(jobs)
      .enter().append('text')
      .attr('class', 'job-label')
      .attr('x', d => xScale(d.deadline) - xScale(1) + 5)
      .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => `(${d.id}, D: ${d.deadline}, P: ${d.profit})`)
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
            Welcome to the Job Scheduling Problem Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the deadlines and profits of jobs in the input fields.</li>
            <li>Click "Add Jobs" to add the jobs to the list.</li>
            <li>Once all jobs are added, click "Visualize" to see the selected jobs.</li>
            <li>The selected jobs will be highlighted in blue on the timeline.</li>
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
          <h1 className="text-3xl font-bold text-center text-red-600">JOB SCHEDULING PROBLEM</h1>
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
              label="Deadlines (comma separated)"
              value={deadlines}
              onChange={(e) => setDeadlines(e.target.value)}
              style={{ width: '45%', marginBottom: '10px' }}
            />
            <TextField
              variant="outlined"
              label="Profits (comma separated)"
              value={profits}
              onChange={(e) => setProfits(e.target.value)}
              style={{ width: '45%', marginBottom: '10px' }}
            />
          </div>
          <Button variant="contained" onClick={handleAddJobs} style={{ width: '90%', marginBottom: '10px' }}>
            Add Jobs
          </Button>
          {jobs.length > 0 && (
            <Typography color="primary" variant="body1" style={{ marginBottom: '10px' }}>
              Jobs added: {jobs.map(job => `(${job.id}, D: ${job.deadline}, P: ${job.profit})`).join(', ')}
            </Typography>
          )}
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

export default JobSchedulingVisualizer;