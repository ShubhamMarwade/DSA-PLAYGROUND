import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography, 
  Paper,
  CircularProgress,
  TextField,
  IconButton 
} from '@mui/material';
import { 
  Code as CodeIcon, 
  PlayArrow as RunIcon, 
  Clear as ClearIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';

const CODE_TEMPLATES = {
  63: `// JavaScript
console.log("Hello, World!");`,
  
  71: `# Python
print("Hello, World!")`,
  
  62: `// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  
  54: `// C++
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  
  50: `// C
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
};

const LANGUAGES = [
  { id: 63, name: 'JavaScript', extension: '.js', mode: 'javascript' },
  { id: 71, name: 'Python', extension: '.py', mode: 'python' },
  { id: 62, name: 'Java', extension: '.java', mode: 'java' },
  { id: 54, name: 'C++', extension: '.cpp', mode: 'cpp' },
  { id: 50, name: 'C', extension: '.c', mode: 'c' }
];

const CodeCompiler = () => {
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(CODE_TEMPLATES[LANGUAGES[0].id]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark'); // Theme state

  const editorRef = useRef(null);

  const handleCompile = async () => {
    setLoading(true);
    setOutput('');
    setError(null);

    const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': API_KEY
      },
      data: {
        source_code: code,
        language_id: language,
        stdin: input
      }
    };

    try {
      const submission = await axios.request(options);
      
      const resultOptions = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${submission.data.token}`,
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': API_KEY
        }
      };

      const pollResult = async (token, maxAttempts = 10) => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const result = await axios.request(resultOptions);
          
          if (result.data.status.id <= 2) continue;
          
          if (result.data.status.id === 3) {
            setOutput(result.data.stdout || 'Compilation successful');
          } else {
            setError(result.data.stderr || result.data.compile_output || 'Unknown error');
          }
          
          return;
        }
        
        setError('Compilation timed out');
      };

      await pollResult(submission.data.token);
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode(CODE_TEMPLATES[language]);
    setInput('');
    setOutput('');
    setError(null);
  };

  useEffect(() => {
    setCode(CODE_TEMPLATES[language]);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register suggestion providers for multiple languages
    const languages = ['javascript', 'python', 'java', 'cpp', 'c'];
    languages.forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: async (model, position) => {
          const currentCode = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });

          const suggestions = await fetchSingleLineSuggestion(currentCode);

          return {
            suggestions: suggestions.map((suggestion, index) => ({
              label: suggestion,
              kind: monaco.languages.CompletionItemKind.Text,
              insertText: suggestion,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              }
            }))
          };
        }
      });
    });
  };

  const fetchSingleLineSuggestion = async (currentCode) => {
    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{ text: currentCode }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Suggestions response:', response.data); // Debugging line

      if (response.data.candidates && response.data.candidates.length > 0) {
        const suggestionText = response.data.candidates[0].content.parts.map(part => part.text).join('');
        const suggestions = suggestionText.split('\n');
        return suggestions.length > 0 ? [suggestions[0].trim()] : [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 1, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff', 
          borderRadius: 2 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              color: theme === 'dark' ? 'white' : 'black'
            }}
          >
            <CodeIcon fontSize="Large" /> Online Code Compiler
          </Typography>
          <IconButton onClick={toggleTheme} sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme === 'dark' ? 'white' : 'black' }}>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ 
                    color: theme === 'dark' ? 'white' : 'black',
                    '& .MuiSelect-icon': { color: theme === 'dark' ? 'white' : 'black' },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)' 
                    }
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Code Editor with Monaco Editor */}
            <Box 
              sx={{ 
                display: 'flex',
                backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <Editor
                height="400px"
                language={LANGUAGES.find(l => l.id === language)?.mode}
                value={code}
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                onChange={(value) => setCode(value)}
                onMount={handleEditorDidMount}
              />
            </Box>
          </Grid>

          {/* Input and Output Section */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              {/* Input TextField */}
              <TextField
                fullWidth
                multiline
                rows={7}
                variant="outlined"
                label="Input (Optional)"
                placeholder="Enter input for your program"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{ 
                  backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f5f5', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                    }
                  }
                }}
                InputLabelProps={{
                  style: { color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                }}
                inputProps={{
                  style: { color: theme === 'dark' ? 'white' : 'black' }
                }}
              />

              {/* Output Section */}
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f5f5', 
                  borderRadius: 1, 
                  p: 2,
                  border: '1px solid rgba(255,255,255,0.23)',
                  overflowY: 'auto',
                  position: 'relative'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: theme === 'dark' ? 'white' : 'black' 
                  }}
                >
                  Output
                </Typography>
                {loading ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%' 
                    }}
                  >
                    <CircularProgress color="primary" />
                  </Box>
                ) : error ? (
                  <Typography 
                    color="error" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      color: '#ff6b6b' 
                    }}
                  >
                    {error}
                  </Typography>
                ) : (
                  <pre 
                    style={{ 
                      margin: 0, 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-word',
                      color: theme === 'dark' ? 'white' : 'black'
                    }}
                  >
                    {output || 'Run your code to see output'}
                  </pre>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  startIcon={<RunIcon />}
                  onClick={handleCompile}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#ff0000',
                    '&:hover': {
                      backgroundColor: '#cc0000'
                    }
                  }}
                >
                  {loading ? 'Compiling...' : 'Compile & Run'}
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleClear}
                  disabled={loading}
                  sx={{
                    borderColor: '#ff0000',
                    color: '#ff0000',
                    '&:hover': {
                      backgroundColor: 'rgba(255,0,0,0.1)'
                    }
                  }}
                >
                  <ClearIcon />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CodeCompiler;