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
                { value: 'bubble', name: 'Bubble Sort' },
                { value: 'selection', name: 'Selection Sort' },
                { value: 'insertion', name: 'Insertion Sort' },
                { value: 'quick', name: 'Quick Sort' }
            ],
            search: [
                { value: 'linear', name: 'Linear Search' },
                { value: 'binary', name: 'Binary Search' }
            ],
            trees: [
                { value: 'bst', name: 'Binary Search Tree' },
                { value: 'avl', name: 'AVL Tree' },
                { value: 'traversal', name: 'Tree Traversal' }
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
            this.array.push(Math.floor(Math.random() * 300) + 10);
        }

        if (this.currentAlgorithm === 'binary') {
            this.array.sort((a, b) => a - b);
        }

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
            bar.style.backgroundColor = '#4f46e5';
            bar.textContent = value;
            bar.id = `bar-${index}`;
            container.appendChild(bar);
        });
    }

    updateAlgorithmInfo() {
        const info = {
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

    this.elements.statusText.textContent = 'Sorting...';

    try {
        let algorithmPromise;
        switch (this.currentAlgorithm) {
            case 'bubble':
                algorithmPromise = this.bubbleSort();
                break;
            case 'selection':
                algorithmPromise = this.selectionSort();
                break;
            case 'insertion':
                algorithmPromise = this.insertionSort();
                break;
            case 'quick':
                algorithmPromise = this.quickSort(0, this.array.length - 1);
                break;
            case 'linear':
                algorithmPromise = this.linearSearch();
                break;
            case 'binary':
                algorithmPromise = this.binarySearch();
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

        // Start the algorithm in step mode
        switch (this.currentAlgorithm) {
            case 'bubble':
                this.bubbleSort().catch(e => console.error(e));
                break;
            case 'selection':
                this.selectionSort().catch(e => console.error(e));
                break;
            case 'insertion':
                this.insertionSort().catch(e => console.error(e));
                break;
            case 'quick':
                this.quickSort(0, this.array.length - 1).catch(e => console.error(e));
                break;
            case 'linear':
                this.linearSearch().catch(e => console.error(e));
                break;
            case 'binary':
                this.binarySearch().catch(e => console.error(e));
                break;
        }
    } else if (this.stepMode && this.nextStep) {
        // Trigger the next step
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
    this.nextStep = null; // Clear any pending step

    this.elements.startBtn.disabled = false;
    this.elements.pauseBtn.disabled = true;
    this.elements.generateBtn.disabled = false;
    this.elements.stepBtn.disabled = false;

    this.elements.statusText.textContent = 'Ready to visualize!';
    this.elements.comparisons.textContent = '0';
    this.elements.swaps.textContent = '0';
    this.elements.time.textContent = '0';

    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('comparing', 'sorted', 'pivot', 'active');
    });

    this.renderArray();
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

    // Sorting Algorithms
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

                if (i === n - 2) {
                    this.highlightBars([n - (swapped ? 0 : 1)], 'sorted');
                }
            }
        } while (swapped && !this.isPaused);

        if (!this.isPaused) {
            for (let i = 0; i < n; i++) {
                this.highlightBars([i], 'sorted');
            }
        }
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

            if (minIdx !== i) {
                await this.swap(i, minIdx);
            }

            this.highlightBars([i], 'sorted');
            this.clearHighlight(minIdx);
        }

        if (!this.isPaused) {
            this.highlightBars([n - 1], 'sorted');
        }
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

            for (let k = 0; k <= i; k++) {
                this.highlightBars([k], 'sorted');
            }
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
                if (i !== j) {
                    await this.swap(i, j);
                }
            }

            this.clearHighlight(j);
        }

        await this.swap(i + 1, high);
        this.clearHighlights();

        return i + 1;
    }

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
       // Select a random index from the array to ensure the target exists
    const randomIndex = Math.floor(Math.random() * this.array.length);
    const target = this.array[randomIndex];
    this.elements.statusText.textContent = `Searching for ${target}...`;

    let left = 0;
    let right = this.array.length - 1;

    while (left <= right) {
        if (this.isPaused) return;

        const mid = Math.floor((left + right) / 2);

        this.highlightBars([mid], 'comparing');
        this.comparisons++;
        this.elements.comparisons.textContent = this.comparisons;

        await this.sleep();

        if (this.array[mid] === target) {
            this.highlightBars([mid], 'sorted');
            this.elements.statusText.textContent = `Found ${target} at index ${mid}!`;
            return;
        }

        this.clearHighlight(mid);

        if (this.array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    }

    // Helper Methods
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
            const maxValue = Math.max(...this.array);
            bar.style.height = `${(value / maxValue) * 300}px`;
            bar.textContent = value;
        }
    }

    highlightBars(indices, className) {
        indices.forEach(index => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) {
                bar.classList.add(className);
            }
        });
    }

    clearHighlights() {
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.remove('comparing', 'active');
        });
    }

    clearHighlight(index) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.classList.remove('comparing', 'active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmVisualizer();
});