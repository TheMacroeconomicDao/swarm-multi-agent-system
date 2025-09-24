// 🐝 PARTICLE SWARM OPTIMIZATION (PSO) ALGORITHM
// Advanced swarm intelligence for task distribution optimization

import { SwarmTask, SwarmAgentCapabilities } from '../types';

export interface Particle {
  id: string;
  position: number[]; // Task assignment vector
  velocity: number[]; // Movement vector
  bestPosition: number[]; // Personal best
  bestFitness: number; // Personal best fitness
  fitness: number; // Current fitness
}

export interface PSOSwarm {
  particles: Particle[];
  globalBest: {
    position: number[];
    fitness: number;
  };
  iteration: number;
  maxIterations: number;
  inertia: number; // w
  cognitiveWeight: number; // c1
  socialWeight: number; // c2
  maxVelocity: number;
  minVelocity: number;
}

export interface TaskAssignment {
  taskId: string;
  agentId: string;
  confidence: number;
  estimatedTime: number;
  cost: number;
}

export interface PSOConfiguration {
  swarmSize: number;
  maxIterations: number;
  inertia: number;
  cognitiveWeight: number;
  socialWeight: number;
  maxVelocity: number;
  minVelocity: number;
  convergenceThreshold: number;
  fitnessWeights: {
    time: number;
    cost: number;
    quality: number;
    loadBalance: number;
  };
}

export class PSOSwarmIntelligence {
  private config: PSOConfiguration;
  private swarm: PSOSwarm;
  private tasks: SwarmTask[];
  private agents: Array<{ id: string; capabilities: SwarmAgentCapabilities; workload: number }>;

  constructor(config: PSOConfiguration) {
    this.config = config;
    this.swarm = {
      particles: [],
      globalBest: { position: [], fitness: -Infinity },
      iteration: 0,
      maxIterations: config.maxIterations,
      inertia: config.inertia,
      cognitiveWeight: config.cognitiveWeight,
      socialWeight: config.socialWeight,
      maxVelocity: config.maxVelocity,
      minVelocity: config.minVelocity
    };
    this.tasks = [];
    this.agents = [];
  }

  /**
   * Optimize task assignment using PSO algorithm
   */
  public async optimizeTaskAssignment(
    tasks: SwarmTask[],
    agents: Array<{ id: string; capabilities: SwarmAgentCapabilities; workload: number }>
  ): Promise<TaskAssignment[]> {
    this.tasks = tasks;
    this.agents = agents;
    
    // Initialize swarm
    this.initializeSwarm();
    
    // Run PSO optimization
    await this.runOptimization();
    
    // Convert best solution to task assignments
    return this.convertToTaskAssignments(this.swarm.globalBest.position);
  }

  /**
   * Initialize particle swarm
   */
  private initializeSwarm(): void {
    // Ensure we have tasks and agents for demo
    if (this.tasks.length === 0) {
      console.log('🎭 PSO Demo Mode: No tasks provided, using demo task');
      this.tasks = [{
        id: 'demo_task_1',
        description: 'Demo task for swarm coordination',
        priority: 'medium',
        complexity: 5,
        estimatedTime: 30,
        dependencies: [],
        skills: ['general']
      }];
    }

    if (this.agents.length === 0) {
      console.log('🎭 PSO Demo Mode: No agents provided, using demo agents');
      this.agents = ['frontend_demo', 'backend_demo', 'testing_demo'];
    }

    const dimensions = this.tasks.length * this.agents.length;
    this.swarm.particles = [];
    
    // Initialize global best with reasonable default
    this.swarm.globalBest = {
      position: new Array(dimensions).fill(0.5),
      fitness: 0
    };
    
    for (let i = 0; i < this.config.swarmSize; i++) {
      const particle: Particle = {
        id: `particle_${i}`,
        position: this.generateRandomPosition(dimensions),
        velocity: this.generateRandomVelocity(dimensions),
        bestPosition: [],
        bestFitness: 0, // Start with 0 instead of -Infinity
        fitness: 0
      };
      
      // Calculate initial fitness
      particle.fitness = this.calculateFitness(particle.position);
      particle.bestPosition = [...particle.position];
      particle.bestFitness = particle.fitness;
      
      this.swarm.particles.push(particle);
      
      // Update global best
      if (particle.fitness > this.swarm.globalBest.fitness) {
        this.swarm.globalBest.position = [...particle.position];
        this.swarm.globalBest.fitness = particle.fitness;
      }
    }
    
    console.log('🐝 PSO Swarm initialized with', this.swarm.particles.length, 'particles');
    console.log('🎯 Initial global best fitness:', this.swarm.globalBest.fitness);
  }

  /**
   * Run PSO optimization iterations
   */
  private async runOptimization(): Promise<void> {
    for (this.swarm.iteration = 0; this.swarm.iteration < this.swarm.maxIterations; this.swarm.iteration++) {
      // Update each particle
      for (const particle of this.swarm.particles) {
        this.updateParticle(particle);
      }
      
      // Check convergence
      if (this.checkConvergence()) {
        console.log(`🐝 PSO converged at iteration ${this.swarm.iteration}`);
        break;
      }
      
      // Adaptive parameters (optional)
      this.adaptParameters();
    }
  }

  /**
   * Update particle position and velocity
   */
  private updateParticle(particle: Particle): void {
    const dimensions = particle.position.length;
    
    for (let i = 0; i < dimensions; i++) {
      // Calculate new velocity
      const r1 = Math.random();
      const r2 = Math.random();
      
      const cognitiveComponent = this.swarm.cognitiveWeight * r1 * 
        (particle.bestPosition[i] - particle.position[i]);
      const socialComponent = this.swarm.socialWeight * r2 * 
        (this.swarm.globalBest.position[i] - particle.position[i]);
      
      particle.velocity[i] = this.swarm.inertia * particle.velocity[i] + 
        cognitiveComponent + socialComponent;
      
      // Apply velocity limits
      particle.velocity[i] = Math.max(
        this.swarm.minVelocity,
        Math.min(this.swarm.maxVelocity, particle.velocity[i])
      );
      
      // Update position
      particle.position[i] += particle.velocity[i];
      
      // Apply position bounds (0 to 1 for assignment probabilities)
      particle.position[i] = Math.max(0, Math.min(1, particle.position[i]));
    }
    
    // Calculate new fitness
    particle.fitness = this.calculateFitness(particle.position);
    
    // Update personal best
    if (particle.fitness > particle.bestFitness) {
      particle.bestPosition = [...particle.position];
      particle.bestFitness = particle.fitness;
      
      // Update global best
      if (particle.fitness > this.swarm.globalBest.fitness) {
        this.swarm.globalBest.position = [...particle.position];
        this.swarm.globalBest.fitness = particle.fitness;
      }
    }
  }

  /**
   * Calculate fitness of a solution
   */
  private calculateFitness(position: number[]): number {
    const assignments = this.convertToTaskAssignments(position);
    
    // Calculate different fitness components
    const timeFitness = this.calculateTimeFitness(assignments);
    const costFitness = this.calculateCostFitness(assignments);
    const qualityFitness = this.calculateQualityFitness(assignments);
    const loadBalanceFitness = this.calculateLoadBalanceFitness(assignments);
    
    // Weighted combination
    const totalFitness = 
      this.config.fitnessWeights.time * timeFitness +
      this.config.fitnessWeights.cost * costFitness +
      this.config.fitnessWeights.quality * qualityFitness +
      this.config.fitnessWeights.loadBalance * loadBalanceFitness;
    
    return totalFitness;
  }

  /**
   * Calculate time-based fitness (lower is better, so we invert)
   */
  private calculateTimeFitness(assignments: TaskAssignment[]): number {
    if (assignments.length === 0) return 0.5; // Default demo value
    
    const totalTime = assignments.reduce((sum, assignment) => sum + assignment.estimatedTime, 0);
    const maxPossibleTime = Math.max(1, this.tasks.length * 100); // Prevent division by zero
    return Math.max(0, 1 - (totalTime / maxPossibleTime));
  }

  /**
   * Calculate cost-based fitness (lower is better, so we invert)
   */
  private calculateCostFitness(assignments: TaskAssignment[]): number {
    if (assignments.length === 0) return 0.7; // Default demo value
    
    const totalCost = assignments.reduce((sum, assignment) => sum + assignment.cost, 0);
    const maxPossibleCost = Math.max(1, this.tasks.length * 1000); // Prevent division by zero
    return Math.max(0, 1 - (totalCost / maxPossibleCost));
  }

  /**
   * Calculate quality-based fitness (higher is better)
   */
  private calculateQualityFitness(assignments: TaskAssignment[]): number {
    if (assignments.length === 0) return 0.8; // Default demo value
    
    const avgConfidence = assignments.reduce((sum, assignment) => sum + assignment.confidence, 0) / assignments.length;
    return isNaN(avgConfidence) ? 0.8 : Math.max(0, Math.min(1, avgConfidence));
  }

  /**
   * Calculate load balance fitness (more balanced is better)
   */
  private calculateLoadBalanceFitness(assignments: TaskAssignment[]): number {
    if (assignments.length === 0) return 0.6; // Default demo value
    
    const agentWorkloads = new Map<string, number>();
    
    // Calculate workload for each agent
    for (const assignment of assignments) {
      const currentWorkload = agentWorkloads.get(assignment.agentId) || 0;
      agentWorkloads.set(assignment.agentId, currentWorkload + assignment.estimatedTime);
    }
    
    if (agentWorkloads.size === 0) return 0.6; // Default demo value
    
    // Calculate variance (lower variance = better balance)
    const workloads = Array.from(agentWorkloads.values());
    if (workloads.length === 0) return 0.6;
    
    const avgWorkload = workloads.reduce((sum, w) => sum + w, 0) / workloads.length;
    const variance = workloads.reduce((sum, w) => sum + Math.pow(w - avgWorkload, 2), 0) / workloads.length;
    
    return Math.max(0, 1 - (variance / (avgWorkload * avgWorkload)));
  }

  /**
   * Convert position vector to task assignments
   */
  private convertToTaskAssignments(position: number[]): TaskAssignment[] {
    const assignments: TaskAssignment[] = [];
    
    for (let taskIndex = 0; taskIndex < this.tasks.length; taskIndex++) {
      let bestAgentIndex = 0;
      let bestScore = 0;
      
      // Find best agent for this task
      for (let agentIndex = 0; agentIndex < this.agents.length; agentIndex++) {
        const positionIndex = taskIndex * this.agents.length + agentIndex;
        const score = position[positionIndex];
        
        if (score > bestScore) {
          bestScore = score;
          bestAgentIndex = agentIndex;
        }
      }
      
      const task = this.tasks[taskIndex];
      const agent = this.agents[bestAgentIndex];
      
      assignments.push({
        taskId: task.id,
        agentId: agent.id,
        confidence: bestScore,
        estimatedTime: this.estimateTaskTime(task, agent),
        cost: this.estimateTaskCost(task, agent)
      });
    }
    
    return assignments;
  }

  /**
   * Estimate task execution time for an agent
   */
  private estimateTaskTime(task: SwarmTask, agent: { capabilities: SwarmAgentCapabilities; workload: number }): number {
    const baseTime = task.estimatedTime;
    const complexityFactor = task.complexity / 10;
    const workloadFactor = 1 + (agent.workload / 100);
    const capabilityMatch = this.calculateCapabilityMatch(task, agent.capabilities);
    
    return baseTime * complexityFactor * workloadFactor * (2 - capabilityMatch);
  }

  /**
   * Estimate task execution cost for an agent
   */
  private estimateTaskCost(task: SwarmTask, agent: { capabilities: SwarmAgentCapabilities; workload: number }): number {
    const baseCost = task.complexity * 10;
    const capabilityMatch = this.calculateCapabilityMatch(task, agent.capabilities);
    
    return baseCost / (capabilityMatch + 0.1); // Higher capability = lower cost
  }

  /**
   * Calculate how well agent capabilities match task requirements
   */
  private calculateCapabilityMatch(task: SwarmTask, capabilities: SwarmAgentCapabilities): number {
    let match = 0;
    let total = 0;
    
    // Check domain expertise
    if (capabilities.domains) {
      const domainMatches = task.domain.filter(domain => 
        capabilities.domains!.includes(domain)
      ).length;
      match += domainMatches / task.domain.length;
      total += 1;
    }
    
    // Check specialized skills
    if (capabilities.specializedSkills) {
      const skillMatches = capabilities.specializedSkills.filter(skill =>
        task.description.toLowerCase().includes(skill.toLowerCase())
      ).length;
      match += skillMatches / capabilities.specializedSkills.length;
      total += 1;
    }
    
    // Check complexity handling
    if (capabilities.maxComplexity && task.complexity <= capabilities.maxComplexity) {
      match += 1;
    }
    total += 1;
    
    return total > 0 ? match / total : 0;
  }

  /**
   * Generate random position vector
   */
  private generateRandomPosition(dimensions: number): number[] {
    return Array.from({ length: dimensions }, () => Math.random());
  }

  /**
   * Generate random velocity vector
   */
  private generateRandomVelocity(dimensions: number): number[] {
    return Array.from({ length: dimensions }, () => 
      (Math.random() - 0.5) * (this.swarm.maxVelocity - this.swarm.minVelocity)
    );
  }

  /**
   * Check if swarm has converged
   */
  private checkConvergence(): boolean {
    if (this.swarm.iteration < 10) return false; // Need minimum iterations
    
    const recentFitness = this.swarm.particles
      .slice(-5)
      .map(p => p.fitness);
    
    const avgFitness = recentFitness.reduce((sum, f) => sum + f, 0) / recentFitness.length;
    const variance = recentFitness.reduce((sum, f) => sum + Math.pow(f - avgFitness, 2), 0) / recentFitness.length;
    
    return variance < this.config.convergenceThreshold;
  }

  /**
   * Adapt PSO parameters during optimization
   */
  private adaptParameters(): void {
    // Linear decrease of inertia
    const progress = this.swarm.iteration / this.swarm.maxIterations;
    this.swarm.inertia = this.config.inertia * (1 - progress * 0.5);
    
    // Adaptive cognitive and social weights
    this.swarm.cognitiveWeight = this.config.cognitiveWeight * (1 - progress * 0.3);
    this.swarm.socialWeight = this.config.socialWeight * (1 + progress * 0.2);
  }

  /**
   * Get optimization statistics
   */
  public getOptimizationStats(): {
    iteration: number;
    globalBestFitness: number;
    averageFitness: number;
    convergence: boolean;
  } {
    const avgFitness = this.swarm.particles.reduce((sum, p) => sum + p.fitness, 0) / this.swarm.particles.length;
    
    return {
      iteration: this.swarm.iteration,
      globalBestFitness: this.swarm.globalBest.fitness,
      averageFitness: avgFitness,
      convergence: this.checkConvergence()
    };
  }
}





