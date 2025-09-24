// 🧠 COLLECTIVE LEARNING SYSTEM - Distributed Learning and Knowledge Sharing
// Система коллективного обучения и распределения знаний между агентами роя

import { SwarmAgent } from '../swarm-agent';
import { EventBus } from '@/lib/events/event-bus';
import { EnhancedPuterClaudeProvider, ClaudeModel } from '@/lib/ai/puter-claude-provider-enhanced';

export interface AgentExperience {
  agentId: string;
  taskType: string;
  context: any;
  action: string;
  result: any;
  success: boolean;
  reward: number;
  timestamp: Date;
  difficulty: number;
  timeSpent: number;
  resourcesUsed: number;
}

export interface KnowledgeFragment {
  id: string;
  type: 'pattern' | 'solution' | 'optimization' | 'error-fix' | 'best-practice';
  domain: string;
  description: string;
  content: any;
  confidence: number;
  usefulness: number;
  source: string;
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  successRate: number;
}

export interface SkillProfile {
  agentId: string;
  skills: Map<string, SkillLevel>;
  learningRate: number;
  adaptability: number;
  knowledgeContributions: number;
  lastUpdate: Date;
}

export interface SkillLevel {
  skill: string;
  level: number; // 0-1
  confidence: number;
  experienceCount: number;
  lastImprovement: Date;
  transferredFrom?: string;
}

export interface LearningPattern {
  id: string;
  pattern: any;
  frequency: number;
  contexts: string[];
  successRate: number;
  discoveredBy: string[];
  validatedBy: string[];
  emergenceScore: number;
}

export interface TransferLearningRequest {
  sourceAgent: string;
  targetAgent: string;
  skill: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  expectedImprovement: number;
}

export interface CollectiveLearningMetrics {
  totalExperiences: number;
  knowledgeFragments: number;
  successfulTransfers: number;
  averageSkillLevel: number;
  learningVelocity: number;
  knowledgeUtilization: number;
  emergentPatterns: number;
}

export class SharedKnowledgeBase {
  private knowledge: Map<string, KnowledgeFragment> = new Map();
  private patterns: Map<string, LearningPattern> = new Map();
  private indexByDomain: Map<string, Set<string>> = new Map();
  private indexByType: Map<string, Set<string>> = new Map();
  
  public store(fragment: KnowledgeFragment): void {
    this.knowledge.set(fragment.id, fragment);
    
    // Update indices
    if (!this.indexByDomain.has(fragment.domain)) {
      this.indexByDomain.set(fragment.domain, new Set());
    }
    this.indexByDomain.get(fragment.domain)?.add(fragment.id);
    
    if (!this.indexByType.has(fragment.type)) {
      this.indexByType.set(fragment.type, new Set());
    }
    this.indexByType.get(fragment.type)?.add(fragment.id);
  }
  
  public retrieve(domain: string, type?: string): KnowledgeFragment[] {
    let candidates = this.indexByDomain.get(domain) || new Set();
    
    if (type) {
      const typeSet = this.indexByType.get(type) || new Set();
      candidates = new Set([...candidates].filter(id => typeSet.has(id)));
    }
    
    return Array.from(candidates)
      .map(id => this.knowledge.get(id))
      .filter((k): k is KnowledgeFragment => k !== undefined)
      .sort((a, b) => (b.confidence * b.usefulness) - (a.confidence * a.usefulness));
  }
  
  public search(query: string): KnowledgeFragment[] {
    const results: Array<{ fragment: KnowledgeFragment; score: number }> = [];
    
    for (const fragment of this.knowledge.values()) {
      const score = this.calculateRelevanceScore(fragment, query);
      if (score > 0.3) {
        results.push({ fragment, score });
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.fragment);
  }
  
  private calculateRelevanceScore(fragment: KnowledgeFragment, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    if (fragment.description.toLowerCase().includes(queryLower)) score += 0.5;
    if (fragment.domain.toLowerCase().includes(queryLower)) score += 0.3;
    if (JSON.stringify(fragment.content).toLowerCase().includes(queryLower)) score += 0.2;
    
    // Boost recent and useful knowledge
    const recencyBoost = Math.max(0, 1 - (Date.now() - fragment.lastUsed.getTime()) / (7 * 24 * 60 * 60 * 1000));
    score *= (1 + recencyBoost * 0.3);
    
    return score * fragment.confidence * fragment.usefulness;
  }
}

export class ExperienceReplayBuffer {
  private experiences: AgentExperience[] = [];
  private maxSize: number = 10000;
  private indexByAgent: Map<string, number[]> = new Map();
  private indexByTask: Map<string, number[]> = new Map();
  
  public add(experience: AgentExperience): void {
    if (this.experiences.length >= this.maxSize) {
      this.removeOldest();
    }
    
    const index = this.experiences.length;
    this.experiences.push(experience);
    
    // Update indices
    if (!this.indexByAgent.has(experience.agentId)) {
      this.indexByAgent.set(experience.agentId, []);
    }
    this.indexByAgent.get(experience.agentId)?.push(index);
    
    if (!this.indexByTask.has(experience.taskType)) {
      this.indexByTask.set(experience.taskType, []);
    }
    this.indexByTask.get(experience.taskType)?.push(index);
  }
  
  public sample(batchSize: number, criteria?: {
    agentId?: string;
    taskType?: string;
    minReward?: number;
    successOnly?: boolean;
  }): AgentExperience[] {
    let candidates = this.experiences;
    
    if (criteria) {
      if (criteria.agentId) {
        const indices = this.indexByAgent.get(criteria.agentId) || [];
        candidates = indices.map(i => this.experiences[i]);
      }
      
      if (criteria.taskType) {
        candidates = candidates.filter(e => e.taskType === criteria.taskType);
      }
      
      if (criteria.minReward !== undefined) {
        candidates = candidates.filter(e => e.reward >= criteria.minReward);
      }
      
      if (criteria.successOnly) {
        candidates = candidates.filter(e => e.success);
      }
    }
    
    // Prioritized sampling based on reward and recency
    const weights = candidates.map(e => {
      const rewardWeight = Math.max(0.1, e.reward);
      const recencyWeight = 1 - (Date.now() - e.timestamp.getTime()) / (30 * 24 * 60 * 60 * 1000); // 30 days
      return rewardWeight * Math.max(0.1, recencyWeight);
    });
    
    return this.weightedRandomSample(candidates, weights, batchSize);
  }
  
  private weightedRandomSample<T>(items: T[], weights: number[], count: number): T[] {
    const result: T[] = [];
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    for (let i = 0; i < count && items.length > 0; i++) {
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;
      
      for (let j = 0; j < weights.length; j++) {
        random -= weights[j];
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      result.push(items[selectedIndex]);
    }
    
    return result;
  }
  
  private removeOldest(): void {
    if (this.experiences.length === 0) return;
    
    this.experiences.shift();
    
    // Rebuild indices (simplified approach)
    this.rebuildIndices();
  }
  
  private rebuildIndices(): void {
    this.indexByAgent.clear();
    this.indexByTask.clear();
    
    this.experiences.forEach((exp, index) => {
      if (!this.indexByAgent.has(exp.agentId)) {
        this.indexByAgent.set(exp.agentId, []);
      }
      this.indexByAgent.get(exp.agentId)?.push(index);
      
      if (!this.indexByTask.has(exp.taskType)) {
        this.indexByTask.set(exp.taskType, []);
      }
      this.indexByTask.get(exp.taskType)?.push(index);
    });
  }
  
  public size(): number {
    return this.experiences.length;
  }
  
  public getExperiencesByAgent(agentId: string): AgentExperience[] {
    const indices = this.indexByAgent.get(agentId) || [];
    return indices.map(i => this.experiences[i]);
  }
}

export class SwarmNeuralNetwork {
  private weights: Map<string, number[]> = new Map();
  private biases: Map<string, number[]> = new Map();
  private learningRate: number = 0.01;
  private momentum: number = 0.9;
  private previousGradients: Map<string, number[]> = new Map();
  
  public async train(experiences: AgentExperience[]): Promise<void> {
    if (experiences.length === 0) return;
    
    // Simple feedforward network for pattern recognition
    for (const experience of experiences) {
      const input = this.encodeExperience(experience);
      const target = experience.success ? 1 : 0;
      
      // Forward pass
      const output = this.forward(input);
      
      // Backward pass
      const error = target - output;
      this.backward(input, error);
    }
  }
  
  private encodeExperience(experience: AgentExperience): number[] {
    // Simple encoding of experience features
    return [
      experience.reward,
      experience.difficulty,
      experience.timeSpent / 1000, // Normalize to seconds
      experience.resourcesUsed,
      experience.success ? 1 : 0
    ];
  }
  
  private forward(input: number[]): number {
    // Simple single-layer network
    const layerKey = 'output';
    let weights = this.weights.get(layerKey);
    let biases = this.biases.get(layerKey);
    
    if (!weights) {
      weights = new Array(input.length).fill(0).map(() => Math.random() - 0.5);
      this.weights.set(layerKey, weights);
    }
    
    if (!biases) {
      biases = [Math.random() - 0.5];
      this.biases.set(layerKey, biases);
    }
    
    let sum = biases[0];
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * weights[i];
    }
    
    return this.sigmoid(sum);
  }
  
  private backward(input: number[], error: number): void {
    const layerKey = 'output';
    const weights = this.weights.get(layerKey)!;
    const biases = this.biases.get(layerKey)!;
    
    // Calculate gradients
    const gradients = input.map(x => error * x * this.learningRate);
    const biasGradient = error * this.learningRate;
    
    // Apply momentum
    let prevGrads = this.previousGradients.get(layerKey);
    if (!prevGrads) {
      prevGrads = new Array(gradients.length).fill(0);
      this.previousGradients.set(layerKey, prevGrads);
    }
    
    // Update weights with momentum
    for (let i = 0; i < weights.length; i++) {
      const momentumTerm = this.momentum * prevGrads[i];
      const updateTerm = gradients[i] + momentumTerm;
      weights[i] += updateTerm;
      prevGrads[i] = updateTerm;
    }
    
    // Update bias
    biases[0] += biasGradient;
  }
  
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
  
  public predict(input: number[]): number {
    return this.forward(input);
  }
}

export class CollectiveLearningEngine {
  private sharedMemory: SharedKnowledgeBase;
  private experienceBuffer: ExperienceReplayBuffer;
  private neuralNetwork: SwarmNeuralNetwork;
  private skillProfiles: Map<string, SkillProfile> = new Map();
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private eventBus: EventBus;
  private aiProvider: EnhancedPuterClaudeProvider;
  
  // Configuration
  private config = {
    batchSize: 32,
    learningInterval: 30000, // 30 seconds
    patternDetectionThreshold: 5,
    knowledgeRetentionDays: 30,
    minConfidenceForTransfer: 0.7
  };
  
  // Metrics
  private metrics: CollectiveLearningMetrics = {
    totalExperiences: 0,
    knowledgeFragments: 0,
    successfulTransfers: 0,
    averageSkillLevel: 0,
    learningVelocity: 0,
    knowledgeUtilization: 0,
    emergentPatterns: 0
  };
  
  private learningTimer?: NodeJS.Timer;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.sharedMemory = new SharedKnowledgeBase();
    this.experienceBuffer = new ExperienceReplayBuffer();
    this.neuralNetwork = new SwarmNeuralNetwork();
    this.aiProvider = EnhancedPuterClaudeProvider.getInstance();
    
    this.startLearningLoop();
    this.setupEventListeners();
  }

  /**
   * Add agent experience to collective learning
   */
  public async learn(experience: AgentExperience): Promise<void> {
    console.log(`🧠 Learning from experience: ${experience.agentId} - ${experience.taskType}`);
    
    // Add to experience buffer
    this.experienceBuffer.add(experience);
    this.metrics.totalExperiences++;
    
    // Update skill profile
    await this.updateSkillProfile(experience);
    
    // Extract knowledge if experience was successful
    if (experience.success && experience.reward > 0.7) {
      await this.extractKnowledge(experience);
    }
    
    // Detect patterns
    await this.detectLearningPatterns(experience);
    
    // Trigger learning if buffer is ready
    if (this.experienceBuffer.size() >= this.config.batchSize) {
      await this.trainNetwork();
    }
    
    // Share knowledge with swarm
    this.eventBus.publish({
      type: 'learning_update',
      payload: {
        agentId: experience.agentId,
        taskType: experience.taskType,
        success: experience.success,
        reward: experience.reward
      }
    });
  }

  /**
   * Transfer skills between agents
   */
  public async transferSkills(
    fromAgent: string, 
    toAgent: string, 
    skill: string
  ): Promise<boolean> {
    console.log(`🔄 Transferring skill '${skill}' from ${fromAgent} to ${toAgent}`);
    
    const sourceProfile = this.skillProfiles.get(fromAgent);
    const targetProfile = this.skillProfiles.get(toAgent);
    
    if (!sourceProfile || !targetProfile) {
      console.warn('Source or target agent profile not found');
      return false;
    }
    
    const sourceSkill = sourceProfile.skills.get(skill);
    if (!sourceSkill || sourceSkill.confidence < this.config.minConfidenceForTransfer) {
      console.warn('Source skill not found or confidence too low');
      return false;
    }
    
    // Get relevant knowledge for this skill
    const knowledge = this.sharedMemory.retrieve(skill);
    if (knowledge.length === 0) {
      console.warn('No knowledge available for transfer');
      return false;
    }
    
    // Adapt knowledge for target agent
    const adaptedKnowledge = await this.adaptKnowledge(knowledge, fromAgent, toAgent);
    
    // Transfer skill level (with some degradation)
    const transferEfficiency = this.calculateTransferEfficiency(sourceProfile, targetProfile, skill);
    const newSkillLevel = sourceSkill.level * transferEfficiency;
    
    // Update target agent's skill
    const targetSkill: SkillLevel = {
      skill,
      level: newSkillLevel,
      confidence: sourceSkill.confidence * 0.8, // Reduced confidence for transferred skill
      experienceCount: 0,
      lastImprovement: new Date(),
      transferredFrom: fromAgent
    };
    
    targetProfile.skills.set(skill, targetSkill);
    targetProfile.knowledgeContributions++;
    targetProfile.lastUpdate = new Date();
    
    // Store adapted knowledge
    for (const knowledge of adaptedKnowledge) {
      this.sharedMemory.store(knowledge);
    }
    
    this.metrics.successfulTransfers++;
    
    console.log(`✅ Skill transfer completed: ${newSkillLevel.toFixed(2)} level achieved`);
    return true;
  }

  /**
   * Get skill recommendations for an agent
   */
  public async getSkillRecommendations(agentId: string): Promise<{
    skill: string;
    currentLevel: number;
    recommendedSources: string[];
    expectedImprovement: number;
    priority: number;
  }[]> {
    const profile = this.skillProfiles.get(agentId);
    if (!profile) return [];
    
    const recommendations: Array<{
      skill: string;
      currentLevel: number;
      recommendedSources: string[];
      expectedImprovement: number;
      priority: number;
    }> = [];
    
    // Analyze skill gaps
    for (const [skill, skillLevel] of profile.skills) {
      if (skillLevel.level < 0.8) { // Room for improvement
        const sources = this.findSkillSources(skill, skillLevel.level);
        
        if (sources.length > 0) {
          const expectedImprovement = this.calculateExpectedImprovement(
            skillLevel.level, 
            sources.map(s => this.skillProfiles.get(s)?.skills.get(skill)?.level || 0)
          );
          
          recommendations.push({
            skill,
            currentLevel: skillLevel.level,
            recommendedSources: sources,
            expectedImprovement,
            priority: this.calculateSkillPriority(skill, skillLevel.level, expectedImprovement)
          });
        }
      }
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Extract knowledge from successful experience
   */
  private async extractKnowledge(experience: AgentExperience): Promise<void> {
    const knowledgeId = `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use AI to analyze and extract patterns
    const extractionPrompt = `
      Analyze this successful agent experience and extract actionable knowledge:
      
      Task Type: ${experience.taskType}
      Action: ${experience.action}
      Context: ${JSON.stringify(experience.context)}
      Result: ${JSON.stringify(experience.result)}
      Success: ${experience.success}
      Reward: ${experience.reward}
      
      Extract:
      1. Key patterns that led to success
      2. Reusable techniques
      3. Context-specific optimizations
      4. General principles
      
      Format as structured knowledge.
    `;
    
    try {
      const analysis = await this.aiProvider.generateText(extractionPrompt, {
        model: ClaudeModel.CLAUDE_3_SONNET,
        temperature: 0.2
      });
      
      const fragment: KnowledgeFragment = {
        id: knowledgeId,
        type: 'solution',
        domain: experience.taskType,
        description: `Successful ${experience.taskType} solution`,
        content: {
          action: experience.action,
          context: experience.context,
          result: experience.result,
          analysis: analysis
        },
        confidence: Math.min(1, experience.reward),
        usefulness: experience.reward,
        source: experience.agentId,
        createdAt: new Date(),
        lastUsed: new Date(),
        usageCount: 0,
        successRate: 1.0
      };
      
      this.sharedMemory.store(fragment);
      this.metrics.knowledgeFragments++;
      
      console.log(`📚 Knowledge extracted: ${knowledgeId}`);
      
    } catch (error) {
      console.error('❌ Failed to extract knowledge:', error);
    }
  }

  /**
   * Update agent skill profile based on experience
   */
  private async updateSkillProfile(experience: AgentExperience): Promise<void> {
    let profile = this.skillProfiles.get(experience.agentId);
    
    if (!profile) {
      profile = {
        agentId: experience.agentId,
        skills: new Map(),
        learningRate: 0.1,
        adaptability: 0.5,
        knowledgeContributions: 0,
        lastUpdate: new Date()
      };
      this.skillProfiles.set(experience.agentId, profile);
    }
    
    // Update skill level based on experience
    const skill = experience.taskType;
    let skillLevel = profile.skills.get(skill);
    
    if (!skillLevel) {
      skillLevel = {
        skill,
        level: 0.1,
        confidence: 0.1,
        experienceCount: 0,
        lastImprovement: new Date()
      };
      profile.skills.set(skill, skillLevel);
    }
    
    // Learning algorithm
    const learningDelta = this.calculateLearningDelta(experience, skillLevel);
    skillLevel.level = Math.min(1, skillLevel.level + learningDelta);
    skillLevel.experienceCount++;
    
    if (learningDelta > 0) {
      skillLevel.lastImprovement = new Date();
      skillLevel.confidence = Math.min(1, skillLevel.confidence + 0.1);
    }
    
    profile.lastUpdate = new Date();
    
    // Update adaptability based on learning across different skills
    const skillCount = profile.skills.size;
    profile.adaptability = Math.min(1, skillCount / 10); // More skills = more adaptable
  }

  /**
   * Detect emergent learning patterns
   */
  private async detectLearningPatterns(experience: AgentExperience): Promise<void> {
    // Simple pattern detection based on similar experiences
    const similarExperiences = this.experienceBuffer.sample(50, {
      taskType: experience.taskType
    });
    
    if (similarExperiences.length >= this.config.patternDetectionThreshold) {
      const patternId = `pattern_${experience.taskType}_${Date.now()}`;
      
      // Analyze common elements
      const commonActions = this.findCommonElements(
        similarExperiences.map(e => e.action)
      );
      
      const commonContexts = this.findCommonElements(
        similarExperiences.map(e => JSON.stringify(e.context))
      );
      
      if (commonActions.length > 0 || commonContexts.length > 0) {
        const pattern: LearningPattern = {
          id: patternId,
          pattern: {
            actions: commonActions,
            contexts: commonContexts,
            taskType: experience.taskType
          },
          frequency: similarExperiences.length,
          contexts: [experience.taskType],
          successRate: similarExperiences.filter(e => e.success).length / similarExperiences.length,
          discoveredBy: [experience.agentId],
          validatedBy: [],
          emergenceScore: this.calculateEmergenceScore(similarExperiences)
        };
        
        this.learningPatterns.set(patternId, pattern);
        this.metrics.emergentPatterns++;
        
        console.log(`🌟 Emergent pattern detected: ${patternId}`);
        
        // Create knowledge fragment for pattern
        const knowledgeId = `pattern_knowledge_${patternId}`;
        const fragment: KnowledgeFragment = {
          id: knowledgeId,
          type: 'pattern',
          domain: experience.taskType,
          description: `Emergent pattern for ${experience.taskType}`,
          content: pattern,
          confidence: pattern.successRate,
          usefulness: pattern.emergenceScore,
          source: 'collective_learning',
          createdAt: new Date(),
          lastUsed: new Date(),
          usageCount: 0,
          successRate: pattern.successRate
        };
        
        this.sharedMemory.store(fragment);
      }
    }
  }

  /**
   * Train neural network on experience batch
   */
  private async trainNetwork(): Promise<void> {
    try {
      const batch = this.experienceBuffer.sample(this.config.batchSize);
      await this.neuralNetwork.train(batch);
      
      console.log(`🔬 Neural network trained on ${batch.length} experiences`);
    } catch (error) {
      console.error('❌ Failed to train neural network:', error);
    }
  }

  /**
   * Adapt knowledge for target agent
   */
  private async adaptKnowledge(
    knowledge: KnowledgeFragment[], 
    sourceAgent: string, 
    targetAgent: string
  ): Promise<KnowledgeFragment[]> {
    const adaptedKnowledge: KnowledgeFragment[] = [];
    
    for (const fragment of knowledge) {
      // Use AI to adapt knowledge for target agent
      const adaptationPrompt = `
        Adapt this knowledge for a different agent:
        
        Original Knowledge: ${JSON.stringify(fragment.content)}
        Source Agent: ${sourceAgent}
        Target Agent: ${targetAgent}
        
        Consider:
        - Agent capabilities differences
        - Context adaptation
        - Technique modification
        
        Provide adapted version that maintains effectiveness.
      `;
      
      try {
        const adaptation = await this.aiProvider.generateText(adaptationPrompt, {
          model: ClaudeModel.CLAUDE_3_HAIKU,
          temperature: 0.3
        });
        
        const adaptedFragment: KnowledgeFragment = {
          ...fragment,
          id: `adapted_${fragment.id}_${targetAgent}`,
          content: {
            original: fragment.content,
            adaptation: adaptation,
            adaptedFor: targetAgent
          },
          confidence: fragment.confidence * 0.9, // Slight reduction for adaptation
          source: `adapted_from_${sourceAgent}`,
          createdAt: new Date(),
          lastUsed: new Date(),
          usageCount: 0
        };
        
        adaptedKnowledge.push(adaptedFragment);
        
      } catch (error) {
        console.error('❌ Failed to adapt knowledge:', error);
        // Include original knowledge as fallback
        adaptedKnowledge.push(fragment);
      }
    }
    
    return adaptedKnowledge;
  }

  /**
   * Helper methods
   */
  private calculateLearningDelta(experience: AgentExperience, skillLevel: SkillLevel): number {
    const baseRate = 0.1;
    const rewardMultiplier = experience.reward;
    const difficultyMultiplier = experience.difficulty;
    const experienceMultiplier = 1 / Math.sqrt(skillLevel.experienceCount + 1);
    
    let delta = baseRate * rewardMultiplier * difficultyMultiplier * experienceMultiplier;
    
    if (!experience.success) {
      delta *= 0.1; // Minimal learning from failures
    }
    
    return delta;
  }

  private calculateTransferEfficiency(
    sourceProfile: SkillProfile, 
    targetProfile: SkillProfile, 
    skill: string
  ): number {
    let efficiency = 0.7; // Base efficiency
    
    // Boost based on source agent's teaching ability
    efficiency *= (1 + sourceProfile.knowledgeContributions * 0.01);
    
    // Boost based on target agent's adaptability
    efficiency *= (1 + targetProfile.adaptability * 0.3);
    
    // Consider skill similarity
    const targetSkill = targetProfile.skills.get(skill);
    if (targetSkill) {
      // Easier to improve existing skill
      efficiency *= 1.2;
    }
    
    return Math.min(1, efficiency);
  }

  private findSkillSources(skill: string, currentLevel: number): string[] {
    const sources: string[] = [];
    
    for (const [agentId, profile] of this.skillProfiles) {
      const agentSkill = profile.skills.get(skill);
      if (agentSkill && agentSkill.level > currentLevel + 0.2) {
        sources.push(agentId);
      }
    }
    
    return sources.sort((a, b) => {
      const aLevel = this.skillProfiles.get(a)?.skills.get(skill)?.level || 0;
      const bLevel = this.skillProfiles.get(b)?.skills.get(skill)?.level || 0;
      return bLevel - aLevel;
    });
  }

  private calculateExpectedImprovement(currentLevel: number, sourceLevels: number[]): number {
    if (sourceLevels.length === 0) return 0;
    
    const maxSource = Math.max(...sourceLevels);
    const transferEfficiency = 0.7; // Average transfer efficiency
    
    return (maxSource - currentLevel) * transferEfficiency;
  }

  private calculateSkillPriority(
    skill: string, 
    currentLevel: number, 
    expectedImprovement: number
  ): number {
    // Priority based on improvement potential and skill importance
    const improvementWeight = expectedImprovement * 10;
    const gapWeight = (1 - currentLevel) * 5;
    const skillImportance = this.getSkillImportance(skill);
    
    return improvementWeight + gapWeight + skillImportance;
  }

  private getSkillImportance(skill: string): number {
    // Define skill importance (could be learned from usage patterns)
    const importanceMap: Record<string, number> = {
      'code_generation': 5,
      'problem_solving': 4,
      'optimization': 4,
      'testing': 3,
      'documentation': 2
    };
    
    return importanceMap[skill] || 1;
  }

  private findCommonElements(items: string[]): string[] {
    const frequency = new Map<string, number>();
    
    for (const item of items) {
      frequency.set(item, (frequency.get(item) || 0) + 1);
    }
    
    const threshold = Math.max(2, Math.floor(items.length * 0.3));
    
    return Array.from(frequency.entries())
      .filter(([_, count]) => count >= threshold)
      .map(([item, _]) => item);
  }

  private calculateEmergenceScore(experiences: AgentExperience[]): number {
    const successRate = experiences.filter(e => e.success).length / experiences.length;
    const avgReward = experiences.reduce((sum, e) => sum + e.reward, 0) / experiences.length;
    const frequency = experiences.length;
    
    return (successRate * 0.4 + avgReward * 0.4 + Math.min(1, frequency / 10) * 0.2);
  }

  private startLearningLoop(): void {
    this.learningTimer = setInterval(async () => {
      await this.updateMetrics();
      await this.cleanupOldKnowledge();
    }, this.config.learningInterval);
  }

  private setupEventListeners(): void {
    this.eventBus.subscribe('agent_experience', async (event: any) => {
      await this.learn(event.payload);
    });
    
    this.eventBus.subscribe('transfer_request', async (event: any) => {
      const request = event.payload as TransferLearningRequest;
      await this.transferSkills(request.sourceAgent, request.targetAgent, request.skill);
    });
  }

  private async updateMetrics(): Promise<void> {
    this.metrics.knowledgeFragments = this.sharedMemory.knowledge.size;
    
    // Calculate average skill level
    let totalSkillLevel = 0;
    let skillCount = 0;
    
    for (const profile of this.skillProfiles.values()) {
      for (const skill of profile.skills.values()) {
        totalSkillLevel += skill.level;
        skillCount++;
      }
    }
    
    this.metrics.averageSkillLevel = skillCount > 0 ? totalSkillLevel / skillCount : 0;
    
    // Calculate learning velocity (improvement rate)
    const recentExperiences = this.experienceBuffer.sample(100);
    const recentSuccessRate = recentExperiences.filter(e => e.success).length / Math.max(1, recentExperiences.length);
    this.metrics.learningVelocity = recentSuccessRate;
  }

  private async cleanupOldKnowledge(): Promise<void> {
    const cutoff = Date.now() - (this.config.knowledgeRetentionDays * 24 * 60 * 60 * 1000);
    
    for (const [id, fragment] of this.sharedMemory.knowledge) {
      if (fragment.lastUsed.getTime() < cutoff && fragment.usageCount < 5) {
        this.sharedMemory.knowledge.delete(id);
      }
    }
  }

  /**
   * Public API
   */
  public getMetrics(): CollectiveLearningMetrics {
    return { ...this.metrics };
  }

  public getSkillProfile(agentId: string): SkillProfile | undefined {
    return this.skillProfiles.get(agentId);
  }

  public searchKnowledge(query: string): KnowledgeFragment[] {
    return this.sharedMemory.search(query);
  }

  public getLearningPatterns(): LearningPattern[] {
    return Array.from(this.learningPatterns.values());
  }

  public async requestSkillTransfer(request: TransferLearningRequest): Promise<boolean> {
    return this.transferSkills(request.sourceAgent, request.targetAgent, request.skill);
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.learningTimer) {
      clearInterval(this.learningTimer);
    }
    
    this.skillProfiles.clear();
    this.learningPatterns.clear();
    
    console.log('🧠 Collective learning engine destroyed');
  }
}

