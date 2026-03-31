"use client";

import { useState, useCallback } from "react";
import { getNodeById, getChildNodes, getLevel0Nodes } from "@/data/architecture";
import type { ArchitectureNode } from "@/data/types";

export type ZoomPath = { id: string; title: string }[];

export function useZoom() {
  const [path, setPath] = useState<ZoomPath>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const currentParentId = path.length > 0 ? path[path.length - 1].id : null;

  const visibleNodes: ArchitectureNode[] = currentParentId
    ? getChildNodes(currentParentId)
    : getLevel0Nodes();

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;

  const zoomIn = useCallback((nodeId: string) => {
    const node = getNodeById(nodeId);
    if (!node) return;

    const children = getChildNodes(nodeId);
    if (children.length > 0) {
      setPath((prev) => [...prev, { id: nodeId, title: node.title }]);
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(nodeId);
    }
  }, []);

  const zoomTo = useCallback((index: number) => {
    if (index < 0) {
      setPath([]);
    } else {
      setPath((prev) => prev.slice(0, index + 1));
    }
    setSelectedNodeId(null);
  }, []);

  const zoomOut = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
    setSelectedNodeId(null);
  }, []);

  return { path, visibleNodes, selectedNode, selectedNodeId, zoomIn, zoomTo, zoomOut, setSelectedNodeId };
}
