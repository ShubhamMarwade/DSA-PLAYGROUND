import React, { useEffect,useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

function MorePage({ data, openVisualizer }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top on load
  }, []);

  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  return (
    <div className="MorePage h-auto">
      <Routes>
        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  onClick={() => openVisualizer(result.algorithm)}
                >
                  {result.name}
                </div>
              ))}
            </div>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                <button 
                  onClick={() => navigate('/selection-sort')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                  data-search-term="selection sort"
                >
                  Selection Sort
                </button>
                <button 
                  onClick={() => navigate('/quick-sort')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                  data-search-term="quick sort"
                >
                  Quick Sort
                </button>
                <button 
                  onClick={() => navigate('/heap-sort')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                  data-search-term="heap sort"
                >
                  Heap Sort
                </button>
                <button 
                  onClick={() => navigate('/radix-sort')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md" 
                  data-search-term="radix sort"
                >
                  Radix Sort
                </button>
              </div>
            </div>
    
            {/* Searching Card */}
            <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-yellow-600/50" data-category="searching">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Searching</h2>
                <i className="bi bi-search text-2xl text-black-600"></i>
              </div>
              <div className="sub-card space-y-2">
                <button 
                  onClick={() => navigate('/binary-search')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md" 
                  data-search-term="binary search"
                >
                  Binary Search
                </button>
                <button 
                  onClick={() => navigate('/linear-search')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md" 
                  data-search-term="linear search"
                >
                  Linear Search
                </button>
                <button 
                  onClick={() => navigate('/interpolation-search')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md" 
                  data-search-term="interpolation search"
                >
                  Interpolation Search
                </button>
                <button 
                  onClick={() => navigate('/ternary-search')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md" 
                  data-search-term="ternary search"
                >
                  Ternary Search
                </button>
                <button 
                  onClick={() => navigate('/exponential-search')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md" 
                  data-search-term="exponential search"
                >
                  Exponential Search
                </button>
                <button 
                  onClick={() => navigate('/jump-search')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md" 
                  data-search-term="jump search"
                >
                  Jump Search
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
                <button 
                  onClick={() => navigate('/dijkstras-algorithm')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                  data-search-term="dijkstra's algorithm"
                >
                  Dijkstra's Algorithm
                </button>
                <button 
                  onClick={() => navigate('/floyd-warshall-algorithm')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                  data-search-term="floyd warshall algorithm"
                >
                  Floyd-Warshall Algorithm
                </button>
                <button 
                  onClick={() => navigate('/bellman-ford-algorithm')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                  data-search-term="bellman ford algorithm"
                >
                  Bellman-Ford Algorithm
                </button>
                <button 
                  onClick={() => navigate('/Kruskals-algorithm')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                  data-search-term="kruskal's algorithm"
                >
                  Kruskal's Algorithm
                </button>
                <button 
                  onClick={() => navigate('/prims-algorithm')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md" 
                  data-search-term="prim's algorithm"
                >
                  Prim's Algorithm
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
                <button 
                  onClick={() => navigate('/fibonacci-sequence')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 rounded-md" 
                  data-search-term="fibonacci sequence"
                >
                  Fibonacci Sequence
                </button>
                <button 
                  onClick={() => navigate('/longest-common-subsequence')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 rounded-md" 
                  data-search-term="longest common subsequence (lcs)"
                >
                  Longest Common Subsequence
                </button>
                <button 
                  onClick={() => navigate('/longest-increasing-subsequence')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 rounded-md" 
                  data-search-term="longest increasing subsequence (lis)"
                >
                  Longest Increasing Subsequence
                </button>
                <button 
                  onClick={() => navigate('/coin-change-problem')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 rounded-md" 
                  data-search-term="coin change problem"
                >
                  Coin Change Problem
                </button>
              </div>
            </div>
    
            {/* Tree Card */}
            <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-green-600/50" data-category="tree">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tree</h2>
                <i className="bi bi-tree text-2xl text-green-600"></i>
              </div>
              <div className="sub-card space-y-2">
                <button 
                  onClick={() => navigate('/binary-tree')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                  data-search-term="binary tree"
                >
                  Binary Tree
                </button>
                <button 
                  onClick={() => navigate('/binary-search-tree')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                  data-search-term="binary search tree (bst)"
                >
                  Binary Search Tree
                </button>
                <button 
                  onClick={() => navigate('/avl-tree')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                  data-search-term="avl tree"
                >
                  AVL Tree
                </button>
                <button 
                  onClick={() => navigate('/red-black-tree')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                  data-search-term="red black tree"
                >
                  Red-Black Tree
                </button>
                <button 
                  onClick={() => navigate('/segment-tree')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                  data-search-term="segment tree"
                >
                  Segment Tree
                </button>
                <button 
                  onClick={() => navigate('/fenwick-tree')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100 rounded-md" 
                  data-search-term="fenwick tree"
                >
                  Fenwick Tree
                </button>
              </div>
            </div>
    
            {/* Greedy Algorithms Card */}
            <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-yellow-600/50" data-category="greedy-algorithms">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Greedy Algorithms</h2>
                <i className="bi bi-lightbulb text-2xl text-yellow-600"></i>
              </div>
              <div className="sub-card space-y-2">
                <button 
                  onClick={() => navigate('/huffman-encoding')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-100 rounded-md" 
                  data-search-term="huffman encoding"
                >
                  Huffman Encoding
                </button>
                <button 
                  onClick={() => navigate('/activity-selection-problem')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-100 rounded-md" 
                  data-search-term="activity selection problem"
                >
                  Activity Selection Problem
                </button>
                <button 
                  onClick={() => navigate('/fractional-knapsack')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-100 rounded-md" 
                  data-search-term="fractional knapsack"
                >
                  Fractional Knapsack
                </button>
                <button 
                  onClick={() => navigate('/job-scheduling-problem')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-100 rounded-md" 
                  data-search-term="job scheduling problem"
                >
                  Job Scheduling Problem
                </button>
              </div>
            </div>
    
            {/* Backtracking Card */}
            <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-pink-600/50" data-category="backtracking">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Backtracking</h2>
                <i className="bi bi-arrow-repeat text-2xl text-pink-600"></i>
              </div>
              <div className="sub-card space-y-2">
                <button 
                  onClick={() => navigate('/nqueen-dp')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md" 
                  data-search-term="n-queen"
                >
                  N-Queens Problem
                </button>
                <button 
                  onClick={() => navigate('/sudoku-solver')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md" 
                  data-search-term="sudoku solver"
                >
                  Sudoku Solver
                </button>
                <button 
                  onClick={() => navigate('/rat-in-a-maze')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md" 
                  data-search-term="rat in a maze"
                >
                  Rat in a Maze
                </button>
                <button 
                  onClick={() => navigate('/subset-sum-problem')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md" 
                  data-search-term="subset sum problem"
                >
                  Subset Sum Problem
                </button>
                <button 
                  onClick={() => navigate('/hamiltonian-cycle')} 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md"
                  data-search-term="hamiltonian cycle"
                  >
                    Hamiltonian Cycle
                  </button>
                  <button 
                    onClick={() => navigate('/graph-coloring')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md" 
                    data-search-term="graph coloring"
                  >
                    Graph Coloring
                  </button>
                  <button 
                    onClick={() => navigate('/array')} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-md" 
                    data-search-term="array"
                  >
                    Array
                  </button>
                </div>
              </div>
      
              {/* Coming Soon Card */}
              <div className="card bg-red-600 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-2xl shadow-green-600/50" data-category="advanced-dsa">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black-800">Advanced DSA</h2>
                  <i className="bi bi-gear text-2xl text-white"></i>
                </div>
                <div className="sub-card space-y-2 text-white">
                  Coming Soon...
                </div>  
              </div>  
            </div> 
          </main>
        }/>
      </Routes>
     </div> 
    );
  }
  
  export default MorePage;