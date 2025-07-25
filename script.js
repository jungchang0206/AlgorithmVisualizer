class AlgorithmVisualizer {
    constructor() {
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
            algorithmContainer: document.getElementById('algorithmContainer'),
            sizeSelect: document.getElementById('sizeSelect'),
            speedSlider: document.getElementById('speedSlider'),
            generateBtn: document.getElementById('generateBtn'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            stepBtn: document.getElementById('stepBtn'),
            arrayContainer: document.getElementById('arrayContainer'),
            countingContainer: document.getElementById('countingContainer'),
            statusText: document.getElementById('statusText'),
            comparisons: document.getElementById('comparisons'),
            swaps: document.getElementById('swaps'),
            time: document.getElementById('time'),
            algorithmDescription: document.getElementById('algorithmDescription'),
            timeComplexity: document.getElementById('timeComplexity'),
            spaceComplexity: document.getElementById('spaceComplexity'),
            stable: document.getElementById('stable')
        };
        // Check for missing elements
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
                { value: 'dijkstra', name: 'Dijkstra\'s Algorithm' },
                { value: 'kruskal', name: "Kruskal's Algorithm" },
                { value: 'topologicalSort', name: 'Topological Sort' },
                { value: 'prim', name: 'Prim\'s Algorithm' },
                { value: 'khan', name: 'Khan\'s Algorithm' }
            ],
            dp: [{ value: 'fibonacci', name: 'Fibonacci Sequence' },
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
            this.array.push(Math.floor(Math.random() * 100) + 1); // Reduced range to 1-100 for simplicity
        }

        console.log('Generated unsorted array:', this.array);
        this.renderArray();
        this.reset();
    }

    renderArray() {
        const container = this.elements.arrayContainer;
        container.innerHTML = '';

        const maxValue = Math.max(...this.array);

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(value / maxValue) * 300}px`;
            bar.style.backgroundColor = '#475569';
            bar.textContent = value;
            bar.id = `bar-${index}`;
            container.appendChild(bar);
        });
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
            bst: {
                description: "Binary Search Tree: A node-based binary tree where each node has at most two children with left < parent < right.",
                time: "O(log n) avg, O(n) worst",
                space: "O(n)",
                stable: "N/A"
            },
            avl: {
                description: "AVL Tree: A self-balancing BST where heights of two child subtrees differ by at most one.",
                time: "O(log n)",
                space: "O(n)",
                stable: "N/A"
            },
            traversal: {
                description: "Tree Traversal: Techniques to visit all nodes of a tree (Inorder, Preorder, Postorder).",
                time: "O(n)",
                space: "O(n)",
                stable: "N/A"
            },
            dfs: {
                description: "Depth-First Search: Explores as far as possible along each branch before backtracking.",
                time: "O(V + E)",
                space: "O(V)",
                stable: "N/A"
            },
            bfs: {
                description: "Breadth-First Search: Explores all nodes at the present depth before moving to the next depth level.",
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

    this.elements.statusText.textContent = 'Preparing array...';

    try {
        let algorithmPromise;
        switch (this.currentAlgorithm) {
            case 'bubble':
                algorithmPromise = this.bubbleSort();
                this.elements.statusText.textContent = 'Sorting with Bubble Sort...';
                break;
            case 'selection':
                algorithmPromise = this.selectionSort();
                this.elements.statusText.textContent = 'Sorting with Selection Sort...';
                break;
            case 'insertion':
                algorithmPromise = this.insertionSort();
                this.elements.statusText.textContent = 'Sorting with Insertion Sort...';
                break;
            case 'quick':
                algorithmPromise = this.quickSort(0, this.array.length - 1);
                this.elements.statusText.textContent = 'Sorting with Quick Sort...';
                break;
            case 'linear':
                algorithmPromise = this.linearSearch();
                this.elements.statusText.textContent = 'Searching with Linear Search...';
                break;
            case 'binary':
                // Sort the array before searching
                this.array.sort((a, b) => a - b);
                this.renderArray();
                this.elements.statusText.textContent = 'Searching with Binary Search...';
                algorithmPromise = this.binarySearch();
                break;
            case 'merge':
                this.elements.statusText.textContent = 'Sorting with Merge Sort...';
                algorithmPromise = this.mergeSort(0, this.array.length - 1);
                break;
            case 'bogo':
                this.elements.statusText.textContent = 'Sorting with Bogo Sort...';
                algorithmPromise = this.bogoSort();
                break;
            case 'counting':
                this.elements.statusText.textContent = 'Sorting with Counting Sort...';
                algorithmPromise = this.countingSort();
                break;
            default:
                throw new Error(`Unknown algorithm: ${this.currentAlgorithm}`);
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
            switch (this.currentAlgorithm) {
                case 'bogo':
                    this.elements.statusText.textContent = 'Sorting with Bogo Sort...';
                    await this.bogoSort();
                    break;
                case 'bubble':
                    this.elements.statusText.textContent = 'Sorting with Bubble Sort...';
                    await this.bubbleSort();
                    break;
                case 'selection':
                    this.elements.statusText.textContent = 'Sorting with Selection Sort...';
                    await this.selectionSort();
                    break;
                case 'insertion':
                    this.elements.statusText.textContent = 'Sorting with Insertion Sort...';
                    await this.insertionSort();
                    break;
                case 'quick':
                    this.elements.statusText.textContent = 'Sorting with Quick Sort...';
                    await this.quickSort(0, this.array.length - 1);
                    break;
                case 'linear':
                    this.elements.statusText.textContent = 'Searching with Linear Search...';
                    await this.linearSearch();
                    break;
                case 'binary':
                    // Sort the array before searching
                    this.array.sort((a, b) => a - b);
                    this.renderArray();
                    this.elements.statusText.textContent = 'Searching with Binary Search...';
                    await this.binarySearch();
                    break;
                case 'merge':
                    this.elements.statusText.textContent = 'Sorting with Merge Sort...';
                    await this.mergeSort(0, this.array.length - 1);
                    break;
                case 'counting':
                    this.elements.statusText.textContent = 'Sorting with Counting Sort...';
                    await this.countingSort();
                    break;
                default:
                    throw new Error(`Unknown algorithm: ${this.currentAlgorithm}`);
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

    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('comparing', 'sorted', 'pivot', 'active');
    });

    this.renderArray();
    this.elements.countingContainer.innerHTML = ''; // Clear counting array
}

complete() {
    this.isRunning = false;
    this.elements.startBtn.disabled = false;
    this.elements.pauseBtn.disabled = true;
    this.elements.generateBtn.disabled = false;
    this.elements.stepBtn.disabled = false;
    this.elements.statusText.textContent = 'Visualization complete! 🎉';

    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.add('sorted');
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

    /*
        * Sorting Algorithms
        * Bogo Sort, Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Counting Sort
        * These methods implement various sorting algorithms with visualization.
    */
    async bogoSort() {
    while (!this.isSorted() && !this.isPaused) {
        await this.shuffle();
        this.highlightRange(0, this.array.length - 1, 'comparing');
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        if (this.isSorted()) {
            for (let i = 0; i < this.array.length; i++) {
                this.highlightBars([i], 'sorted');
                await this.sleep();
            }
            this.elements.statusText.textContent = 'Bogo Sort complete by chance!';
            return;
        }
        this.clearHighlights();
    }
}

    async shuffle() {
    for (let i = this.array.length - 1; i > 0; i--) {
        if (this.isPaused) return;
        const j = Math.floor(Math.random() * (i + 1));
        await this.swap(i, j);
    }
}

isSorted() {
    for (let i = 0; i < this.array.length - 1; i++) {
        if (this.array[i] > this.array[i + 1]) return false;
    }
    return true;
}

    async bubbleSort() {
    const n = this.array.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (this.isPaused) return;
            this.highlightBars([i, i + 1], 'comparing');
            this.comparisons++;
            this.elements.comparisons.textContent = this.comparisons;
            await this.sleep();
            if (this.array[i] > this.array[i + 1]) {
                await this.swap(i, i + 1);
                swapped = true;
            }
            this.clearHighlights();
            if (i === n - 2) this.highlightBars([n - (swapped ? 0 : 1)], 'sorted');
        }
    } while (swapped && !this.isPaused);
    if (!this.isPaused) for (let i = 0; i < n; i++) this.highlightBars([i], 'sorted');
}

    async selectionSort() {
    const n = this.array.length;
    for (let i = 0; i < n - 1; i++) {
        if (this.isPaused) return;
        let minIdx = i;
        this.highlightBars([i], 'pivot');
        await this.sleep();
        for (let j = i + 1; j < n; j++) {
            if (this.isPaused) return;
            this.highlightBars([j], 'comparing');
            this.comparisons++;
            this.elements.comparisons.textContent = this.comparisons;
            await this.sleep();
            if (this.array[j] < this.array[minIdx]) {
                if (minIdx !== i) this.clearHighlight(minIdx);
                minIdx = j;
                this.highlightBars([minIdx], 'pivot');
                await this.sleep();
            }
            this.clearHighlight(j);
        }
        if (minIdx !== i) await this.swap(i, minIdx);
        this.highlightBars([i], 'sorted');
        this.clearHighlight(minIdx);
    }
    if (!this.isPaused) this.highlightBars([n - 1], 'sorted');
}

    async insertionSort() {
    const n = this.array.length;
    for (let i = 1; i < n; i++) {
        if (this.isPaused) return;
        let key = this.array[i];
        let j = i - 1;
        this.highlightBars([i], 'pivot');
        await this.sleep();
        while (j >= 0 && this.array[j] > key) {
            if (this.isPaused) return;
            this.highlightBars([j, j + 1], 'comparing');
            this.comparisons++;
            this.elements.comparisons.textContent = this.comparisons;
            await this.sleep();
            this.array[j + 1] = this.array[j];
            this.swaps++;
            this.elements.swaps.textContent = this.swaps;
            this.updateBar(j + 1, this.array[j + 1]);
            j--;
            this.clearHighlights();
        }
        this.array[j + 1] = key;
        this.updateBar(j + 1, key);
        this.clearHighlights();
        for (let k = 0; k <= i; k++) this.highlightBars([k], 'sorted');
    }
}

    async quickSort(low, high) {
    if (low < high && !this.isPaused) {
        const pi = await this.partition(low, high);
        await this.quickSort(low, pi - 1);
        await this.quickSort(pi + 1, high);
    }
}

    async partition(low, high) {
    const pivot = this.array[high];
    this.highlightBars([high], 'pivot');
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (this.isPaused) return i + 1;
        this.highlightBars([j], 'comparing');
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        if (this.array[j] < pivot) {
            i++;
            if (i !== j) await this.swap(i, j);
        }
        this.clearHighlight(j);
    }
    await this.swap(i + 1, high);
    this.clearHighlights();
    return i + 1;
}

    async mergeSort(left, right) {
    if (left < right && !this.isPaused) {
        const mid = Math.floor((left + right) / 2);
        await this.mergeSort(left, mid);
        await this.mergeSort(mid + 1, right);
        await this.merge(left, mid, right);
    }
    if (left === 0 && right === this.array.length - 1 && !this.isPaused) {
        for (let i = 0; i < this.array.length; i++) {
            this.highlightBars([i], 'sorted');
            await this.sleep();
        }
    }
}

    async merge(left, mid, right) {
    const leftArray = this.array.slice(left, mid + 1);
    const rightArray = this.array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    this.highlightRange(left, right, 'active');
    while (i < leftArray.length && j < rightArray.length && !this.isPaused) {
        this.highlightBars([left + i], 'comparing');
        this.highlightBars([mid + 1 + j], 'comparing');
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        if (leftArray[i] <= rightArray[j]) {
            this.array[k] = leftArray[i];
            this.updateBar(k, this.array[k]);
            i++;
        } else {
            this.array[k] = rightArray[j];
            this.updateBar(k, this.array[k]);
            j++;
        }
        k++;
        this.clearHighlights();
        await this.sleep();
    }
    while (i < leftArray.length && !this.isPaused) {
        this.highlightBars([left + i], 'comparing');
        this.array[k] = leftArray[i];
        this.updateBar(k, this.array[k]);
        i++;
        k++;
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        this.clearHighlights();
    }
    while (j < rightArray.length && !this.isPaused) {
        this.highlightBars([mid + 1 + j], 'comparing');
        this.array[k] = rightArray[j];
        this.updateBar(k, this.array[k]);
        j++;
        k++;
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        this.clearHighlights();
    }
    this.clearHighlights();
}

    async countingSort() {
    const maxValue = Math.max(...this.array);
    let count = new Array(maxValue + 1).fill(0);
    this.renderCountingArray(count);

    // Step 1: Count occurrences
    for (let i = 0; i < this.array.length && !this.isPaused; i++) {
        this.highlightBars([i], 'comparing');
        count[this.array[i]]++;
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        this.updateCountingBar(this.array[i], count[this.array[i]]);
        await this.sleep();
        this.clearHighlights();
    }

    // Step 2: Compute cumulative count
    for (let i = 1; i < count.length && !this.isPaused; i++) {
        count[i] += count[i - 1];
        this.updateCountingBar(i, count[i]);
        await this.sleep();
    }

    // Step 3: Build output array
    const output = new Array(this.array.length);
    for (let i = this.array.length - 1; i >= 0 && !this.isPaused; i--) {
        this.highlightBars([i], 'comparing');
        output[count[this.array[i]] - 1] = this.array[i];
        count[this.array[i]]--;
        this.updateCountingBar(this.array[i], count[this.array[i]]);
        await this.sleep();
        this.clearHighlights();
    }

    // Step 4: Copy back to original array
    for (let i = 0; i < output.length && !this.isPaused; i++) {
        this.array[i] = output[i];
        this.updateBar(i, this.array[i]);
        this.highlightBars([i], 'sorted');
        await this.sleep();
    }

    if (!this.isPaused) {
        this.elements.statusText.textContent = 'Counting Sort complete!';
    }
}

renderCountingArray(count) {
    const container = this.elements.countingContainer;
    container.innerHTML = '';
    count.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'counting-bar';
        const maxHeight = Math.max(...this.array) || 1; // Avoid division by zero
        bar.style.height = `${(value / maxHeight) * 200}px`;
        bar.innerHTML = `<span class="count-value">${value > 0 ? value : ''}</span><br><span class="count-index">${index}</span>`;
        bar.id = `count-${index}`;
        container.appendChild(bar);
    });
}

updateCountingBar(index, value) {
    const bar = document.getElementById(`count-${index}`);
    if (bar) {
        const maxHeight = Math.max(...this.array) || 1; // Avoid division by zero
        bar.style.height = `${(value / maxHeight) * 200}px`;
        bar.querySelector('.count-value').textContent = value > 0 ? value : '';
        bar.classList.add('active');
        setTimeout(() => bar.classList.remove('active'), this.speed);
    }
}
renderCountingArray(count) {
    const container = this.elements.countingContainer;
    container.innerHTML = '';
    count.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'counting-bar';
        const maxHeight = Math.max(...this.array) || 1;
        bar.style.height = `${(value / maxHeight) * 200}px`;
        bar.textContent = value > 0 ? value : '';
        bar.id = `count-${index}`;
        container.appendChild(bar);
    });
}

updateCountingBar(index, value) {
    const bar = document.getElementById(`count-${index}`);
    if (bar) {
        const maxHeight = Math.max(...this.array) || 1;
        bar.style.height = `${(value / maxHeight) * 200}px`;
        bar.textContent = value > 0 ? value : '';
        bar.classList.add('active');
        setTimeout(() => bar.classList.remove('active'), this.speed);
    }
}

    /*
        * Search Algorithms
        * Linear Search and Binary Search
        * These methods are designed to search for a randomly selected element in the array.
        * The linear search checks each element sequentially, while the binary search requires the array to be sorted first.
    */
    async linearSearch() {
    const randomIndex = Math.floor(Math.random() * this.array.length);
    const target = this.array[randomIndex];
    this.elements.statusText.textContent = `Searching for ${target}...`;

    for (let i = 0; i < this.array.length; i++) {
        if (this.isPaused) return;
        this.highlightBars([i], 'comparing');
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        if (this.array[i] === target) {
            this.highlightBars([i], 'sorted');
            this.elements.statusText.textContent = `Found ${target} at index ${i}!`;
            return;
        }
        this.clearHighlight(i);
    }
}

    async binarySearch() {
    const randomIndex = Math.floor(Math.random() * this.array.length);
    const target = this.array[randomIndex];
    this.elements.statusText.textContent = `Searching for ${target}...`;

    let left = 0;
    let right = this.array.length - 1;
    this.highlightRange(left, right, 'active');

    while (left <= right) {
        if (this.isPaused) {
            this.clearHighlights();
            return;
        }
        const mid = Math.floor((left + right) / 2);
        this.highlightBars([mid], 'comparing');
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;
        await this.sleep();
        if (this.array[mid] === target) {
            this.clearHighlights();
            this.highlightBars([mid], 'sorted');
            this.elements.statusText.textContent = `Found ${target} at index ${mid}!`;
            return;
        }
        this.clearHighlight(mid);
        if (this.array[mid] < target) {
            this.clearHighlights();
            left = mid + 1;
            this.highlightRange(left, right, 'active');
        } else {
            this.clearHighlights();
            right = mid - 1;
            this.highlightRange(left, right, 'active');
        }
        await this.sleep();
    }
    this.clearHighlights();
    this.elements.statusText.textContent = `${target} not found in array.`;
}
/*
Tree Algorithms
* 
*/


/*
Dynamic Programming Algorithms
*/
// Helper Methods
highlightRange(start, end, className) {
    for (let i = start; i <= end; i++) {
        const bar = document.getElementById(`bar-${i}`);
        if (bar) bar.classList.add(className);
    }
}

    async swap(i, j) {
    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;
    this.swaps++;
    this.elements.swaps.textContent = this.swaps;
    this.updateBar(i, this.array[i]);
    this.updateBar(j, this.array[j]);
    await this.sleep();
}

updateBar(index, value) {
    const bar = document.getElementById(`bar-${index}`);
    if (bar) {
        const maxValue = Math.max(...this.array) || 1; // Avoid division by zero
        bar.style.height = `${(value / maxValue) * 300}px`;
        bar.textContent = value;
    }
}

highlightBars(indices, className) {
    indices.forEach(index => {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) bar.classList.add(className);
    });
}

clearHighlights() {
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('comparing', 'active');
    });
}

clearHighlight(index) {
    const bar = document.getElementById(`bar-${index}`);
    if (bar) bar.classList.remove('comparing', 'active');
}
}

document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmVisualizer();
});