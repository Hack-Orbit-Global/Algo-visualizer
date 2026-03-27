/**
 * ============================================================
 * graphs.js — Graph algorithms and interactive graph builder
 * ============================================================
 * Implements: BFS, DFS, Dijkstra, A* Search
 * Provides an interactive graph builder (click to add nodes,
 * drag between nodes to add edges).
 */
// Hack Orbit Project
// Copyright © Hack Orbit Global.
// Open-source for learning only. Credit required. No commercial use.

'use strict';

/* ============================================================
   Graph Data Structure
   ============================================================ */

class Graph {
    constructor() {
        this.nodes = [];       // { id, x, y, label }
        this.edges = [];       // { from, to, weight }
        this.adjacency = {};   // id -> [{ to, weight }]
        this.directed = false;
        this.weighted = false;
        this.nextId = 0;
    }

    /**
     * Add a node at position (x, y)
     * @param {number} x 
     * @param {number} y 
     * @param {string} [label]
     * @returns {Object} node
     */
    addNode(x, y, label) {
        const id = this.nextId++;
        const node = { id, x, y, label: label || String.fromCharCode(65 + id % 26) };
        this.nodes.push(node);
        this.adjacency[id] = [];
        return node;
    }

    /**
     * Remove a node and all connected edges
     * @param {number} id 
     */
    removeNode(id) {
        this.nodes = this.nodes.filter(n => n.id !== id);
        this.edges = this.edges.filter(e => e.from !== id && e.to !== id);
        delete this.adjacency[id];
        for (const key in this.adjacency) {
            this.adjacency[key] = this.adjacency[key].filter(e => e.to !== id);
        }
    }

    /**
     * Add edge between two nodes
     * @param {number} from 
     * @param {number} to 
     * @param {number} [weight=1]
     */
    addEdge(from, to, weight = 1) {
        // Prevent duplicates
        const exists = this.edges.some(e => e.from === from && e.to === to);
        if (exists) return;

        this.edges.push({ from, to, weight });
        this.adjacency[from].push({ to, weight });

        if (!this.directed) {
            this.edges.push({ from: to, to: from, weight });
            if (!this.adjacency[to]) this.adjacency[to] = [];
            this.adjacency[to].push({ to: from, weight });
        }
    }

    /**
     * Get node by id
     * @param {number} id 
     * @returns {Object|undefined}
     */
    getNode(id) {
        return this.nodes.find(n => n.id === id);
    }

    /**
     * Find node at position (within radius)
     * @param {number} x 
     * @param {number} y 
     * @param {number} [radius=20]
     * @returns {Object|null}
     */
    findNodeAt(x, y, radius = 20) {
        for (const node of this.nodes) {
            const dx = node.x - x;
            const dy = node.y - y;
            if (Math.sqrt(dx * dx + dy * dy) <= radius) {
                return node;
            }
        }
        return null;
    }

    /**
     * Clear all nodes and edges
     */
    clear() {
        this.nodes = [];
        this.edges = [];
        this.adjacency = {};
        this.nextId = 0;
    }

    /**
     * Generate a random graph
     * @param {number} nodeCount 
     * @param {number} maxX 
     * @param {number} maxY 
     */
    generateRandom(nodeCount, maxX, maxY) {
        this.clear();
        const padding = 40;
        
        // Add nodes with spacing
        for (let i = 0; i < nodeCount; i++) {
            let x, y, attempts = 0;
            do {
                x = padding + Math.random() * (maxX - padding * 2);
                y = padding + Math.random() * (maxY - padding * 2);
                attempts++;
            } while (this.findNodeAt(x, y, 50) && attempts < 50);
            this.addNode(x, y);
        }

        // Add edges (ensure connectivity then add some random)
        // Start with a spanning tree
        const shuffled = shuffleArray([...Array(nodeCount).keys()]);
        for (let i = 1; i < shuffled.length; i++) {
            const w = this.weighted ? Math.floor(Math.random() * 20) + 1 : 1;
            this.addEdge(shuffled[i - 1], shuffled[i], w);
        }

        // Add a few extra edges
        const extraEdges = Math.floor(nodeCount * 0.5);
        for (let i = 0; i < extraEdges; i++) {
            const from = Math.floor(Math.random() * nodeCount);
            const to = Math.floor(Math.random() * nodeCount);
            if (from !== to) {
                const w = this.weighted ? Math.floor(Math.random() * 20) + 1 : 1;
                this.addEdge(from, to, w);
            }
        }
    }
}

/* ============================================================
   Algorithm Code Strings
   ============================================================ */

const GRAPH_CODE = {
    bfs: `function BFS(graph, start) {
  let visited = new Set();
  let queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    let node = queue.shift();
    process(node);
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    dfs: `function DFS(graph, start) {
  let visited = new Set();
  
  function dfsHelper(node) {
    visited.add(node);
    process(node);
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(start);
}`,
    dijkstra: `function dijkstra(graph, start) {
  let dist = {};
  let visited = new Set();
  let pq = [[0, start]]; // [distance, node]
  
  for (let node of graph.nodes)
    dist[node] = Infinity;
  dist[start] = 0;
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    let [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    
    for (let {to, weight} of graph[u]) {
      let alt = d + weight;
      if (alt < dist[to]) {
        dist[to] = alt;
        pq.push([alt, to]);
      }
    }
  }
  return dist;
}`,
    astar: `function aStar(graph, start, goal, h) {
  let openSet = [start];
  let cameFrom = {};
  let gScore = {}, fScore = {};
  
  for (let n of graph.nodes) {
    gScore[n] = Infinity;
    fScore[n] = Infinity;
  }
  gScore[start] = 0;
  fScore[start] = h(start, goal);
  
  while (openSet.length > 0) {
    openSet.sort((a,b) => fScore[a] - fScore[b]);
    let current = openSet.shift();
    if (current === goal) return reconstructPath();
    
    for (let {to, weight} of graph[current]) {
      let tentative = gScore[current] + weight;
      if (tentative < gScore[to]) {
        cameFrom[to] = current;
        gScore[to] = tentative;
        fScore[to] = tentative + h(to, goal);
        if (!openSet.includes(to))
          openSet.push(to);
      }
    }
  }
  return null; // No path found
}`
};

const GRAPH_COMPLEXITY = {
    bfs:      { time: 'O(V + E)', space: 'O(V)' },
    dfs:      { time: 'O(V + E)', space: 'O(V)' },
    dijkstra: { time: 'O((V+E) log V)', space: 'O(V)' },
    astar:    { time: 'O(E)', space: 'O(V)', note: 'with good heuristic' },
};

/* ============================================================
   Step Generation for Graph Algorithms
   ============================================================ */

/**
 * Generate BFS steps
 * @param {Graph} graph 
 * @param {number} startId - start node id
 * @returns {Step[]}
 */
function bfsSteps(graph, startId) {
    const steps = [];
    const visited = new Set();
    const queue = [startId];
    visited.add(startId);

    steps.push({
        type: 'start',
        nodeId: startId,
        visited: new Set(visited),
        queue: [...queue],
        codeLine: 2,
        description: `Start BFS from node ${graph.getNode(startId).label}`,
        eli5: `We start at node ${graph.getNode(startId).label} and will explore all neighbors level by level, like ripples in water!`
    });

    while (queue.length > 0) {
        const nodeId = queue.shift();
        const node = graph.getNode(nodeId);

        steps.push({
            type: 'visit',
            nodeId,
            visited: new Set(visited),
            queue: [...queue],
            codeLine: 6,
            description: `Visit node ${node.label}`,
            eli5: `We visit ${node.label}. Time to check all its neighbors!`
        });

        const neighbors = graph.adjacency[nodeId] || [];
        for (const { to } of neighbors) {
            if (!visited.has(to)) {
                visited.add(to);
                queue.push(to);
                const neighbor = graph.getNode(to);

                steps.push({
                    type: 'enqueue',
                    nodeId: to,
                    edgeFrom: nodeId,
                    visited: new Set(visited),
                    queue: [...queue],
                    codeLine: 10,
                    description: `Discover node ${neighbor.label}, add to queue`,
                    eli5: `Found neighbor ${neighbor.label}! We haven't seen it before, so add it to our queue.`
                });
            } else {
                steps.push({
                    type: 'skip',
                    nodeId: to,
                    visited: new Set(visited),
                    queue: [...queue],
                    codeLine: 9,
                    description: `Node ${graph.getNode(to).label} already visited`,
                    eli5: `We already visited ${graph.getNode(to).label}, so we skip it.`
                });
            }
        }
    }

    steps.push({
        type: 'done',
        visited: new Set(visited),
        queue: [],
        codeLine: 0,
        description: 'BFS complete!',
        eli5: 'All reachable nodes have been visited! BFS is done. 🎉'
    });

    return steps;
}

/**
 * Generate DFS steps
 * @param {Graph} graph 
 * @param {number} startId 
 * @returns {Step[]}
 */
function dfsSteps(graph, startId) {
    const steps = [];
    const visited = new Set();

    function dfsHelper(nodeId) {
        visited.add(nodeId);
        const node = graph.getNode(nodeId);

        steps.push({
            type: 'visit',
            nodeId,
            visited: new Set(visited),
            codeLine: 3,
            description: `Visit node ${node.label}`,
            eli5: `We dive into node ${node.label}! Let's explore as deep as possible first.`
        });

        const neighbors = graph.adjacency[nodeId] || [];
        for (const { to } of neighbors) {
            if (!visited.has(to)) {
                steps.push({
                    type: 'explore',
                    nodeId: to,
                    edgeFrom: nodeId,
                    visited: new Set(visited),
                    codeLine: 7,
                    description: `Exploring edge ${node.label} → ${graph.getNode(to).label}`,
                    eli5: `Found unvisited neighbor ${graph.getNode(to).label}! Let's dive deeper.`
                });
                dfsHelper(to);
                steps.push({
                    type: 'backtrack',
                    nodeId,
                    visited: new Set(visited),
                    codeLine: 8,
                    description: `Backtrack to ${node.label}`,
                    eli5: `Done exploring that path. Coming back to ${node.label} to check other neighbors.`
                });
            }
        }
    }

    steps.push({
        type: 'start',
        nodeId: startId,
        visited: new Set(visited),
        codeLine: 1,
        description: `Start DFS from node ${graph.getNode(startId).label}`,
        eli5: `Starting DFS at ${graph.getNode(startId).label}. We'll go as deep as possible before backtracking!`
    });

    dfsHelper(startId);

    steps.push({
        type: 'done',
        visited: new Set(visited),
        codeLine: 0,
        description: 'DFS complete!',
        eli5: 'All reachable nodes explored! DFS is done. 🎉'
    });

    return steps;
}

/**
 * Generate Dijkstra steps
 * @param {Graph} graph 
 * @param {number} startId 
 * @returns {Step[]}
 */
function dijkstraSteps(graph, startId) {
    const steps = [];
    const dist = {};
    const visited = new Set();
    const pq = [{ node: startId, dist: 0 }];

    for (const node of graph.nodes) {
        dist[node.id] = node.id === startId ? 0 : Infinity;
    }

    steps.push({
        type: 'start',
        nodeId: startId,
        distances: { ...dist },
        visited: new Set(visited),
        codeLine: 1,
        description: `Start Dijkstra from node ${graph.getNode(startId).label}`,
        eli5: `We start at ${graph.getNode(startId).label} with distance 0. All others are "infinity" until proven shorter!`
    });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { node: uId, dist: d } = pq.shift();

        if (visited.has(uId)) continue;
        visited.add(uId);
        const u = graph.getNode(uId);

        steps.push({
            type: 'visit',
            nodeId: uId,
            distances: { ...dist },
            visited: new Set(visited),
            codeLine: 11,
            description: `Visit node ${u.label} (distance = ${d})`,
            eli5: `Visiting ${u.label}. Its shortest known distance is ${d}.`
        });

        const neighbors = graph.adjacency[uId] || [];
        for (const { to, weight } of neighbors) {
            if (visited.has(to)) continue;
            const alt = d + weight;
            const neighbor = graph.getNode(to);

            steps.push({
                type: 'relax',
                nodeId: to,
                edgeFrom: uId,
                oldDist: dist[to],
                newDist: alt,
                distances: { ...dist },
                visited: new Set(visited),
                codeLine: 14,
                description: `Check edge ${u.label}→${neighbor.label}: ${d}+${weight}=${alt} vs current ${dist[to] === Infinity ? '∞' : dist[to]}`,
                eli5: `Can we reach ${neighbor.label} faster through ${u.label}? ${d}+${weight}=${alt}, currently ${dist[to] === Infinity ? '∞' : dist[to]}.`
            });

            if (alt < dist[to]) {
                dist[to] = alt;
                pq.push({ node: to, dist: alt });

                steps.push({
                    type: 'update',
                    nodeId: to,
                    distances: { ...dist },
                    visited: new Set(visited),
                    codeLine: 16,
                    description: `Update distance of ${neighbor.label} to ${alt}`,
                    eli5: `Yes! ${alt} is shorter! Updating ${neighbor.label}'s distance.`
                });
            }
        }
    }

    steps.push({
        type: 'done',
        distances: { ...dist },
        visited: new Set(visited),
        codeLine: 0,
        description: 'Dijkstra complete!',
        eli5: 'Shortest distances to all reachable nodes found! 🎉'
    });

    return steps;
}

/**
 * Generate A* steps
 * @param {Graph} graph 
 * @param {number} startId 
 * @param {number} goalId 
 * @returns {Step[]}
 */
function astarSteps(graph, startId, goalId) {
    const steps = [];
    const goal = graph.getNode(goalId);
    if (!goal) return steps;

    // Euclidean distance heuristic
    function h(nodeId) {
        const n = graph.getNode(nodeId);
        if (!n) return 0;
        return Math.sqrt((n.x - goal.x) ** 2 + (n.y - goal.y) ** 2);
    }

    const openSet = [startId];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    for (const node of graph.nodes) {
        gScore[node.id] = Infinity;
        fScore[node.id] = Infinity;
    }
    gScore[startId] = 0;
    fScore[startId] = h(startId);

    steps.push({
        type: 'start',
        nodeId: startId,
        goalId,
        openSet: [...openSet],
        gScore: { ...gScore },
        fScore: { ...fScore },
        codeLine: 1,
        description: `Start A* from ${graph.getNode(startId).label} to ${goal.label}`,
        eli5: `We want to find the shortest path from ${graph.getNode(startId).label} to ${goal.label}. A* uses a "guess" of how far each node is from the goal!`
    });

    const visited = new Set();

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[a] - fScore[b]);
        const current = openSet.shift();
        const currentNode = graph.getNode(current);

        steps.push({
            type: 'visit',
            nodeId: current,
            openSet: [...openSet],
            visited: new Set(visited),
            gScore: { ...gScore },
            fScore: { ...fScore },
            codeLine: 12,
            description: `Explore ${currentNode.label} (f=${fScore[current].toFixed(1)})`,
            eli5: `${currentNode.label} looks most promising (estimated total: ${fScore[current].toFixed(1)}). Let's explore it!`
        });

        if (current === goalId) {
            // Reconstruct path
            const path = [current];
            let c = current;
            while (cameFrom[c] !== undefined) {
                c = cameFrom[c];
                path.unshift(c);
            }
            steps.push({
                type: 'path',
                path,
                visited: new Set(visited),
                codeLine: 13,
                description: `Goal reached! Path: ${path.map(id => graph.getNode(id).label).join(' → ')}`,
                eli5: `We found the shortest path! ${path.map(id => graph.getNode(id).label).join(' → ')} 🎉`
            });
            return steps;
        }

        visited.add(current);
        const neighbors = graph.adjacency[current] || [];

        for (const { to, weight } of neighbors) {
            const tentative = gScore[current] + weight;
            const neighbor = graph.getNode(to);

            if (tentative < gScore[to]) {
                cameFrom[to] = current;
                gScore[to] = tentative;
                fScore[to] = tentative + h(to);

                steps.push({
                    type: 'update',
                    nodeId: to,
                    edgeFrom: current,
                    gScore: { ...gScore },
                    fScore: { ...fScore },
                    visited: new Set(visited),
                    codeLine: 19,
                    description: `Update ${neighbor.label}: g=${tentative.toFixed(1)}, f=${fScore[to].toFixed(1)}`,
                    eli5: `Found a better way to reach ${neighbor.label}! New cost: ${tentative.toFixed(1)}, estimated total: ${fScore[to].toFixed(1)}`
                });

                if (!openSet.includes(to)) {
                    openSet.push(to);
                }
            }
        }
    }

    steps.push({
        type: 'done',
        visited: new Set(visited),
        codeLine: 0,
        description: 'No path found!',
        eli5: 'There is no path between these two nodes. 😞'
    });

    return steps;
}

/* ============================================================
   Graph Renderer (Canvas)
   ============================================================ */

class GraphRenderer {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodeRadius = 18;
    }

    /**
     * Draw the full graph state
     * @param {Graph} graph 
     * @param {Object} [state] - highlight state
     */
    draw(graph, state = {}) {
        const ctx = this.ctx;
        const { width, height } = resizeCanvas(this.canvas);

        // Background grid
        ctx.strokeStyle = COLORS.GRID;
        ctx.lineWidth = 0.5;
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw edges
        const drawnEdges = new Set();
        for (const edge of graph.edges) {
            const key = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
            if (!graph.directed && drawnEdges.has(key)) continue;
            drawnEdges.add(key);

            const from = graph.getNode(edge.from);
            const to = graph.getNode(edge.to);
            if (!from || !to) continue;

            let edgeColor = COLORS.EDGE;
            let edgeWidth = 1.5;

            if (state.activeEdges) {
                const active = state.activeEdges.find(e => 
                    (e.from === edge.from && e.to === edge.to) || 
                    (!graph.directed && e.from === edge.to && e.to === edge.from)
                );
                if (active) {
                    edgeColor = COLORS.EDGE_ACTIVE;
                    edgeWidth = 3;
                }
            }
            if (state.pathEdges) {
                const onPath = state.pathEdges.find(e =>
                    (e.from === edge.from && e.to === edge.to) ||
                    (!graph.directed && e.from === edge.to && e.to === edge.from)
                );
                if (onPath) {
                    edgeColor = COLORS.SORTED;
                    edgeWidth = 3;
                }
            }

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = edgeWidth;
            ctx.stroke();

            // Arrow for directed
            if (graph.directed) {
                const angle = Math.atan2(to.y - from.y, to.x - from.x);
                const arrowX = to.x - this.nodeRadius * Math.cos(angle);
                const arrowY = to.y - this.nodeRadius * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - 10 * Math.cos(angle - 0.4), arrowY - 10 * Math.sin(angle - 0.4));
                ctx.lineTo(arrowX - 10 * Math.cos(angle + 0.4), arrowY - 10 * Math.sin(angle + 0.4));
                ctx.closePath();
                ctx.fillStyle = edgeColor;
                ctx.fill();
            }

            // Weight label
            if (graph.weighted) {
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                ctx.fillStyle = '#0a0a0f';
                ctx.beginPath();
                ctx.arc(mx, my, 12, 0, Math.PI * 2);
                ctx.fill();
                drawText(ctx, String(edge.weight), mx, my, '#ffdd00', 'bold 10px Inter');
            }
        }

        // Draw nodes
        for (const node of graph.nodes) {
            let color = COLORS.NODE;
            let glow = 0;

            if (state.visited && state.visited.has(node.id)) {
                color = COLORS.NODE_VISITED;
                glow = 8;
            }
            if (state.queued && state.queued.has(node.id)) {
                color = COLORS.QUEUED;
                glow = 8;
            }
            if (state.currentNode === node.id) {
                color = COLORS.NODE_CURRENT;
                glow = 15;
            }
            if (state.path && state.path.includes(node.id)) {
                color = COLORS.SORTED;
                glow = 12;
            }
            if (state.startNode === node.id) {
                color = '#00ff88';
                glow = 10;
            }
            if (state.goalNode === node.id) {
                color = '#ff4466';
                glow = 10;
            }

            // Glow
            if (glow > 0) {
                ctx.save();
                ctx.shadowColor = color;
                ctx.shadowBlur = glow;
                ctx.beginPath();
                ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
                ctx.fillStyle = hexAlpha(color, 0.2);
                ctx.fill();
                ctx.restore();
            }

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = hexAlpha(color, 0.15);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            drawText(ctx, node.label, node.x, node.y, COLORS.TEXT, 'bold 12px Inter');

            // Distance label for Dijkstra
            if (state.distances && state.distances[node.id] !== undefined) {
                const d = state.distances[node.id];
                const dText = d === Infinity ? '∞' : d.toFixed(0);
                drawText(ctx, dText, node.x, node.y + this.nodeRadius + 14, '#ffdd00', '10px JetBrains Mono');
            }
        }
    }
}

/* ============================================================
   Export: get graph algorithm data
   ============================================================ */

/**
 * Get steps for a graph algorithm
 * @param {string} algoName 
 * @param {Graph} graph 
 * @param {number} startId 
 * @param {number} [goalId]
 * @returns {{ steps: Array, code: string, complexity: Object }}
 */
function getGraphData(algoName, graph, startId, goalId) {
    const generators = {
        bfs: (g, s) => bfsSteps(g, s),
        dfs: (g, s) => dfsSteps(g, s),
        dijkstra: (g, s) => dijkstraSteps(g, s),
        astar: (g, s, goal) => astarSteps(g, s, goal),
    };

    const gen = generators[algoName];
    if (!gen) {
        console.error(`Unknown graph algorithm: ${algoName}`);
        return { steps: [], code: '', complexity: {} };
    }

    return {
        steps: gen(graph, startId, goalId),
        code: GRAPH_CODE[algoName] || '',
        complexity: GRAPH_COMPLEXITY[algoName] || {},
    };
}
