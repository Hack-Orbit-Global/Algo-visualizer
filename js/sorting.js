/**
 * Hack Orbit Project
Copyright © Hack Orbit Global.
Open-source for learning only. Credit required. No commercial use.
 * ============================================================
 * sorting.js — All sorting algorithm implementations
 * ============================================================
 * Supported algorithms:
 * - Bubble Sort
 * - Selection Sort
 * - Insertion Sort
 * - Merge Sort
 * - Quick Sort
 * - Heap Sort
 * - Counting Sort
 * - Radix Sort
 */

'use strict';

/* ============================================================
   Algorithm Code Strings (for code panel display)
   ============================================================ */

const SORTING_CODE = {
    bubble: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`,
    selection: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    insertion: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    merge: `function mergeSort(arr, l, r) {
  if (l >= r) return;
  let m = Math.floor((l + r) / 2);
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}

function merge(arr, l, m, r) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,
    quick: `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  return i + 1;
}`,
    heap: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n/2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    counting: `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  let output = new Array(arr.length);
  
  for (let i = 0; i < arr.length; i++)
    count[arr[i]]++;
  for (let i = 1; i <= max; i++)
    count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  for (let i = 0; i < arr.length; i++)
    arr[i] = output[i];
}`,
    radix: `function radixSort(arr) {
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max/exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
}

function countingSortByDigit(arr, exp) {
  let output = new Array(arr.length);
  let count = new Array(10).fill(0);
  
  for (let i = 0; i < arr.length; i++)
    count[Math.floor(arr[i]/exp) % 10]++;
  for (let i = 1; i < 10; i++)
    count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    let d = Math.floor(arr[i]/exp) % 10;
    output[count[d] - 1] = arr[i];
    count[d]--;
  }
  for (let i = 0; i < arr.length; i++)
    arr[i] = output[i];
}`
};

/* ============================================================
   Complexity Info
   ============================================================ */

const SORTING_COMPLEXITY = {
    bubble: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    selection: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    insertion: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    merge: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    quick: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    heap: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    counting: { best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)' },
    radix: { best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)' },
};

/* ============================================================
   Step generation for each algorithm
   ============================================================ */

/**
 * Generate Bubble Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function bubbleSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Compare step
            steps.push(createStep('compare', [j, j + 1], arr, 3,
                `Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`,
                `We look at two neighbors: ${arr[j]} and ${arr[j + 1]}. Is the left one bigger?`
            ));

            if (arr[j] > arr[j + 1]) {
                // Swap step
                swap(arr, j, j + 1);
                steps.push(createStep('swap', [j, j + 1], arr, 4,
                    `Swapping ${arr[j + 1]} and ${arr[j]}`,
                    `Yes! ${arr[j + 1]} was bigger, so we swap them. Now ${arr[j]} comes first.`
                ));
            }
        }
        // Mark sorted
        steps.push(createStep('sorted', [n - i - 1], arr, 2,
            `Element at index ${n - i - 1} is now sorted`,
            `The biggest unsorted number has "bubbled up" to its correct spot!`
        ));
    }
    steps.push(createStep('sorted', [0], arr, 7,
        'Sorting complete!',
        'All done! Every element has bubbled to its correct position. 🎉'
    ));
    return steps;
}

/**
 * Generate Selection Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function selectionSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push(createStep('highlight', [i], arr, 3,
            `Starting pass ${i + 1}. Assume arr[${i}]=${arr[i]} is minimum`,
            `Let's find the smallest number from position ${i} onwards. We'll guess it's ${arr[i]} for now.`
        ));

        for (let j = i + 1; j < n; j++) {
            steps.push(createStep('compare', [minIdx, j], arr, 4,
                `Comparing min=${arr[minIdx]} with arr[${j}]=${arr[j]}`,
                `Is ${arr[j]} smaller than our current minimum (${arr[minIdx]})?`
            ));
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                steps.push(createStep('highlight', [minIdx], arr, 5,
                    `New minimum found: arr[${minIdx}]=${arr[minIdx]}`,
                    `Yes! ${arr[minIdx]} is smaller. That's our new minimum!`
                ));
            }
        }

        if (minIdx !== i) {
            swap(arr, i, minIdx);
            steps.push(createStep('swap', [i, minIdx], arr, 7,
                `Swapping arr[${i}] with arr[${minIdx}]`,
                `We place the smallest number (${arr[i]}) at position ${i}.`
            ));
        }

        steps.push(createStep('sorted', [i], arr, 2,
            `Index ${i} is now sorted`,
            `Position ${i} now has the correct value. Moving on!`
        ));
    }
    steps.push(createStep('sorted', [n - 1], arr, 9,
        'Sorting complete!',
        'All elements selected and placed. The array is sorted! 🎉'
    ));
    return steps;
}

/**
 * Generate Insertion Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function insertionSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];
    const n = arr.length;

    steps.push(createStep('sorted', [0], arr, 2,
        'First element is trivially sorted',
        'The first card in our hand is already "sorted" by itself.'
    ));

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        steps.push(createStep('highlight', [i], arr, 3,
            `Pick key = arr[${i}] = ${key}`,
            `We pick up the card ${key} and need to insert it in the right spot.`
        ));

        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            steps.push(createStep('compare', [j, j + 1], arr, 5,
                `Comparing arr[${j}]=${arr[j]} > key=${key}`,
                `${arr[j]} is bigger than ${key}, so we shift ${arr[j]} one position right.`
            ));
            arr[j + 1] = arr[j];
            steps.push(createStep('set', [j + 1], arr, 6,
                `Shift arr[${j}] to arr[${j + 1}]`,
                `Moved ${arr[j + 1]} to the right to make room.`
            ));
            j--;
        }

        arr[j + 1] = key;
        steps.push(createStep('set', [j + 1], arr, 8,
            `Insert key=${key} at index ${j + 1}`,
            `Found the right spot! Placing ${key} at position ${j + 1}. 🎯`
        ));
    }

    steps.push(createStep('done', [], arr, 10,
        'Sorting complete!',
        'All cards inserted in order. The array is sorted! 🎉'
    ));
    return steps;
}

/**
 * Generate Merge Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function mergeSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];

    function mergeHelper(arr, l, r) {
        if (l >= r) return;
        const m = Math.floor((l + r) / 2);

        steps.push(createStep('highlight', [l, r], arr, 2,
            `Dividing arr[${l}..${r}] at midpoint ${m}`,
            `We split the section from index ${l} to ${r} into two halves.`,
            { range: [l, r], mid: m }
        ));

        mergeHelper(arr, l, m);
        mergeHelper(arr, m + 1, r);

        // Merge
        const left = arr.slice(l, m + 1);
        const right = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;

        steps.push(createStep('highlight', [l, r], arr, 7,
            `Merging arr[${l}..${m}] and arr[${m + 1}..${r}]`,
            `Now we merge the two sorted halves back together, picking the smaller element each time.`,
            { range: [l, r] }
        ));

        while (i < left.length && j < right.length) {
            steps.push(createStep('compare', [l + i, m + 1 + j], arr, 10,
                `Comparing ${left[i]} and ${right[j]}`,
                `Which is smaller: ${left[i]} or ${right[j]}?`
            ));

            if (left[i] <= right[j]) {
                arr[k] = left[i];
                steps.push(createStep('set', [k], arr, 11,
                    `Place ${left[i]} at index ${k}`,
                    `${left[i]} is smaller (or equal), so it goes next!`
                ));
                i++;
            } else {
                arr[k] = right[j];
                steps.push(createStep('set', [k], arr, 13,
                    `Place ${right[j]} at index ${k}`,
                    `${right[j]} is smaller, so it goes next!`
                ));
                j++;
            }
            k++;
        }

        while (i < left.length) {
            arr[k] = left[i];
            steps.push(createStep('set', [k], arr, 16,
                `Place remaining ${left[i]} at index ${k}`,
                `Copy remaining elements from the left half.`
            ));
            i++; k++;
        }

        while (j < right.length) {
            arr[k] = right[j];
            steps.push(createStep('set', [k], arr, 17,
                `Place remaining ${right[j]} at index ${k}`,
                `Copy remaining elements from the right half.`
            ));
            j++; k++;
        }
    }

    mergeHelper(arr, 0, arr.length - 1);
    steps.push(createStep('done', [], arr, 0,
        'Sorting complete!',
        'All halves merged! The array is fully sorted. 🎉'
    ));
    return steps;
}

/**
 * Generate Quick Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function quickSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];

    function qsHelper(low, high) {
        if (low >= high) return;

        const pivot = arr[high];
        steps.push(createStep('pivot', [high], arr, 8,
            `Pivot chosen: arr[${high}]=${pivot}`,
            `We pick ${pivot} as our pivot. Everything smaller goes left, bigger goes right.`,
            { pivot: high }
        ));

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push(createStep('compare', [j, high], arr, 10,
                `Comparing arr[${j}]=${arr[j]} with pivot=${pivot}`,
                `Is ${arr[j]} less than our pivot (${pivot})?`
            ));

            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    swap(arr, i, j);
                    steps.push(createStep('swap', [i, j], arr, 12,
                        `Swap arr[${i}]=${arr[j]} ↔ arr[${j}]=${arr[i]}`,
                        `Yes! So we swap ${arr[j]} to the left partition.`
                    ));
                }
            }
        }

        swap(arr, i + 1, high);
        steps.push(createStep('swap', [i + 1, high], arr, 14,
            `Place pivot at index ${i + 1}`,
            `Pivot ${pivot} goes to its final position at index ${i + 1}. 🎯`
        ));

        const pi = i + 1;
        steps.push(createStep('sorted', [pi], arr, 14,
            `Pivot index ${pi} is now in correct position`,
            `${arr[pi]} is in its final sorted spot!`
        ));

        qsHelper(low, pi - 1);
        qsHelper(pi + 1, high);
    }

    qsHelper(0, arr.length - 1);
    steps.push(createStep('done', [], arr, 0,
        'Sorting complete!',
        'All pivots placed. The array is sorted! 🎉'
    ));
    return steps;
}

/**
 * Generate Heap Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function heapSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];
    const n = arr.length;

    function heapify(size, i) {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        if (l < size) {
            steps.push(createStep('compare', [largest, l], arr, 13,
                `Comparing arr[${largest}]=${arr[largest]} with left child arr[${l}]=${arr[l]}`,
                `Checking if the left child (${arr[l]}) is bigger than the parent (${arr[largest]}).`
            ));
            if (arr[l] > arr[largest]) largest = l;
        }

        if (r < size) {
            steps.push(createStep('compare', [largest, r], arr, 14,
                `Comparing arr[${largest}]=${arr[largest]} with right child arr[${r}]=${arr[r]}`,
                `Checking if the right child (${arr[r]}) is bigger.`
            ));
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
            swap(arr, i, largest);
            steps.push(createStep('swap', [i, largest], arr, 16,
                `Swap arr[${i}]=${arr[largest]} ↔ arr[${largest}]=${arr[i]}`,
                `The child was bigger, so we swap to maintain the heap property.`
            ));
            heapify(size, largest);
        }
    }

    // Build max heap
    steps.push(createStep('highlight', [], arr, 3,
        'Building max heap...',
        'First, we arrange the array into a max-heap where every parent is bigger than its children.'
    ));

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
        swap(arr, 0, i);
        steps.push(createStep('swap', [0, i], arr, 6,
            `Move max element arr[0]=${arr[i]} to end (index ${i})`,
            `The biggest remaining element goes to the end — its sorted position!`
        ));
        steps.push(createStep('sorted', [i], arr, 6,
            `Index ${i} is sorted`,
            `Position ${i} is now finalized.`
        ));
        heapify(i, 0);
    }

    steps.push(createStep('sorted', [0], arr, 0,
        'Sorting complete!',
        'The heap is empty, array is sorted! 🎉'
    ));
    return steps;
}

/**
 * Generate Counting Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function countingSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];
    const n = arr.length;
    const max = Math.max(...arr);

    steps.push(createStep('highlight', [], arr, 1,
        `Max value = ${max}. Creating count array of size ${max + 1}`,
        `We find the biggest number (${max}) and create a counting array to tally each value.`
    ));

    const count = new Array(max + 1).fill(0);

    // Count occurrences
    for (let i = 0; i < n; i++) {
        count[arr[i]]++;
        steps.push(createStep('highlight', [i], arr, 4,
            `Count arr[${i}]=${arr[i]}: count[${arr[i]}] = ${count[arr[i]]}`,
            `We see ${arr[i]}, so we add one to its tally. Count of ${arr[i]} is now ${count[arr[i]]}.`
        ));
    }

    // Cumulative count
    for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }

    // Build output
    const output = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
        steps.push(createStep('set', [count[arr[i]]], [...output.map(v => v || 0)], 9,
            `Place ${arr[i]} at output[${count[arr[i]]}]`,
            `Based on our counts, ${arr[i]} belongs at index ${count[arr[i]]} in the output.`
        ));
    }

    // Copy back
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    steps.push(createStep('done', [], arr, 11,
        'Sorting complete!',
        'All values counted and placed. Counting Sort is done! 🎉'
    ));
    return steps;
}

/**
 * Generate Radix Sort steps
 * @param {number[]} inputArr 
 * @returns {Step[]}
 */
function radixSortSteps(inputArr) {
    const arr = [...inputArr];
    const steps = [];
    const max = Math.max(...arr);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        steps.push(createStep('highlight', [], arr, 2,
            `Sorting by digit at position ${exp}`,
            `We sort all numbers by looking only at the ${exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'} digit.`
        ));

        const output = new Array(arr.length);
        const count = new Array(10).fill(0);

        for (let i = 0; i < arr.length; i++) {
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            steps.push(createStep('highlight', [i], arr, 5,
                `arr[${i}]=${arr[i]}, digit=${digit}`,
                `The ${exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'} digit of ${arr[i]} is ${digit}.`
            ));
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = arr.length - 1; i >= 0; i--) {
            const digit = Math.floor(arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }

        for (let i = 0; i < arr.length; i++) {
            arr[i] = output[i];
            steps.push(createStep('set', [i], arr, 12,
                `Place ${arr[i]} at index ${i}`,
                `After sorting by this digit, ${arr[i]} goes to position ${i}.`
            ));
        }
    }

    steps.push(createStep('done', [], arr, 0,
        'Sorting complete!',
        'All digit positions processed. Radix Sort is done! 🎉'
    ));
    return steps;
}

/* ============================================================
   Main Export: generate steps for a given algorithm
   ============================================================ */

/**
 * Get steps for a sorting algorithm
 * @param {string} algoName - e.g. 'bubble', 'merge', etc.
 * @param {number[]} arr - input array
 * @returns {{ steps: Step[], code: string, complexity: Object }}
 */
function getSortingData(algoName, arr) {
    const generators = {
        bubble: bubbleSortSteps,
        selection: selectionSortSteps,
        insertion: insertionSortSteps,
        merge: mergeSortSteps,
        quick: quickSortSteps,
        heap: heapSortSteps,
        counting: countingSortSteps,
        radix: radixSortSteps,
    };

    const gen = generators[algoName];
    if (!gen) {
        console.error(`Unknown sorting algorithm: ${algoName}`);
        return { steps: [], code: '', complexity: {} };
    }

    return {
        steps: gen(arr),
        code: SORTING_CODE[algoName] || '',
        complexity: SORTING_COMPLEXITY[algoName] || {},
    };
}
