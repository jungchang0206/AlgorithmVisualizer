export class HelperMethods {
    constructor(visualizer) {
        this.visualizer = visualizer;
    }

    static getDijkstraAdjacencyList() {
        return {
            0: [[1, 7], [2, 9], [5, 14]],
            1: [[2, 10], [3, 15]],
            2: [[3, 11], [5, 2]],
            3: [[4, 6]],
            4: [],
            5: [[4, 9]]
        };
    }

    static getPyramidAdjacencyList() {
        return {
            0: [1, 2],
            1: [3, 4],
            2: [5, 6],
            3: [],
            4: [],
            5: [],
            6: []
        };
    }
    
    highlightGraphNode(nodeId, color = '#FFD700') {
        const nodeElem = document.getElementById(`graph-node-${nodeId}`);
        if (nodeElem) {
            nodeElem.style.stroke = '#333';
            nodeElem.style.strokeWidth = '2px';
            nodeElem.setAttribute('fill', color); 
        }
    }
    
    clearGraphHighlights() {
        document.querySelectorAll('.graph-node').forEach(elem => {
            elem.style.stroke = '#333';
            elem.style.strokeWidth = '2px';
            elem.setAttribute('fill', '#fff');
        });
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

    renderGraph(graph, showWeights = false) {
        const container = this.visualizer.elements.graphContainer;
        container.innerHTML = '';
        let nodes = [];
        let edges = [];
        let nodePos = {};
        let width = 360, height = 300;

        const isDijkstra = Object.keys(graph).length === 6 && Object.values(graph).some(arr => Array.isArray(arr[0]));
        if (isDijkstra) {

            nodes = [0, 1, 2, 3, 4, 5];
            nodePos = {
                0: { x: width / 2, y: 20 },
                1: { x: width / 6, y: 100 },
                2: { x: 5 * width / 6, y: 100 },
                3: { x: width / 4, y: 200 },
                4: { x: 3 * width / 4, y: 200 },
                5: { x: width / 2 - 60, y: 270 } 
            };
            for (const from in graph) {
                for (const [to, weight] of graph[from]) {
                    edges.push({ from: Number(from), to: Number(to), weight });
                }
            }
            showWeights = true;
        } else {

            const adj = HelperMethods.getPyramidAdjacencyList();
            nodes = Object.keys(adj).map(Number);
            nodePos = {
                0: { x: width / 2, y: 40 },
                1: { x: width / 4, y: 120 },
                2: { x: 3 * width / 4, y: 120 },
                3: { x: width / 8, y: 220 },
                4: { x: 3 * width / 8, y: 220 },
                5: { x: 5 * width / 8, y: 220 },
                6: { x: 7 * width / 8, y: 220 }
            };
            for (const from in adj) {
                for (const to of adj[from]) {
                    edges.push({ from: Number(from), to });
                }
            }
        }
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.background = '#f9f9f9';

        edges.forEach(({ from, to, weight }) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', nodePos[from].x);
            line.setAttribute('y1', nodePos[from].y);
            line.setAttribute('x2', nodePos[to].x);
            line.setAttribute('y2', nodePos[to].y);
            line.setAttribute('stroke', '#888');
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);
            if (showWeights && typeof weight !== 'undefined') {
                const mx = (nodePos[from].x + nodePos[to].x) / 2;
                const my = (nodePos[from].y + nodePos[to].y) / 2;
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', mx);
                text.setAttribute('y', my - 5);
                text.setAttribute('font-size', '12');
                text.setAttribute('fill', '#333');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = weight;
                svg.appendChild(text);
            }
        });
        nodes.forEach((node) => {
            const { x, y } = nodePos[node];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '18');
            circle.setAttribute('fill', '#fff');
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('class', 'graph-node');
            circle.setAttribute('id', `graph-node-${node}`);
            svg.appendChild(circle);
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', y + 5);
            label.setAttribute('font-size', '16');
            label.setAttribute('fill', '#333');
            label.setAttribute('text-anchor', 'middle');
            label.textContent = node;
            svg.appendChild(label);
        });
        container.appendChild(svg);
    }
}