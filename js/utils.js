/**
 * Hack Orbit Project
Copyright © Hack Orbit Global.
Open-source for learning only. Credit required. No commercial use.
 * ============================================================
 * utils.js — Shared utilities for DSA Visualizer
 * ============================================================
 * Provides common helpers for animations, DOM, colors, etc.
 */

'use strict';

/* ---------- DOM Helpers ---------- */

/**
 * Shorthand for querySelector
 * @param {string} sel - CSS selector
 * @param {Element} [parent=document] - Parent element
 * @returns {Element|null}
 */
function $(sel, parent = document) {
    return parent.querySelector(sel);
}

/**
 * Shorthand for querySelectorAll  
 * @param {string} sel - CSS selector
 * @param {Element} [parent=document] - Parent element
 * @returns {NodeList}
 */
function $$(sel, parent = document) {
    return parent.querySelectorAll(sel);
}

/* ---------- Array Utilities ---------- */

/**
 * Generate a random integer array
 * @param {number} size - Array length
 * @param {number} [min=5] - Minimum value
 * @param {number} [max=100] - Maximum value
 * @returns {number[]}
 */
function generateRandomArray(size, min = 5, max = 100) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
}

/**
 * Swap two elements in an array
 * @param {Array} arr 
 * @param {number} i 
 * @param {number} j 
 */
function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * Shuffle array using Fisher-Yates
 * @param {Array} arr 
 * @returns {Array}
 */
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ---------- Color Utilities ---------- */

const COLORS = {
    DEFAULT: '#00aaff',
    COMPARING: '#ff4466',
    SWAPPING: '#ff8800',
    SORTED: '#00ff88',
    PIVOT: '#aa00ff',
    ACTIVE: '#ffdd00',
    VISITED: '#00ff88',
    QUEUED: '#00aaff',
    CURRENT: '#ffdd00',
    EDGE: 'rgba(0, 170, 255, 0.4)',
    EDGE_ACTIVE: '#ffdd00',
    NODE: '#00aaff',
    NODE_VISITED: '#00ff88',
    NODE_CURRENT: '#ffdd00',
    BG: 'rgba(10, 10, 15, 0.0)',
    TEXT: '#e8e8f0',
    TEXT_DIM: '#606078',
    GRID: 'rgba(255, 255, 255, 0.03)',
};

/**
 * Returns a color string with alpha applied.
 * Handles hex (#rrggbb), rgb(), rgba(), hsl(), and named colors.
 * @param {string} color - Any CSS color string
 * @param {number} alpha - Opacity 0..1
 * @returns {string}
 */
function hexAlpha(color, alpha) {
    // Handle hex colors
    if (color && color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            return `rgba(${r},${g},${b},${alpha})`;
        }
    }
    // Handle rgba — replace existing alpha
    if (color && color.startsWith('rgba')) {
        return color.replace(/,[^,)]+\)/, `,${alpha})`);
    }
    // Handle rgb — convert to rgba
    if (color && color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
    }
    // Handle hsl — convert to hsla
    if (color && color.startsWith('hsl(')) {
        return color.replace('hsl(', 'hsla(').replace(')', `,${alpha})`);
    }
    // Handle hsla
    if (color && color.startsWith('hsla')) {
        return color.replace(/,[^,)]+\)/, `,${alpha})`);
    }
    // Fallback: return a transparent version using canvas
    return `rgba(128,128,128,${alpha})`;
}

/* ---------- Canvas Utilities ---------- */

/**
 * Resize canvas to match its CSS size with devicePixelRatio
 * @param {HTMLCanvasElement} canvas 
 * @returns {{width: number, height: number}} Logical size
 */
function resizeCanvas(canvas) {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { width: rect.width, height: rect.height };
}

/**
 * Clear canvas
 * @param {HTMLCanvasElement} canvas 
 */
function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw a rounded rectangle
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 * @param {number} r - radius
 */
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

/**
 * Draw a glowing circle
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} radius 
 * @param {string} color 
 * @param {number} [glowSize=10]
 */
function drawGlowCircle(ctx, x, y, radius, color, glowSize = 10) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = glowSize;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

/**
 * Draw text centered
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 * @param {string} [color='#e8e8f0'] 
 * @param {string} [font='12px Inter']
 */
function drawText(ctx, text, x, y, color = '#e8e8f0', font = '12px Inter') {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
}

/* ---------- Animation Helpers ---------- */

/**
 * Animate a value from start to end
 * @param {number} start 
 * @param {number} end 
 * @param {number} duration - ms
 * @param {function} onUpdate - called with current value
 * @param {function} [onComplete] - called when done
 * @returns {number} - animation frame id
 */
function animateValue(start, end, duration, onUpdate, onComplete) {
    const startTime = performance.now();
    let frameId;

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        const value = start + (end - start) * eased;
        onUpdate(value);
        if (progress < 1) {
            frameId = requestAnimationFrame(step);
        } else {
            if (onComplete) onComplete();
        }
    }

    frameId = requestAnimationFrame(step);
    return frameId;
}

/**
 * Easing function
 * @param {number} t - progress 0..1
 * @returns {number}
 */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 * @returns {number}
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/* ---------- Step / Trace System ---------- */

/**
 * @typedef {Object} Step
 * @property {string} type - e.g. 'compare', 'swap', 'sorted', 'set', 'highlight', 'partition'
 * @property {number[]} indices - array indices involved
 * @property {number[]} [values] - values at those indices (snapshot)
 * @property {number[]} [array] - full array snapshot
 * @property {number} [codeLine] - line number to highlight in code
 * @property {string} description - what this step does
 * @property {string} eli5 - beginner-friendly explanation
 */

/**
 * Create a step object
 * @param {string} type 
 * @param {number[]} indices 
 * @param {number[]} array 
 * @param {number} codeLine 
 * @param {string} description 
 * @param {string} eli5 
 * @param {Object} [extra]
 * @returns {Step}
 */
function createStep(type, indices, array, codeLine, description, eli5, extra = {}) {
    return {
        type,
        indices,
        array: [...array],
        codeLine,
        description,
        eli5,
        ...extra
    };
}

/* ---------- Local Storage Helpers ---------- */

/**
 * Get leaderboard from localStorage
 * @returns {Array}
 */
function getLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem('dsa_leaderboard') || '[]');
    } catch {
        return [];
    }
}

/**
 * Save score to leaderboard
 * @param {string} name 
 * @param {number} score 
 */
function saveToLeaderboard(name, score) {
    const board = getLeaderboard();
    board.push({ name, score, date: Date.now() });
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem('dsa_leaderboard', JSON.stringify(board.slice(0, 50)));
}

/* ---------- Debounce ---------- */

/**
 * Debounce function calls
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {Function}
 */
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/* ---------- Throttle ---------- */

/**
 * Throttle function calls
 * @param {Function} fn 
 * @param {number} limit 
 * @returns {Function}
 */
function throttle(fn, limit) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= limit) {
            last = now;
            return fn.apply(this, args);
        }
    };
}

/* ---------- Sleep ---------- */

/**
 * Async sleep
 * @param {number} ms 
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
