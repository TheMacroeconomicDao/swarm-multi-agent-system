// 🛡️ BYZANTINE FAULT TOLERANCE - Practical Byzantine Fault Tolerance (PBFT)
// Защита от byzantine агентов и обеспечение консенсуса в недоверенной среде

import crypto from 'crypto';
import { SwarmAgent } from '../swarm-agent';
import { EventBus } from '@/lib/events/event-bus';

export interface ValidatorNode {
  id: string;
  publicKey: string;
  address: string;
  reputation: number;
  stakes: number;
  isActive: boolean;
  lastSeen: Date;
  byzantineScore: number; // 0-1, higher = more suspicious
}

export interface Message {
  id: string;
  type: 'prepare' | 'commit' | 'view-change' | 'new-view' | 'checkpoint';
  sender: string;
  view: number;
  sequenceNumber: number;
  digest: string;
  timestamp: Date;
  signature: string;
  payload: any;
}

export interface ConsensusProposal {
  id: string;
  proposer: string;
  view: number;
  sequenceNumber: number;
  value: any;
  digest: string;
  timestamp: Date;
  signature: string;
}

export interface ConsensusResult {
  success: boolean;
  value: any;
  votes: Map<string, 'accept' | 'reject'>;
  finalizedAt: Date;
  byzantineDetected: string[];
  proofOfConsensus: string;
}

export interface ByzantineEvidence {
  suspiciousNode: string;
  evidenceType: 'double-voting' | 'equivocation' | 'silence' | 'corruption';
  evidence: any;
  reportedBy: string;
  timestamp: Date;
  severity: number; // 0-1
}

export interface CheckpointState {
  sequenceNumber: number;
  stateHash: string;
  validatorSignatures: Map<string, string>;
  timestamp: Date;
}

export class ByzantineConsensusEngine {
  private validators: Map<string, ValidatorNode> = new Map();
  private activeProposals: Map<string, ConsensusProposal> = new Map();
  private messageLog: Message[] = [];
  private byzantineEvidence: ByzantineEvidence[] = [];
  private checkpoints: CheckpointState[] = [];
  
  // PBFT parameters
  private f: number = 0; // Maximum Byzantine nodes (n >= 3f + 1)
  private view: number = 0;
  private sequenceNumber: number = 0;
  private primaryId: string = '';
  private consensusThreshold: number = 0.67; // 2/3 + 1
  private timeout: number = 10000; // 10 seconds
  
  // Security parameters
  private keyPair: { publicKey: string; privateKey: string };
  private nodeId: string;
  private eventBus: EventBus;
  
  // Metrics and monitoring
  private metrics = {
    totalProposals: 0,
    successfulConsensus: 0,
    byzantineDetections: 0,
    averageConsensusTime: 0,
    networkPartitions: 0
  };

  constructor(nodeId: string, eventBus: EventBus) {
    this.nodeId = nodeId;
    this.eventBus = eventBus;
    this.keyPair = this.generateKeyPair();
    this.startConsensusEngine();
  }

  /**
   * Initialize consensus with validator set
   */
  public initializeValidators(validatorNodes: ValidatorNode[]): void {
    this.validators.clear();
    
    for (const node of validatorNodes) {
      this.validators.set(node.id, node);
    }
    
    // Calculate Byzantine fault tolerance
    const n = this.validators.size;
    this.f = Math.floor((n - 1) / 3);
    this.consensusThreshold = (2 * this.f + 1) / n;
    
    // Select primary node (round-robin or stake-based)
    this.selectPrimary();
    
    console.log(`🛡️ Byzantine consensus initialized with ${n} validators, f=${this.f}`);
  }

  /**
   * Propose a value for consensus
   */
  public async proposeValue(value: any, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<ConsensusResult> {
    const proposalId = `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const proposal: ConsensusProposal = {
      id: proposalId,
      proposer: this.nodeId,
      view: this.view,
      sequenceNumber: this.sequenceNumber++,
      value,
      digest: this.createDigest(value),
      timestamp: new Date(),
      signature: ''
    };
    
    // Sign proposal
    proposal.signature = this.signMessage(proposal);
    
    this.activeProposals.set(proposalId, proposal);
    this.metrics.totalProposals++;
    
    console.log(`📋 Proposing value for consensus: ${proposalId}`);
    
    // Start PBFT protocol
    return this.runPBFTConsensus(proposal, priority);
  }

  /**
   * PBFT Three-phase protocol
   */
  private async runPBFTConsensus(proposal: ConsensusProposal, priority: string): Promise<ConsensusResult> {
    const startTime = Date.now();
    
    try {
      // Phase 1: Pre-prepare (Primary sends proposal)
      if (this.isPrimary()) {
        await this.broadcastPrePrepare(proposal);
      }
      
      // Phase 2: Prepare (Validators validate and vote)
      const prepareVotes = await this.collectPrepareVotes(proposal);
      
      if (!this.hasSufficientVotes(prepareVotes)) {
        return this.createFailureResult(proposal, 'Insufficient prepare votes');
      }
      
      // Phase 3: Commit (Final commitment)
      const commitVotes = await this.collectCommitVotes(proposal);
      
      if (!this.hasSufficientVotes(commitVotes)) {
        return this.createFailureResult(proposal, 'Insufficient commit votes');
      }
      
      // Consensus achieved!
      const consensusTime = Date.now() - startTime;
      this.updateMetrics(consensusTime, true);
      
      const result: ConsensusResult = {
        success: true,
        value: proposal.value,
        votes: commitVotes,
        finalizedAt: new Date(),
        byzantineDetected: this.detectByzantineBehavior(proposal.id),
        proofOfConsensus: this.generateProofOfConsensus(proposal, commitVotes)
      };
      
      // Create checkpoint for this consensus
      await this.createCheckpoint(proposal.sequenceNumber, result);
      
      console.log(`✅ Consensus achieved for ${proposal.id} in ${consensusTime}ms`);
      this.metrics.successfulConsensus++;
      
      return result;
      
    } catch (error) {
      console.error(`❌ Consensus failed for ${proposal.id}:`, error);
      this.updateMetrics(Date.now() - startTime, false);
      
      return this.createFailureResult(proposal, error.message);
    } finally {
      this.activeProposals.delete(proposal.id);
    }
  }

  /**
   * Broadcast pre-prepare message
   */
  private async broadcastPrePrepare(proposal: ConsensusProposal): Promise<void> {
    const message: Message = {
      id: `preprepare_${proposal.id}`,
      type: 'prepare',
      sender: this.nodeId,
      view: this.view,
      sequenceNumber: proposal.sequenceNumber,
      digest: proposal.digest,
      timestamp: new Date(),
      signature: '',
      payload: proposal
    };
    
    message.signature = this.signMessage(message);
    this.messageLog.push(message);
    
    // Broadcast to all validators
    await this.broadcastMessage(message);
  }

  /**
   * Collect prepare votes from validators
   */
  private async collectPrepareVotes(proposal: ConsensusProposal): Promise<Map<string, 'accept' | 'reject'>> {
    const votes = new Map<string, 'accept' | 'reject'>();
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Prepare phase timeout')), this.timeout);
    });
    
    // Simulate vote collection (in real implementation, this would listen to network)
    const votePromise = this.simulateVoteCollection(proposal, 'prepare');
    
    try {
      const collectedVotes = await Promise.race([votePromise, timeoutPromise]);
      return collectedVotes as Map<string, 'accept' | 'reject'>;
    } catch (error) {
      console.warn(`⚠️ Prepare votes collection failed: ${error.message}`);
      return votes;
    }
  }

  /**
   * Collect commit votes from validators
   */
  private async collectCommitVotes(proposal: ConsensusProposal): Promise<Map<string, 'accept' | 'reject'>> {
    const votes = new Map<string, 'accept' | 'reject'>();
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Commit phase timeout')), this.timeout);
    });
    
    const votePromise = this.simulateVoteCollection(proposal, 'commit');
    
    try {
      const collectedVotes = await Promise.race([votePromise, timeoutPromise]);
      return collectedVotes as Map<string, 'accept' | 'reject'>;
    } catch (error) {
      console.warn(`⚠️ Commit votes collection failed: ${error.message}`);
      return votes;
    }
  }

  /**
   * Simulate vote collection (replace with actual network communication)
   */
  private async simulateVoteCollection(proposal: ConsensusProposal, phase: 'prepare' | 'commit'): Promise<Map<string, 'accept' | 'reject'>> {
    const votes = new Map<string, 'accept' | 'reject'>();
    
    // Simulate validators voting
    for (const [validatorId, validator] of this.validators) {
      if (validatorId === this.nodeId) continue; // Skip self
      
      await this.delay(Math.random() * 100); // Simulate network delay
      
      // Determine vote based on validator behavior and proposal validity
      const vote = this.determineValidatorVote(validator, proposal, phase);
      votes.set(validatorId, vote);
      
      // Detect potential Byzantine behavior
      if (this.isSuspiciousBehavior(validator, vote, proposal)) {
        this.reportByzantineEvidence(validatorId, 'equivocation', { phase, vote, proposal });
      }
    }
    
    return votes;
  }

  /**
   * Determine how a validator would vote
   */
  private determineValidatorVote(
    validator: ValidatorNode, 
    proposal: ConsensusProposal, 
    phase: string
  ): 'accept' | 'reject' {
    // Byzantine nodes might vote maliciously
    if (validator.byzantineScore > 0.5) {
      // Simulate byzantine behavior
      if (Math.random() < validator.byzantineScore) {
        return Math.random() < 0.5 ? 'reject' : 'accept'; // Random vote
      }
    }
    
    // Honest nodes validate proposal
    const isValidProposal = this.validateProposal(proposal);
    const hasGoodReputation = validator.reputation > 0.7;
    
    return isValidProposal && hasGoodReputation ? 'accept' : 'reject';
  }

  /**
   * Validate proposal integrity
   */
  private validateProposal(proposal: ConsensusProposal): boolean {
    // Check signature
    if (!this.verifySignature(proposal, proposal.signature, proposal.proposer)) {
      return false;
    }
    
    // Check digest
    const computedDigest = this.createDigest(proposal.value);
    if (computedDigest !== proposal.digest) {
      return false;
    }
    
    // Check sequence number
    if (proposal.sequenceNumber < this.sequenceNumber) {
      return false;
    }
    
    // Check view
    if (proposal.view < this.view) {
      return false;
    }
    
    return true;
  }

  /**
   * Detect Byzantine behavior
   */
  private detectByzantineBehavior(proposalId: string): string[] {
    const suspicious: string[] = [];
    
    // Analyze message patterns for this proposal
    const proposalMessages = this.messageLog.filter(m => 
      m.payload?.id === proposalId || m.digest === this.activeProposals.get(proposalId)?.digest
    );
    
    // Detect double voting
    const votesByNode = new Map<string, Message[]>();
    for (const message of proposalMessages) {
      if (!votesByNode.has(message.sender)) {
        votesByNode.set(message.sender, []);
      }
      votesByNode.get(message.sender)?.push(message);
    }
    
    for (const [nodeId, messages] of votesByNode) {
      const samePhaseMessages = messages.filter(m => m.type === 'prepare');
      
      // If node sent multiple different votes for same phase
      if (samePhaseMessages.length > 1) {
        const uniqueDigests = new Set(samePhaseMessages.map(m => m.digest));
        if (uniqueDigests.size > 1) {
          suspicious.push(nodeId);
          this.reportByzantineEvidence(nodeId, 'double-voting', { messages: samePhaseMessages });
        }
      }
    }
    
    return suspicious;
  }

  /**
   * Report Byzantine evidence
   */
  private reportByzantineEvidence(
    nodeId: string, 
    evidenceType: ByzantineEvidence['evidenceType'], 
    evidence: any
  ): void {
    const byzantineEvidence: ByzantineEvidence = {
      suspiciousNode: nodeId,
      evidenceType,
      evidence,
      reportedBy: this.nodeId,
      timestamp: new Date(),
      severity: this.calculateEvidenceSeverity(evidenceType)
    };
    
    this.byzantineEvidence.push(byzantineEvidence);
    
    // Update node's Byzantine score
    const validator = this.validators.get(nodeId);
    if (validator) {
      validator.byzantineScore = Math.min(1, validator.byzantineScore + byzantineEvidence.severity);
      
      if (validator.byzantineScore > 0.8) {
        console.warn(`🚨 Node ${nodeId} marked as highly suspicious (score: ${validator.byzantineScore})`);
        
        // Consider removing from validator set
        this.considerValidatorRemoval(nodeId);
      }
    }
    
    this.metrics.byzantineDetections++;
    console.log(`🛡️ Byzantine evidence reported: ${evidenceType} by ${nodeId}`);
  }

  /**
   * Create checkpoint for consensus state
   */
  private async createCheckpoint(sequenceNumber: number, consensusResult: ConsensusResult): Promise<void> {
    const stateHash = this.createDigest({
      sequenceNumber,
      result: consensusResult,
      validators: Array.from(this.validators.keys())
    });
    
    const checkpoint: CheckpointState = {
      sequenceNumber,
      stateHash,
      validatorSignatures: new Map(),
      timestamp: new Date()
    };
    
    // Collect signatures from validators
    for (const [validatorId] of this.validators) {
      if (validatorId !== this.nodeId) {
        // Simulate signature collection
        const signature = this.signMessage({ stateHash, sequenceNumber });
        checkpoint.validatorSignatures.set(validatorId, signature);
      }
    }
    
    this.checkpoints.push(checkpoint);
    
    // Keep only recent checkpoints
    if (this.checkpoints.length > 100) {
      this.checkpoints = this.checkpoints.slice(-100);
    }
    
    console.log(`📋 Checkpoint created for sequence ${sequenceNumber}`);
  }

  /**
   * Cryptographic utilities
   */
  private generateKeyPair(): { publicKey: string; privateKey: string } {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    
    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  }

  private signMessage(message: any): string {
    const messageString = JSON.stringify(message);
    const signature = crypto.sign('sha256', Buffer.from(messageString), this.keyPair.privateKey);
    return signature.toString('base64');
  }

  private verifySignature(message: any, signature: string, publicKey: string): boolean {
    try {
      const messageString = JSON.stringify(message);
      const signatureBuffer = Buffer.from(signature, 'base64');
      return crypto.verify('sha256', Buffer.from(messageString), publicKey, signatureBuffer);
    } catch {
      return false;
    }
  }

  private createDigest(data: any): string {
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Helper methods
   */
  private hasSufficientVotes(votes: Map<string, 'accept' | 'reject'>): boolean {
    const acceptVotes = Array.from(votes.values()).filter(v => v === 'accept').length;
    const totalVotes = votes.size;
    return acceptVotes >= Math.ceil(totalVotes * this.consensusThreshold);
  }

  private isPrimary(): boolean {
    return this.primaryId === this.nodeId;
  }

  private selectPrimary(): void {
    // Simple round-robin selection
    const validatorIds = Array.from(this.validators.keys());
    this.primaryId = validatorIds[this.view % validatorIds.length];
  }

  private isSuspiciousBehavior(validator: ValidatorNode, vote: string, proposal: ConsensusProposal): boolean {
    // Implement suspicious behavior detection logic
    return validator.byzantineScore > 0.3 && Math.random() < validator.byzantineScore;
  }

  private calculateEvidenceSeverity(evidenceType: ByzantineEvidence['evidenceType']): number {
    const severityMap = {
      'double-voting': 0.3,
      'equivocation': 0.2,
      'silence': 0.1,
      'corruption': 0.5
    };
    return severityMap[evidenceType] || 0.1;
  }

  private considerValidatorRemoval(nodeId: string): void {
    const validator = this.validators.get(nodeId);
    if (validator && validator.byzantineScore > 0.9) {
      console.warn(`🚫 Considering removal of Byzantine validator: ${nodeId}`);
      
      // In production, this would trigger a validator removal proposal
      validator.isActive = false;
    }
  }

  private createFailureResult(proposal: ConsensusProposal, reason: string): ConsensusResult {
    return {
      success: false,
      value: null,
      votes: new Map(),
      finalizedAt: new Date(),
      byzantineDetected: [],
      proofOfConsensus: `FAILED: ${reason}`
    };
  }

  private generateProofOfConsensus(proposal: ConsensusProposal, votes: Map<string, 'accept' | 'reject'>): string {
    const proof = {
      proposalId: proposal.id,
      sequenceNumber: proposal.sequenceNumber,
      view: this.view,
      votes: Array.from(votes.entries()),
      timestamp: new Date(),
      validatorCount: this.validators.size
    };
    
    return this.createDigest(proof);
  }

  private async broadcastMessage(message: Message): Promise<void> {
    // In production, this would use actual network communication
    this.eventBus.publish({
      type: 'byzantine_message',
      payload: message
    });
  }

  private startConsensusEngine(): void {
    // Start periodic cleanup and monitoring
    setInterval(() => {
      this.cleanupOldMessages();
      this.monitorValidators();
    }, 60000); // Every minute
  }

  private cleanupOldMessages(): void {
    const cutoff = Date.now() - 3600000; // 1 hour ago
    this.messageLog = this.messageLog.filter(m => m.timestamp.getTime() > cutoff);
    this.byzantineEvidence = this.byzantineEvidence.filter(e => e.timestamp.getTime() > cutoff);
  }

  private monitorValidators(): void {
    const now = Date.now();
    
    for (const [validatorId, validator] of this.validators) {
      const timeSinceLastSeen = now - validator.lastSeen.getTime();
      
      // Mark as inactive if not seen for too long
      if (timeSinceLastSeen > 300000) { // 5 minutes
        validator.isActive = false;
        this.reportByzantineEvidence(validatorId, 'silence', { timeSinceLastSeen });
      }
    }
  }

  private updateMetrics(consensusTime: number, success: boolean): void {
    if (success) {
      this.metrics.averageConsensusTime = 
        (this.metrics.averageConsensusTime * this.metrics.successfulConsensus + consensusTime) / 
        (this.metrics.successfulConsensus + 1);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Public API
   */
  public addValidator(validator: ValidatorNode): void {
    this.validators.set(validator.id, validator);
    this.f = Math.floor((this.validators.size - 1) / 3);
    console.log(`✅ Validator added: ${validator.id}`);
  }

  public removeValidator(validatorId: string): void {
    this.validators.delete(validatorId);
    this.f = Math.floor((this.validators.size - 1) / 3);
    console.log(`🗑️ Validator removed: ${validatorId}`);
  }

  public getValidators(): ValidatorNode[] {
    return Array.from(this.validators.values());
  }

  public getByzantineEvidence(): ByzantineEvidence[] {
    return [...this.byzantineEvidence];
  }

  public getMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  public getCurrentView(): number {
    return this.view;
  }

  public getSequenceNumber(): number {
    return this.sequenceNumber;
  }

  /**
   * Handle view change (when primary fails)
   */
  public async triggerViewChange(): Promise<void> {
    this.view++;
    this.selectPrimary();
    
    console.log(`🔄 View change triggered: new view ${this.view}, primary: ${this.primaryId}`);
    
    // Broadcast view change message
    const viewChangeMessage: Message = {
      id: `viewchange_${this.view}`,
      type: 'view-change',
      sender: this.nodeId,
      view: this.view,
      sequenceNumber: this.sequenceNumber,
      digest: '',
      timestamp: new Date(),
      signature: '',
      payload: { newPrimary: this.primaryId }
    };
    
    viewChangeMessage.signature = this.signMessage(viewChangeMessage);
    await this.broadcastMessage(viewChangeMessage);
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.validators.clear();
    this.activeProposals.clear();
    this.messageLog = [];
    this.byzantineEvidence = [];
    this.checkpoints = [];
    
    console.log('🛡️ Byzantine consensus engine destroyed');
  }
}

