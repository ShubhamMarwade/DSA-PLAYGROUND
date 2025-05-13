import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import * as d3 from 'd3';

const algorithms = {
  python: `
// Activity Selection Problem Algorithm in Python
def activity_selection(activities):
    activities.sort(key=lambda x: x['end'])
    selected_activities = []
    last_end_time = 0

    for activity in activities:
        if activity['start'] >= last_end_time:
            selected_activities.append(activity)
            last_end_time = activity['end']

    return selected_activities

activities = [{'start': 1, 'end': 2}, {'start': 3, 'end': 4}, {'start': 0, 'end': 6}, {'start': 5, 'end': 7}, {'start': 8, 'end': 9}, {'start': 5, 'end': 9}]
print(activity_selection(activities))
`,

  javascript: `
// Activity Selection Problem Algorithm in JavaScript
function activitySelection(activities) {
  activities.sort((a, b) => a.end - b.end);
  const selectedActivities = [];
  let lastEndTime = 0;

  for (const activity of activities) {
    if (activity.start >= lastEndTime) {
      selectedActivities.push(activity);
      lastEndTime = activity.end;
    }
  }

  return selectedActivities;
}

const activities = [{start: 1, end: 2}, {start: 3, end: 4}, {start: 0, end: 6}, {start: 5, end: 7}, {start: 8, end: 9}, {start: 5, end: 9}];
console.log(activitySelection(activities));
`,

  java: `
// Activity Selection Problem Algorithm in Java
import java.util.*;

class ActivitySelection {
    public static List<Activity> activitySelection(List<Activity> activities) {
        activities.sort(Comparator.comparingInt(a -> a.end));
        List<Activity> selectedActivities = new ArrayList<>();
        int lastEndTime = 0;

        for (Activity activity : activities) {
            if (activity.start >= lastEndTime) {
                selectedActivities.add(activity);
                lastEndTime = activity.end;
            }
        }

        return selectedActivities;
    }

    public static void main(String[] args) {
        List<Activity> activities = Arrays.asList(
            new Activity(1, 2), new Activity(3, 4), new Activity(0, 6),
            new Activity(5, 7), new Activity(8, 9), new Activity(5, 9)
        );
        System.out.println(activitySelection(activities));
    }
}

class Activity {
    int start, end;
    Activity(int start, int end) {
        this.start = start;
        this.end = end;
    }
    @Override
    public String toString() {
        return "(" + start + ", " + end + ")";
    }
}
`,

  c: `
// Activity Selection Problem Algorithm in C
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int start, end;
} Activity;

int compare(const void* a, const void* b) {
    return ((Activity*)a)->end - ((Activity*)b)->end;
}

void activitySelection(Activity activities[], int n) {
    qsort(activities, n, sizeof(Activity), compare);
    int lastEndTime = 0;

    printf("Selected Activities:\\n");
    for (int i = 0; i < n; i++) {
        if (activities[i].start >= lastEndTime) {
            printf("(%d, %d) ", activities[i].start, activities[i].end);
            lastEndTime = activities[i].end;
        }
    }
    printf("\\n");
}

int main() {
    Activity activities[] = {{1, 2}, {3, 4}, {0, 6}, {5, 7}, {8, 9}, {5, 9}};
    int n = sizeof(activities) / sizeof(activities[0]);
    activitySelection(activities, n);
    return 0;
}
`,

  cpp: `
// Activity Selection Problem Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>

struct Activity {
    int start, end;
};

bool compare(Activity a, Activity b) {
    return a.end < b.end;
}

std::vector<Activity> activitySelection(std::vector<Activity>& activities) {
    std::sort(activities.begin(), activities.end(), compare);
    std::vector<Activity> selectedActivities;
    int lastEndTime = 0;

    for (const Activity& activity : activities) {
        if (activity.start >= lastEndTime) {
            selectedActivities.push_back(activity);
            lastEndTime = activity.end;
        }
    }

    return selectedActivities;
}

int main() {
    std::vector<Activity> activities = {{1, 2}, {3, 4}, {0, 6}, {5, 7}, {8, 9}, {5, 9}};
    std::vector<Activity> selected = activitySelection(activities);
    for (const Activity& activity : selected) {
        std::cout << "(" << activity.start << ", " << activity.end << ") ";
    }
    std::cout << "\\n";
    return 0;
}
`
};

const ActivitySelectionVisualizer = () => {
  const [startTimes, setStartTimes] = useState('');
  const [endTimes, setEndTimes] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState('');
  const svgContainerRef = useRef(null);

  const handleAddActivity = () => {
    const startArray = startTimes.split(',').map(Number);
    const endArray = endTimes.split(',').map(Number);
    const newActivities = startArray.map((start, index) => ({
      start,
      end: endArray[index],
    }));
    setActivities(newActivities);
  };

  const activitySelection = (activities) => {
    activities.sort((a, b) => a.end - b.end);
    const selectedActivities = [];
    let lastEndTime = 0;

    for (const activity of activities) {
      if (activity.start >= lastEndTime) {
        selectedActivities.push(activity);
        lastEndTime = activity.end;
      }
    }

    return selectedActivities;
  };

  const handleVisualize = () => {
    const selected = activitySelection(activities);
    setSelectedActivities(selected);
    drawVisualization(selected);
    setResult(`Number of selected activities: ${selected.length}`);
  };

  const drawVisualization = (selected) => {
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
      .domain([0, d3.max(activities, d => d.end)])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(activities.length))
      .range([0, height])
      .padding(0.1);

    g.selectAll('.activity')
      .data(activities)
      .enter().append('rect')
      .attr('class', 'activity')
      .attr('x', d => xScale(d.start))
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.end - d.start))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => selected.includes(d) ? 'steelblue' : 'lightgray');

    g.selectAll('.activity-label')
      .data(activities)
      .enter().append('text')
      .attr('class', 'activity-label')
      .attr('x', d => xScale(d.start) + 5)
      .attr('y', (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => `(${d.start}, ${d.end})`)
      .attr('fill', 'white');
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
            Welcome to the Activity Selection Problem Visualizer! Follow these steps to visualize the algorithm:
          </Typography>
          <ol>
            <li>Enter the start and end times of activities in the input fields.</li>
            <li>Click "Add Activities" to add the activities to the list.</li>
            <li>Once all activities are added, click "Visualize" to see the selected activities.</li>
            <li>The selected activities will be highlighted in blue on the timeline.</li>
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
          <h1 className="text-3xl font-bold text-center text-red-600">ACTIVITY SELECTION PROBLEM</h1>
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
              label="Start Times (comma separated)"
              value={startTimes}
              onChange={(e) => setStartTimes(e.target.value)}
              style={{ width: '45%', marginBottom: '10px' }}
            />
            <TextField
              variant="outlined"
              label="End Times (comma separated)"
              value={endTimes}
              onChange={(e) => setEndTimes(e.target.value)}
              style={{ width: '45%', marginBottom: '10px' }}
            />
          </div>
          <Button variant="contained" onClick={handleAddActivity} style={{ width: '90%', marginBottom: '10px' }}>
            Add Activities
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

export default ActivitySelectionVisualizer;