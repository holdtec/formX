
/**
 * Generic Dependency Graph Implementation (DAG)
 * 负责拓扑排序和循环检测，不包含具体的业务逻辑。
 */
export class DependencyGraph {
  private adjacencyList: Map<string, Set<string>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node: string) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Set());
    }
  }

  addDependency(from: string, to: string) {
    this.addNode(from);
    this.addNode(to);
    this.adjacencyList.get(from)?.add(to);
  }

  /**
   * 获取某节点的所有直接依赖（谁依赖我）
   */
  getDirectDependents(node: string): string[] {
    return Array.from(this.adjacencyList.get(node) || []);
  }

  /**
   * 核心算法：获取执行顺序 (BFS 变体)
   * 给定一个触发变更的起始节点，返回所有受影响节点的拓扑执行顺序。
   */
  getExecutionOrder(startNode: string): string[] {
    const visited = new Set<string>();
    const order: string[] = [];
    const queue: string[] = [startNode];

    // 简单的 BFS 只能找到受影响的节点，但不能保证拓扑顺序。
    // 对于正确的计算引擎，我们需要 Kahn 算法或 DFS 后序遍历的逆序。
    // 这里为了性能和增量计算，我们采用“子图拓扑排序”。
    
    // 1. 找出所有可达节点 (Subgraph)
    const subgraphNodes = new Set<string>();
    const pendingQueue = [startNode];
    while(pendingQueue.length > 0) {
      const current = pendingQueue.shift()!;
      if (!subgraphNodes.has(current)) {
        subgraphNodes.add(current);
        const neighbors = this.adjacencyList.get(current) || [];
        for (const neighbor of neighbors) {
          pendingQueue.push(neighbor);
        }
      }
    }

    // 2. 对子图进行入度计算 (In-degree)
    const inDegree = new Map<string, number>();
    subgraphNodes.forEach(node => inDegree.set(node, 0));

    subgraphNodes.forEach(node => {
      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (subgraphNodes.has(neighbor)) {
          inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
        }
      }
    });

    // 3. Kahn's Algorithm on Subgraph
    // 起始节点的入度在子图中视为 0 (尽管它可能被外部依赖，但在本次触发链中它是源头)
    // 但为了确保 A->B, A->C, B->C 的情况 C 在 B 之后执行，我们需要严格遵循入度。
    // 这里简化处理：将 startNode 作为种子放入队列
    
    const kahnQueue: string[] = [startNode];
    
    // 注意：如果 startNode 本身在环中，这里检测不到，需要专门的 detectCycle
    while (kahnQueue.length > 0) {
      const current = kahnQueue.shift()!;
      // 只有除了 startNode 以外的节点才需要加入执行队列（startNode 值已经变了）
      if (current !== startNode) {
        order.push(current);
      }

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (subgraphNodes.has(neighbor)) {
          const newDegree = (inDegree.get(neighbor) || 0) - 1;
          inDegree.set(neighbor, newDegree);
          if (newDegree === 0) {
            kahnQueue.push(neighbor);
          }
        }
      }
    }

    return order;
  }

  /**
   * 循环检测 (DFS)
   * @returns string[] 构成循环的路径，如果没有循环则返回 null
   */
  detectCycle(): string[] | null {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const dfs = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          path.push(neighbor); // Close the loop visualization
          return true; 
        }
      }

      recursionStack.delete(node);
      path.pop();
      return false;
    };

    for (const node of this.adjacencyList.keys()) {
      if (!visited.has(node)) {
        if (dfs(node)) return path;
      }
    }

    return null;
  }
}
