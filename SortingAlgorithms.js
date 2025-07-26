export class SortingAlgorithms {
    constructor(helpers) {
        this.helpers = helpers;
    }

    async bogoSort(visualizer) {
        while (!this.isSorted(visualizer.array) && !visualizer.isPaused) {
            await this.shuffle(visualizer);
            this.helpers.highlightRange(0, visualizer.array.length - 1, 'comparing', visualizer);
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            if (this.isSorted(visualizer.array)) {
                for (let i = 0; i < visualizer.array.length; i++) {
                    this.helpers.highlightBars([i], 'sorted', visualizer);
                    await visualizer.sleep();
                }
                visualizer.elements.statusText.textContent = 'Bogo Sort complete by chance!';
                return;
            }
            this.helpers.clearHighlights(visualizer);
        }
    }

    async shuffle(visualizer) {
        for (let i = visualizer.array.length - 1; i > 0; i--) {
            if (visualizer.isPaused) return;
            const j = Math.floor(Math.random() * (i + 1));
            await this.helpers.swap(i, j, visualizer);
        }
    }

    isSorted(array) {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) return false;
        }
        return true;
    }

    async bubbleSort(visualizer) {
        const n = visualizer.array.length;
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (visualizer.isPaused) return;
                this.helpers.highlightBars([i, i + 1], 'comparing', visualizer);
                visualizer.comparisons++;
                visualizer.elements.comparisons.textContent = visualizer.comparisons;
                await visualizer.sleep();
                if (visualizer.array[i] > visualizer.array[i + 1]) {
                    await this.helpers.swap(i, i + 1, visualizer);
                    swapped = true;
                }
                this.helpers.clearHighlights(visualizer);
                if (i === n - 2) this.helpers.highlightBars([n - (swapped ? 0 : 1)], 'sorted', visualizer);
            }
        } while (swapped && !visualizer.isPaused);
        if (!visualizer.isPaused) for (let i = 0; i < n; i++) this.helpers.highlightBars([i], 'sorted', visualizer);
    }

    async selectionSort(visualizer) {
        const n = visualizer.array.length;
        for (let i = 0; i < n - 1; i++) {
            if (visualizer.isPaused) return;
            let minIdx = i;
            this.helpers.highlightBars([i], 'pivot', visualizer);
            await visualizer.sleep();
            for (let j = i + 1; j < n; j++) {
                if (visualizer.isPaused) return;
                this.helpers.highlightBars([j], 'comparing', visualizer);
                visualizer.comparisons++;
                visualizer.elements.comparisons.textContent = visualizer.comparisons;
                await visualizer.sleep();
                if (visualizer.array[j] < visualizer.array[minIdx]) {
                    if (minIdx !== i) this.helpers.clearHighlight(minIdx, visualizer);
                    minIdx = j;
                    this.helpers.highlightBars([minIdx], 'pivot', visualizer);
                    await visualizer.sleep();
                }
                this.helpers.clearHighlight(j, visualizer);
            }
            if (minIdx !== i) await this.helpers.swap(i, minIdx, visualizer);
            this.helpers.highlightBars([i], 'sorted', visualizer);
            this.helpers.clearHighlight(minIdx, visualizer);
        }
        if (!visualizer.isPaused) this.helpers.highlightBars([n - 1], 'sorted', visualizer);
    }

    async insertionSort(visualizer) {
        const n = visualizer.array.length;
        for (let i = 1; i < n; i++) {
            if (visualizer.isPaused) return;
            let key = visualizer.array[i];
            let j = i - 1;
            this.helpers.highlightBars([i], 'pivot', visualizer);
            await visualizer.sleep();
            while (j >= 0 && visualizer.array[j] > key) {
                if (visualizer.isPaused) return;
                this.helpers.highlightBars([j, j + 1], 'comparing', visualizer);
                visualizer.comparisons++;
                visualizer.elements.comparisons.textContent = visualizer.comparisons;
                await visualizer.sleep();
                visualizer.array[j + 1] = visualizer.array[j];
                visualizer.swaps++;
                visualizer.elements.swaps.textContent = visualizer.swaps;
                this.helpers.updateBar(j + 1, visualizer.array[j + 1], visualizer);
                j--;
                this.helpers.clearHighlights(visualizer);
            }
            visualizer.array[j + 1] = key;
            this.helpers.updateBar(j + 1, key, visualizer);
            this.helpers.clearHighlights(visualizer);
            for (let k = 0; k <= i; k++) this.helpers.highlightBars([k], 'sorted', visualizer);
        }
    }

    async quickSort(visualizer, low, high) {
        if (low < high && !visualizer.isPaused) {
            const pi = await this.partition(visualizer, low, high);
            await this.quickSort(visualizer, low, pi - 1);
            await this.quickSort(visualizer, pi + 1, high);
        }
    }

    async partition(visualizer, low, high) {
        const pivot = visualizer.array[high];
        this.helpers.highlightBars([high], 'pivot', visualizer);
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (visualizer.isPaused) return i + 1;
            this.helpers.highlightBars([j], 'comparing', visualizer);
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            if (visualizer.array[j] < pivot) {
                i++;
                if (i !== j) await this.helpers.swap(i, j, visualizer);
            }
            this.helpers.clearHighlight(j, visualizer);
        }
        await this.helpers.swap(i + 1, high, visualizer);
        this.helpers.clearHighlights(visualizer);
        return i + 1;
    }

    async mergeSort(visualizer, left, right) {
        if (left < right && !visualizer.isPaused) {
            const mid = Math.floor((left + right) / 2);
            await this.mergeSort(visualizer, left, mid);
            await this.mergeSort(visualizer, mid + 1, right);
            await this.merge(visualizer, left, mid, right);
        }
        if (left === 0 && right === visualizer.array.length - 1 && !visualizer.isPaused) {
            for (let i = 0; i < visualizer.array.length; i++) {
                this.helpers.highlightBars([i], 'sorted', visualizer);
                await visualizer.sleep();
            }
        }
    }

    async merge(visualizer, left, mid, right) {
        const leftArray = visualizer.array.slice(left, mid + 1);
        const rightArray = visualizer.array.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;
        this.helpers.highlightRange(left, right, 'active', visualizer);
        while (i < leftArray.length && j < rightArray.length && !visualizer.isPaused) {
            this.helpers.highlightBars([left + i], 'comparing', visualizer);
            this.helpers.highlightBars([mid + 1 + j], 'comparing', visualizer);
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            if (leftArray[i] <= rightArray[j]) {
                visualizer.array[k] = leftArray[i];
                this.helpers.updateBar(k, visualizer.array[k], visualizer);
                i++;
            } else {
                visualizer.array[k] = rightArray[j];
                this.helpers.updateBar(k, visualizer.array[k], visualizer);
                j++;
            }
            k++;
            this.helpers.clearHighlights(visualizer);
            await visualizer.sleep();
        }
        while (i < leftArray.length && !visualizer.isPaused) {
            this.helpers.highlightBars([left + i], 'comparing', visualizer);
            visualizer.array[k] = leftArray[i];
            this.helpers.updateBar(k, visualizer.array[k], visualizer);
            i++;
            k++;
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            this.helpers.clearHighlights(visualizer);
        }
        while (j < rightArray.length && !visualizer.isPaused) {
            this.helpers.highlightBars([mid + 1 + j], 'comparing', visualizer);
            visualizer.array[k] = rightArray[j];
            this.helpers.updateBar(k, visualizer.array[k], visualizer);
            j++;
            k++;
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            this.helpers.clearHighlights(visualizer);
        }
        this.helpers.clearHighlights(visualizer);
    }

    async countingSort(visualizer) {
        const maxValue = Math.max(...visualizer.array);
        let count = new Array(maxValue + 1).fill(0);
        this.helpers.renderCountingArray(count, visualizer);

        for (let i = 0; i < visualizer.array.length && !visualizer.isPaused; i++) {
            this.helpers.highlightBars([i], 'comparing', visualizer);
            count[visualizer.array[i]]++;
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            this.helpers.updateCountingBar(visualizer.array[i], count[visualizer.array[i]], visualizer);
            await visualizer.sleep();
            this.helpers.clearHighlights(visualizer);
        }

        for (let i = 1; i < count.length && !visualizer.isPaused; i++) {
            count[i] += count[i - 1];
            this.helpers.updateCountingBar(i, count[i], visualizer);
            await visualizer.sleep();
        }

        const output = new Array(visualizer.array.length);
        for (let i = visualizer.array.length - 1; i >= 0 && !visualizer.isPaused; i--) {
            this.helpers.highlightBars([i], 'comparing', visualizer);
            output[count[visualizer.array[i]] - 1] = visualizer.array[i];
            count[visualizer.array[i]]--;
            this.helpers.updateCountingBar(visualizer.array[i], count[visualizer.array[i]], visualizer);
            await visualizer.sleep();
            this.helpers.clearHighlights(visualizer);
        }

        for (let i = 0; i < output.length && !visualizer.isPaused; i++) {
            visualizer.array[i] = output[i];
            this.helpers.updateBar(i, visualizer.array[i], visualizer);
            this.helpers.highlightBars([i], 'sorted', visualizer);
            await visualizer.sleep();
        }

        if (!visualizer.isPaused) {
            visualizer.elements.statusText.textContent = 'Counting Sort complete!';
        }
    }
}