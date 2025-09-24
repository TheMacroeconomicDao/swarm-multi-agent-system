// 🐜 ANT COLONY OPTIMIZATION (ACO) ALGORITHM
// Алгоритм муравьиной колонии для поиска оптимальных путей решения задач

import { SwarmTask, SwarmAgentCapabilities } from '../types';

export interface AntColonyNode {
  id: string;
  type: 'start' | 'solution' | 'intermediate' | 'end';
  value: any;
  position: { x: number; y: number; z?: number };
  connections: string[];
}

export interface PheromoneEdge {
  from: string;
  to: string;
  pheromoneLevel: number;
  distance: number;
  traversals: number;
  lastUpdate: Date;
}

export interface Ant {
  id: string;
  currentNode: string;
  path: string[];
  pathCost: number;
  carrying: any; // Решение или его часть
  memory: Set<string>; // Посещенные узлы
  energy: number;
}

export interface SolutionPath {
  nodes: string[];
  edges: PheromoneEdge[];
  totalCost: number;
  quality: number;
  foundBy: string;
  timestamp: Date;
}

export interface ACOConfiguration {
  colonySize: number;
  alpha: number; // Влияние феромона
  beta: number; // Влияние эвристики
  evaporationRate: number; // Скорость испарения феромона
  Q: number; // Количество феромона
  maxIterations: number;
  eliteAnts: number; // Элитные муравьи
  initialPheromone: number;
  minPheromone: number;
  maxPheromone: number;
}

export class ACOSwarmIntelligence {
  private config: ACOConfiguration;
  private nodes: Map<string, AntColonyNode>;
  private pheromoneMatrix: Map<string, Map<string, PheromoneEdge>>;
  private ants: Ant[];
  private bestPath: SolutionPath | null = null;
  private iteration: number = 0;
  private solutionGraph: Map<string, Set<string>>;
  
  // Метрики для анализа
  private metrics = {
    totalPathsFound: 0,
    averagePathLength: 0,
    convergenceRate: 0,
    pheromoneDistribution: new Map<string, number>()
  };

  constructor(config: Partial<ACOConfiguration> = {}) {
    this.config = {
      colonySize: 50,
      alpha: 1.0, // Влияние феромона
      beta: 2.0, // Влияние эвристики (distance)
      evaporationRate: 0.1,
      Q: 100, // Количество феромона для депозита
      maxIterations: 100,
      eliteAnts: 5,
      initialPheromone: 1.0,
      minPheromone: 0.01,
      maxPheromone: 10.0,
      ...config
    };
    
    this.nodes = new Map();
    this.pheromoneMatrix = new Map();
    this.ants = [];
    this.solutionGraph = new Map();
    
    this.initializeColony();
  }

  /**
   * Initialize ant colony
   */
  private initializeColony(): void {
    this.ants = [];
    
    for (let i = 0; i < this.config.colonySize; i++) {
      this.ants.push({
        id: `ant_${i}`,
        currentNode: '',
        path: [],
        pathCost: 0,
        carrying: null,
        memory: new Set(),
        energy: 100
      });
    }
  }

  /**
   * Find optimal solution path for a task
   */
  public async findOptimalPath(
    task: SwarmTask,
    agents: Array<{ id: string; capabilities: SwarmAgentCapabilities }>
  ): Promise<SolutionPath> {
    console.log(`🐜 Starting ACO optimization for task: ${task.title}`);
    
    // Build solution graph
    this.buildSolutionGraph(task, agents);
    
    // Initialize pheromone trails
    this.initializePheromones();
    
    // Run ACO iterations
    for (this.iteration = 0; this.iteration < this.config.maxIterations; this.iteration++) {
      await this.runIteration();
      
      // Early termination if converged
      if (this.hasConverged()) {
        console.log(`✅ ACO converged at iteration ${this.iteration}`);
        break;
      }
      
      // Adaptive parameter adjustment
      this.adaptParameters();
    }
    
    if (!this.bestPath) {
      throw new Error('No solution path found');
    }
    
    console.log(`🎯 Best path found with cost: ${this.bestPath.totalCost}`);
    return this.bestPath;
  }

  /**
   * Build graph representation of solution space
   */
  private buildSolutionGraph(
    task: SwarmTask,
    agents: Array<{ id: string; capabilities: SwarmAgentCapabilities }>
  ): void {
    // Create start node
    const startNode: AntColonyNode = {
      id: 'start',
      type: 'start',
      value: task,
      position: { x: 0, y: 0 },
      connections: []
    };
    this.nodes.set(startNode.id, startNode);
    
    // Create nodes for each subtask-agent combination
    let nodeIndex = 0;
    task.subtasks.forEach((subtask, subtaskIndex) => {
      agents.forEach((agent, agentIndex) => {
        const nodeId = `node_${nodeIndex++}`;
        const node: AntColonyNode = {
          id: nodeId,
          type: 'intermediate',
          value: { subtask, agent },
          position: {
            x: (subtaskIndex + 1) * 100,
            y: agentIndex * 50
          },
          connections: []
        };
        
        this.nodes.set(nodeId, node);
        
        // Connect to previous layer
        if (subtaskIndex === 0) {
          startNode.connections.push(nodeId);
        } else {
          // Connect to all nodes of previous subtask
          const prevLayerStart = (subtaskIndex - 1) * agents.length;
          const prevLayerEnd = subtaskIndex * agents.length;
          for (let i = prevLayerStart; i < prevLayerEnd; i++) {
            const prevNodeId = `node_${i}`;
            const prevNode = this.nodes.get(prevNodeId);
            if (prevNode) {
              prevNode.connections.push(nodeId);
            }
          }
        }
      });
    });
    
    // Create end node
    const endNode: AntColonyNode = {
      id: 'end',
      type: 'end',
      value: null,
      position: { x: (task.subtasks.length + 1) * 100, y: 0 },
      connections: []
    };
    
    // Connect last layer to end
    const lastLayerStart = (task.subtasks.length - 1) * agents.length;
    for (let i = lastLayerStart; i < nodeIndex; i++) {
      const nodeId = `node_${i}`;
      const node = this.nodes.get(nodeId);
      if (node) {
        node.connections.push(endNode.id);
      }
    }
    
    this.nodes.set(endNode.id, endNode);
  }

  /**
   * Initialize pheromone levels on all edges
   */
  private initializePheromones(): void {
    this.pheromoneMatrix.clear();
    
    for (const [nodeId, node] of this.nodes) {
      this.pheromoneMatrix.set(nodeId, new Map());
      
      for (const targetId of node.connections) {
        const targetNode = this.nodes.get(targetId);
        if (targetNode) {
          const edge: PheromoneEdge = {
            from: nodeId,
            to: targetId,
            pheromoneLevel: this.config.initialPheromone,
            distance: this.calculateDistance(node, targetNode),
            traversals: 0,
            lastUpdate: new Date()
          };
          
          this.pheromoneMatrix.get(nodeId)?.set(targetId, edge);
        }
      }
    }
  }

  /**
   * Run one iteration of ACO
   */
  private async runIteration(): Promise<void> {
    // Reset ants
    this.resetAnts();
    
    // Each ant constructs a solution
    const solutions: SolutionPath[] = [];
    
    for (const ant of this.ants) {
      const solution = await this.constructSolution(ant);
      if (solution) {
        solutions.push(solution);
      }
    }
    
    // Update pheromones
    this.evaporatePheromones();
    this.depositPheromones(solutions);
    
    // Update best solution
    const bestInIteration = this.findBestSolution(solutions);
    if (bestInIteration && (!this.bestPath || bestInIteration.totalCost < this.bestPath.totalCost)) {
      this.bestPath = bestInIteration;
      console.log(`🏆 New best path found! Cost: ${this.bestPath.totalCost}`);
    }
    
    // Update metrics
    this.updateMetrics(solutions);
  }

  /**
   * Ant constructs a complete solution
   */
  private async constructSolution(ant: Ant): Promise<SolutionPath | null> {
    ant.currentNode = 'start';
    ant.path = ['start'];
    ant.pathCost = 0;
    ant.memory.clear();
    ant.memory.add('start');
    
    while (ant.currentNode !== 'end') {
      const nextNode = this.selectNextNode(ant);
      
      if (!nextNode) {
        // Dead end
        return null;
      }
      
      // Move ant
      const edge = this.pheromoneMatrix.get(ant.currentNode)?.get(nextNode);
      if (edge) {
        ant.pathCost += edge.distance;
        edge.traversals++;
      }
      
      ant.currentNode = nextNode;
      ant.path.push(nextNode);
      ant.memory.add(nextNode);
      
      // Energy depletion
      ant.energy -= 1;
      if (ant.energy <= 0) {
        return null;
      }
    }
    
    // Calculate solution quality
    const quality = this.evaluateSolutionQuality(ant.path);
    
    // Extract edges
    const edges: PheromoneEdge[] = [];
    for (let i = 0; i < ant.path.length - 1; i++) {
      const edge = this.pheromoneMatrix.get(ant.path[i])?.get(ant.path[i + 1]);
      if (edge) {
        edges.push(edge);
      }
    }
    
    return {
      nodes: ant.path,
      edges,
      totalCost: ant.pathCost,
      quality,
      foundBy: ant.id,
      timestamp: new Date()
    };
  }

  /**
   * Select next node for ant using probabilistic rule
   */
  private selectNextNode(ant: Ant): string | null {
    const currentNode = this.nodes.get(ant.currentNode);
    if (!currentNode) return null;
    
    const candidates = currentNode.connections.filter(nodeId => !ant.memory.has(nodeId));
    
    if (candidates.length === 0) {
      return null;
    }
    
    // Calculate probabilities
    const probabilities: Array<{ node: string; probability: number }> = [];
    let totalProbability = 0;
    
    for (const candidateId of candidates) {
      const edge = this.pheromoneMatrix.get(ant.currentNode)?.get(candidateId);
      if (edge) {
        // Classic ACO probability calculation
        const pheromone = Math.pow(edge.pheromoneLevel, this.config.alpha);
        const heuristic = Math.pow(1 / edge.distance, this.config.beta);
        const probability = pheromone * heuristic;
        
        probabilities.push({ node: candidateId, probability });
        totalProbability += probability;
      }
    }
    
    // Normalize probabilities
    probabilities.forEach(p => p.probability /= totalProbability);
    
    // Roulette wheel selection
    const random = Math.random();
    let cumulative = 0;
    
    for (const { node, probability } of probabilities) {
      cumulative += probability;
      if (random <= cumulative) {
        return node;
      }
    }
    
    return candidates[0]; // Fallback
  }

  /**
   * Evaporate pheromones
   */
  private evaporatePheromones(): void {
    for (const [fromId, edges] of this.pheromoneMatrix) {
      for (const [toId, edge] of edges) {
        edge.pheromoneLevel *= (1 - this.config.evaporationRate);
        edge.pheromoneLevel = Math.max(this.config.minPheromone, edge.pheromoneLevel);
      }
    }
  }

  /**
   * Deposit pheromones on paths
   */
  private depositPheromones(solutions: SolutionPath[]): void {
    // Sort solutions by quality
    solutions.sort((a, b) => b.quality - a.quality);
    
    // Elite ants deposit more pheromone
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];
      const isElite = i < this.config.eliteAnts;
      const depositAmount = (this.config.Q / solution.totalCost) * (isElite ? 2 : 1);
      
      // Deposit on all edges in path
      for (const edge of solution.edges) {
        edge.pheromoneLevel += depositAmount;
        edge.pheromoneLevel = Math.min(this.config.maxPheromone, edge.pheromoneLevel);
      }
    }
  }

  /**
   * Evaluate solution quality
   */
  private evaluateSolutionQuality(path: string[]): number {
    let quality = 100;
    
    // Penalize long paths
    quality -= path.length * 2;
    
    // Check for load balancing
    const agentLoads = new Map<string, number>();
    for (const nodeId of path) {
      const node = this.nodes.get(nodeId);
      if (node && node.type === 'intermediate') {
        const agentId = node.value.agent.id;
        agentLoads.set(agentId, (agentLoads.get(agentId) || 0) + 1);
      }
    }
    
    // Calculate load balance score
    if (agentLoads.size > 0) {
      const loads = Array.from(agentLoads.values());
      const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
      const variance = loads.reduce((sum, load) => sum + Math.pow(load - avgLoad, 2), 0) / loads.length;
      quality -= variance * 10;
    }
    
    return Math.max(0, quality);
  }

  /**
   * Calculate distance between nodes
   */
  private calculateDistance(node1: AntColonyNode, node2: AntColonyNode): number {
    // Euclidean distance
    const dx = node2.position.x - node1.position.x;
    const dy = node2.position.y - node1.position.y;
    const dz = (node2.position.z || 0) - (node1.position.z || 0);
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Check if algorithm has converged
   */
  private hasConverged(): boolean {
    if (this.iteration < 10) return false;
    
    // Check if all ants are taking the same path
    const pathStrings = this.ants.map(ant => ant.path.join('-'));
    const uniquePaths = new Set(pathStrings);
    
    return uniquePaths.size === 1;
  }

  /**
   * Adapt parameters during runtime
   */
  private adaptParameters(): void {
    // Reduce evaporation rate as we converge
    const convergenceRatio = this.metrics.convergenceRate;
    this.config.evaporationRate = 0.1 * (1 - convergenceRatio * 0.5);
    
    // Increase pheromone influence as we find better solutions
    if (this.bestPath) {
      this.config.alpha = Math.min(2.0, 1.0 + convergenceRatio);
    }
  }

  /**
   * Reset ants for new iteration
   */
  private resetAnts(): void {
    for (const ant of this.ants) {
      ant.currentNode = 'start';
      ant.path = [];
      ant.pathCost = 0;
      ant.memory.clear();
      ant.energy = 100;
      ant.carrying = null;
    }
  }

  /**
   * Find best solution in iteration
   */
  private findBestSolution(solutions: SolutionPath[]): SolutionPath | null {
    if (solutions.length === 0) return null;
    
    return solutions.reduce((best, current) => 
      current.totalCost < best.totalCost ? current : best
    );
  }

  /**
   * Update algorithm metrics
   */
  private updateMetrics(solutions: SolutionPath[]): void {
    this.metrics.totalPathsFound += solutions.length;
    
    if (solutions.length > 0) {
      const avgLength = solutions.reduce((sum, s) => sum + s.nodes.length, 0) / solutions.length;
      this.metrics.averagePathLength = avgLength;
      
      // Calculate convergence rate
      const uniquePaths = new Set(solutions.map(s => s.nodes.join('-')));
      this.metrics.convergenceRate = 1 - (uniquePaths.size / solutions.length);
    }
    
    // Update pheromone distribution
    this.metrics.pheromoneDistribution.clear();
    for (const [fromId, edges] of this.pheromoneMatrix) {
      for (const [toId, edge] of edges) {
        const key = `${fromId}-${toId}`;
        this.metrics.pheromoneDistribution.set(key, edge.pheromoneLevel);
      }
    }
  }

  /**
   * Get pheromone visualization data
   */
  public getPheromoneVisualization(): {
    nodes: Array<{ id: string; x: number; y: number; type: string }>;
    edges: Array<{ from: string; to: string; strength: number }>;
  } {
    const nodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
      type: node.type
    }));
    
    const edges: Array<{ from: string; to: string; strength: number }> = [];
    
    for (const [fromId, edgeMap] of this.pheromoneMatrix) {
      for (const [toId, edge] of edgeMap) {
        edges.push({
          from: fromId,
          to: toId,
          strength: edge.pheromoneLevel / this.config.maxPheromone
        });
      }
    }
    
    return { nodes, edges };
  }

  /**
   * Get algorithm statistics
   */
  public getStatistics(): {
    iteration: number;
    bestCost: number;
    convergenceRate: number;
    averagePathLength: number;
    totalPathsFound: number;
  } {
    return {
      iteration: this.iteration,
      bestCost: this.bestPath?.totalCost || Infinity,
      convergenceRate: this.metrics.convergenceRate,
      averagePathLength: this.metrics.averagePathLength,
      totalPathsFound: this.metrics.totalPathsFound
    };
  }

  /**
   * Apply ACO to general optimization problem
   */
  public async optimize(
    problemGraph: Map<string, AntColonyNode>,
    objectiveFunction: (path: string[]) => number,
    constraints?: (path: string[]) => boolean
  ): Promise<SolutionPath> {
    this.nodes = problemGraph;
    this.initializePheromones();
    
    // Custom evaluation function
    this.evaluateSolutionQuality = (path: string[]) => {
      if (constraints && !constraints(path)) {
        return 0; // Invalid solution
      }
      return 1 / objectiveFunction(path); // Minimize objective
    };
    
    // Run optimization
    for (this.iteration = 0; this.iteration < this.config.maxIterations; this.iteration++) {
      await this.runIteration();
      
      if (this.hasConverged()) {
        break;
      }
    }
    
    if (!this.bestPath) {
      throw new Error('No feasible solution found');
    }
    
    return this.bestPath;
  }
}

