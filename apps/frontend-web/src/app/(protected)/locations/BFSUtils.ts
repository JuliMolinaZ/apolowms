import { Node2D, Worker } from "./LocationModel";

/** Crea la tabla de adyacencia a partir de un listado de nodos y edges */
export function createAdjacency(nodesIds: string[], edgesList: [string, string][]) {
  const adjacency: Record<string, string[]> = {};
  nodesIds.forEach((id) => (adjacency[id] = []));
  edgesList.forEach(([a, b]) => {
    adjacency[a].push(b);
    adjacency[b].push(a);
  });
  return adjacency;
}

/** BFS básico para encontrar ruta */
export function bfsRoute(
  start: string,
  end: string,
  adjacency: Record<string, string[]>
): string[] | null {
  const queue = [start];
  const visited = new Set<string>([start]);
  const parent: Record<string, string | null> = { [start]: null };

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === end) {
      const path: string[] = [];
      let temp: string | null = current;
      while (temp !== null) {
        path.push(temp);
        temp = parent[temp];
      }
      return path.reverse();
    }
    for (const neighbor of adjacency[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }
  return null;
}

/** Verifica si un nodo está ocupado por un trabajador */
export function isNodeOccupied(
  nodeId: string, 
  nodes: Node2D[], 
  workers: Worker[],
  safetyRadius = 30
): boolean {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return false;

  return workers.some((w) => {
    const dx = w.x - node.x;
    const dy = w.y - node.y;
    return Math.hypot(dx, dy) < safetyRadius;
  });
}

/** BFS que evita colisiones con workers */
export function bfsRouteAvoidingWorkers(
  start: string,
  end: string,
  adjacency: Record<string, string[]>,
  nodes: Node2D[],
  workers: Worker[]
): string[] | null {
  const queue = [start];
  const visited = new Set<string>([start]);
  const parent: Record<string, string | null> = { [start]: null };

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === end) {
      // Reconstruir el path
      const path: string[] = [];
      let temp: string | null = current;
      while (temp !== null) {
        path.push(temp);
        temp = parent[temp];
      }
      return path.reverse();
    }
    for (const neighbor of adjacency[current] || []) {
      // Si el nodo está ocupado, lo saltamos
      if (isNodeOccupied(neighbor, nodes, workers)) continue;

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }
  return null;
}
