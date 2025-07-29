export class GraphAlgorithms {
    // Helper to highlight a node and wait
    async _highlightAndSleep(node, visualizer, color) {
        console.log('Highlighting node:', node, 'with color:', color);
        this.helpers.highlightGraphNode(node, color);
        await visualizer.sleep();
    }
    constructor(helpers) {
        this.helpers = helpers;
    }
    // Breadth-First Search
    async bfs(graph, start, visualizer) {
        // Ensure DOM is ready for highlighting
        await new Promise(r => setTimeout(r, 50));
        const visited = new Set();
        const queue = [start];
        visited.add(start);
        while (queue.length > 0 && !visualizer.isPaused) {
            const node = queue.shift();
            await this._highlightAndSleep(node, visualizer, '#FFD700');
            for (const neighbor of graph[node] || []) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        // (Do not clear highlights here; let them persist)
    }

    // Depth-First Search
    async dfs(graph, start, visualizer) {
        // Ensure DOM is ready for highlighting
        await new Promise(r => setTimeout(r, 50));
        const visited = new Set();
        const dfsVisit = async (node) => {
            if (visited.has(node) || visualizer.isPaused) return;
            visited.add(node);
            await this._highlightAndSleep(node, visualizer, '#00BFFF');
            for (const neighbor of graph[node] || []) {
                await dfsVisit(neighbor);
            }
        };
        await dfsVisit(start);
        // (Do not clear highlights here; let them persist)
    }

    // Dijkstra's Algorithm
    async dijkstra(graph, start, visualizer) {
        const dist = {};
        const prev = {};
        const nodes = Object.keys(graph);
        for (const node of nodes) {
            dist[node] = Infinity;
            prev[node] = null;
        }
        dist[start] = 0;
        // Highlight the source node immediately
        this.helpers.highlightGraphNode(start, '#32CD32');
        await visualizer.sleep();
        const unvisited = new Set(nodes);
        while (unvisited.size > 0 && !visualizer.isPaused) {
            let u = null;
            let minDist = Infinity;
            for (const node of unvisited) {
                if (dist[node] < minDist) {
                    minDist = dist[node];
                    u = node;
                }
            }
            if (u === null) break;
            unvisited.delete(u);
            // Highlight the current node (always, including source)
            this.helpers.highlightGraphNode(u, '#32CD32');
            await visualizer.sleep();
            for (const [v, weight] of (graph[u] || [])) {
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    prev[v] = u;
                }
            }
        }
        // Optionally, clear highlights at the end or leave as is
        // this.helpers.clearGraphHighlights();
        return { dist, prev };
    }

    // Kruskal's Algorithm
    async kruskal(graph, visualizer) {
        // graph: { nodes: [...], edges: [[u, v, weight], ...] }
        const { nodes, edges } = graph;
        const parent = {};
        for (const node of nodes) parent[node] = node;
        const find = (u) => (parent[u] === u ? u : (parent[u] = find(parent[u])));
        const union = (u, v) => { parent[find(u)] = find(v); };
        const mst = [];
        edges.sort((a, b) => a[2] - b[2]);
        for (const [u, v, w] of edges) {
            if (find(u) !== find(v)) {
                mst.push([u, v, w]);
                union(u, v);
                this.helpers.highlightBars([u, v], 'comparing', visualizer);
                await visualizer.sleep();
                this.helpers.highlightBars([u, v], 'sorted', visualizer);
            }
            if (visualizer.isPaused) break;
        }
        this.helpers.clearHighlights(visualizer);
        return mst;
    }

    // Prim's Algorithm
    async prim(graph, start, visualizer) {
        const nodes = Object.keys(graph);
        const inMST = new Set();
        const key = {};
        const parent = {};
        for (const node of nodes) {
            key[node] = Infinity;
            parent[node] = null;
        }
        key[start] = 0;
        // Highlight the source node immediately
        this.helpers.highlightGraphNode(start, '#FF69B4');
        await visualizer.sleep();
        while (inMST.size < nodes.length && !visualizer.isPaused) {
            let u = null;
            let minKey = Infinity;
            for (const node of nodes) {
                if (!inMST.has(node) && key[node] < minKey) {
                    minKey = key[node];
                    u = node;
                }
            }
            if (u === null) break;
            inMST.add(u);
            // Only highlight if not the source (already highlighted)
            if (u !== start) {
                this.helpers.highlightBars([u], 'comparing', visualizer);
                await visualizer.sleep();
            }
            for (const [v, weight] of (graph[u] || [])) {
                if (!inMST.has(v) && weight < key[v]) {
                    key[v] = weight;
                    parent[v] = u;
                }
            }
            this.helpers.highlightBars([u], 'sorted', visualizer);
        }
        this.helpers.clearHighlights(visualizer);
        return parent;
    }

    // Topological Sort (Kahn's Algorithm)
    async topologicalSort(graph, visualizer) {
        const inDegree = {};
        const nodes = Object.keys(graph);
        for (const node of nodes) inDegree[node] = 0;
        for (const node of nodes) {
            for (const neighbor of graph[node] || []) {
                inDegree[neighbor]++;
            }
        }
        const queue = nodes.filter(n => inDegree[n] === 0);
        const result = [];
        while (queue.length > 0 && !visualizer.isPaused) {
            const u = queue.shift();
            result.push(u);
            this.helpers.highlightBars([u], 'comparing', visualizer);
            await visualizer.sleep();
            for (const v of graph[u] || []) {
                inDegree[v]--;
                if (inDegree[v] === 0) queue.push(v);
            }
            this.helpers.highlightBars([u], 'sorted', visualizer);
        }
        this.helpers.clearHighlights(visualizer);
        return result;
    }
}