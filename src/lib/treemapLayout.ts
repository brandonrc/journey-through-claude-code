export type TreemapNode = {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
};

export type TreemapRect = {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function computeTreemap(
  nodes: TreemapNode[],
  width: number,
  height: number
): TreemapRect[] {
  const total = nodes.reduce((sum, n) => sum + n.value, 0);
  if (total === 0 || nodes.length === 0) return [];
  const sorted = [...nodes].sort((a, b) => b.value - a.value);
  return squarify(sorted, { x: 0, y: 0, width, height }, total);
}

type Rect = { x: number; y: number; width: number; height: number };

function squarify(nodes: TreemapNode[], bounds: Rect, total: number): TreemapRect[] {
  if (nodes.length === 0) return [];
  if (nodes.length === 1) {
    return [{ ...nodes[0], ...bounds }];
  }

  const results: TreemapRect[] = [];
  let remaining = [...nodes];
  let currentBounds = { ...bounds };
  let remainingTotal = total;

  while (remaining.length > 0) {
    const isWide = currentBounds.width >= currentBounds.height;
    const side = isWide ? currentBounds.height : currentBounds.width;

    const row: TreemapNode[] = [];
    let rowSum = 0;
    let bestWorst = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidateSum = rowSum + remaining[i].value;
      const candidateRow = [...row, remaining[i]];
      const worst = worstRatio(candidateRow, candidateSum, side, remainingTotal, currentBounds);

      if (worst <= bestWorst) {
        row.push(remaining[i]);
        rowSum = candidateSum;
        bestWorst = worst;
      } else {
        break;
      }
    }

    const rowFraction = rowSum / remainingTotal;
    const rowSize = isWide
      ? currentBounds.width * rowFraction
      : currentBounds.height * rowFraction;

    let offset = 0;
    for (const node of row) {
      const nodeFraction = node.value / rowSum;
      const nodeSize = side * nodeFraction;

      const rect: TreemapRect = isWide
        ? { ...node, x: currentBounds.x, y: currentBounds.y + offset, width: rowSize, height: nodeSize }
        : { ...node, x: currentBounds.x + offset, y: currentBounds.y, width: nodeSize, height: rowSize };

      results.push(rect);
      offset += nodeSize;
    }

    if (isWide) {
      currentBounds = {
        x: currentBounds.x + rowSize,
        y: currentBounds.y,
        width: currentBounds.width - rowSize,
        height: currentBounds.height,
      };
    } else {
      currentBounds = {
        x: currentBounds.x,
        y: currentBounds.y + rowSize,
        width: currentBounds.width,
        height: currentBounds.height - rowSize,
      };
    }

    remaining = remaining.slice(row.length);
    remainingTotal -= rowSum;
  }

  return results;
}

function worstRatio(row: TreemapNode[], rowSum: number, side: number, total: number, bounds: Rect): number {
  const isWide = bounds.width >= bounds.height;
  const rowFraction = rowSum / total;
  const rowSize = isWide ? bounds.width * rowFraction : bounds.height * rowFraction;
  if (rowSize === 0) return Infinity;

  let worst = 0;
  for (const node of row) {
    const nodeSize = side * (node.value / rowSum);
    if (nodeSize === 0) continue;
    const aspect = rowSize > nodeSize ? rowSize / nodeSize : nodeSize / rowSize;
    worst = Math.max(worst, aspect);
  }
  return worst;
}
