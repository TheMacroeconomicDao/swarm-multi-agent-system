// 🌟 EMERGENT BEHAVIOR SYSTEM - Detection and Enhancement of Swarm Intelligence
// Система обнаружения и усиления emergent behavior в роевой системе

import { SwarmAgent } from '../swarm-agent';
import { EventBus } from '@/lib/events/event-bus';
import { StigmergicEnvironment, EnvironmentMarker } from '../stigmergy/stigmergic-environment';
import { EnhancedPuterClaudeProvider, ClaudeModel } from '@/lib/ai/puter-claude-provider-enhanced';

export interface Interaction {
  id: string;
  participants: string[];
  type: 'communication' | 'collaboration' | 'coordination' | 'competition' | 'stigmergy';
  timestamp: Date;
  duration: number;
  context: any;
  outcome: any;
  success: boolean;
  emergenceIndicators: EmergenceIndicator[];
}

export interface EmergenceIndicator {
  type: 'synchronization' | 'coordination' | 'self-organization' | 'collective-intelligence' | 'adaptation';
  strength: number; // 0-1
  confidence: number; // 0-1
  description: string;
  measuredValue: number;
  expectedValue: number;
  deviation: number;
}

export interface EmergentPattern {
  id: string;
  type: 'behavioral' | 'organizational' | 'informational' | 'functional';
  name: string;
  description: string;
  participants: Set<string>;
  detectedAt: Date;
  lastObserved: Date;
  frequency: number;
  stability: number; // How consistent the pattern is
  utility: number; // How useful/beneficial the pattern is
  complexity: number; // How complex the pattern is
  novelty: number; // How new/unexpected the pattern is
  conditions: any; // Conditions under which pattern emerges
  triggers: string[]; // What triggers this pattern
  effects: string[]; // What effects this pattern has
}

export interface SwarmGoal {
  id: string;
  description: string;
  priority: number;
  targetMetrics: Map<string, number>;
  deadline?: Date;
  context: any;
}

export interface Organization {
  structure: 'hierarchical' | 'network' | 'cluster' | 'chain' | 'star' | 'mesh';
  roles: Map<string, string[]>; // role -> agent IDs
  connections: Array<{ from: string; to: string; strength: number; type: string }>;
  efficiency: number;
  adaptability: number;
  resilience: number;
}

export interface BehaviorPattern {
  id: string;
  pattern: any;
  frequency: number;
  context: string[];
  effectiveness: number;
  participants: string[];
  emergenceLevel: number;
}

export interface EmergenceMetrics {
  totalInteractions: number;
  emergentPatterns: number;
  averageComplexity: number;
  selfOrganizationIndex: number;
  collectiveIntelligenceScore: number;
  adaptationRate: number;
  synchronizationLevel: number;
  noveltyScore: number;
}

export class EmergenceDetector {
  private interactions: Interaction[] = [];
  private patterns: Map<string, EmergentPattern> = new Map();
  private behaviorHistory: Map<string, any[]> = new Map();
  private aiProvider: EnhancedPuterClaudeProvider;
  
  // Detection parameters
  private config = {
    minInteractionsForPattern: 5,
    patternDetectionWindow: 300000, // 5 minutes
    complexityThreshold: 0.3,
    noveltyThreshold: 0.5,
    stabilityThreshold: 0.7
  };

  constructor() {
    this.aiProvider = EnhancedPuterClaudeProvider.getInstance();
  }

  public async analyze(interactions: Interaction[]): Promise<EmergentPattern[]> {
    this.interactions.push(...interactions);
    
    // Clean old interactions
    this.cleanOldInteractions();
    
    const emergentPatterns: EmergentPattern[] = [];
    
    // 1. Detect synchronization patterns
    const syncPatterns = await this.detectSynchronization();
    emergentPatterns.push(...syncPatterns);
    
    // 2. Detect coordination patterns
    const coordPatterns = await this.detectCoordination();
    emergentPatterns.push(...coordPatterns);
    
    // 3. Detect self-organization patterns
    const orgPatterns = await this.detectSelfOrganization();
    emergentPatterns.push(...orgPatterns);
    
    // 4. Detect collective intelligence emergence
    const intPatterns = await this.detectCollectiveIntelligence();
    emergentPatterns.push(...intPatterns);
    
    // 5. Detect adaptive behaviors
    const adaptPatterns = await this.detectAdaptiveBehaviors();
    emergentPatterns.push(...adaptPatterns);
    
    // Update pattern history
    for (const pattern of emergentPatterns) {
      this.updatePatternHistory(pattern);
    }
    
    return emergentPatterns;
  }

  private async detectSynchronization(): Promise<EmergentPattern[]> {
    const patterns: EmergentPattern[] = [];
    
    // Group interactions by time windows
    const timeWindows = this.groupByTimeWindows(this.interactions, 10000); // 10 second windows
    
    for (const window of timeWindows) {
      if (window.interactions.length < 3) continue;
      
      // Analyze temporal clustering
      const timeSpread = this.calculateTimeSpread(window.interactions);
      const participantOverlap = this.calculateParticipantOverlap(window.interactions);
      
      if (timeSpread < 5000 && participantOverlap > 0.5) { // High synchronization
        const patternId = `sync_${window.start}_${Date.now()}`;
        
        const pattern: EmergentPattern = {
          id: patternId,
          type: 'behavioral',
          name: 'Temporal Synchronization',
          description: `${window.interactions.length} agents synchronized their actions within ${timeSpread}ms`,
          participants: new Set(window.interactions.flatMap(i => i.participants)),
          detectedAt: new Date(),
          lastObserved: new Date(),
          frequency: 1,
          stability: this.calculateStability(window.interactions),
          utility: this.calculateUtility(window.interactions),
          complexity: this.calculateComplexity(window.interactions),
          novelty: this.calculateNovelty(patternId),
          conditions: { timeWindow: window.start, timeSpread, participantOverlap },
          triggers: ['task_assignment', 'external_event'],
          effects: ['improved_coordination', 'faster_execution']
        };
        
        patterns.push(pattern);
      }
    }
    
    return patterns;
  }

  private async detectCoordination(): Promise<EmergentPattern[]> {
    const patterns: EmergentPattern[] = [];
    
    // Analyze communication patterns
    const commInteractions = this.interactions.filter(i => i.type === 'communication');
    const coordGroups = this.findCoordinationGroups(commInteractions);
    
    for (const group of coordGroups) {
      if (group.size < 3) continue;
      
      const groupInteractions = commInteractions.filter(i => 
        i.participants.some(p => group.has(p))
      );
      
      // Analyze coordination effectiveness
      const effectiveness = this.analyzeCoordinationEffectiveness(groupInteractions);
      
      if (effectiveness > 0.7) {
        const patternId = `coord_${Array.from(group).join('_')}_${Date.now()}`;
        
        const pattern: EmergentPattern = {
          id: patternId,
          type: 'organizational',
          name: 'Emergent Coordination',
          description: `Self-organizing coordination group of ${group.size} agents`,
          participants: group,
          detectedAt: new Date(),
          lastObserved: new Date(),
          frequency: groupInteractions.length,
          stability: effectiveness,
          utility: this.calculateCoordinationUtility(groupInteractions),
          complexity: group.size / 10, // Complexity increases with group size
          novelty: this.calculateNovelty(patternId),
          conditions: { groupSize: group.size, effectiveness },
          triggers: ['complex_task', 'resource_constraints'],
          effects: ['improved_efficiency', 'reduced_conflicts']
        };
        
        patterns.push(pattern);
      }
    }
    
    return patterns;
  }

  private async detectSelfOrganization(): Promise<EmergentPattern[]> {
    const patterns: EmergentPattern[] = [];
    
    // Track role emergence over time
    const roleChanges = this.trackRoleChanges();
    
    for (const [agentId, changes] of roleChanges) {
      if (changes.length < 3) continue;
      
      // Detect spontaneous role specialization
      const specialization = this.analyzeRoleSpecialization(changes);
      
      if (specialization.emergenceScore > 0.6) {
        const patternId = `selforg_${agentId}_${Date.now()}`;
        
        const pattern: EmergentPattern = {
          id: patternId,
          type: 'organizational',
          name: 'Role Specialization',
          description: `Agent ${agentId} spontaneously specialized in ${specialization.role}`,
          participants: new Set([agentId]),
          detectedAt: new Date(),
          lastObserved: new Date(),
          frequency: changes.length,
          stability: specialization.stability,
          utility: specialization.utility,
          complexity: 0.5,
          novelty: specialization.novelty,
          conditions: { role: specialization.role, emergenceScore: specialization.emergenceScore },
          triggers: ['task_demand', 'skill_development'],
          effects: ['increased_expertise', 'improved_performance']
        };
        
        patterns.push(pattern);
      }
    }
    
    return patterns;
  }

  private async detectCollectiveIntelligence(): Promise<EmergentPattern[]> {
    const patterns: EmergentPattern[] = [];
    
    // Analyze problem-solving sessions
    const problemSolvingSessions = this.identifyProblemSolvingSessions();
    
    for (const session of problemSolvingSessions) {
      const intelligence = await this.analyzeCollectiveIntelligence(session);
      
      if (intelligence.score > 0.8) {
        const patternId = `collintel_${session.id}_${Date.now()}`;
        
        const pattern: EmergentPattern = {
          id: patternId,
          type: 'informational',
          name: 'Collective Intelligence',
          description: `Group intelligence emerged during ${session.type} task`,
          participants: new Set(session.participants),
          detectedAt: new Date(),
          lastObserved: new Date(),
          frequency: 1,
          stability: intelligence.stability,
          utility: intelligence.utility,
          complexity: intelligence.complexity,
          novelty: intelligence.novelty,
          conditions: { 
            problemType: session.type,
            participantCount: session.participants.length,
            intelligenceScore: intelligence.score
          },
          triggers: ['complex_problem', 'diverse_expertise'],
          effects: ['superior_solutions', 'knowledge_synthesis']
        };
        
        patterns.push(pattern);
      }
    }
    
    return patterns;
  }

  private async detectAdaptiveBehaviors(): Promise<EmergentPattern[]> {
    const patterns: EmergentPattern[] = [];
    
    // Analyze behavioral adaptations to environmental changes
    const adaptations = this.analyzeAdaptations();
    
    for (const adaptation of adaptations) {
      if (adaptation.adaptationScore > 0.7) {
        const patternId = `adapt_${adaptation.trigger}_${Date.now()}`;
        
        const pattern: EmergentPattern = {
          id: patternId,
          type: 'behavioral',
          name: 'Adaptive Behavior',
          description: `Swarm adapted to ${adaptation.trigger} by ${adaptation.response}`,
          participants: new Set(adaptation.participants),
          detectedAt: new Date(),
          lastObserved: new Date(),
          frequency: 1,
          stability: adaptation.stability,
          utility: adaptation.effectiveness,
          complexity: adaptation.complexity,
          novelty: adaptation.novelty,
          conditions: { 
            trigger: adaptation.trigger,
            response: adaptation.response,
            adaptationScore: adaptation.adaptationScore
          },
          triggers: [adaptation.trigger],
          effects: [adaptation.outcome]
        };
        
        patterns.push(pattern);
      }
    }
    
    return patterns;
  }

  private groupByTimeWindows(interactions: Interaction[], windowSize: number): Array<{
    start: number;
    end: number;
    interactions: Interaction[];
  }> {
    if (interactions.length === 0) return [];
    
    const sorted = interactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const windows: Array<{ start: number; end: number; interactions: Interaction[] }> = [];
    
    let currentWindow = {
      start: sorted[0].timestamp.getTime(),
      end: sorted[0].timestamp.getTime() + windowSize,
      interactions: [] as Interaction[]
    };
    
    for (const interaction of sorted) {
      const time = interaction.timestamp.getTime();
      
      if (time <= currentWindow.end) {
        currentWindow.interactions.push(interaction);
      } else {
        if (currentWindow.interactions.length > 0) {
          windows.push(currentWindow);
        }
        
        currentWindow = {
          start: time,
          end: time + windowSize,
          interactions: [interaction]
        };
      }
    }
    
    if (currentWindow.interactions.length > 0) {
      windows.push(currentWindow);
    }
    
    return windows;
  }

  private calculateTimeSpread(interactions: Interaction[]): number {
    if (interactions.length <= 1) return 0;
    
    const times = interactions.map(i => i.timestamp.getTime());
    return Math.max(...times) - Math.min(...times);
  }

  private calculateParticipantOverlap(interactions: Interaction[]): number {
    if (interactions.length <= 1) return 0;
    
    const allParticipants = new Set(interactions.flatMap(i => i.participants));
    const commonParticipants = new Set<string>();
    
    for (const participant of allParticipants) {
      const appearCount = interactions.filter(i => i.participants.includes(participant)).length;
      if (appearCount > 1) {
        commonParticipants.add(participant);
      }
    }
    
    return commonParticipants.size / allParticipants.size;
  }

  private findCoordinationGroups(interactions: Interaction[]): Set<string>[] {
    const graph = new Map<string, Set<string>>();
    
    // Build interaction graph
    for (const interaction of interactions) {
      for (const participant of interaction.participants) {
        if (!graph.has(participant)) {
          graph.set(participant, new Set());
        }
        
        for (const other of interaction.participants) {
          if (other !== participant) {
            graph.get(participant)?.add(other);
          }
        }
      }
    }
    
    // Find connected components (coordination groups)
    const visited = new Set<string>();
    const groups: Set<string>[] = [];
    
    for (const [node, _] of graph) {
      if (!visited.has(node)) {
        const group = new Set<string>();
        this.dfsVisit(node, graph, visited, group);
        if (group.size > 1) {
          groups.push(group);
        }
      }
    }
    
    return groups;
  }

  private dfsVisit(
    node: string, 
    graph: Map<string, Set<string>>, 
    visited: Set<string>, 
    group: Set<string>
  ): void {
    visited.add(node);
    group.add(node);
    
    const neighbors = graph.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        this.dfsVisit(neighbor, graph, visited, group);
      }
    }
  }

  private analyzeCoordinationEffectiveness(interactions: Interaction[]): number {
    if (interactions.length === 0) return 0;
    
    const successRate = interactions.filter(i => i.success).length / interactions.length;
    const avgDuration = interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length;
    const optimalDuration = 5000; // 5 seconds baseline
    
    const efficiencyScore = Math.max(0, 1 - (avgDuration - optimalDuration) / optimalDuration);
    
    return (successRate * 0.7 + efficiencyScore * 0.3);
  }

  private trackRoleChanges(): Map<string, any[]> {
    // Simplified role change tracking
    const roleChanges = new Map<string, any[]>();
    
    // In real implementation, this would track actual role changes over time
    // For now, simulate some role changes
    const agents = new Set(this.interactions.flatMap(i => i.participants));
    
    for (const agent of agents) {
      const agentInteractions = this.interactions.filter(i => i.participants.includes(agent));
      const roles = this.extractRoles(agentInteractions);
      
      if (roles.length > 0) {
        roleChanges.set(agent, roles);
      }
    }
    
    return roleChanges;
  }

  private extractRoles(interactions: Interaction[]): any[] {
    // Extract roles from interaction context
    const roles: any[] = [];
    
    for (const interaction of interactions) {
      if (interaction.context?.role) {
        roles.push({
          role: interaction.context.role,
          timestamp: interaction.timestamp,
          effectiveness: interaction.success ? 1 : 0
        });
      }
    }
    
    return roles;
  }

  private analyzeRoleSpecialization(changes: any[]): {
    role: string;
    emergenceScore: number;
    stability: number;
    utility: number;
    novelty: number;
  } {
    if (changes.length === 0) {
      return { role: '', emergenceScore: 0, stability: 0, utility: 0, novelty: 0 };
    }
    
    // Find most frequent role
    const roleFreq = new Map<string, number>();
    for (const change of changes) {
      roleFreq.set(change.role, (roleFreq.get(change.role) || 0) + 1);
    }
    
    const dominantRole = Array.from(roleFreq.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    const specialization = dominantRole[1] / changes.length;
    const effectiveness = changes
      .filter(c => c.role === dominantRole[0])
      .reduce((sum, c) => sum + c.effectiveness, 0) / dominantRole[1];
    
    return {
      role: dominantRole[0],
      emergenceScore: specialization,
      stability: effectiveness,
      utility: effectiveness,
      novelty: this.calculateRoleNovelty(dominantRole[0])
    };
  }

  private identifyProblemSolvingSessions(): Array<{
    id: string;
    type: string;
    participants: string[];
    interactions: Interaction[];
  }> {
    // Group interactions by problem-solving context
    const sessions: Array<{
      id: string;
      type: string;
      participants: string[];
      interactions: Interaction[];
    }> = [];
    
    const problemInteractions = this.interactions.filter(i => 
      i.context?.problemSolving || i.type === 'collaboration'
    );
    
    // Simple grouping by time proximity and participant overlap
    const timeGroups = this.groupByTimeWindows(problemInteractions, 60000); // 1 minute windows
    
    for (const group of timeGroups) {
      if (group.interactions.length >= 3) {
        sessions.push({
          id: `session_${group.start}`,
          type: 'collaborative_problem_solving',
          participants: Array.from(new Set(group.interactions.flatMap(i => i.participants))),
          interactions: group.interactions
        });
      }
    }
    
    return sessions;
  }

  private async analyzeCollectiveIntelligence(session: any): Promise<{
    score: number;
    stability: number;
    utility: number;
    complexity: number;
    novelty: number;
  }> {
    const interactions = session.interactions;
    const participants = session.participants;
    
    // Measure information integration
    const informationDiversity = this.measureInformationDiversity(interactions);
    
    // Measure solution quality
    const solutionQuality = this.measureSolutionQuality(interactions);
    
    // Measure convergence
    const convergence = this.measureConvergence(interactions);
    
    // Measure synergy (group performance > sum of individual performances)
    const synergy = this.measureSynergy(interactions, participants);
    
    const score = (informationDiversity * 0.25 + 
                  solutionQuality * 0.35 + 
                  convergence * 0.2 + 
                  synergy * 0.2);
    
    return {
      score,
      stability: convergence,
      utility: solutionQuality,
      complexity: participants.length / 10,
      novelty: this.calculateNovelty(`intelligence_${session.id}`)
    };
  }

  private analyzeAdaptations(): Array<{
    trigger: string;
    response: string;
    participants: string[];
    adaptationScore: number;
    stability: number;
    effectiveness: number;
    complexity: number;
    novelty: number;
    outcome: string;
  }> {
    const adaptations: Array<{
      trigger: string;
      response: string;
      participants: string[];
      adaptationScore: number;
      stability: number;
      effectiveness: number;
      complexity: number;
      novelty: number;
      outcome: string;
    }> = [];
    
    // Detect environmental changes and responses
    const changes = this.detectEnvironmentalChanges();
    
    for (const change of changes) {
      const response = this.analyzeResponseToChange(change);
      
      if (response.adaptationScore > 0.5) {
        adaptations.push(response);
      }
    }
    
    return adaptations;
  }

  private detectEnvironmentalChanges(): any[] {
    // In real implementation, this would detect actual environmental changes
    // For now, simulate some changes
    return [
      { type: 'resource_shortage', severity: 0.7, timestamp: new Date() },
      { type: 'new_requirements', severity: 0.5, timestamp: new Date() },
      { type: 'system_failure', severity: 0.9, timestamp: new Date() }
    ];
  }

  private analyzeResponseToChange(change: any): any {
    // Analyze how the swarm responded to the change
    const relevantInteractions = this.interactions.filter(i => 
      i.timestamp.getTime() > change.timestamp.getTime() - 60000 && // 1 minute before
      i.timestamp.getTime() < change.timestamp.getTime() + 300000   // 5 minutes after
    );
    
    const participants = Array.from(new Set(relevantInteractions.flatMap(i => i.participants)));
    const successRate = relevantInteractions.filter(i => i.success).length / Math.max(1, relevantInteractions.length);
    
    return {
      trigger: change.type,
      response: 'adaptive_coordination',
      participants,
      adaptationScore: successRate,
      stability: 0.8,
      effectiveness: successRate,
      complexity: participants.length / 10,
      novelty: 0.7,
      outcome: 'maintained_performance'
    };
  }

  // Utility calculation methods
  private calculateStability(interactions: Interaction[]): number {
    if (interactions.length <= 1) return 0;
    
    const successRate = interactions.filter(i => i.success).length / interactions.length;
    const consistencyScore = this.calculateConsistency(interactions);
    
    return (successRate * 0.6 + consistencyScore * 0.4);
  }

  private calculateUtility(interactions: Interaction[]): number {
    const outcomes = interactions.map(i => i.outcome?.value || 0);
    const avgOutcome = outcomes.reduce((sum, v) => sum + v, 0) / Math.max(1, outcomes.length);
    
    return Math.min(1, avgOutcome / 100); // Normalize assuming max value of 100
  }

  private calculateComplexity(interactions: Interaction[]): number {
    const participantCount = new Set(interactions.flatMap(i => i.participants)).size;
    const interactionTypes = new Set(interactions.map(i => i.type)).size;
    const timeSpan = this.calculateTimeSpread(interactions);
    
    return Math.min(1, (participantCount / 10 + interactionTypes / 5 + timeSpan / 60000) / 3);
  }

  private calculateNovelty(patternId: string): number {
    // Check if similar pattern exists
    const existingPatterns = Array.from(this.patterns.values())
      .filter(p => p.name.includes(patternId.split('_')[0]));
    
    return Math.max(0, 1 - existingPatterns.length / 10);
  }

  private calculateConsistency(interactions: Interaction[]): number {
    // Measure how consistent the interactions are
    const durations = interactions.map(i => i.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
    
    return Math.max(0, 1 - variance / (avgDuration * avgDuration));
  }

  private calculateCoordinationUtility(interactions: Interaction[]): number {
    const coordinationInteractions = interactions.filter(i => i.type === 'coordination');
    const successRate = coordinationInteractions.filter(i => i.success).length / Math.max(1, coordinationInteractions.length);
    
    return successRate;
  }

  private calculateRoleNovelty(role: string): number {
    // Check how novel this role specialization is
    const knownRoles = ['coordinator', 'executor', 'analyzer', 'communicator'];
    return knownRoles.includes(role) ? 0.3 : 0.8;
  }

  private measureInformationDiversity(interactions: Interaction[]): number {
    // Measure diversity of information shared
    const contexts = interactions.map(i => JSON.stringify(i.context));
    const uniqueContexts = new Set(contexts);
    
    return uniqueContexts.size / Math.max(1, contexts.length);
  }

  private measureSolutionQuality(interactions: Interaction[]): number {
    const solutionInteractions = interactions.filter(i => i.outcome?.solution);
    const qualityScores = solutionInteractions.map(i => i.outcome.quality || 0);
    
    return qualityScores.reduce((sum, q) => sum + q, 0) / Math.max(1, qualityScores.length);
  }

  private measureConvergence(interactions: Interaction[]): number {
    // Measure how well the group converged on solutions
    const agreements = interactions.filter(i => i.outcome?.agreement).length;
    return agreements / Math.max(1, interactions.length);
  }

  private measureSynergy(interactions: Interaction[], participants: string[]): number {
    // Simplified synergy measurement
    const groupPerformance = interactions.filter(i => i.success).length / Math.max(1, interactions.length);
    const individualBaseline = 0.7; // Assume individual baseline performance
    
    return Math.max(0, (groupPerformance - individualBaseline) / individualBaseline);
  }

  private updatePatternHistory(pattern: EmergentPattern): void {
    const existing = this.patterns.get(pattern.id);
    
    if (existing) {
      existing.frequency++;
      existing.lastObserved = new Date();
      existing.stability = (existing.stability + pattern.stability) / 2;
    } else {
      this.patterns.set(pattern.id, pattern);
    }
  }

  private cleanOldInteractions(): void {
    const cutoff = Date.now() - this.config.patternDetectionWindow * 10; // Keep 10x window
    this.interactions = this.interactions.filter(i => i.timestamp.getTime() > cutoff);
  }

  public getDetectedPatterns(): EmergentPattern[] {
    return Array.from(this.patterns.values());
  }

  public getEmergenceMetrics(): EmergenceMetrics {
    const patterns = Array.from(this.patterns.values());
    
    return {
      totalInteractions: this.interactions.length,
      emergentPatterns: patterns.length,
      averageComplexity: patterns.reduce((sum, p) => sum + p.complexity, 0) / Math.max(1, patterns.length),
      selfOrganizationIndex: patterns.filter(p => p.type === 'organizational').length / Math.max(1, patterns.length),
      collectiveIntelligenceScore: patterns.filter(p => p.type === 'informational').reduce((sum, p) => sum + p.utility, 0) / Math.max(1, patterns.length),
      adaptationRate: patterns.filter(p => p.type === 'behavioral').length / Math.max(1, patterns.length),
      synchronizationLevel: patterns.filter(p => p.name.includes('Synchronization')).reduce((sum, p) => sum + p.stability, 0) / Math.max(1, patterns.length),
      noveltyScore: patterns.reduce((sum, p) => sum + p.novelty, 0) / Math.max(1, patterns.length)
    };
  }
}

export class EmergentBehaviorEngine {
  private behaviorPatterns: Map<string, BehaviorPattern> = new Map();
  private emergenceDetector: EmergenceDetector;
  private stigmergicEnvironment: StigmergicEnvironment;
  private eventBus: EventBus;
  private aiProvider: EnhancedPuterClaudeProvider;
  
  // Configuration
  private config = {
    utilityThreshold: 0.7,
    reinforcementFactor: 1.2,
    decayFactor: 0.95,
    maxPatterns: 1000
  };
  
  private reinforcementTimer?: NodeJS.Timer;

  constructor(
    eventBus: EventBus, 
    stigmergicEnvironment: StigmergicEnvironment
  ) {
    this.eventBus = eventBus;
    this.stigmergicEnvironment = stigmergicEnvironment;
    this.emergenceDetector = new EmergenceDetector();
    this.aiProvider = EnhancedPuterClaudeProvider.getInstance();
    
    this.startReinforcementLoop();
    this.setupEventListeners();
  }

  /**
   * Detect emergent patterns from agent interactions
   */
  public async detectEmergence(agentInteractions: Interaction[]): Promise<EmergentPattern[]> {
    console.log(`🌟 Analyzing ${agentInteractions.length} interactions for emergent patterns`);
    
    const patterns = await this.emergenceDetector.analyze(agentInteractions);
    
    // Reinforce useful patterns
    for (const pattern of patterns) {
      if (pattern.utility > this.config.utilityThreshold) {
        await this.reinforcePattern(pattern);
      }
    }
    
    return patterns;
  }

  /**
   * Reinforce useful emergent patterns
   */
  public async reinforcePattern(pattern: EmergentPattern): Promise<void> {
    console.log(`💪 Reinforcing emergent pattern: ${pattern.name}`);
    
    // Store pattern in behavior patterns
    const behaviorPattern: BehaviorPattern = {
      id: pattern.id,
      pattern: {
        type: pattern.type,
        description: pattern.description,
        conditions: pattern.conditions,
        triggers: pattern.triggers,
        effects: pattern.effects
      },
      frequency: pattern.frequency,
      context: Object.keys(pattern.conditions),
      effectiveness: pattern.utility,
      participants: Array.from(pattern.participants),
      emergenceLevel: pattern.complexity * pattern.novelty
    };
    
    this.behaviorPatterns.set(pattern.id, behaviorPattern);
    
    // Create stigmergic markers to reinforce pattern
    for (const participant of pattern.participants) {
      const marker: EnvironmentMarker = {
        id: `pattern_marker_${pattern.id}_${participant}`,
        type: 'signal',
        agentId: participant,
        position: { x: Math.random() * 1000, y: Math.random() * 1000, z: 0 },
        intensity: pattern.utility,
        data: {
          patternId: pattern.id,
          patternType: pattern.type,
          reinforcement: true
        },
        timestamp: new Date(),
        lifetime: 300000, // 5 minutes
        diffusionRate: 0.1,
        evaporationRate: 0.02
      };
      
      this.stigmergicEnvironment.leaveMarker(marker);
    }
    
    // Use AI to analyze pattern and suggest enhancements
    await this.analyzePatternWithAI(pattern);
    
    // Publish pattern reinforcement event
    this.eventBus.publish({
      type: 'pattern_reinforced',
      payload: {
        patternId: pattern.id,
        patternName: pattern.name,
        utility: pattern.utility,
        participants: Array.from(pattern.participants)
      }
    });
  }

  /**
   * Self-organize based on detected patterns
   */
  public async selfOrganize(goal: SwarmGoal): Promise<Organization> {
    console.log(`🔄 Self-organizing for goal: ${goal.description}`);
    
    const currentPatterns = await this.getActivePatterns();
    const relevantPatterns = currentPatterns.filter(p => 
      this.isPatternRelevantToGoal(p, goal)
    );
    
    // Use AI to suggest optimal organization
    const organization = await this.optimizeOrganization(goal, relevantPatterns);
    
    // Apply organization through stigmergic signals
    await this.applyOrganization(organization);
    
    return organization;
  }

  /**
   * Use AI to analyze pattern and suggest enhancements
   */
  private async analyzePatternWithAI(pattern: EmergentPattern): Promise<void> {
    const analysisPrompt = `
      Analyze this emergent behavior pattern and suggest enhancements:
      
      Pattern: ${pattern.name}
      Description: ${pattern.description}
      Type: ${pattern.type}
      Utility: ${pattern.utility}
      Complexity: ${pattern.complexity}
      Participants: ${Array.from(pattern.participants).join(', ')}
      
      Conditions: ${JSON.stringify(pattern.conditions)}
      Triggers: ${pattern.triggers.join(', ')}
      Effects: ${pattern.effects.join(', ')}
      
      Suggest:
      1. How to enhance this pattern's effectiveness
      2. Conditions that could improve its emergence
      3. Ways to make it more stable and reliable
      4. Potential negative effects to mitigate
    `;
    
    try {
      const analysis = await this.aiProvider.generateText(analysisPrompt, {
        model: ClaudeModel.CLAUDE_3_SONNET,
        temperature: 0.4
      });
      
      console.log(`🧠 AI analysis for pattern ${pattern.name}:`, analysis.substring(0, 200) + '...');
      
      // Store analysis in pattern metadata
      pattern.conditions.aiAnalysis = analysis;
      
    } catch (error) {
      console.error('❌ Failed to analyze pattern with AI:', error);
    }
  }

  /**
   * Optimize organization structure for goal
   */
  private async optimizeOrganization(
    goal: SwarmGoal, 
    patterns: BehaviorPattern[]
  ): Promise<Organization> {
    // Use AI to suggest optimal organization structure
    const optimizationPrompt = `
      Design an optimal organization structure for this goal:
      
      Goal: ${goal.description}
      Priority: ${goal.priority}
      Target Metrics: ${JSON.stringify(Object.fromEntries(goal.targetMetrics))}
      
      Available Patterns:
      ${patterns.map(p => `- ${p.pattern.description} (effectiveness: ${p.effectiveness})`).join('\n')}
      
      Suggest:
      1. Organization structure (hierarchical, network, cluster, etc.)
      2. Role assignments
      3. Communication patterns
      4. Coordination mechanisms
      
      Consider efficiency, adaptability, and resilience.
    `;
    
    try {
      const suggestion = await this.aiProvider.generateText(optimizationPrompt, {
        model: ClaudeModel.CLAUDE_3_SONNET,
        temperature: 0.3
      });
      
      // Parse AI suggestion and create organization structure
      const organization: Organization = {
        structure: this.parseStructureType(suggestion),
        roles: this.parseRoleAssignments(suggestion, patterns),
        connections: this.generateConnections(patterns),
        efficiency: this.estimateEfficiency(patterns),
        adaptability: this.estimateAdaptability(patterns),
        resilience: this.estimateResilience(patterns)
      };
      
      return organization;
      
    } catch (error) {
      console.error('❌ Failed to optimize organization:', error);
      
      // Fallback to default network structure
      return {
        structure: 'network',
        roles: new Map([['general', patterns.flatMap(p => p.participants)]]),
        connections: [],
        efficiency: 0.7,
        adaptability: 0.8,
        resilience: 0.6
      };
    }
  }

  /**
   * Apply organization through environmental signals
   */
  private async applyOrganization(organization: Organization): Promise<void> {
    console.log(`🏗️ Applying ${organization.structure} organization structure`);
    
    // Create organizational markers in environment
    for (const [role, agents] of organization.roles) {
      for (const agentId of agents) {
        const marker: EnvironmentMarker = {
          id: `org_marker_${role}_${agentId}`,
          type: 'signal',
          agentId,
          position: this.calculateOptimalPosition(role, organization),
          intensity: 0.8,
          data: {
            organizationType: 'role_assignment',
            role,
            structure: organization.structure
          },
          timestamp: new Date(),
          lifetime: 600000, // 10 minutes
          diffusionRate: 0.05,
          evaporationRate: 0.01
        };
        
        this.stigmergicEnvironment.leaveMarker(marker);
      }
    }
    
    // Create connection markers
    for (const connection of organization.connections) {
      const marker: EnvironmentMarker = {
        id: `conn_marker_${connection.from}_${connection.to}`,
        type: 'signal',
        agentId: connection.from,
        position: { x: Math.random() * 1000, y: Math.random() * 1000, z: 0 },
        intensity: connection.strength,
        data: {
          organizationType: 'connection',
          target: connection.to,
          connectionType: connection.type
        },
        timestamp: new Date(),
        lifetime: 300000, // 5 minutes
        diffusionRate: 0.1,
        evaporationRate: 0.02
      };
      
      this.stigmergicEnvironment.leaveMarker(marker);
    }
  }

  private startReinforcementLoop(): void {
    this.reinforcementTimer = setInterval(() => {
      this.decayPatterns();
      this.cleanupOldPatterns();
    }, 60000); // Every minute
  }

  private setupEventListeners(): void {
    this.eventBus.subscribe('agent_interaction', async (event: any) => {
      const interaction = event.payload as Interaction;
      await this.detectEmergence([interaction]);
    });
  }

  private decayPatterns(): void {
    for (const pattern of this.behaviorPatterns.values()) {
      pattern.effectiveness *= this.config.decayFactor;
      
      if (pattern.effectiveness < 0.1) {
        this.behaviorPatterns.delete(pattern.id);
      }
    }
  }

  private cleanupOldPatterns(): void {
    if (this.behaviorPatterns.size > this.config.maxPatterns) {
      // Remove least effective patterns
      const sorted = Array.from(this.behaviorPatterns.entries())
        .sort((a, b) => a[1].effectiveness - b[1].effectiveness);
      
      const toRemove = sorted.slice(0, this.behaviorPatterns.size - this.config.maxPatterns);
      
      for (const [id, _] of toRemove) {
        this.behaviorPatterns.delete(id);
      }
    }
  }

  private async getActivePatterns(): Promise<BehaviorPattern[]> {
    return Array.from(this.behaviorPatterns.values())
      .filter(p => p.effectiveness > 0.3)
      .sort((a, b) => b.effectiveness - a.effectiveness);
  }

  private isPatternRelevantToGoal(pattern: BehaviorPattern, goal: SwarmGoal): boolean {
    // Check if pattern context matches goal context
    const goalContext = JSON.stringify(goal.context).toLowerCase();
    const patternContext = pattern.context.join(' ').toLowerCase();
    
    return goalContext.includes(patternContext) || 
           pattern.pattern.effects.some(effect => goalContext.includes(effect));
  }

  private parseStructureType(suggestion: string): Organization['structure'] {
    const text = suggestion.toLowerCase();
    
    if (text.includes('hierarchical')) return 'hierarchical';
    if (text.includes('cluster')) return 'cluster';
    if (text.includes('chain')) return 'chain';
    if (text.includes('star')) return 'star';
    if (text.includes('mesh')) return 'mesh';
    
    return 'network'; // Default
  }

  private parseRoleAssignments(suggestion: string, patterns: BehaviorPattern[]): Map<string, string[]> {
    const roles = new Map<string, string[]>();
    
    // Extract roles from AI suggestion (simplified)
    const roleKeywords = ['coordinator', 'executor', 'analyzer', 'communicator', 'specialist'];
    const allParticipants = Array.from(new Set(patterns.flatMap(p => p.participants)));
    
    for (const keyword of roleKeywords) {
      if (suggestion.toLowerCase().includes(keyword)) {
        // Assign agents to role based on their pattern participation
        const roleAgents = allParticipants.filter(agent => 
          patterns.some(p => p.participants.includes(agent) && 
                           p.pattern.description.toLowerCase().includes(keyword))
        );
        
        if (roleAgents.length > 0) {
          roles.set(keyword, roleAgents);
        }
      }
    }
    
    // Ensure all agents have a role
    const assignedAgents = new Set(Array.from(roles.values()).flat());
    const unassignedAgents = allParticipants.filter(agent => !assignedAgents.has(agent));
    
    if (unassignedAgents.length > 0) {
      roles.set('general', unassignedAgents);
    }
    
    return roles;
  }

  private generateConnections(patterns: BehaviorPattern[]): Array<{
    from: string;
    to: string;
    strength: number;
    type: string;
  }> {
    const connections: Array<{ from: string; to: string; strength: number; type: string }> = [];
    
    // Generate connections based on pattern co-participation
    const agentPairs = new Map<string, { count: number; effectiveness: number }>();
    
    for (const pattern of patterns) {
      for (let i = 0; i < pattern.participants.length; i++) {
        for (let j = i + 1; j < pattern.participants.length; j++) {
          const from = pattern.participants[i];
          const to = pattern.participants[j];
          const key = `${from}-${to}`;
          
          if (!agentPairs.has(key)) {
            agentPairs.set(key, { count: 0, effectiveness: 0 });
          }
          
          const pair = agentPairs.get(key)!;
          pair.count++;
          pair.effectiveness += pattern.effectiveness;
        }
      }
    }
    
    // Create connections for strong pairs
    for (const [key, data] of agentPairs) {
      if (data.count >= 2) { // Appeared together in multiple patterns
        const [from, to] = key.split('-');
        const strength = Math.min(1, data.effectiveness / data.count);
        
        connections.push({
          from,
          to,
          strength,
          type: 'collaboration'
        });
      }
    }
    
    return connections;
  }

  private estimateEfficiency(patterns: BehaviorPattern[]): number {
    return patterns.reduce((sum, p) => sum + p.effectiveness, 0) / Math.max(1, patterns.length);
  }

  private estimateAdaptability(patterns: BehaviorPattern[]): number {
    const diversityScore = new Set(patterns.map(p => p.pattern.type)).size / 10;
    return Math.min(1, diversityScore + 0.5);
  }

  private estimateResilience(patterns: BehaviorPattern[]): number {
    const redundancyScore = patterns.length / 100; // More patterns = more resilience
    return Math.min(1, redundancyScore + 0.6);
  }

  private calculateOptimalPosition(role: string, organization: Organization): { x: number; y: number; z: number } {
    // Calculate position based on role and organization structure
    const basePositions: Record<string, { x: number; y: number }> = {
      coordinator: { x: 500, y: 500 },
      executor: { x: 300, y: 300 },
      analyzer: { x: 700, y: 300 },
      communicator: { x: 500, y: 200 },
      specialist: { x: 400, y: 600 },
      general: { x: 600, y: 400 }
    };
    
    const base = basePositions[role] || { x: 500, y: 500 };
    
    return {
      x: base.x + (Math.random() - 0.5) * 100,
      y: base.y + (Math.random() - 0.5) * 100,
      z: 0
    };
  }

  /**
   * Public API
   */
  public getBehaviorPatterns(): BehaviorPattern[] {
    return Array.from(this.behaviorPatterns.values());
  }

  public getEmergenceMetrics(): EmergenceMetrics {
    return this.emergenceDetector.getEmergenceMetrics();
  }

  public getDetectedPatterns(): EmergentPattern[] {
    return this.emergenceDetector.getDetectedPatterns();
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.reinforcementTimer) {
      clearInterval(this.reinforcementTimer);
    }
    
    this.behaviorPatterns.clear();
    
    console.log('🌟 Emergent behavior engine destroyed');
  }
}

