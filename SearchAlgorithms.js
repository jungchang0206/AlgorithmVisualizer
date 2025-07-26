export class SearchAlgorithms {
    constructor(helpers) {
        this.helpers = helpers;
    }

    async linearSearch(visualizer) {
        const randomIndex = Math.floor(Math.random() * visualizer.array.length);
        const target = visualizer.array[randomIndex];
        visualizer.elements.statusText.textContent = `Searching for ${target}...`;

        for (let i = 0; i < visualizer.array.length; i++) {
            if (visualizer.isPaused) return;
            this.helpers.highlightBars([i], 'comparing', visualizer);
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            if (visualizer.array[i] === target) {
                this.helpers.highlightBars([i], 'sorted', visualizer);
                visualizer.elements.statusText.textContent = `Found ${target} at index ${i}!`;
                return;
            }
            this.helpers.clearHighlight(i, visualizer);
        }
    }

    async binarySearch(visualizer) {
        const randomIndex = Math.floor(Math.random() * visualizer.array.length);
        const target = visualizer.array[randomIndex];
        visualizer.elements.statusText.textContent = `Searching for ${target}...`;

        let left = 0;
        let right = visualizer.array.length - 1;
        this.helpers.highlightRange(left, right, 'active', visualizer);

        while (left <= right) {
            if (visualizer.isPaused) {
                this.helpers.clearHighlights(visualizer);
                return;
            }
            const mid = Math.floor((left + right) / 2);
            this.helpers.highlightBars([mid], 'comparing', visualizer);
            visualizer.comparisons++;
            visualizer.elements.comparisons.textContent = visualizer.comparisons;
            await visualizer.sleep();
            if (visualizer.array[mid] === target) {
                this.helpers.clearHighlights(visualizer);
                this.helpers.highlightBars([mid], 'sorted', visualizer);
                visualizer.elements.statusText.textContent = `Found ${target} at index ${mid}!`;
                return;
            }
            this.helpers.clearHighlight(mid, visualizer);
            if (visualizer.array[mid] < target) {
                this.helpers.clearHighlights(visualizer);
                left = mid + 1;
                this.helpers.highlightRange(left, right, 'active', visualizer);
            } else {
                this.helpers.clearHighlights(visualizer);
                right = mid - 1;
                this.helpers.highlightRange(left, right, 'active', visualizer);
            }
            await visualizer.sleep();
        }
        this.helpers.clearHighlights(visualizer);
        visualizer.elements.statusText.textContent = `${target} not found in array.`;
    }
}