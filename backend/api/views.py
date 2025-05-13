import os
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import re

# Load API Key from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Extended list of DSA-related keywords to match against
DSA_KEYWORDS = [
    "sorting", "searching", "recursion", "dynamic programming", "greedy algorithms", "backtracking", "divide and conquer",
    "tree", "graph", "linked list", "stack", "queue", "binary search", "heap", "hash table", "priority queue", 
    "AVL tree", "binary tree", "red-black tree", "B-tree", "trie", "disjoint set", "Floyd-Warshall algorithm", 
    "Bellman-Ford algorithm", "Dijkstra's algorithm", "Kruskal's algorithm", "Prim's algorithm", "depth-first search", 
    "breadth-first search", "topological sorting", "BFS", "DFS", "Floyd-Warshall", "Kadane's algorithm", 
    "longest common subsequence", "longest increasing subsequence", "minimum spanning tree", "Knapsack problem", 
    "subset sum problem", "matrix chain multiplication", "sliding window", "monotonic queue", "bit manipulation", 
    "graph traversal", "array", "singly linked list", "doubly linked list", "circular linked list", "binary search tree", 
    "BST", "insertion sort", "bubble sort", "selection sort", "merge sort", "quick sort", "heap sort", "shell sort", 
    "counting sort", "radix sort", "topological sort", "quickselect", "binary search tree traversal", 
    "tree traversal", "graph traversal", "matrix multiplication", "matrix exponentiation", "two-pointer technique", 
    "Knuth-Morris-Pratt", "Rabin-Karp", "Bellman-Ford", "Dijkstra", "A* algorithm", "Floyd-Warshall", "Kadane's algorithm", 
    "LCS", "LIS", "union-find", "Huffman coding", "Ford-Fulkerson", "prime numbers", "Fibonacci sequence", 
    "factorial", "GCD", "LCM", "permutations", "combinations", "Pascal's triangle", "power of two", "modular arithmetic", 
    "binomial coefficient", "Euclidean algorithm", "sieve of Eratosthenes", "fast exponentiation", 
    "Chinese remainder theorem", "fast Fourier transform"
]

@method_decorator(csrf_exempt, name='dispatch')
class DSAGPTView(View):
    def get(self, request):
        query = request.GET.get("query", "")
        
        if not query:
            return JsonResponse({"error": "Query parameter is required"}, status=400)
        
        # Log the query for debugging purposes
        print(f"Received query: {query}")

        # Check if the query contains any DSA-related keywords
        if not any(keyword.lower() in query.lower() for keyword in DSA_KEYWORDS):
            return JsonResponse({"response": "Only ask DSA related questions."}, status=400)
        
        # Log the match result for debugging purposes
        print("Query contains DSA-related keywords")

        query_with_context = f"Answer the following DSA-related question with code examples or explanations: {query}"


        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(query_with_context)
            return JsonResponse({"response": response.text})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
