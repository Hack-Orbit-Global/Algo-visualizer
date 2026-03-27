/**
 * ============================================================
 * main.js — Core application controller for DSA Visualizer
 * ============================================================
 * Handles: page navigation, algorithm selection, playback
 * engine, canvas rendering loop, UI interactions, quiz mode,
 * comparison mode, ELI5 mode, keyboard shortcuts, and more.
 */
// Hack Orbit Project
// Copyright © Hack Orbit Global.
// Open-source for learning only. Credit required. No commercial use.

'use strict';

/* ============================================================
   Application State
   ============================================================ */

const AppState = {
    // Current page
    currentPage: 'home', // 'home' | 'visualizer'

    // Algorithm
    currentType: null,   // 'sorting' | 'graph' | 'tree'
    currentAlgo: null,   // e.g. 'bubble', 'bfs', 'preorder'

    // Playback
    steps: [],
    currentStep: 0,
    isPlaying: false,
    playTimer: null,
    speed: 1.0,          // multiplier
    arraySize: 30,

    // Data
    array: [],
    originalArray: [],

    // Graph
    graph: new Graph(),
    graphRenderer: null,
    graphMode: 'none',   // 'none' | 'addNode' | 'addEdge'
    edgeStartNode: null,
    graphStartNode: null,
    graphGoalNode: null,

    // Tree
    bst: new BST(),
    treeRenderer: null,

    // Modes
    eli5Mode: false,
    compareMode: false,
    quizMode: false,
    quizScore: 0,
    quizStreak: 0,
    quizAnswered: false,

    // Compare
    compareAlgo: null,
    compareSteps: [],
    compareStep: 0,

    // Sorted indices tracker
    sortedIndices: new Set(),

    // Canvas animation
    animFrameId: null,
    barPositions: [],    // for smooth animations
};

/* ============================================================
   DOM References
   ============================================================ */

const DOM = {};

function cacheDOMRefs() {
    DOM.navbar = $('#navbar');
    DOM.navLinks = $('#navLinks');
    DOM.navHamburger = $('#navHamburger');
    DOM.navLogo = $('#navLogo');
    DOM.navVisualizerLink = $('#navVisualizerLink');
    DOM.themeToggle = $('#themeToggle');
    DOM.contrastToggle = $('#contrastToggle');

    DOM.pageHome = $('#pageHome');
    DOM.pageVisualizer = $('#pageVisualizer');

    DOM.heroStartBtn = $('#heroStartBtn');
    DOM.heroCanvas = $('#heroCanvas');
    DOM.heroParticles = $('#heroParticles');

    DOM.vizSidebar = $('#vizSidebar');
    DOM.sidebarToggle = $('#sidebarToggle');
    DOM.vizMain = $('#vizMain');
    DOM.vizCanvas = $('#vizCanvas');
    DOM.vizCanvasCompare = $('#vizCanvasCompare');
    DOM.vizCanvasWrapper = $('#vizCanvasWrapper');
    DOM.vizCodePanel = $('#vizCodePanel');
    DOM.codePanelToggle = $('#codePanelToggle');
    DOM.codeContent = $('#codeContent');
    DOM.vizTitle = $('#vizTitle');
    DOM.vizComplexity = $('#vizComplexity');

    // Controls
    DOM.btnPlayPause = $('#btnPlayPause');
    DOM.btnReset = $('#btnReset');
    DOM.btnStepBack = $('#btnStepBack');
    DOM.btnStepForward = $('#btnStepForward');
    DOM.speedSlider = $('#speedSlider');
    DOM.speedValue = $('#speedValue');
    DOM.arraySizeSlider = $('#arraySizeSlider');
    DOM.sizeValue = $('#sizeValue');
    DOM.btnRandomize = $('#btnRandomize');
    DOM.stepCounter = $('#stepCounter');
    DOM.stepDesc = $('#stepDesc');

    // Mode buttons
    DOM.btnEli5 = $('#btnEli5');
    DOM.btnCompare = $('#btnCompare');
    DOM.btnQuiz = $('#btnQuiz');

    // Panels
    DOM.eli5Panel = $('#eli5Panel');
    DOM.eli5Text = $('#eli5Text');
    DOM.quizPanel = $('#quizPanel');
    DOM.quizOptions = $('#quizOptions');
    DOM.quizResult = $('#quizResult');
    DOM.quizScore = $('#quizScore');
    DOM.quizStreak = $('#quizStreak');

    // Graph controls
    DOM.graphControls = $('#graphControls');
    DOM.btnAddNode = $('#btnAddNode');
    DOM.btnAddEdge = $('#btnAddEdge');
    DOM.btnRandomGraph = $('#btnRandomGraph');
    DOM.btnClearGraph = $('#btnClearGraph');
    DOM.graphWeighted = $('#graphWeighted');
    DOM.graphDirected = $('#graphDirected');

    // Tree controls
    DOM.treeControls = $('#treeControls');
    DOM.treeNodeValue = $('#treeNodeValue');
    DOM.btnTreeInsert = $('#btnTreeInsert');
    DOM.btnTreeDelete = $('#btnTreeDelete');
    DOM.btnTreeSearch = $('#btnTreeSearch');
    DOM.btnTreeRandom = $('#btnTreeRandom');
    DOM.btnTreeClear = $('#btnTreeClear');

    // Modals
    DOM.floatingHelp = $('#floatingHelp');
    DOM.helpModal = $('#helpModal');
    DOM.helpModalClose = $('#helpModalClose');

    // Footer
    DOM.siteFooter = $('#siteFooter');

    // Cursor
    DOM.customCursor = $('#customCursor');
    DOM.customCursorTrail = $('#customCursorTrail');
}

/* ============================================================
   Initialization
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    cacheDOMRefs();
    initTheme();
    initNavigation();
    initHeroAnimations();
    initAlgoCards();
    initSidebar();
    initControls();
    initModes();
    initGraphControls();
    initTreeControls();
    initModals();
    initCursor();
    initKeyboardShortcuts();
    initStatCounters();

    // Initialize renderers
    AppState.graphRenderer = new GraphRenderer(DOM.vizCanvas);
    AppState.treeRenderer = new TreeRenderer(DOM.vizCanvas);

    // Generate initial data
    generateNewArray();
});

/* ============================================================
   Theme
   ============================================================ */

function initTheme() {
    const saved = localStorage.getItem('dsa_theme');
    if (saved === 'light') {
        document.body.classList.add('light-theme');
    }
    const hc = localStorage.getItem('dsa_high_contrast');
    if (hc === 'true') {
        document.body.classList.add('high-contrast');
    }

    DOM.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('dsa_theme',
            document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    DOM.contrastToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        localStorage.setItem('dsa_high_contrast',
            document.body.classList.contains('high-contrast') ? 'true' : 'false');
    });
}

/* ============================================================
   Navigation
   ============================================================ */

function initNavigation() {
    // Hamburger menu
    DOM.navHamburger.addEventListener('click', () => {
        DOM.navHamburger.classList.toggle('open');
        DOM.navLinks.classList.toggle('open');
        DOM.navHamburger.setAttribute('aria-expanded',
            DOM.navHamburger.classList.contains('open'));
    });

    // Nav links
    DOM.navVisualizerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('visualizer');
    });

    DOM.heroStartBtn.addEventListener('click', () => {
        showPage('visualizer');
    });

    // Logo easter egg
    let logoClicks = 0;
    DOM.navLogo.addEventListener('click', (e) => {
        logoClicks++;
        if (logoClicks >= 3) {
            logoClicks = 0;
            const svg = DOM.navLogo.querySelector('.logo-svg');
            svg.classList.add('logo-easter-egg');
            setTimeout(() => svg.classList.remove('logo-easter-egg'), 1500);
        }
    });

    // Algo cards navigation
    $$('.algo-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showPage('visualizer');
            // Open correct section and select first algo
            setTimeout(() => {
                const firstItem = $(`[data-type="${category}"]`, DOM.vizSidebar);
                if (firstItem) firstItem.click();
            }, 100);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

function showPage(page) {
    AppState.currentPage = page;

    // Hide all pages
    DOM.pageHome.classList.remove('active');
    DOM.pageVisualizer.classList.remove('active');

    // Update nav
    $$('.nav-link').forEach(l => l.classList.remove('active'));

    if (page === 'home') {
        DOM.pageHome.classList.add('active');
        $('[data-page="home"]').classList.add('active');
        DOM.siteFooter.style.display = '';
    } else if (page === 'visualizer') {
        DOM.pageVisualizer.classList.add('active');
        DOM.navVisualizerLink.classList.add('active');
        DOM.siteFooter.style.display = 'none';
        // Resize canvas on show
        setTimeout(() => {
            resizeCanvases();
            if (AppState.currentType === 'sorting') renderSortingFrame();
            else if (AppState.currentType === 'graph') renderGraphFrame();
            else if (AppState.currentType === 'tree') renderTreeFrame();
        }, 50);
    }

    // Close mobile nav
    DOM.navHamburger.classList.remove('open');
    DOM.navLinks.classList.remove('open');

    window.scrollTo(0, 0);
}

/* ============================================================
   Hero Animations
   ============================================================ */

function initHeroAnimations() {
    const canvas = DOM.heroCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate animated mini bars
    let bars = [];
    const barCount = 12;
    for (let i = 0; i < barCount; i++) {
        bars.push({
            height: 30 + Math.random() * 150,
            targetHeight: 30 + Math.random() * 150,
            color: `hsl(${200 + i * 12}, 100%, 60%)`,
        });
    }

    function animateHero() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.min(rect.width, 500) * dpr;
        canvas.height = 340 * dpr;
        canvas.style.width = Math.min(rect.width, 500) + 'px';
        canvas.style.height = '340px';
        ctx.scale(dpr, dpr);

        const w = Math.min(rect.width, 500);
        const h = 340;
        ctx.clearRect(0, 0, w, h);

        const barWidth = (w - 60) / barCount;
        const gap = 4;

        for (let i = 0; i < barCount; i++) {
            // Animate towards target
            bars[i].height += (bars[i].targetHeight - bars[i].height) * 0.05;

            if (Math.abs(bars[i].height - bars[i].targetHeight) < 1) {
                bars[i].targetHeight = 30 + Math.random() * 200;
            }

            const x = 30 + i * barWidth;
            const bh = bars[i].height;
            const y = h - bh - 20;

            // Glow
            ctx.save();
            ctx.shadowColor = bars[i].color;
            ctx.shadowBlur = 12;

            // Bar
            const grad = ctx.createLinearGradient(x, y, x, y + bh);
            grad.addColorStop(0, bars[i].color);
            grad.addColorStop(1, hexAlpha(bars[i].color, 0.3));
            ctx.fillStyle = grad;
            roundRect(ctx, x, y, barWidth - gap, bh, 4);
            ctx.fill();
            ctx.restore();
        }

        if (AppState.currentPage === 'home') {
            requestAnimationFrame(animateHero);
        }
    }

    animateHero();

    // Particles
    createParticles();
}

function createParticles() {
    const container = DOM.heroParticles;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: ${Math.random() > 0.5 ? '#00aaff' : '#aa00ff'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.1 + Math.random() * 0.3};
            animation: float ${3 + Math.random() * 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        container.appendChild(p);
    }
}

/* ============================================================
   Stat Counters (Animated)
   ============================================================ */

function initStatCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $$('.stat-number').forEach(el => {
                    const target = parseInt(el.dataset.count);
                    animateValue(0, target, 1500, (v) => {
                        el.textContent = Math.round(v);
                    });
                });
                observer.disconnect();
            }
        });
    });
    const statsEl = $('.hero-stats');
    if (statsEl) observer.observe(statsEl);
}

/* ============================================================
   Algorithm Cards (Landing)
   ============================================================ */

function initAlgoCards() {
    // Already handled in initNavigation
}

/* ============================================================
   Sidebar
   ============================================================ */

function initSidebar() {
    // Toggle sidebar (mobile)
    DOM.sidebarToggle.addEventListener('click', () => {
        DOM.vizSidebar.classList.toggle('open');
    });

    // Section collapse
    $$('.section-header', DOM.vizSidebar).forEach(header => {
        header.addEventListener('click', () => {
            const expanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !expanded);
        });
    });

    // Algorithm items
    $$('.algo-item', DOM.vizSidebar).forEach(item => {
        item.addEventListener('click', () => {
            selectAlgorithm(item.dataset.type, item.dataset.algo);
            // Update active state
            $$('.algo-item', DOM.vizSidebar).forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                DOM.vizSidebar.classList.remove('open');
            }
        });
    });
}

/* ============================================================
   Algorithm Selection
   ============================================================ */

function selectAlgorithm(type, algo) {
    stopPlayback();
    AppState.currentType = type;
    AppState.currentAlgo = algo;
    AppState.steps = [];
    AppState.currentStep = 0;
    AppState.sortedIndices = new Set();

    // Update title
    const names = {
        bubble: 'Bubble Sort', selection: 'Selection Sort', insertion: 'Insertion Sort',
        merge: 'Merge Sort', quick: 'Quick Sort', heap: 'Heap Sort',
        counting: 'Counting Sort', radix: 'Radix Sort',
        bfs: 'Breadth-First Search', dfs: 'Depth-First Search',
        dijkstra: "Dijkstra's Algorithm", astar: 'A* Search',
        'bst-insert': 'BST Insert', 'bst-delete': 'BST Delete',
        'bst-search': 'BST Search', preorder: 'Preorder Traversal',
        inorder: 'Inorder Traversal', postorder: 'Postorder Traversal',
        levelorder: 'Level-order Traversal',
    };
    DOM.vizTitle.textContent = names[algo] || algo;

    // Show/hide type-specific controls
    DOM.graphControls.classList.add('hidden');
    DOM.treeControls.classList.add('hidden');
    DOM.arraySizeSlider.parentElement.style.display = '';
    DOM.btnRandomize.style.display = '';

    if (type === 'sorting') {
        generateNewArray();
        loadSortingSteps();
    } else if (type === 'graph') {
        DOM.graphControls.classList.remove('hidden');
        DOM.arraySizeSlider.parentElement.style.display = 'none';
        DOM.btnRandomize.style.display = 'none';
        if (AppState.graph.nodes.length === 0) {
            const { width, height } = resizeCanvas(DOM.vizCanvas);
            AppState.graph.generateRandom(8, width, height);
        }
        renderGraphFrame();
        loadGraphCode();
    } else if (type === 'tree') {
        DOM.treeControls.classList.remove('hidden');
        DOM.arraySizeSlider.parentElement.style.display = 'none';
        DOM.btnRandomize.style.display = 'none';
        if (!AppState.bst.root) {
            AppState.bst.generateRandom(7);
        }
        renderTreeFrame();
        loadTreeCode();
    }

    // Update complexity
    updateComplexity(type, algo);

    // Update step counter
    updateStepDisplay();

    // Resize canvases
    resizeCanvases();
}

function updateComplexity(type, algo) {
    let cData = {};
    if (type === 'sorting') cData = SORTING_COMPLEXITY[algo] || {};
    else if (type === 'graph') cData = GRAPH_COMPLEXITY[algo] || {};
    else if (type === 'tree') cData = TREE_COMPLEXITY[algo] || {};

    if (cData.avg) {
        DOM.vizComplexity.textContent = `Time: ${cData.avg} | Space: ${cData.space || '?'}`;
    } else if (cData.time) {
        DOM.vizComplexity.textContent = `Time: ${cData.time} | Space: ${cData.space || '?'}`;
    } else {
        DOM.vizComplexity.textContent = '';
    }
}

/* ============================================================
   Sorting Logic
   ============================================================ */

function generateNewArray() {
    AppState.array = generateRandomArray(AppState.arraySize);
    AppState.originalArray = [...AppState.array];
    AppState.sortedIndices = new Set();
    AppState.barPositions = AppState.array.map((val, i) => ({
        x: i,
        height: val,
        targetX: i,
        targetHeight: val,
    }));
    if (AppState.currentType === 'sorting') {
        loadSortingSteps();
    }
    renderSortingFrame();
}

function loadSortingSteps() {
    if (!AppState.currentAlgo) return;
    const data = getSortingData(AppState.currentAlgo, [...AppState.originalArray]);
    AppState.steps = data.steps;
    AppState.currentStep = 0;
    AppState.sortedIndices = new Set();
    updateCodePanel(data.code);
    updateStepDisplay();
    // Reset array to original for playback
    AppState.array = [...AppState.originalArray];
    renderSortingFrame();
}

function loadGraphCode() {
    if (!AppState.currentAlgo) return;
    const code = GRAPH_CODE[AppState.currentAlgo] || '';
    updateCodePanel(code);
}

function loadTreeCode() {
    if (!AppState.currentAlgo) return;
    const code = TREE_CODE[AppState.currentAlgo] || '';
    updateCodePanel(code);
}

/* ============================================================
   Rendering — Sorting
   ============================================================ */

function renderSortingFrame(stepData) {
    const canvas = DOM.vizCanvas;
    if (!canvas) return;

    const { width, height } = resizeCanvas(canvas);
    const ctx = canvas.getContext('2d');
    const arr = stepData ? stepData.array : AppState.array;
    const n = arr.length;

    if (n === 0) return;

    const padding = 16;
    const barAreaWidth = width - padding * 2;
    const barWidth = Math.max(2, (barAreaWidth / n) - 1);
    const gap = Math.max(0.5, (barAreaWidth - barWidth * n) / (n - 1 || 1));
    const maxVal = Math.max(...arr, 1);
    const barAreaHeight = height - 50;

    // Draw bars
    for (let i = 0; i < n; i++) {
        const barH = (arr[i] / maxVal) * barAreaHeight;
        const x = padding + i * (barWidth + gap);
        const y = height - barH - 20;

        let color = COLORS.DEFAULT;

        // Determine colors based on step
        if (stepData) {
            const indices = stepData.indices || [];
            if (AppState.sortedIndices.has(i)) {
                color = COLORS.SORTED;
            }
            if (stepData.type === 'compare' && indices.includes(i)) {
                color = COLORS.COMPARING;
            } else if (stepData.type === 'swap' && indices.includes(i)) {
                color = COLORS.SWAPPING;
            } else if (stepData.type === 'sorted' && indices.includes(i)) {
                color = COLORS.SORTED;
                AppState.sortedIndices.add(i);
            } else if (stepData.type === 'set' && indices.includes(i)) {
                color = COLORS.ACTIVE;
            } else if (stepData.type === 'highlight' && indices.includes(i)) {
                color = COLORS.ACTIVE;
            } else if (stepData.type === 'pivot' && indices.includes(i)) {
                color = COLORS.PIVOT;
            } else if (stepData.type === 'done') {
                color = COLORS.SORTED;
            }
        }

        // Draw glow
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = (stepData && (stepData.indices || []).includes(i)) ? 15 : 5;

        // Bar gradient
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, color);
        grad.addColorStop(1, hexAlpha(color, 0.4));
        ctx.fillStyle = grad;
        roundRect(ctx, x, y, barWidth, barH, Math.min(3, barWidth / 2));
        ctx.fill();
        ctx.restore();

        // Value text (show only if bars are wide enough)
        if (barWidth >= 16) {
            drawText(ctx, String(arr[i]), x + barWidth / 2, height - 8,
                COLORS.TEXT_DIM, `${Math.min(10, barWidth - 2)}px JetBrains Mono`);
        }
    }
}

/* ============================================================
   Rendering — Graph
   ============================================================ */

function renderGraphFrame(stepData) {
    if (!AppState.graphRenderer) return;
    const state = {};

    if (stepData) {
        state.visited = stepData.visited || new Set();
        state.currentNode = stepData.nodeId;

        if (stepData.queue) {
            state.queued = new Set(stepData.queue);
        }
        if (stepData.distances) {
            state.distances = stepData.distances;
        }
        if (stepData.edgeFrom !== undefined) {
            state.activeEdges = [{ from: stepData.edgeFrom, to: stepData.nodeId }];
        }
        if (stepData.path) {
            state.path = stepData.path;
            // Create path edges
            state.pathEdges = [];
            for (let i = 0; i < stepData.path.length - 1; i++) {
                state.pathEdges.push({ from: stepData.path[i], to: stepData.path[i + 1] });
            }
        }
        if (stepData.goalId !== undefined) {
            state.goalNode = stepData.goalId;
        }
        if (AppState.graphStartNode !== null) {
            state.startNode = AppState.graphStartNode;
        }
    }

    AppState.graphRenderer.draw(AppState.graph, state);
}

/* ============================================================
   Rendering — Tree
   ============================================================ */

function renderTreeFrame(stepData) {
    if (!AppState.treeRenderer) return;
    const tree = stepData && stepData.tree ? stepData.tree : AppState.bst.serialize();
    const state = {};

    if (stepData) {
        if (stepData.highlightNode !== undefined) {
            state.highlightNode = stepData.highlightNode;
        }
        if (stepData.type === 'found') {
            state.foundNode = stepData.value;
        }
        if (stepData.type === 'insert' || stepData.type === 'inserted') {
            state.insertedNode = stepData.value;
        }
        if (stepData.type === 'visit') {
            state.highlightNode = stepData.value;
        }
        if (stepData.result) {
            state.result = stepData.result;
            state.visited = stepData.result;
        }
    }

    AppState.treeRenderer.draw(tree, state);
}

/* ============================================================
   Canvas Resize Handler
   ============================================================ */

function resizeCanvases() {
    if (DOM.vizCanvas) resizeCanvas(DOM.vizCanvas);
    if (DOM.vizCanvasCompare && !DOM.vizCanvasCompare.classList.contains('hidden')) {
        resizeCanvas(DOM.vizCanvasCompare);
    }
}

window.addEventListener('resize', debounce(() => {
    resizeCanvases();
    if (AppState.currentType === 'sorting') {
        const step = AppState.steps[AppState.currentStep];
        renderSortingFrame(step);
    } else if (AppState.currentType === 'graph') {
        renderGraphFrame();
    } else if (AppState.currentType === 'tree') {
        renderTreeFrame();
    }
}, 150));

/* ============================================================
   Controls
   ============================================================ */

function initControls() {
    DOM.btnPlayPause.addEventListener('click', togglePlayPause);
    DOM.btnReset.addEventListener('click', resetVisualization);
    DOM.btnStepForward.addEventListener('click', stepForward);
    DOM.btnStepBack.addEventListener('click', stepBackward);
    DOM.btnRandomize.addEventListener('click', () => {
        stopPlayback();
        generateNewArray();
    });

    DOM.speedSlider.addEventListener('input', () => {
        AppState.speed = DOM.speedSlider.value / 10;
        DOM.speedValue.textContent = AppState.speed.toFixed(1) + 'x';
    });

    DOM.arraySizeSlider.addEventListener('input', () => {
        AppState.arraySize = parseInt(DOM.arraySizeSlider.value);
        DOM.sizeValue.textContent = AppState.arraySize;
        stopPlayback();
        generateNewArray();
    });
}

function togglePlayPause() {
    if (AppState.steps.length === 0) {
        // Need to generate steps first
        if (AppState.currentType === 'sorting') {
            loadSortingSteps();
        } else if (AppState.currentType === 'graph') {
            startGraphAlgorithm();
        } else if (AppState.currentType === 'tree') {
            // Trees need explicit input
            return;
        }
    }

    if (AppState.isPlaying) {
        stopPlayback();
    } else {
        startPlayback();
    }
}

function startPlayback() {
    if (AppState.currentStep >= AppState.steps.length) {
        // Restart from beginning
        AppState.currentStep = 0;
        AppState.sortedIndices = new Set();
        if (AppState.currentType === 'sorting') {
            AppState.array = [...AppState.originalArray];
        }
    }

    AppState.isPlaying = true;
    updatePlayPauseIcon();

    function tick() {
        if (!AppState.isPlaying || AppState.currentStep >= AppState.steps.length) {
            stopPlayback();
            return;
        }

        applyStep(AppState.currentStep);
        AppState.currentStep++;
        updateStepDisplay();

        // Quiz mode: pause and ask question
        if (AppState.quizMode && AppState.currentStep < AppState.steps.length && AppState.currentStep % 3 === 0) {
            stopPlayback();
            showQuizQuestion();
            return;
        }

        const delay = Math.max(20, 500 / AppState.speed);
        AppState.playTimer = setTimeout(() => {
            requestAnimationFrame(tick);
        }, delay);
    }

    requestAnimationFrame(tick);
}

function stopPlayback() {
    AppState.isPlaying = false;
    if (AppState.playTimer) {
        clearTimeout(AppState.playTimer);
        AppState.playTimer = null;
    }
    updatePlayPauseIcon();
}

function stepForward() {
    if (AppState.currentStep < AppState.steps.length) {
        applyStep(AppState.currentStep);
        AppState.currentStep++;
        updateStepDisplay();
    }
}

function stepBackward() {
    if (AppState.currentStep > 0) {
        AppState.currentStep--;
        // Rebuild state from beginning to this step
        AppState.sortedIndices = new Set();
        if (AppState.currentType === 'sorting') {
            AppState.array = [...AppState.originalArray];
        }
        for (let i = 0; i < AppState.currentStep; i++) {
            const step = AppState.steps[i];
            if (step.array) AppState.array = [...step.array];
            if (step.type === 'sorted' && step.indices) {
                step.indices.forEach(idx => AppState.sortedIndices.add(idx));
            }
        }
        const step = AppState.currentStep > 0 ? AppState.steps[AppState.currentStep - 1] : null;
        if (AppState.currentType === 'sorting') {
            renderSortingFrame(step);
        } else if (AppState.currentType === 'graph') {
            renderGraphFrame(step);
        } else if (AppState.currentType === 'tree') {
            renderTreeFrame(step);
        }
        updateStepDisplay();
    }
}

function resetVisualization() {
    stopPlayback();
    AppState.currentStep = 0;
    AppState.sortedIndices = new Set();

    if (AppState.currentType === 'sorting') {
        AppState.array = [...AppState.originalArray];
        loadSortingSteps();
        renderSortingFrame();
    } else if (AppState.currentType === 'graph') {
        renderGraphFrame();
    } else if (AppState.currentType === 'tree') {
        renderTreeFrame();
    }

    updateStepDisplay();
    clearCodeHighlight();

    // Reset quiz
    AppState.quizScore = 0;
    AppState.quizStreak = 0;
    updateQuizDisplay();
}

function applyStep(stepIndex) {
    const step = AppState.steps[stepIndex];
    if (!step) return;

    if (AppState.currentType === 'sorting') {
        if (step.array) AppState.array = [...step.array];
        if (step.type === 'sorted' && step.indices) {
            step.indices.forEach(idx => AppState.sortedIndices.add(idx));
        }
        renderSortingFrame(step);
    } else if (AppState.currentType === 'graph') {
        renderGraphFrame(step);
    } else if (AppState.currentType === 'tree') {
        renderTreeFrame(step);
    }

    // Highlight code line
    if (step.codeLine !== undefined) {
        highlightCodeLine(step.codeLine);
    }

    // Update step description
    DOM.stepDesc.textContent = step.description || '';

    // ELI5 mode
    if (AppState.eli5Mode && step.eli5) {
        DOM.eli5Text.textContent = step.eli5;
    }
}

/* ============================================================
   Playback UI
   ============================================================ */

function updatePlayPauseIcon() {
    const playIcon = $('.icon-play', DOM.btnPlayPause);
    const pauseIcon = $('.icon-pause', DOM.btnPlayPause);
    if (AppState.isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

function updateStepDisplay() {
    DOM.stepCounter.textContent = `Step ${AppState.currentStep} / ${AppState.steps.length}`;
    if (AppState.currentStep === 0) {
        DOM.stepDesc.textContent = 'Ready to start';
    }
}

/* ============================================================
   Code Panel
   ============================================================ */

function updateCodePanel(code) {
    if (!code) {
        DOM.codeContent.innerHTML = '// Select an algorithm to see its code here';
        return;
    }

    const lines = code.split('\n');
    DOM.codeContent.innerHTML = lines.map((line, i) => {
        // Basic syntax highlighting
        let highlighted = escapeHtml(line)
            .replace(/\b(function|let|const|var|if|else|while|for|return|new|of|in|break|continue)\b/g,
                '<span class="code-keyword">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
            .replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>')
            .replace(/\b(Math\.\w+|console\.\w+|Array|Set|Infinity)\b/g,
                '<span class="code-function">$1</span>');

        return `<span class="code-line" data-line="${i + 1}">${highlighted}</span>`;
    }).join('\n');
}

function highlightCodeLine(lineNum) {
    $$('.code-line', DOM.codeContent).forEach(el => {
        el.classList.remove('highlight');
    });
    if (lineNum > 0) {
        const line = $(`.code-line[data-line="${lineNum}"]`, DOM.codeContent);
        if (line) {
            line.classList.add('highlight');
            line.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
}

function clearCodeHighlight() {
    $$('.code-line', DOM.codeContent).forEach(el => {
        el.classList.remove('highlight');
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ============================================================
   Modes: ELI5, Compare, Quiz
   ============================================================ */

function initModes() {
    DOM.btnEli5.addEventListener('click', () => {
        AppState.eli5Mode = !AppState.eli5Mode;
        DOM.btnEli5.classList.toggle('active', AppState.eli5Mode);
        DOM.eli5Panel.classList.toggle('hidden', !AppState.eli5Mode);
    });

    DOM.btnCompare.addEventListener('click', () => {
        AppState.compareMode = !AppState.compareMode;
        DOM.btnCompare.classList.toggle('active', AppState.compareMode);
        DOM.vizCanvasCompare.classList.toggle('hidden', !AppState.compareMode);
        DOM.vizCanvasWrapper.classList.toggle('split', AppState.compareMode);
        if (AppState.compareMode) {
            resizeCanvases();
        }
    });

    DOM.btnQuiz.addEventListener('click', () => {
        AppState.quizMode = !AppState.quizMode;
        DOM.btnQuiz.classList.toggle('active', AppState.quizMode);
        DOM.quizPanel.classList.toggle('hidden', !AppState.quizMode);
        if (AppState.quizMode) {
            AppState.quizScore = 0;
            AppState.quizStreak = 0;
            updateQuizDisplay();
        }
    });
}

/* ============================================================
   Quiz Mode
   ============================================================ */

function showQuizQuestion() {
    if (AppState.currentStep >= AppState.steps.length) return;

    const nextStep = AppState.steps[AppState.currentStep];
    AppState.quizAnswered = false;

    // Generate options
    const correctAnswer = nextStep.description;
    const options = [correctAnswer];

    // Generate fake options based on step type
    const fakeOptions = generateFakeOptions(nextStep);
    for (const fake of fakeOptions) {
        if (options.length < 4 && !options.includes(fake)) {
            options.push(fake);
        }
    }

    // Shuffle
    const shuffled = shuffleArray(options);

    DOM.quizOptions.innerHTML = '';
    DOM.quizResult.textContent = '';

    shuffled.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            if (AppState.quizAnswered) return;
            AppState.quizAnswered = true;

            if (opt === correctAnswer) {
                btn.classList.add('correct');
                DOM.quizResult.textContent = '✅ Correct!';
                AppState.quizScore++;
                AppState.quizStreak++;
            } else {
                btn.classList.add('wrong');
                DOM.quizResult.textContent = `❌ The answer was: ${correctAnswer}`;
                AppState.quizStreak = 0;
                // Highlight correct
                DOM.quizOptions.querySelectorAll('.quiz-option').forEach(b => {
                    if (b.textContent === correctAnswer) b.classList.add('correct');
                });
            }
            updateQuizDisplay();

            // Auto-continue after 1.5s
            setTimeout(() => {
                startPlayback();
            }, 1500);
        });
        DOM.quizOptions.appendChild(btn);
    });
}

function generateFakeOptions(step) {
    const fakes = [];
    if (step.type === 'compare') {
        fakes.push('Swap elements and continue');
        fakes.push('Mark element as sorted');
        fakes.push('Skip to next iteration');
    } else if (step.type === 'swap') {
        fakes.push('Compare without swapping');
        fakes.push('Element is already sorted');
        fakes.push('Move to next pass');
    } else if (step.type === 'sorted') {
        fakes.push('Continue comparing');
        fakes.push('Swap with adjacent element');
        fakes.push('Reset and start over');
    } else {
        fakes.push('Skip this step');
        fakes.push('Reverse the operation');
        fakes.push('Mark as complete');
    }
    return fakes;
}

function updateQuizDisplay() {
    if (DOM.quizScore) DOM.quizScore.textContent = AppState.quizScore;
    if (DOM.quizStreak) DOM.quizStreak.textContent = AppState.quizStreak;
}

/* ============================================================
   Graph Controls
   ============================================================ */

function initGraphControls() {
    DOM.btnAddNode.addEventListener('click', () => {
        AppState.graphMode = AppState.graphMode === 'addNode' ? 'none' : 'addNode';
        DOM.btnAddNode.classList.toggle('active', AppState.graphMode === 'addNode');
        DOM.btnAddEdge.classList.remove('active');
    });

    DOM.btnAddEdge.addEventListener('click', () => {
        AppState.graphMode = AppState.graphMode === 'addEdge' ? 'none' : 'addEdge';
        DOM.btnAddEdge.classList.toggle('active', AppState.graphMode === 'addEdge');
        DOM.btnAddNode.classList.remove('active');
        AppState.edgeStartNode = null;
    });

    DOM.btnRandomGraph.addEventListener('click', () => {
        const { width, height } = resizeCanvas(DOM.vizCanvas);
        AppState.graph.weighted = DOM.graphWeighted.checked;
        AppState.graph.directed = DOM.graphDirected.checked;
        AppState.graph.generateRandom(8, width, height);
        renderGraphFrame();
    });

    DOM.btnClearGraph.addEventListener('click', () => {
        AppState.graph.clear();
        AppState.steps = [];
        AppState.currentStep = 0;
        renderGraphFrame();
        updateStepDisplay();
    });

    DOM.graphWeighted.addEventListener('change', () => {
        AppState.graph.weighted = DOM.graphWeighted.checked;
        renderGraphFrame();
    });

    DOM.graphDirected.addEventListener('change', () => {
        AppState.graph.directed = DOM.graphDirected.checked;
        renderGraphFrame();
    });

    // Canvas click for graph interaction
    DOM.vizCanvas.addEventListener('click', (e) => {
        if (AppState.currentType !== 'graph') return;

        const rect = DOM.vizCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (AppState.graphMode === 'addNode') {
            AppState.graph.addNode(x, y);
            renderGraphFrame();
        } else if (AppState.graphMode === 'addEdge') {
            const node = AppState.graph.findNodeAt(x, y);
            if (node) {
                if (AppState.edgeStartNode === null) {
                    AppState.edgeStartNode = node.id;
                } else {
                    const w = AppState.graph.weighted ?
                        parseInt(prompt('Edge weight:', '1')) || 1 : 1;
                    AppState.graph.addEdge(AppState.edgeStartNode, node.id, w);
                    AppState.edgeStartNode = null;
                    renderGraphFrame();
                }
            }
        } else {
            // Select start node for algorithm
            const node = AppState.graph.findNodeAt(x, y);
            if (node) {
                if (AppState.graphStartNode === null) {
                    AppState.graphStartNode = node.id;
                    renderGraphFrame({ nodeId: node.id });
                } else if (AppState.currentAlgo === 'astar' && AppState.graphGoalNode === null) {
                    AppState.graphGoalNode = node.id;
                }
            }
        }
    });
}

function startGraphAlgorithm() {
    if (AppState.graph.nodes.length === 0) return;

    const startId = AppState.graphStartNode !== null ?
        AppState.graphStartNode : AppState.graph.nodes[0].id;
    const goalId = AppState.graphGoalNode !== null ?
        AppState.graphGoalNode :
        (AppState.graph.nodes.length > 1 ? AppState.graph.nodes[AppState.graph.nodes.length - 1].id : startId);

    AppState.graphStartNode = startId;

    const data = getGraphData(AppState.currentAlgo, AppState.graph, startId, goalId);
    AppState.steps = data.steps;
    AppState.currentStep = 0;
    updateCodePanel(data.code);
    updateStepDisplay();
}

/* ============================================================
   Tree Controls
   ============================================================ */

function initTreeControls() {
    DOM.btnTreeInsert.addEventListener('click', () => {
        const val = parseInt(DOM.treeNodeValue.value);
        if (isNaN(val)) return;
        AppState.currentAlgo = 'bst-insert';
        const data = getTreeData('bst-insert', AppState.bst, val);
        AppState.steps = data.steps;
        AppState.currentStep = 0;
        updateCodePanel(data.code);
        updateStepDisplay();
        updateComplexity('tree', 'bst-insert');
        DOM.treeNodeValue.value = '';
        renderTreeFrame();
    });

    DOM.btnTreeDelete.addEventListener('click', () => {
        const val = parseInt(DOM.treeNodeValue.value);
        if (isNaN(val)) return;
        AppState.currentAlgo = 'bst-delete';
        const data = getTreeData('bst-delete', AppState.bst, val);
        AppState.steps = data.steps;
        AppState.currentStep = 0;
        updateCodePanel(data.code);
        updateStepDisplay();
        updateComplexity('tree', 'bst-delete');
        DOM.treeNodeValue.value = '';
        renderTreeFrame();
    });

    DOM.btnTreeSearch.addEventListener('click', () => {
        const val = parseInt(DOM.treeNodeValue.value);
        if (isNaN(val)) return;
        AppState.currentAlgo = 'bst-search';
        const data = getTreeData('bst-search', AppState.bst, val);
        AppState.steps = data.steps;
        AppState.currentStep = 0;
        updateCodePanel(data.code);
        updateStepDisplay();
        updateComplexity('tree', 'bst-search');
        DOM.treeNodeValue.value = '';
    });

    DOM.btnTreeRandom.addEventListener('click', () => {
        AppState.bst.clear();
        AppState.bst.generateRandom(9);
        AppState.steps = [];
        AppState.currentStep = 0;
        renderTreeFrame();
        updateStepDisplay();
    });

    DOM.btnTreeClear.addEventListener('click', () => {
        AppState.bst.clear();
        AppState.steps = [];
        AppState.currentStep = 0;
        renderTreeFrame();
        updateStepDisplay();
    });

    // When selecting a traversal from sidebar, load steps
    $$('.algo-item[data-type="tree"]').forEach(item => {
        item.addEventListener('click', () => {
            const algo = item.dataset.algo;
            if (['preorder', 'inorder', 'postorder', 'levelorder'].includes(algo)) {
                loadTraversalSteps(algo);
            }
        });
    });
}

function loadTraversalSteps(algo) {
    if (!AppState.bst.root) {
        AppState.bst.generateRandom(7);
    }
    const data = getTreeData(algo, AppState.bst);
    AppState.steps = data.steps;
    AppState.currentStep = 0;
    updateCodePanel(data.code);
    updateStepDisplay();
    renderTreeFrame();
}

/* ============================================================
   Modals
   ============================================================ */

function initModals() {
    DOM.floatingHelp.addEventListener('click', () => {
        DOM.helpModal.classList.remove('hidden');
    });

    DOM.helpModalClose.addEventListener('click', () => {
        DOM.helpModal.classList.add('hidden');
    });

    DOM.helpModal.addEventListener('click', (e) => {
        if (e.target === DOM.helpModal) {
            DOM.helpModal.classList.add('hidden');
        }
    });
}

/* ============================================================
   Custom Cursor
   ============================================================ */

function initCursor() {
    if (!DOM.customCursor) return;

    // Only show on desktop
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        DOM.customCursor.style.left = mouseX + 'px';
        DOM.customCursor.style.top = mouseY + 'px';
        DOM.customCursorTrail.style.left = cursorX + 'px';
        DOM.customCursorTrail.style.top = cursorY + 'px';

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .algo-card, .algo-item, input');
        if (target) {
            DOM.customCursor.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .algo-card, .algo-item, input');
        if (target) {
            DOM.customCursor.classList.remove('hover');
        }
    });
}

/* ============================================================
   Keyboard Shortcuts
   ============================================================ */

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                stepForward();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                stepBackward();
                break;
            case 'r':
            case 'R':
                resetVisualization();
                break;
            case 'e':
            case 'E':
                DOM.btnEli5.click();
                break;
            case 'q':
            case 'Q':
                DOM.btnQuiz.click();
                break;
            case 'Escape':
                // Close modals
                DOM.helpModal.classList.add('hidden');
                break;
        }
    });
}

/* ============================================================
   Code Panel Toggle
   ============================================================ */

if (DOM && DOM.codePanelToggle) {
    // deferred
}
document.addEventListener('DOMContentLoaded', () => {
    const toggle = $('#codePanelToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const panel = $('#vizCodePanel');
            panel.classList.toggle('open');
        });
    }
});
