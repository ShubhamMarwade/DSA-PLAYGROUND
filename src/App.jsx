import React, {Suspense, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AuthModal from './components/AuthModal';
import CodeCompiler from './components/CodeCompiler';
import { Avatar, Button, Dialog, DialogContent } from '@mui/material';
import MorePage from './components/MorePage'; // Import the new page component
import BubbleSortVisualizer from './components/BubbleSortVisualizer'; // Import the BubbleSortVisualizer component
import InsertionSortVisualizer from './components/InsertionSortVisualizer';
import MergeSortVisualizer from './components/MergeSortVisualizer';
import NQueenVisualizer from './components/NQueenVisualizer';
import BinarySearchVisualizer from './components/BinarySearchVisualizer';
import LinearSearchVisualizer from './components/LinearSearchVisualizer';
import BFSVisualizer from './components/BFSVisualizer';
import DFSVisualizer from './components/DFSVisualizer';
import KnapsackVisualizer from './components/KnapsackVisualizer';
import SelectionSortVisualizer from './components/SelectionSortVisualizer';
import QuickSortVisualizer from './components/QuickSortVisualizer';
import HeapSortVisualizer from './components/HeapSortVisualizer';
import DSAGPT from './DSAGPT';
import RadixSortVisualizer from './components/RadixSortVisualizer';
import InterpolationSearchVisualizer from './components/InterpolationSearchVisualizer';
import TernarySearchVisualizer from './components/TernarySearchVisualizer';
import ExponentialSearchVisualizer from './components/ExponentialSearchVisualizer';
import JumpSearchVisualizer from './components/JumpSearchVisualizer';
import DijkstraVisualizer from './components/DijkstraVisualizer';
import FloydWarshallVisualizer from './components/FloydWarshallVisualizer';
import BellmanFordVisualizer from './components/BellmanFordVisualizer';
import KruskalVisualizer from './components/KruskalVisualizer';
import PrimVisualizer from './components/PrimVisualizer';
import FibonacciVisualizer from './components/FibonacciVisualizer';
import LCSVisualizer from './components/LCSVisualizer';
import LISVisualizer from './components/LISVisualizer';
import CoinChangeVisualizer from './components/CoinChangeVisualizer';
import BinaryTreeVisualizer from './components/BinaryTreeVisualizer';
import BinarySearchTreeVisualizer from './components/BinarySearchTreeVisualizer';
import AVLTreeVisualizer from './components/AVLTreeVisualizer';
import RedBlackTreeVisualizer from './components/RedBlackTreeVisualizer';
import SegmentTreeVisualizer from './components/SegmentTreeVisualizer';
import FenwickTreeVisualizer from './components/FenwickTreeVisualizer';
import HuffmanTreeVisualizer from './components/HuffmanTreeVisualizer';
import ActivitySelectionVisualizer from './components/ActivitySelectionVisualizer';
import FractionalKnapsackVisualizer from './components/FractionalKnapsackVisualizer';
import JobSchedulingVisualizer from './components/JobSchedulingVisualizer';
import SudokuSolverVisualizer from './components/SudokuSolverVisualizer';
import RatInAMazeVisualizer from './components/RatInAMazeVisualizer';
import SubsetSumVisualizer from './components/SubsetSumVisualizer';
import HamiltonianCycleVisualizer from './components/HamiltonianCycleVisualizer';
import GraphColoringVisualizer from './components/GraphColoringVisualizer';
import ArrayVisualizer from './components/ArrayVisualizer';
import Button1 from './ui/Button1';
import Button2 from './ui/Button2';
import Button3 from './ui/Button3';
import Button4 from './ui/Button4';
import Button5 from './ui/Button5';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import StackVisualizer from './components/StackVisualizer';
import QueueVisualizer from './components/QueueVisualizer';
import MoreButton from './ui/MoreButton';
import DSAQuestions from './components/DSAQuestions';
import DSAKeywords from './components/DSAKeywords';
import Editor1 from './Editor';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCodeCompilerOpen, setIsCodeCompilerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const data = [
    { category: 'sorting', name: 'Bubble Sort', algorithm: 'bubble-sort' },
    { category: 'sorting', name: 'Insertion Sort', algorithm: 'insertion-sort' },
    { category: 'sorting', name: 'Merge Sort', algorithm: 'merge-sort' },
    { category: 'searching', name: 'Binary Search', algorithm: 'binary-search' },
    { category: 'searching', name: 'Linear Search', algorithm: 'linear-search' },
    { category: 'graph-algorithms', name: 'Breadth-First Search (BFS)', algorithm: 'bfs' },
    { category: 'graph-algorithms', name: 'Depth-First Search (DFS)', algorithm: 'dfs' },
    { category: 'dynamic-programming', name: '0/1 Knapsack', algorithm: 'knapsack' },
    { category: 'dynamic-programming', name: 'N-Queen', algorithm: 'n-queen' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthModalOpen(false);
      } else {
        setIsAuthModalOpen(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  const openVisualizer = (algorithm) => {
    const visualizerUrl = `/visualizer.html?algorithm=${algorithm}`;
    window.open(visualizerUrl, '_blank');
  };

  const openCodeCompiler = () => {
    setIsCodeCompilerOpen(true);
  };

  const startGame = (gameType) => {
    switch(gameType) {
      case 'keywords':
        window.open('/keywords-game.html', '_blank');
        break;
      case 'quiz':
        window.open('/dsa-quiz.html', '_blank');
        break;
      case 'duo-code':
        window.open('/duo-code.html', '_blank');
        break;
      default:
        console.error('Unknown game type');
    }
  };

  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === '') {
      setSearchResults([]);
    } else {
      const results = data.filter(item =>
        item.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 6); // Generate unique room ID
    navigate(`/editor/${newRoomId}`); // Navigate to the room
  };

  return (
    <Suspense fallback={<div className="loader"></div>}>
    <div className="App min-h-screen bg-gradient-to-br from-red-500 via-white to-red-500 bg-[length:200%_200%] animate-gradient-x">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-10"
              />
              <span className="ml-2 text-xl font-bold text-red-600">DSA Playground</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Avatar 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt={user.displayName || 'User'}
                  />
                  <span>{user.displayName || (user.isAnonymous ? 'Guest' : 'User')}</span>
                  <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        open={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <Dialog 
        open={isCodeCompilerOpen} 
        onClose={() => setIsCodeCompilerOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent>
          <CodeCompiler />
        </DialogContent>
      </Dialog>

      <Routes>
        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <button 
                onClick={openCodeCompiler} 
                className="code-compiler-btn bg-red-600 text-white px-8 py-4 rounded-lg text-2xl font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <i className="bi bi-code-slash mr-3"></i>Code Compiler
              </button>
              <p className="mt-4 text-gray-600 text-lg">
                Explore this tab to compile your code in multiple programming languages
              </p>
            </div>

            <h1 className="text-4xl font-bold text-center text-red-600 mb-12">DSA Visualizer</h1>
            
            <div className="relative max-w-xl mx-auto mb-12">
              <div className="relative">
                <input 
                  type="text" 
                  id="dsa-search" 
                  placeholder="Search DSA topics (e.g., Bubble Sort, BFS, Knapsack)" 
                  className="w-full px-4 py-3 rounded-lg border-red-300 shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-red-600/50 text-gray-700"
                  value={searchQuery}
                  onChange={handleSearchInput}
                />
                <i className="bi bi-search absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600"></i>
              </div>
              <div id="search-results" className={`search-results ${searchResults.length > 0 ? '' : 'hidden'} mt-2 bg-white border border-gray-300 rounded-lg shadow-lg`}>
                {searchResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="search-result-item px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      if (result.algorithm === 'bubble-sort') {
                        navigate(`/` + result.algorithm);
                      } else {
                        openVisualizer(result.algorithm);
                      }
                    }}
                  >
                    {result.name}
                  </div>
                ))}
              </div>
            </div>
            
            <h2 className="w-full text-center px-4 py-2 text-gray-700 bg-red-300 rounded-full">Data Structures</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mt-8">

            {/* Stylish Button */}
            <Button1/>
            <Button2/>
            <Button3/>
            <Button4/>
            {/*<Button5/>*/}

            </div>

            <h2 className="w-full text-center px-4 py-2 text-gray-700 bg-red-300 rounded-full">Data Structures & Algorithms</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {/* Sorting Card */}
              <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-red-600/50" data-category="sorting">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Sorting</h2>
                  <i className="bi bi-sort-alpha-down text-2xl text-red-600"></i>
                </div>
                <div className="sub-card space-y-2">
                  <button 
                    onClick={() => navigate('/bubble-sort')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                    data-search-term="bubble sort"
                  >
                    Bubble Sort
                  </button>
                  <button 
                    onClick={() => navigate('/insertion-sort')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                    data-search-term="insertion sort"
                  >
                    Insertion Sort
                  </button>
                  <button 
                    onClick={() => navigate('/merge-sort')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                    data-search-term="merge sort"
                  >
                    Merge Sort
                  </button>
                </div>
              </div>

              {/* Searching Card */}
              <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-green-600/50" data-category="searching">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Searching</h2>
                  <i className="bi bi-search text-2xl text-green-600"></i>
                </div>
                <div className="sub-card space-y-2">
                  <button 
                    onClick={() => navigate('/binary-search')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                    data-search-term="binary search"
                  >
                    Binary Search
                  </button>
                  <button 
                    onClick={() => navigate('/linear-search')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                    data-search-term="linear search"
                  >
                    Linear Search
                  </button>
                </div>
              </div>

              {/* Graph Algorithms Card */}
              <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-blue-600/50" data-category="graph-algorithms">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Graph Algorithms</h2>                
                  <i className="bi bi-graph-up text-2xl text-blue-600"></i>
                </div>
                <div className="sub-card space-y-2">
                  <button 
                    onClick={() => navigate('/bfs')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                    data-search-term="bfs"
                  >
                    Breadth-First Search (BFS)
                  </button>
                  <button 
                    onClick={() => navigate('/dfs')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                    data-search-term="dfs"
                  >
                    Depth-First Search (DFS)
                  </button>
                </div>
              </div>

              {/* Dynamic Programming Card */}
              <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-purple-600/50" data-category="dynamic-programming">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Dynamic Programming</h2>
                  <i className="bi bi-diagram-3 text-2xl text-purple-600"></i>
                </div>
                <div className="sub-card space-y-2">
                  <button 
                    onClick={() => navigate('/knapsack')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 rounded-md" 
                    data-search-term="knapsack"
                  >
                    0/1 Knapsack
                  </button>
                  <button 
                    onClick={() => navigate('/nqueen-dp')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 rounded-md" 
                    data-search-term="n-queen"
                  >
                    N-Queen
                  </button>
                </div>
              </div>
              </div>

              <div className="mt-8 flex justify-center items-center"> <MoreButton/> </div>
              
            {/* DSA Funground Section */}
{/* Main heading for the section */}
<h1 className="text-4xl font-bold text-center text-red-600 mb-12 mt-12">DSA Funground</h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  
  {/* Keywords Card */}
  <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-red-600/50 text-center" data-game="keywords">
    <div className="mb-6">
      <i className="bi bi-chat-text text-6xl text-red-600 mb-4"></i>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">DSA Keywords</h2>
    <p className="text-gray-600 mb-6">Test your knowledge of Data Structures and Algorithms terminology</p>
    <button 
      onClick={() => navigate('/keywords')} 
      className="funground-play-btn bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
      shadow-lg shadow-red-500/50 hover:shadow-red-500 transition-all duration-300 hover:shadow-[0px_0px_5px_rgb(255,25,0),0px_0px_25px_rgb(255,25,0),0px_0px_50px_rgb(255,25,0),0px_0px_100px_rgb(255,25,0)]"
    >
      <i className="bi bi-play-fill mr-2"></i>Play Now
    </button>
  </div>

  {/* Quiz Card */}
  <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-green-600/50 text-center" data-game="quiz">
    <div className="mb-6">
      <i className="bi bi-question-diamond text-6xl text-green-600 mb-4"></i>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">DSA Quiz</h2>
    <p className="text-gray-600 mb-6">Challenge yourself with multiple-choice DSA questions</p>
    <button 
      onClick={() => navigate('/quiz')} 
      className="funground-play-btn bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
      shadow-lg shadow-green-500/50 hover:shadow-green-500 transition-all duration-300 hover:shadow-[0px_0px_5px_rgb(255,25,0),0px_0px_25px_rgb(255,25,0),0px_0px_50px_rgb(255,25,0),0px_0px_100px_rgb(255,25,0)]"
    >
      <i className="bi bi-play-fill mr-2"></i>Play Now
    </button>
  </div>

  {/* Duo Code Card */}
  <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-blue-600/50 text-center">
      <div className="mb-6">
        <i className="bi bi-code-slash text-6xl text-blue-600 mb-4"></i>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Duo Code</h2>
      <p className="text-gray-600 mb-6">Collaborative coding challenges with a friend</p>
      
      <button 
        onClick={createRoom} // Call function to create & navigate to room
        className="funground-play-btn bg-blue-500 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
        shadow-lg shadow-blue-500/50 hover:shadow-blue-500 transition-all duration-300 hover:shadow-[0px_0px_5px_rgb(255,25,0),0px_0px_25px_rgb(255,25,0),0px_0px_50px_rgb(255,25,0),0px_0px_100px_rgb(255,25,0)]"
      >
        <i className="bi bi-play-fill mr-2"></i>Play Now
      </button>
    </div>
  </div>


          </main>
        } />
        <Route path="/more" element={<MorePage data={data} openVisualizer={openVisualizer} />} />
        <Route path="/bubble-sort" element={<BubbleSortVisualizer />} />
        <Route path="/insertion-sort" element={<InsertionSortVisualizer />} />
        <Route path="/merge-sort" element={<MergeSortVisualizer />} />
        <Route path="/nqueen-dp" element={<NQueenVisualizer />} />
        <Route path="/binary-search" element={<BinarySearchVisualizer />} />
        <Route path="/linear-search" element={<LinearSearchVisualizer />} />
        <Route path="/bfs" element={<BFSVisualizer />} />
        <Route path="/dfs" element={<DFSVisualizer />} />
        <Route path="/knapsack" element={<KnapsackVisualizer />} />
        <Route path="/selection-sort" element={<SelectionSortVisualizer />} />
        <Route path="/quick-sort" element={<QuickSortVisualizer />} />
        <Route path="/heap-sort" element={<HeapSortVisualizer />} />
        <Route path="/radix-sort" element={<RadixSortVisualizer />} />
        <Route path="/interpolation-search" element={<InterpolationSearchVisualizer />} />
        <Route path="/ternary-search" element={<TernarySearchVisualizer />} />
        <Route path="/exponential-search" element={<ExponentialSearchVisualizer />} />
        <Route path="/jump-search" element={<JumpSearchVisualizer />} />
        <Route path="/dijkstras-algorithm" element={<DijkstraVisualizer />} />
        <Route path="/floyd-warshall-algorithm" element={<FloydWarshallVisualizer />} />
        <Route path="/bellman-ford-algorithm" element={<BellmanFordVisualizer />} />
        <Route path="/kruskals-algorithm" element={<KruskalVisualizer />} />
        <Route path="/prims-algorithm" element={<PrimVisualizer />} />
        <Route path="/fibonacci-sequence" element={<FibonacciVisualizer />} />
        <Route path="/longest-common-subsequence" element={<LCSVisualizer />} />
        <Route path="/longest-increasing-subsequence" element={<LISVisualizer />} />
        <Route path="/coin-change-problem" element={<CoinChangeVisualizer />} />
        <Route path="/binary-tree" element={<BinaryTreeVisualizer />} />
        <Route path="/binary-search-tree" element={<BinarySearchTreeVisualizer/>} />
        <Route path="/avl-tree" element={<AVLTreeVisualizer />} />
        <Route path="/red-black-tree" element={<RedBlackTreeVisualizer />} />
        <Route path="/segment-tree" element={<SegmentTreeVisualizer />} />
        <Route path="/fenwick-tree" element={<FenwickTreeVisualizer />} />
        <Route path="/huffman-encoding" element={<HuffmanTreeVisualizer />} />
        <Route path="/activity-selection-problem" element={<ActivitySelectionVisualizer />} />
        <Route path="/fractional-knapsack" element={<FractionalKnapsackVisualizer />} />
        <Route path="/job-scheduling-problem" element={<JobSchedulingVisualizer />} />
        <Route path="/sudoku-solver" element={<SudokuSolverVisualizer />} />
        <Route path="/rat-in-a-maze" element={<RatInAMazeVisualizer />} />
        <Route path="/subset-sum-problem" element={<SubsetSumVisualizer />} />
        <Route path="/hamiltonian-cycle" element={<HamiltonianCycleVisualizer />} />
        <Route path="/graph-coloring" element={<GraphColoringVisualizer />} />
        <Route path="/array" element={<ArrayVisualizer />} />
        <Route path="/linked-list" element={<LinkedListVisualizer />} />
        <Route path="/stack" element={<StackVisualizer />} />
        <Route path="/queue" element={<QueueVisualizer />} />
        <Route path="/keywords" element={<DSAKeywords />} />
        <Route path="/quiz" element={<DSAQuestions />} />
        <Route path="/editor/:roomId" element={<EditorWrapper />} />
      </Routes>
      <DSAGPT/>
    </div>
    </Suspense>
  );
};

const EditorWrapper = () => {
  const { roomId } = useParams();
  return <Editor1 roomId={roomId} />;
};

export default App;