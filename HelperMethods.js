export class HelperMethods {
    constructor(visualizer) {
        this.visualizer = visualizer;
    }

    highlightRange(start, end, className, visualizer) {
        for (let i = start; i <= end; i++) {
            const bar = document.getElementById(`bar-${i}`);
            if (bar) bar.classList.add(className);
        }
    }

    async swap(i, j, visualizer) {
        const temp = visualizer.array[i];
        visualizer.array[i] = visualizer.array[j];
        visualizer.array[j] = temp;
        visualizer.swaps++;
        visualizer.elements.swaps.textContent = visualizer.swaps;
        this.updateBar(i, visualizer.array[i], visualizer);
        this.updateBar(j, visualizer.array[j], visualizer);
        await visualizer.sleep();
    }

    updateBar(index, value, visualizer) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            const maxValue = Math.max(...visualizer.array) || 1;
            bar.style.height = `${(value / maxValue) * 250}px`;
            bar.textContent = value;
        }
    }

    highlightBars(indices, className, visualizer) {
        indices.forEach(index => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.classList.add(className);
        });
    }

    clearHighlights(visualizer) {
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.remove('comparing', 'active');
        });
    }

    clearHighlight(index, visualizer) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) bar.classList.remove('comparing', 'active');
    }

    renderArray(array) {
        const container = this.visualizer.elements.arrayContainer;
        container.innerHTML = '';
        const maxValue = Math.max(...array) || 1;
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.id = `bar-${index}`;
            bar.style.height = `${(value / maxValue) * 250}px`;
            bar.textContent = value;
            container.appendChild(bar);
        });
    }

    renderCountingArray(count, visualizer) {
        const container = visualizer.elements.countingContainer;
        container.innerHTML = '';
        const maxHeight = Math.max(...visualizer.array) || 1;
        count.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'counting-bar';
            bar.id = `count-${index}`;
            bar.style.height = `${(value / maxHeight) * 200}px`;
            bar.innerHTML = `<span class="count-value">${value > 0 ? value : ''}</span><br><span class="count-index">${index}</span>`;
            container.appendChild(bar);
        });
    }

    updateCountingBar(index, value, visualizer) {
        const bar = document.getElementById(`count-${index}`);
        if (bar) {
            const maxHeight = Math.max(...visualizer.array) || 1;
            bar.style.height = `${(value / maxHeight) * 200}px`;
            bar.querySelector('.count-value').textContent = value > 0 ? value : '';
            bar.classList.add('active');
            setTimeout(() => bar.classList.remove('active'), visualizer.speed);
        }
    }

    /*
    Need to render tree, grpaph, and DP table
    */
}