/**
 * Hack Orbit Project
Copyright © Hack Orbit Global.
Open-source for learning only. Credit required. No commercial use.
 * ============================================================
 * trees.js — Binary Search Tree with visualizations
 * ============================================================
 * Implements BST operations and traversals with step generation.
 * Supports: Insert, Delete, Search, Preorder, Inorder,
 *           Postorder, Level-order traversals.
 */

'use strict';

/* ============================================================
   BST Node
   ============================================================ */

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        // Layout coordinates (computed by renderer)
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
    }
}

/* ============================================================
   BST Class
   ============================================================ */

class BST {
    constructor() {
        this.root = null;
    }

    /**
     * Insert a value and generate steps
     * @param {number} value 
     * @returns {Step[]}
     */
    insertWithSteps(value) {
        const steps = [];

        if (this.root === null) {
            this.root = new TreeNode(value);
            steps.push({
                type: 'insert',
                value,
                nodeId: value,
                tree: this.serialize(),
                codeLine: 2,
                description: `Insert ${value} as root`,
                eli5: `The tree is empty, so ${value} becomes the root — the very first node!`
            });
            return steps;
        }

        let current = this.root;
        let parent = null;
        let direction = '';

        steps.push({
            type: 'start',
            value,
            currentValue: current.value,
            tree: this.serialize(),
            codeLine: 1,
            description: `Insert ${value}: start at root (${current.value})`,
            eli5: `We want to add ${value}. Let's start at the top of the tree (${current.value}).`
        });

        while (current !== null) {
            steps.push({
                type: 'compare',
                value,
                currentValue: current.value,
                highlightNode: current.value,
                tree: this.serialize(),
                codeLine: 4,
                description: `Compare ${value} with ${current.value}`,
                eli5: `Is ${value} less than or greater than ${current.value}?`
            });

            parent = current;
            if (value < current.value) {
                direction = 'left';
                current = current.left;
                steps.push({
                    type: 'move',
                    direction: 'left',
                    value,
                    parentValue: parent.value,
                    tree: this.serialize(),
                    codeLine: 5,
                    description: `${value} < ${parent.value}, go left`,
                    eli5: `${value} is smaller, so we go to the left child.`
                });
            } else if (value > current.value) {
                direction = 'right';
                current = current.right;
                steps.push({
                    type: 'move',
                    direction: 'right',
                    value,
                    parentValue: parent.value,
                    tree: this.serialize(),
                    codeLine: 7,
                    description: `${value} > ${parent.value}, go right`,
                    eli5: `${value} is bigger, so we go to the right child.`
                });
            } else {
                steps.push({
                    type: 'duplicate',
                    value,
                    tree: this.serialize(),
                    codeLine: 9,
                    description: `${value} already exists in the tree`,
                    eli5: `${value} is already in the tree. We don't insert duplicates!`
                });
                return steps;
            }
        }

        const newNode = new TreeNode(value);
        if (direction === 'left') {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        steps.push({
            type: 'insert',
            value,
            parentValue: parent.value,
            direction,
            tree: this.serialize(),
            codeLine: 10,
            description: `Insert ${value} as ${direction} child of ${parent.value}`,
            eli5: `Found an empty spot! ${value} goes as the ${direction} child of ${parent.value}. 🎉`
        });

        return steps;
    }

    /**
     * Delete a value and generate steps
     * @param {number} value 
     * @returns {Step[]}
     */
    deleteWithSteps(value) {
        const steps = [];
        this.root = this._deleteHelper(this.root, value, steps);
        return steps;
    }

    _deleteHelper(node, value, steps) {
        if (node === null) {
            steps.push({
                type: 'not-found',
                value,
                tree: this.serialize(),
                codeLine: 1,
                description: `Value ${value} not found in tree`,
                eli5: `We searched everywhere but ${value} isn't in the tree.`
            });
            return null;
        }

        steps.push({
            type: 'compare',
            value,
            currentValue: node.value,
            highlightNode: node.value,
            tree: this.serialize(),
            codeLine: 3,
            description: `Compare ${value} with ${node.value}`,
            eli5: `Looking for ${value}. Currently at ${node.value}.`
        });

        if (value < node.value) {
            node.left = this._deleteHelper(node.left, value, steps);
        } else if (value > node.value) {
            node.right = this._deleteHelper(node.right, value, steps);
        } else {
            // Found the node
            if (node.left === null && node.right === null) {
                steps.push({
                    type: 'delete-leaf',
                    value,
                    tree: this.serialize(),
                    codeLine: 7,
                    description: `Delete leaf node ${value}`,
                    eli5: `${value} has no children — just remove it!`
                });
                return null;
            } else if (node.left === null) {
                steps.push({
                    type: 'delete-one-child',
                    value,
                    replacement: node.right.value,
                    tree: this.serialize(),
                    codeLine: 9,
                    description: `Delete ${value}, replace with right child ${node.right.value}`,
                    eli5: `${value} has only a right child. We replace it with ${node.right.value}.`
                });
                return node.right;
            } else if (node.right === null) {
                steps.push({
                    type: 'delete-one-child',
                    value,
                    replacement: node.left.value,
                    tree: this.serialize(),
                    codeLine: 11,
                    description: `Delete ${value}, replace with left child ${node.left.value}`,
                    eli5: `${value} has only a left child. We replace it with ${node.left.value}.`
                });
                return node.left;
            } else {
                // Find inorder successor
                let successor = node.right;
                while (successor.left !== null) {
                    successor = successor.left;
                }
                steps.push({
                    type: 'delete-two-children',
                    value,
                    successor: successor.value,
                    tree: this.serialize(),
                    codeLine: 13,
                    description: `Replace ${value} with inorder successor ${successor.value}`,
                    eli5: `${value} has two children. We find the next bigger value (${successor.value}) and swap it in.`
                });
                node.value = successor.value;
                node.right = this._deleteHelper(node.right, successor.value, steps);
            }
        }
        return node;
    }

    /**
     * Search for a value and generate steps
     * @param {number} value 
     * @returns {Step[]}
     */
    searchWithSteps(value) {
        const steps = [];
        let current = this.root;

        steps.push({
            type: 'start',
            value,
            tree: this.serialize(),
            codeLine: 1,
            description: `Search for ${value}`,
            eli5: `Let's find ${value} in our tree! Starting at the root.`
        });

        while (current !== null) {
            steps.push({
                type: 'compare',
                value,
                currentValue: current.value,
                highlightNode: current.value,
                tree: this.serialize(),
                codeLine: 3,
                description: `Compare ${value} with ${current.value}`,
                eli5: `Is ${value} equal to ${current.value}?`
            });

            if (value === current.value) {
                steps.push({
                    type: 'found',
                    value,
                    highlightNode: current.value,
                    tree: this.serialize(),
                    codeLine: 4,
                    description: `Found ${value}!`,
                    eli5: `Yes! We found ${value}! 🎉`
                });
                return steps;
            } else if (value < current.value) {
                steps.push({
                    type: 'move',
                    direction: 'left',
                    value,
                    tree: this.serialize(),
                    codeLine: 6,
                    description: `${value} < ${current.value}, go left`,
                    eli5: `${value} is smaller, so it must be in the left subtree.`
                });
                current = current.left;
            } else {
                steps.push({
                    type: 'move',
                    direction: 'right',
                    value,
                    tree: this.serialize(),
                    codeLine: 8,
                    description: `${value} > ${current.value}, go right`,
                    eli5: `${value} is bigger, so it must be in the right subtree.`
                });
                current = current.right;
            }
        }

        steps.push({
            type: 'not-found',
            value,
            tree: this.serialize(),
            codeLine: 10,
            description: `${value} not found in tree`,
            eli5: `We reached a dead end. ${value} is not in the tree. 😞`
        });
        return steps;
    }

    /**
     * Preorder traversal with steps
     * @returns {Step[]}
     */
    preorderSteps() {
        const steps = [];
        const result = [];

        function helper(node) {
            if (!node) return;
            result.push(node.value);
            steps.push({
                type: 'visit',
                value: node.value,
                highlightNode: node.value,
                result: [...result],
                codeLine: 2,
                description: `Visit ${node.value} (Preorder: Root → Left → Right)`,
                eli5: `Preorder visits the node FIRST, then goes left, then right. Visit ${node.value}!`
            });
            helper(node.left);
            helper(node.right);
        }

        steps.push({
            type: 'start',
            codeLine: 1,
            description: 'Start Preorder Traversal (Root → Left → Right)',
            eli5: 'In Preorder, we visit the current node first, then its left subtree, then its right subtree.'
        });
        helper(this.root);
        steps.push({
            type: 'done',
            result: [...result],
            codeLine: 0,
            description: `Preorder: [${result.join(', ')}]`,
            eli5: `Done! Preorder result: [${result.join(', ')}] 🎉`
        });
        return steps;
    }

    /**
     * Inorder traversal with steps
     * @returns {Step[]}
     */
    inorderSteps() {
        const steps = [];
        const result = [];

        function helper(node) {
            if (!node) return;
            helper(node.left);
            result.push(node.value);
            steps.push({
                type: 'visit',
                value: node.value,
                highlightNode: node.value,
                result: [...result],
                codeLine: 3,
                description: `Visit ${node.value} (Inorder: Left → Root → Right)`,
                eli5: `Inorder goes left first, then visits the node, then goes right. Visit ${node.value}!`
            });
            helper(node.right);
        }

        steps.push({
            type: 'start',
            codeLine: 1,
            description: 'Start Inorder Traversal (Left → Root → Right)',
            eli5: 'Inorder gives us nodes in sorted order! Left first, then the node, then right.'
        });
        helper(this.root);
        steps.push({
            type: 'done',
            result: [...result],
            codeLine: 0,
            description: `Inorder: [${result.join(', ')}]`,
            eli5: `Done! Inorder result: [${result.join(', ')}] — notice they're in sorted order! 🎉`
        });
        return steps;
    }

    /**
     * Postorder traversal with steps
     * @returns {Step[]}
     */
    postorderSteps() {
        const steps = [];
        const result = [];

        function helper(node) {
            if (!node) return;
            helper(node.left);
            helper(node.right);
            result.push(node.value);
            steps.push({
                type: 'visit',
                value: node.value,
                highlightNode: node.value,
                result: [...result],
                codeLine: 4,
                description: `Visit ${node.value} (Postorder: Left → Right → Root)`,
                eli5: `Postorder visits children first, then the parent. Visit ${node.value}!`
            });
        }

        steps.push({
            type: 'start',
            codeLine: 1,
            description: 'Start Postorder Traversal (Left → Right → Root)',
            eli5: 'In Postorder, we visit both children before the parent node.'
        });
        helper(this.root);
        steps.push({
            type: 'done',
            result: [...result],
            codeLine: 0,
            description: `Postorder: [${result.join(', ')}]`,
            eli5: `Done! Postorder result: [${result.join(', ')}] 🎉`
        });
        return steps;
    }

    /**
     * Level-order traversal with steps
     * @returns {Step[]}
     */
    levelOrderSteps() {
        const steps = [];
        const result = [];

        if (!this.root) {
            steps.push({
                type: 'done',
                result: [],
                codeLine: 0,
                description: 'Tree is empty',
                eli5: 'Nothing to traverse — the tree is empty!'
            });
            return steps;
        }

        const queue = [this.root];

        steps.push({
            type: 'start',
            codeLine: 1,
            description: 'Start Level-order Traversal (BFS on tree)',
            eli5: 'Level-order visits nodes level by level, left to right — like reading a book!'
        });

        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.value);

            steps.push({
                type: 'visit',
                value: node.value,
                highlightNode: node.value,
                result: [...result],
                codeLine: 4,
                description: `Visit ${node.value} (Level-order)`,
                eli5: `Visit ${node.value}! Then add its children to the queue.`
            });

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        steps.push({
            type: 'done',
            result: [...result],
            codeLine: 0,
            description: `Level-order: [${result.join(', ')}]`,
            eli5: `Done! Level-order result: [${result.join(', ')}] 🎉`
        });
        return steps;
    }

    /**
     * Serialize tree to array format for rendering
     * @returns {Object|null}
     */
    serialize() {
        if (!this.root) return null;

        function serializeNode(node) {
            if (!node) return null;
            return {
                value: node.value,
                left: serializeNode(node.left),
                right: serializeNode(node.right)
            };
        }

        return serializeNode(this.root);
    }

    /**
     * Generate random BST with n nodes
     * @param {number} n 
     */
    generateRandom(n) {
        this.root = null;
        const values = new Set();
        while (values.size < n) {
            values.add(Math.floor(Math.random() * 99) + 1);
        }
        for (const v of values) {
            this.insert(v);
        }
    }

    /**
     * Insert without steps (for building)
     * @param {number} value 
     */
    insert(value) {
        this.root = this._insert(this.root, value);
    }

    _insert(node, value) {
        if (!node) return new TreeNode(value);
        if (value < node.value) node.left = this._insert(node.left, value);
        else if (value > node.value) node.right = this._insert(node.right, value);
        return node;
    }

    /**
     * Clear the tree
     */
    clear() {
        this.root = null;
    }
}

/* ============================================================
   Tree Renderer (Canvas)
   ============================================================ */

class TreeRenderer {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodeRadius = 20;
        this.levelHeight = 60;
        this.padding = 30;
    }

    /**
     * Calculate positions for each node
     * @param {Object} tree - serialized tree
     * @param {number} width 
     * @param {number} height 
     * @returns {Array} - flat array of { value, x, y, left, right, parent }
     */
    layoutTree(tree, width, height) {
        if (!tree) return [];
        const nodes = [];

        function assignPositions(node, depth, left, right, parent) {
            if (!node) return;
            const x = (left + right) / 2;
            const y = 40 + depth * 65;
            nodes.push({
                value: node.value,
                x,
                y,
                hasLeft: !!node.left,
                hasRight: !!node.right,
                parent
            });
            assignPositions(node.left, depth + 1, left, x, node.value);
            assignPositions(node.right, depth + 1, x, right, node.value);
        }

        assignPositions(tree, 0, this.padding, width - this.padding, null);
        return nodes;
    }

    /**
     * Draw the tree
     * @param {Object} tree - serialized tree
     * @param {Object} [state] - highlight state
     */
    draw(tree, state = {}) {
        const ctx = this.ctx;
        const { width, height } = resizeCanvas(this.canvas);

        if (!tree) {
            drawText(ctx, 'Tree is empty. Insert a node to start!', width / 2, height / 2,
                COLORS.TEXT_DIM, '14px Inter');
            return;
        }

        const nodes = this.layoutTree(tree, width, height);

        // Draw edges
        for (const node of nodes) {
            if (node.parent !== null) {
                const parentNode = nodes.find(n => n.value === node.parent);
                if (parentNode) {
                    let edgeColor = 'rgba(0, 170, 255, 0.3)';

                    if (state.highlightPath && state.highlightPath.includes(node.value) && state.highlightPath.includes(parentNode.value)) {
                        edgeColor = COLORS.ACTIVE;
                    }

                    ctx.beginPath();
                    ctx.moveTo(parentNode.x, parentNode.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.strokeStyle = edgeColor;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (const node of nodes) {
            let color = COLORS.NODE;
            let glow = 0;

            if (state.visited && state.visited.includes(node.value)) {
                color = COLORS.VISITED;
                glow = 8;
            }
            if (state.highlightNode === node.value) {
                color = COLORS.CURRENT;
                glow = 15;
            }
            if (state.foundNode === node.value) {
                color = COLORS.SORTED;
                glow = 15;
            }
            if (state.insertedNode === node.value) {
                color = COLORS.SORTED;
                glow = 15;
            }
            if (state.deletedNode === node.value) {
                color = COLORS.COMPARING;
                glow = 12;
            }

            // Glow
            if (glow > 0) {
                ctx.save();
                ctx.shadowColor = color;
                ctx.shadowBlur = glow;
                ctx.beginPath();
                ctx.arc(node.x, node.y, this.nodeRadius + 4, 0, Math.PI * 2);
                ctx.fillStyle = hexAlpha(color, 0.15);
                ctx.fill();
                ctx.restore();
            }

            // Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = hexAlpha(color, 0.12);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Value text
            drawText(ctx, String(node.value), node.x, node.y, COLORS.TEXT, 'bold 13px Inter');
        }

        // Draw traversal result
        if (state.result && state.result.length > 0) {
            const resultText = `Result: [${state.result.join(', ')}]`;
            drawText(ctx, resultText, width / 2, height - 20, COLORS.ACTIVE, '12px JetBrains Mono');
        }
    }
}

/* ============================================================
   Algorithm Code Strings
   ============================================================ */

const TREE_CODE = {
    'bst-insert': `function insert(root, value) {
  if (root === null)
    return new Node(value);
  if (value < root.value)
    root.left = insert(root.left, value);
  else if (value > root.value)
    root.right = insert(root.right, value);
  return root;
}`,
    'bst-delete': `function deleteNode(root, value) {
  if (!root) return null;
  if (value < root.value)
    root.left = deleteNode(root.left, value);
  else if (value > root.value)
    root.right = deleteNode(root.right, value);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let successor = root.right;
    while (successor.left)
      successor = successor.left;
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }
  return root;
}`,
    'bst-search': `function search(root, value) {
  if (!root) return null;
  if (value === root.value)
    return root;
  if (value < root.value)
    return search(root.left, value);
  else
    return search(root.right, value);
}`,
    'preorder': `function preorder(node) {
  if (!node) return;
  visit(node);        // Root
  preorder(node.left);  // Left
  preorder(node.right); // Right
}`,
    'inorder': `function inorder(node) {
  if (!node) return;
  inorder(node.left);   // Left
  visit(node);          // Root
  inorder(node.right);  // Right
}`,
    'postorder': `function postorder(node) {
  if (!node) return;
  postorder(node.left);  // Left
  postorder(node.right); // Right
  visit(node);           // Root
}`,
    'levelorder': `function levelOrder(root) {
  if (!root) return;
  let queue = [root];
  while (queue.length > 0) {
    let node = queue.shift();
    visit(node);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`
};

const TREE_COMPLEXITY = {
    'bst-insert': { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    'bst-delete': { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    'bst-search': { best: 'O(1)', avg: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    'preorder': { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    'inorder': { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    'postorder': { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    'levelorder': { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)' },
};

/* ============================================================
   Export: get tree algorithm data
   ============================================================ */

/**
 * Get steps for a tree operation
 * @param {string} algoName 
 * @param {BST} bst 
 * @param {number} [value]
 * @returns {{ steps: Array, code: string, complexity: Object }}
 */
function getTreeData(algoName, bst, value) {
    let steps = [];

    switch (algoName) {
        case 'bst-insert':
            steps = bst.insertWithSteps(value);
            break;
        case 'bst-delete':
            steps = bst.deleteWithSteps(value);
            break;
        case 'bst-search':
            steps = bst.searchWithSteps(value);
            break;
        case 'preorder':
            steps = bst.preorderSteps();
            break;
        case 'inorder':
            steps = bst.inorderSteps();
            break;
        case 'postorder':
            steps = bst.postorderSteps();
            break;
        case 'levelorder':
            steps = bst.levelOrderSteps();
            break;
        default:
            console.error(`Unknown tree algorithm: ${algoName}`);
    }

    return {
        steps,
        code: TREE_CODE[algoName] || '',
        complexity: TREE_COMPLEXITY[algoName] || {},
    };
}
