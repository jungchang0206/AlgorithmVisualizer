import { HelperMethods } from './HelperMethods.js';
import { SortingAlgorithms } from './SortingAlgorithms.js';
import { SearchAlgorithms } from './SearchAlgorithms.js';
import { TreeAlgorithms } from './TreeAlgorithms.js';
import { DynamicProgramming } from './DynamicProgramming.js';
import { GraphAlgorithms } from './GraphAlgorithms.js';

export class AlgorithmVisualizer {
    constructor() {
        this.helpers = new HelperMethods(this);
        this.sorting = new SortingAlgorithms(this.helpers);
        this.search = new SearchAlgorithms(this.helpers);
        this.trees = new TreeAlgorithms(this.helpers);
        this.dp = new DynamicProgramming(this.helpers);
        this.graphs = new GraphAlgorithms(this.helpers);

        this.array = [];
        this.isRunning = false;
        this.isPaused = false;
        this.stepMode = false;
        this.nextStep = null;
        this.currentTopic = 'sorting';
        this.currentAlgorithm = 'bubble';
        this.speed = 300;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;

        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();
        this.updateAlgorithmInfo();
    }

    initializeElements() {
        this.elements = {
            topicSelect: document.getElementById('topicSelect'),
            algorithmSelect: document.getElementById('algorithmSelect'),
            sizeSelect: document.getElementById('sizeSelect'),
            speedSlider: document.getElementById('speedSlider'),
            generateBtn: document.getElementById('generateBtn'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            stepBtn: document.getElementById('stepBtn'),
            arrayContainer: document.getElementById('arrayContainer'),
            countingContainer: document.getElementById('countingContainer'),
            treeContainer: document.getElementById('treeContainer'),
            graphContainer: document.getElementById('graphContainer'),
            dpContainer: document.getElementById('dpContainer'),
            statusText: document.getElementById('statusText'),
            comparisons: document.getElementById('comparisons'),
            swaps: document.getElementById('swaps'),
            time: document.getElementById('time'),
            algorithmDescription: document.getElementById('algorithmDescription'),
            timeComplexity: document.getElementById('timeComplexity'),
            spaceComplexity: document.getElementById('spaceComplexity'),
            stable: document.getElementById('stable')
        };
        for (const [key, value] of Object.entries(this.elements)) {
            if (!value) {
                console.error(`Element with ID '${key}' not found in the DOM`);
                this.elements.statusText.textContent = `Error: Missing element '${key}'`;
                return;
            }
        }
    }

    setupEventListeners() {
        this.elements.topicSelect.addEventListener('change', () => {
            this.currentTopic = this.elements.topicSelect.value;
            this.updateAlgorithmOptions();
            this.reset();
        });

        this.elements.algorithmSelect.addEventListener('change', () => {
            this.currentAlgorithm = this.elements.algorithmSelect.value;
            this.updateAlgorithmInfo();
            this.reset();
        });

        this.elements.sizeSelect.addEventListener('change', () => {
            this.generateArray();
        });

        this.elements.speedSlider.addEventListener('input', () => {
            this.speed = 1000 - parseInt(this.elements.speedSlider.value);
        });

        this.elements.generateBtn.addEventListener('click', () => this.generateArray());
        this.elements.startBtn.addEventListener('click', () => this.start());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        this.elements.stepBtn.addEventListener('click', () => this.step());
    }

    updateAlgorithmOptions() {
        const algorithmSelect = this.elements.algorithmSelect;
        algorithmSelect.innerHTML = '';

        const algorithms = {
            sorting: [
                { value: 'bogo', name: 'Bogo Sort' },
                { value: 'bubble', name: 'Bubble Sort' },
                { value: 'selection', name: 'Selection Sort' },
                { value: 'insertion', name: 'Insertion Sort' },
                { value: 'quick', name: 'Quick Sort' },
                { value: 'merge', name: 'Merge Sort' },
                { value: 'counting', name: 'Counting Sort' }
            ],
            search: [
                { value: 'linear', name: 'Linear Search' },
                { value: 'binary', name: 'Binary Search' }
            ],
            trees: [
                { value: 'binary-search-tree', name: 'Binary Search Tree' },
                { value: 'avl-tree', name: 'AVL Tree' },
                { value: 'red-black-tree', name: 'Red-Black Tree' }
            ],
            graphs: [
                { value: 'bfs', name: 'Breadth-First Search' },
                { value: 'dfs', name: 'Depth-First Search' },
                { value: 'dijkstra', name: "Dijkstra's Algorithm" },
                { value: 'kruskal', name: "Kruskal's Algorithm" },
                { value: 'topologicalSort', name: 'Topological Sort' },
                { value: 'prim', name: "Prim's Algorithm" },
                { value: 'khan', name: "Khan's Algorithm" }
            ],
            dp: [
                { value: 'fibonacci', name: 'Fibonacci Sequence' },
                { value: 'knapsack', name: '0/1 Knapsack' },
                { value: 'lcs', name: 'Longest Common Subsequence' },
                { value: 'bellmanFord', name: 'Bellman-Ford Algorithm' }
            ]
        };

        algorithms[this.currentTopic].forEach(alg => {
            const option = document.createElement('option');
            option.value = alg.value;
            option.textContent = alg.name;
            algorithmSelect.appendChild(option);
        });

        this.currentAlgorithm = algorithmSelect.value;
        this.updateAlgorithmInfo();
    }

    generateArray() {
        const size = parseInt(this.elements.sizeSelect.value);
        this.array = [];

        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 100) + 1);
        }

        console.log('Generated unsorted array:', this.array);
        this.renderArray();
        this.reset();
    }

    renderArray() {
        this.elements.arrayContainer.style.display = this.currentTopic === 'sorting' || this.currentTopic === 'search' ? 'flex' : 'none';
        this.elements.countingContainer.style.display = this.currentAlgorithm === 'counting' ? 'flex' : 'none';
        this.elements.treeContainer.style.display = this.currentTopic === 'trees' ? 'block' : 'none';
        this.elements.graphContainer.style.display = this.currentTopic === 'graphs' ? 'block' : 'none';
        this.elements.dpContainer.style.display = this.currentTopic === 'dp' ? 'block' : 'none';

        if (this.currentTopic === 'sorting' || this.currentTopic === 'search') {
            this.helpers.renderArray(this.array);
        } else if (this.currentTopic === 'trees') {
            this.helpers.renderTree(this.array);
        } else if (this.currentTopic === 'graphs') {
            this.helpers.renderGraph(this.array);
        } else if (this.currentTopic === 'dp') {
            this.helpers.renderDPTable(this.array);
        }
    }

    updateAlgorithmInfo() {
        const info = {
            bogo: {
                description: "Bogo Sort: Randomly shuffles the array until it is sorted by chance.",
                time: "O((n+1)!) avg, O(∞) worst",
                space: "O(1)",
                stable: "Yes"
            },
            bubble: {
                description: "Bubble Sort: Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.",
                time: "O(n²)",
                space: "O(1)",
                stable: "Yes"
            },
            selection: {
                description: "Selection Sort: Finds the minimum element and places it at the beginning, then repeats for the rest.",
                time: "O(n²)",
                space: "O(1)",
                stable: "No"
            },
            insertion: {
                description: "Insertion Sort: Builds the sorted array one element at a time by inserting each element in its correct position.",
                time: "O(n²)",
                space: "O(1)",
                stable: "Yes"
            },
            quick: {
                description: "Quick Sort: Divides the array around a pivot element and recursively sorts the subarrays.",
                time: "O(n log n) avg, O(n²) worst",
                space: "O(log n)",
                stable: "No"
            },
            linear: {
                description: "Linear Search: Checks each element in sequence until the target is found.",
                time: "O(n)",
                space: "O(1)",
                stable: "N/A"
            },
            binary: {
                description: "Binary Search: Efficiently finds an item in a sorted array by repeatedly dividing the search interval in half.",
                time: "O(log n)",
                space: "O(1)",
                stable: "N/A"
            },
            'binary-search-tree': {
                description: "Binary Search Tree: A node-based binary tree where each node has at most two children with left < parent < right.",
                time: "O(log n) avg, O(n) worst",
                space: "O(n)",
                stable: "N/A"
            },
            'avl-tree': {
                description: "AVL Tree: A self-balancing BST where heights of two child subtrees differ by at most one.",
                time: "O(log n)",
                space: "O(n)",
                stable: "N/A"
            },
            'red-black-tree': {
                description: "Red-Black Tree: A self-balancing BST with additional color properties to ensure balance.",
                time: "O(log n)",
                space: "O(n)",
                stable: "N/A"
            },
            bfs: {
                description: "Breadth-First Search: Explores all nodes at the present depth before moving to the next depth level.",
                time: "O(V + E)",
                space: "O(V)",
                stable: "N/A"
            },
            dfs: {
                description: "Depth-First Search: Explores as far as possible along each branch before backtracking.",
                time: "O(V + E)",
                space: "O(V)",
                stable: "N/A"
            },
            dijkstra: {
                description: "Dijkstra's Algorithm: Finds the shortest paths from a source vertex to all other vertices in a weighted graph.",
                time: "O((V + E) log V)",
                space: "O(V)",
                stable: "N/A"
            },
            kruskal: {
                description: "Kruskal's Algorithm: Finds a minimum spanning tree for a connected weighted graph.",
                time: "O(E log E)",
                space: "O(V + E)",
                stable: "N/A"
            },
            topologicalSort: {
                description: "Topological Sort: Orders vertices in a directed acyclic graph such that if there is an edge from u to v, u appears before v.",
                time: "O(V + E)",
                space: "O(V)",
                stable: "N/A"
            },
            prim: {
                description: "Prim's Algorithm: Finds a minimum spanning tree for a connected weighted undirected graph by growing a tree from a starting vertex.",
                time: "O((V + E) log V)",
                space: "O(V)",
                stable: "N/A"
            },
            khan: {
                description: "Khan's Algorithm: Performs a topological sort on a directed acyclic graph using in-degree of vertices.",
                time: "O(V + E)",
                space: "O(V)",
                stable: "N/A"
            },
            bellmanFord: {
                description: "Bellman-Ford Algorithm: Computes shortest paths from a single source vertex to all other vertices, handling negative weights.",
                time: "O(VE)",
                space: "O(V)",
                stable: "N/A"
            },
            fibonacci: {
                description: "Fibonacci Sequence: Computes the nth Fibonacci number using dynamic programming.",
                time: "O(n)",
                space: "O(n)",
                stable: "N/A"
            },
            knapsack: {
                description: "0/1 Knapsack: Solves the problem of selecting items with maximum value within a weight constraint.",
                time: "O(nW)",
                space: "O(nW)",
                stable: "N/A"
            },
            lcs: {
                description: "Longest Common Subsequence: Finds the longest subsequence present in two sequences.",
                time: "O(mn)",
                space: "O(mn)",
                stable: "N/A"
            },
            merge: {
                description: "Merge Sort: Divides the array into halves, sorts them, and merges the sorted halves.",
                time: "O(n log n)",
                space: "O(n)",
                stable: "Yes"
            },
            counting: {
                description: "Counting Sort: Uses a counting array to determine the position of each element, sorting based on frequency.",
                time: "O(n + k)",
                space: "O(k)",
                stable: "Yes"
            }
        };

        const current = info[this.currentAlgorithm];
        this.elements.algorithmDescription.innerHTML = `<strong>${current.description}</strong>`;
        this.elements.timeComplexity.textContent = current.time;
        this.elements.spaceComplexity.textContent = current.space;
        this.elements.stable.textContent = current.stable;
    }

    async start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.elements.startBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
            if (this.nextStep) this.nextStep();
            return;
        }

        this.isRunning = true;
        this.isPaused = false;
        this.stepMode = false;
        this.startTime = Date.now();
        this.comparisons = 0;
        this.swaps = 0;
        this.elements.comparisons.textContent = '0';
        this.elements.swaps.textContent = '0';

        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        this.elements.generateBtn.disabled = true;
        this.elements.stepBtn.disabled = true;

        this.elements.statusText.textContent = 'Preparing...';

        try {
            let algorithmPromise;
            switch (this.currentTopic) {
                case 'sorting':
                    switch (this.currentAlgorithm) {
                        case 'bubble':
                            algorithmPromise = this.sorting.bubbleSort(this);
                            this.elements.statusText.textContent = 'Sorting with Bubble Sort...';
                            break;
                        case 'selection':
                            algorithmPromise = this.sorting.selectionSort(this);
                            this.elements.statusText.textContent = 'Sorting with Selection Sort...';
                            break;
                        case 'insertion':
                            algorithmPromise = this.sorting.insertionSort(this);
                            this.elements.statusText.textContent = 'Sorting with Insertion Sort...';
                            break;
                        case 'quick':
                            algorithmPromise = this.sorting.quickSort(this, 0, this.array.length - 1);
                            this.elements.statusText.textContent = 'Sorting with Quick Sort...';
                            break;
                        case 'merge':
                            algorithmPromise = this.sorting.mergeSort(this, 0, this.array.length - 1);
                            this.elements.statusText.textContent = 'Sorting with Merge Sort...';
                            break;
                        case 'bogo':
                            algorithmPromise = this.sorting.bogoSort(this);
                            this.elements.statusText.textContent = 'Sorting with Bogo Sort...';
                            break;
                        case 'counting':
                            algorithmPromise = this.sorting.countingSort(this);
                            this.elements.statusText.textContent = 'Sorting with Counting Sort...';
                            break;
                        default:
                            throw new Error(`Unknown sorting algorithm: ${this.currentAlgorithm}`);
                    }
                    break;
                case 'search':
                    switch (this.currentAlgorithm) {
                        case 'linear':
                            algorithmPromise = this.search.linearSearch(this);
                            this.elements.statusText.textContent = 'Searching with Linear Search...';
                            break;
                        case 'binary':
                            this.array.sort((a, b) => a - b);
                            this.renderArray();
                            algorithmPromise = this.search.binarySearch(this);
                            this.elements.statusText.textContent = 'Searching with Binary Search...';
                            break;
                        default:
                            throw new Error(`Unknown search algorithm: ${this.currentAlgorithm}`);
                    }
                    break;
                case 'trees':
                    switch (this.currentAlgorithm) {
                        case 'binary-search-tree':
                            algorithmPromise = this.trees.binarySearchTree(this);
                            this.elements.statusText.textContent = 'Building Binary Search Tree...';
                            break;
                        case 'avl-tree':
                            algorithmPromise = this.trees.avlTree(this);
                            this.elements.statusText.textContent = 'Building AVL Tree...';
                            break;
                        case 'red-black-tree':
                            algorithmPromise = this.trees.redBlackTree(this);
                            this.elements.statusText.textContent = 'Building Red-Black Tree...';
                            break;
                        default:
                            throw new Error(`Unknown tree algorithm: ${this.currentAlgorithm}`);
                    }
                    break;
                case 'graphs':
                    switch (this.currentAlgorithm) {
                        case 'bfs':
                            algorithmPromise = this.graphs.bfs(this);
                            this.elements.statusText.textContent = 'Running Breadth-First Search...';
                            break;
                        case 'dfs':
                            algorithmPromise = this.graphs.dfs(this);
                            this.elements.statusText.textContent = 'Running Depth-First Search...';
                            break;
                        case 'dijkstra':
                            algorithmPromise = this.graphs.dijkstra(this);
                            this.elements.statusText.textContent = "Running Dijkstra's Algorithm...";
                            break;
                        case 'kruskal':
                            algorithmPromise = this.graphs.kruskal(this);
                            this.elements.statusText.textContent = "Running Kruskal's Algorithm...";
                            break;
                        case 'topologicalSort':
                            algorithmPromise = this.graphs.topologicalSort(this);
                            this.elements.statusText.textContent = 'Running Topological Sort...';
                            break;
                        case 'prim':
                            algorithmPromise = this.graphs.prim(this);
                            this.elements.statusText.textContent = "Running Prim's Algorithm...";
                            break;
                        case 'khan':
                            algorithmPromise = this.graphs.khan(this);
                            this.elements.statusText.textContent = "Running Khan's Algorithm...";
                            break;
                        default:
                            throw new Error(`Unknown graph algorithm: ${this.currentAlgorithm}`);
                    }
                    break;
                case 'dp':
                    switch (this.currentAlgorithm) {
                        case 'fibonacci':
                            algorithmPromise = this.dp.fibonacci(this);
                            this.elements.statusText.textContent = 'Computing Fibonacci Sequence...';
                            break;
                        case 'knapsack':
                            algorithmPromise = this.dp.knapsack(this);
                            this.elements.statusText.textContent = 'Solving 0/1 Knapsack...';
                            break;
                        case 'lcs':
                            algorithmPromise = this.dp.lcs(this);
                            this.elements.statusText.textContent = 'Finding Longest Common Subsequence...';
                            break;
                        case 'bellmanFord':
                            algorithmPromise = this.dp.bellmanFord(this);
                            this.elements.statusText.textContent = 'Running Bellman-Ford Algorithm...';
                            break;
                        default:
                            throw new Error(`Unknown DP algorithm: ${this.currentAlgorithm}`);
                    }
                    break;
                default:
                    throw new Error(`Unknown topic: ${this.currentTopic}`);
            }

            await algorithmPromise;

            if (!this.isPaused) {
                this.complete();
            }
        } catch (error) {
            console.error('Visualization error:', error);
            this.elements.statusText.textContent = 'Error occurred during visualization';
            this.reset();
        }
    }

    async step() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.stepMode = true;
            this.startTime = Date.now();
            this.comparisons = 0;
            this.swaps = 0;
            this.elements.comparisons.textContent = '0';
            this.elements.swaps.textContent = '0';

            this.elements.startBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
            this.elements.generateBtn.disabled = true;
            this.elements.stepBtn.disabled = false;

            this.elements.statusText.textContent = 'Step mode - click Step to continue';

            try {
                switch (this.currentTopic) {
                    case 'sorting':
                        switch (this.currentAlgorithm) {
                            case 'bogo':
                                this.elements.statusText.textContent = 'Sorting with Bogo Sort...';
                                await this.sorting.bogoSort(this);
                                break;
                            case 'bubble':
                                this.elements.statusText.textContent = 'Sorting with Bubble Sort...';
                                await this.sorting.bubbleSort(this);
                                break;
                            case 'selection':
                                this.elements.statusText.textContent = 'Sorting with Selection Sort...';
                                await this.sorting.selectionSort(this);
                                break;
                            case 'insertion':
                                this.elements.statusText.textContent = 'Sorting with Insertion Sort...';
                                await this.sorting.insertionSort(this);
                                break;
                            case 'quick':
                                this.elements.statusText.textContent = 'Sorting with Quick Sort...';
                                await this.sorting.quickSort(this, 0, this.array.length - 1);
                                break;
                            case 'merge':
                                this.elements.statusText.textContent = 'Sorting with Merge Sort...';
                                await this.sorting.mergeSort(this, 0, this.array.length - 1);
                                break;
                            case 'counting':
                                this.elements.statusText.textContent = 'Sorting with Counting Sort...';
                                await this.sorting.countingSort(this);
                                break;
                            default:
                                throw new Error(`Unknown sorting algorithm: ${this.currentAlgorithm}`);
                        }
                        break;
                    case 'search':
                        switch (this.currentAlgorithm) {
                            case 'linear':
                                this.elements.statusText.textContent = 'Searching with Linear Search...';
                                await this.search.linearSearch(this);
                                break;
                            case 'binary':
                                this.array.sort((a, b) => a - b);
                                this.renderArray();
                                this.elements.statusText.textContent = 'Searching with Binary Search...';
                                await this.search.binarySearch(this);
                                break;
                            default:
                                throw new Error(`Unknown search algorithm: ${this.currentAlgorithm}`);
                        }
                        break;
                    case 'trees':
                        switch (this.currentAlgorithm) {
                            case 'binary-search-tree':
                                this.elements.statusText.textContent = 'Building Binary Search Tree...';
                                await this.trees.binarySearchTree(this);
                                break;
                            case 'avl-tree':
                                this.elements.statusText.textContent = 'Building AVL Tree...';
                                await this.trees.avlTree(this);
                                break;
                            case 'red-black-tree':
                                this.elements.statusText.textContent = 'Building Red-Black Tree...';
                                await this.trees.redBlackTree(this);
                                break;
                            default:
                                throw new Error(`Unknown tree algorithm: ${this.currentAlgorithm}`);
                        }
                        break;
                    case 'graphs':
                        switch (this.currentAlgorithm) {
                            case 'bfs':
                                this.elements.statusText.textContent = 'Running Breadth-First Search...';
                                await this.graphs.bfs(this);
                                break;
                            case 'dfs':
                                this.elements.statusText.textContent = 'Running Depth-First Search...';
                                await this.graphs.dfs(this);
                                break;
                            case 'dijkstra':
                                this.elements.statusText.textContent = "Running Dijkstra's Algorithm...";
                                await this.graphs.dijkstra(this);
                                break;
                            case 'kruskal':
                                this.elements.statusText.textContent = "Running Kruskal's Algorithm...";
                                await this.graphs.kruskal(this);
                                break;
                            case 'topologicalSort':
                                this.elements.statusText.textContent = 'Running Topological Sort...';
                                await this.graphs.topologicalSort(this);
                                break;
                            case 'prim':
                                this.elements.statusText.textContent = "Running Prim's Algorithm...";
                                await this.graphs.prim(this);
                                break;
                            case 'khan':
                                this.elements.statusText.textContent = "Running Khan's Algorithm...";
                                await this.graphs.khan(this);
                                break;
                            default:
                                throw new Error(`Unknown graph algorithm: ${this.currentAlgorithm}`);
                        }
                        break;
                    case 'dp':
                        switch (this.currentAlgorithm) {
                            case 'fibonacci':
                                this.elements.statusText.textContent = 'Computing Fibonacci Sequence...';
                                await this.dp.fibonacci(this);
                                break;
                            case 'knapsack':
                                this.elements.statusText.textContent = 'Solving 0/1 Knapsack...';
                                await this.dp.knapsack(this);
                                break;
                            case 'lcs':
                                this.elements.statusText.textContent = 'Finding Longest Common Subsequence...';
                                await this.dp.lcs(this);
                                break;
                            case 'bellmanFord':
                                this.elements.statusText.textContent = 'Running Bellman-Ford Algorithm...';
                                await this.dp.bellmanFord(this);
                                break;
                            default:
                                throw new Error(`Unknown DP algorithm: ${this.currentAlgorithm}`);
                        }
                        break;
                    default:
                        throw new Error(`Unknown topic: ${this.currentTopic}`);
                }

                if (!this.isPaused) {
                    this.complete();
                }
            } catch (error) {
                console.error('Step mode error:', error);
                this.elements.statusText.textContent = 'Error in step mode';
                this.reset();
            }
        } else if (this.stepMode && this.nextStep) {
            this.nextStep();
        }
    }

    pause() {
        this.isPaused = true;
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.statusText.textContent = 'Paused';
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.stepMode = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.nextStep = null;

        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.generateBtn.disabled = false;
        this.elements.stepBtn.disabled = false;

        this.elements.statusText.textContent = 'Ready to Visualize!';
        this.elements.comparisons.textContent = '0';
        this.elements.swaps.textContent = '0';
        this.elements.time.textContent = '0';

        document.querySelectorAll('.bar, .tree-node, .graph-node, .dp-cell').forEach(element => {
            element.classList.remove('comparing', 'sorted', 'pivot', 'active');
        });

        this.renderArray();
        this.elements.countingContainer.innerHTML = '';
        this.elements.treeContainer.innerHTML = '';
        this.elements.graphContainer.innerHTML = '';
        this.elements.dpContainer.innerHTML = '';
    }

    complete() {
        this.isRunning = false;
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.generateBtn.disabled = false;
        this.elements.stepBtn.disabled = false;
        this.elements.statusText.textContent = 'Visualization complete! 🎉';

        document.querySelectorAll('.bar, .tree-node, .graph-node .dp-cell').forEach(element => {
            element.classList.add('sorted');
        });

        const endTime = Date.now();
        this.elements.time.textContent = endTime - this.startTime;
    }

    sleep() {
        return new Promise(resolve => {
            if (this.stepMode) {
                this.nextStep = () => {
                    resolve();
                    this.nextStep = null;
                };
            } else {
                setTimeout(resolve, this.speed);
            }
        });
    }
}