# 🚀 DSA Visualizer — Hack Orbit

[![Open Source](https://img.shields.io/badge/Open_Source-blue?style=for-the-badge&logo=github)](https://github.com/Hack-Orbit-Global)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://Algo-visualizer.hackorbitglobal.workers.dev)

An **interactive Data Structures & Algorithms visualizer** built with pure HTML, CSS, and vanilla JavaScript. Learn sorting, graph traversal, and tree operations through beautiful step-by-step animations with code highlighting and beginner-friendly explanations.

> Built in public by [Hack Orbit Global](https://github.com/Hack-Orbit-Global)

---

## ✨ Features

### 🔢 Sorting Algorithms (8)
- Bubble Sort, Selection Sort, Insertion Sort
- Merge Sort, Quick Sort, Heap Sort
- Counting Sort, Radix Sort

### 🕸️ Graph Algorithms (4)
- BFS (Breadth-First Search)
- DFS (Depth-First Search)
- Dijkstra's Algorithm
- A* Search

### 🌳 Tree Operations
- BST Insert, Delete, Search
- Preorder, Inorder, Postorder, Level-order Traversals

### 🎯 Interactive Features
- **Step-by-Step Mode** — walk through each step with synchronized code highlighting
- **ELI5 Mode** — "Explain Like I'm Dumb" beginner-friendly explanations
- **Quiz Mode** — test your knowledge, compete on the leaderboard
- **Comparison Mode** — run two algorithms side by side
- **Speed Control** — adjust animation speed from 0.1x to 3x
- **Graph Builder** — click to add nodes, drag to add edges
- **Interactive Trees** — insert, delete, and search nodes

### 🎨 Design
- Dark mode with glassmorphism and neon accents
- Smooth Canvas-based animations
- Fully responsive (desktop + mobile)
- Custom cursor hover effects
- Keyboard shortcuts for power users
- Hack Orbit branding and theme

---

## 📁 Folder Structure

```
/
├── index.html          # Main app (landing + visualizer)
├── contact.html        # Contact page with form
├── privacy.html        # Privacy Policy 
├── terms.html          # Terms & Conditions
├── css/
│   └── style.css       # All styles (dark theme, glass, responsive)
├── js/
│   ├── utils.js        # Shared utilities (DOM, canvas, colors, steps)
│   ├── sorting.js      # 8 sorting algorithm implementations
│   ├── graphs.js       # Graph data structure + 4 algorithms
│   ├── trees.js        # BST + traversals
│   └── main.js         # Core app controller
├── images/
│   └── favicon.svg     # SVG favicon
└── README.md           # This file
```
---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Step Forward |
| `←` | Step Backward |
| `R` | Reset |
| `E` | Toggle ELI5 Mode |
| `Q` | Toggle Quiz Mode |
| `Esc` | Close Modals |

---

## 🤝 Contributing

We welcome contributions from everyone! Here are some ways to get started:

### Good First Issues
- [ ] Add more color themes (cyberpunk, ocean, forest)
- [ ] Add array input field (custom arrays)
- [ ] Add algorithm time comparison chart
- [ ] Add more graph algorithms (Prim's, Kruskal's, Bellman-Ford)
- [ ] Add AVL Tree / Red-Black Tree visualizations
- [ ] Add sound effects for animations
- [ ] Export visualization as GIF
- [ ] Add linked list visualizations
- [ ] Improve mobile touch interactions

### How to Contribute

1. **Fork** this repository
2. **Create a branch** (`git checkout -b feature/my-feature`)
3. **Make your changes** and test locally
4. **Commit** with clear messages (`git commit -m "Add: AVL tree visualization"`)
5. **Push** to your fork (`git push origin feature/my-feature`)
6. **Open a Pull Request**

### Adding a New Algorithm

To add a new sorting algorithm:

1. Add the algorithm function in `js/sorting.js` that generates `Step[]`
2. Add the code string to `SORTING_CODE`
3. Add complexity info to `SORTING_COMPLEXITY`
4. Add a button in the sidebar section of `index.html`
5. It auto-integrates with the visualizer!

Same pattern applies for graph and tree algorithms.

---

## 📊 Performance

- **Zero dependencies** — pure HTML/CSS/JS
- **Canvas-based rendering** — smooth 60fps animations
- **Lightweight** — total page load < 500KB
- **requestAnimationFrame** — optimized animation loop  
- **Debounced resize** — no layout thrashing
- **localStorage** — no server round-trips

---

## 📄 License
This Hack Orbit project is open-source for learning only.
Commercial use is prohibited.
Credit must be given to the original author. [LICENSE](LICENSE) for details.

---

## 🌐 Links

- **Website**: [DSA Visualizer](https://Algo-visualizer.hackorbitglobal.workers.dev)
- **GitHub**: [Hack-Orbit-Global](https://github.com/Hack-Orbit-Global)
- **Discord**: [Join Community](https://discord.gg/GVNnacYENf)
- **HackOrbit**: [HackOrbitGlobal.vercel.app](https://HackOrbitGlobal.vercel.app)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Hack-Orbit-Global">Hack Orbit</a> · 2026 · Open Source
</p>
