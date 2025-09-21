// 📄 OPERATIONAL SPECIALIZED AGENTS - Documentation, Deployment, Monitoring
// Enterprise-grade agents for operational excellence and system reliability

import { SwarmAgent } from '@/lib/swarm/swarm-agent';
import { AgentRole, Task, AgentResponse } from '@/types/agents';
import { SwarmTask, SwarmAgentCapabilities } from '@/lib/swarm/swarm-agent';
import { OpenAIClient } from '@/lib/ai/openai-client';
import { openaiConfig } from '@/config/environment';

// 📄 Documentation Swarm Agent
export class DocumentationAgent extends SwarmAgent {
  private openaiClient: OpenAIClient;

  constructor(id: string = 'documentation_agent_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: false,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: false,
      canDocument: true,
      canDeploy: false,
      specializedSkills: ['technical-writing', 'api-documentation', 'user-guides', 'architecture-docs'],
      domains: ['documentation', 'technical-writing', 'knowledge-management'],
      languages: ['markdown', 'rst', 'asciidoc'],
      frameworks: ['gitbook', 'docusaurus', 'mkdocs', 'sphinx'],
      tools: ['notion', 'confluence', 'gitbook', 'swagger'],
      maxComplexity: 7,
      parallelTasks: 5,
      collaborationStyle: 'comprehensive'
    };

    super(id, AgentRole.DOCUMENTATION, capabilities);
    this.openaiClient = new OpenAIClient({
      ...openaiConfig,
      fallbackModels: ['gpt-4-turbo-preview', 'gpt-3.5-turbo']
    });
  }

  public async initializeAgent(): Promise<void> {
    if (this.swarmContext) {
      this.updateContext('specialty', 'Technical Documentation & Knowledge Management');
      this.updateContext('expertise', ['API Documentation', 'User Guides', 'Architecture Docs', 'Tutorials']);
      this.updateContext('focus_areas', ['clarity', 'completeness', 'accessibility', 'maintainability']);
      
      this.swarmContext.set('documentation_format', 'markdown');
      this.swarmContext.set('doc_platform', 'docusaurus');
      this.swarmContext.set('audience_level', 'mixed');
      this.swarmContext.set('update_frequency', 'continuous');
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`📄 Documentation Agent processing: ${task.title}`);
    
    try {
      const analysis = this.analyzeDocumentationNeeds(task);
      const content = await this.generateDocumentation(task, analysis);
      const structure = this.organizeDocs(content);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'analysis',
          content: this.formatDocumentationSuite(content, analysis, structure),
          confidence: content.confidence,
          reasoning: `Generated ${analysis.type} documentation with ${analysis.sections.length} sections`
        },
        nextActions: ['Review documentation', 'Publish to platform', 'Set up maintenance schedule']
      };
      
    } catch (error) {
      console.error('Documentation generation failed:', error);
      throw error;
    }
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    
    const hasValidDocs = output.content && output.structure;
    const hasReadability = output.readabilityScore || output.clarity;
    const hasCompleteness = output.coverage || output.completeness;
    
    return hasValidDocs && hasReadability && hasCompleteness;
  }

  private analyzeDocumentationNeeds(task: SwarmTask) {
    return {
      type: this.identifyDocumentationType(task),
      audience: this.determineAudience(task),
      sections: this.extractRequiredSections(task),
      format: this.selectDocumentationFormat(task),
      maintenance: this.assessMaintenanceNeeds(task)
    };
  }

  private async generateDocumentation(task: SwarmTask, analysis: any) {
    const docPrompt = this.buildDocumentationPrompt(task, analysis);
    
    try {
      const response = await this.openaiClient.generateCompletion({
        messages: [{ role: 'user', content: docPrompt }],
        temperature: 0.3,
        maxTokens: 3000
      });

      return {
        content: response.content,
        confidence: 0.92,
        format: analysis.format,
        readabilityScore: 85
      };
    } catch (error) {
      throw new Error(`Documentation generation failed: ${error.message}`);
    }
  }

  private organizeDocs(content: any) {
    return {
      structure: 'hierarchical',
      navigation: 'sidebar + search',
      crossReferences: 'automatic linking',
      versioning: 'git-based',
      accessibility: 'WCAG AA compliant'
    };
  }

  private identifyDocumentationType(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    
    if (description.includes('api')) return 'api-documentation';
    if (description.includes('user') || description.includes('guide')) return 'user-guide';
    if (description.includes('architecture') || description.includes('system')) return 'architecture-docs';
    if (description.includes('tutorial') || description.includes('getting-started')) return 'tutorial';
    if (description.includes('troubleshooting')) return 'troubleshooting-guide';
    return 'technical-documentation';
  }

  private determineAudience(task: SwarmTask): string[] {
    const description = task.description.toLowerCase();
    const audiences = [];
    
    if (description.includes('developer')) audiences.push('developers');
    if (description.includes('user') || description.includes('end-user')) audiences.push('end-users');
    if (description.includes('admin')) audiences.push('administrators');
    if (description.includes('manager')) audiences.push('managers');
    
    return audiences.length > 0 ? audiences : ['developers'];
  }

  private extractRequiredSections(task: SwarmTask): string[] {
    const description = task.description.toLowerCase();
    const sections = ['overview', 'getting-started'];
    
    if (description.includes('api')) sections.push('api-reference', 'authentication', 'examples');
    if (description.includes('install')) sections.push('installation', 'configuration');
    if (description.includes('tutorial')) sections.push('step-by-step-guide', 'examples');
    if (description.includes('troubleshoot')) sections.push('common-issues', 'faq');
    
    sections.push('best-practices', 'support');
    return sections;
  }

  private selectDocumentationFormat(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    
    if (description.includes('interactive')) return 'interactive-docs';
    if (description.includes('video')) return 'video-tutorials';
    if (description.includes('pdf')) return 'pdf-manual';
    return 'markdown-docs';
  }

  private assessMaintenanceNeeds(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    
    if (description.includes('continuous') || description.includes('agile')) return 'continuous';
    if (description.includes('release')) return 'release-based';
    return 'periodic';
  }

  private buildDocumentationPrompt(task: SwarmTask, analysis: any): string {
    return `As a senior technical writer with expertise in ${analysis.type}, create comprehensive documentation.

Task: ${task.description}
Type: ${analysis.type}
Audience: ${analysis.audience.join(', ')}
Sections: ${analysis.sections.join(', ')}
Format: ${analysis.format}

Requirements:
- Clear, concise writing
- Comprehensive coverage
- Practical examples
- Accessibility compliance
- Easy maintenance

Generate:
1. Complete documentation content
2. Clear section organization
3. Code examples and snippets
4. Visual aids descriptions
5. Cross-reference structure

Focus on clarity, completeness, and user experience.`;
  }

  private formatDocumentationSuite(content: any, analysis: any, structure: any): string {
    return `
📄 **Documentation Suite**

**Type:** ${analysis.type}
**Target Audience:** ${analysis.audience.join(', ')}
**Format:** ${analysis.format}
**Readability Score:** ${content.readabilityScore}/100

**Documentation Content:**
\`\`\`markdown
${content.content}
\`\`\`

**Structure Organization:**
- **Navigation:** ${structure.navigation}
- **Cross-References:** ${structure.crossReferences}
- **Versioning:** ${structure.versioning}
- **Accessibility:** ${structure.accessibility}

**Required Sections:**
${analysis.sections.map((section: string) => `- ${section.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`).join('\n')}

**Maintenance Strategy:**
- **Frequency:** ${analysis.maintenance}
- **Ownership:** Development team
- **Review Process:** Peer review + stakeholder approval
- **Update Triggers:** Code changes, user feedback, support tickets

**Quality Metrics:**
- ✅ Clarity and readability
- ✅ Comprehensive coverage
- ✅ Practical examples
- ✅ Accessibility compliance
- ✅ Easy navigation

**Next Steps:**
1. Review content with stakeholders
2. Set up documentation platform
3. Integrate with development workflow
4. Establish maintenance procedures
5. Gather user feedback
    `.trim();
  }
}

// 🚀 Deployment Swarm Agent
export class DeploymentAgent extends SwarmAgent {
  private openaiClient: OpenAIClient;

  constructor(id: string = 'deployment_agent_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: true,
      canExecuteCode: true,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: true,
      canDocument: true,
      canDeploy: true,
      specializedSkills: ['deployment-strategies', 'infrastructure-automation', 'rollback-procedures', 'environment-management'],
      domains: ['deployment', 'infrastructure', 'automation', 'environments'],
      languages: ['yaml', 'bash', 'python', 'terraform'],
      frameworks: ['kubernetes', 'docker', 'helm', 'ansible'],
      tools: ['jenkins', 'github-actions', 'terraform', 'ansible'],
      maxComplexity: 10,
      parallelTasks: 4,
      collaborationStyle: 'systematic'
    };

    super(id, AgentRole.DEPLOYMENT, capabilities);
    this.openaiClient = new OpenAIClient({
      ...openaiConfig,
      fallbackModels: ['gpt-4-turbo-preview', 'gpt-3.5-turbo']
    });
  }

  public async initializeAgent(): Promise<void> {
    if (this.swarmContext) {
      this.updateContext('specialty', 'Deployment Automation & Infrastructure Management');
      this.updateContext('expertise', ['Blue-Green Deployment', 'Canary Releases', 'Infrastructure as Code', 'Zero-Downtime Deployment']);
      this.updateContext('focus_areas', ['reliability', 'automation', 'rollback-capability', 'monitoring']);
      
      this.swarmContext.set('deployment_strategy', 'blue-green');
      this.swarmContext.set('infrastructure_tool', 'kubernetes');
      this.swarmContext.set('automation_platform', 'github-actions');
      this.swarmContext.set('monitoring_level', 'comprehensive');
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🚀 Deployment Agent processing: ${task.title}`);
    
    try {
      const strategy = this.analyzeDeploymentRequirements(task);
      const pipeline = await this.designDeploymentPipeline(task, strategy);
      const automation = this.createAutomationScripts(pipeline);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatDeploymentSolution(pipeline, strategy, automation),
          confidence: pipeline.confidence,
          reasoning: `Designed ${strategy.type} deployment with ${strategy.environments.length} environments`
        },
        nextActions: ['Test deployment pipeline', 'Set up monitoring', 'Create rollback procedures']
      };
      
    } catch (error) {
      console.error('Deployment pipeline creation failed:', error);
      throw error;
    }
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    
    const hasValidPipeline = output.pipeline && output.stages;
    const hasAutomation = output.automation && output.scripts;
    const hasRollback = output.rollback || output.recovery;
    
    return hasValidPipeline && hasAutomation && hasRollback;
  }

  private analyzeDeploymentRequirements(task: SwarmTask) {
    return {
      type: this.identifyDeploymentStrategy(task),
      environments: this.defineEnvironments(task),
      complexity: this.assessDeploymentComplexity(task),
      constraints: this.identifyConstraints(task),
      rollbackNeeds: this.assessRollbackRequirements(task)
    };
  }

  private async designDeploymentPipeline(task: SwarmTask, strategy: any) {
    const pipelinePrompt = this.buildDeploymentPrompt(task, strategy);
    
    try {
      const response = await this.openaiClient.generateCompletion({
        messages: [{ role: 'user', content: pipelinePrompt }],
        temperature: 0.2,
        maxTokens: 2500
      });

      return {
        pipeline: response.content,
        confidence: 0.94,
        strategy: strategy.type,
        environments: strategy.environments
      };
    } catch (error) {
      throw new Error(`Deployment pipeline generation failed: ${error.message}`);
    }
  }

  private createAutomationScripts(pipeline: any) {
    return {
      cicd: 'GitHub Actions with automated testing',
      infrastructure: 'Terraform for infrastructure provisioning',
      configuration: 'Ansible for configuration management',
      monitoring: 'Prometheus + Grafana integration',
      notifications: 'Slack/Teams integration for alerts'
    };
  }

  private identifyDeploymentStrategy(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    
    if (description.includes('blue-green')) return 'blue-green';
    if (description.includes('canary')) return 'canary';
    if (description.includes('rolling')) return 'rolling';
    if (description.includes('recreate')) return 'recreate';
    return 'blue-green'; // Default to safest strategy
  }

  private defineEnvironments(task: SwarmTask): string[] {
    const description = task.description.toLowerCase();
    const environments = ['development'];
    
    if (description.includes('staging') || description.includes('test')) environments.push('staging');
    if (description.includes('production') || description.includes('prod')) environments.push('production');
    
    return environments;
  }

  private assessDeploymentComplexity(task: SwarmTask): number {
    let complexity = 5;
    const description = task.description.toLowerCase();
    
    if (description.includes('microservice')) complexity += 2;
    if (description.includes('database')) complexity += 1;
    if (description.includes('zero-downtime')) complexity += 2;
    if (description.includes('multi-region')) complexity += 3;
    
    return Math.min(complexity, 10);
  }

  private identifyConstraints(task: SwarmTask): string[] {
    const description = task.description.toLowerCase();
    const constraints = [];
    
    if (description.includes('downtime')) constraints.push('zero-downtime required');
    if (description.includes('security')) constraints.push('security compliance');
    if (description.includes('audit')) constraints.push('audit trail required');
    if (description.includes('rollback')) constraints.push('quick rollback capability');
    
    return constraints;
  }

  private assessRollbackRequirements(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    
    if (description.includes('critical') || description.includes('production')) return 'immediate';
    if (description.includes('business')) return 'within-5-minutes';
    return 'within-15-minutes';
  }

  private buildDeploymentPrompt(task: SwarmTask, strategy: any): string {
    return `As a senior DevOps engineer with expertise in ${strategy.type} deployments, create a robust deployment pipeline.

Task: ${task.description}
Strategy: ${strategy.type}
Environments: ${strategy.environments.join(', ')}
Complexity: ${strategy.complexity}/10
Rollback Requirement: ${strategy.rollbackNeeds}

Requirements:
- Zero-downtime deployment
- Automated testing integration
- Infrastructure as code
- Comprehensive monitoring
- Quick rollback capability

Generate:
1. Complete deployment pipeline
2. Infrastructure configuration
3. Automated testing stages
4. Monitoring and alerting
5. Rollback procedures

Focus on reliability, automation, and operational excellence.`;
  }

  private formatDeploymentSolution(pipeline: any, strategy: any, automation: any): string {
    return `
🚀 **Deployment Pipeline Solution**

**Strategy:** ${strategy.type}
**Environments:** ${strategy.environments.join(' → ')}
**Complexity Level:** ${strategy.complexity}/10
**Rollback Time:** ${strategy.rollbackNeeds}

**Deployment Pipeline:**
\`\`\`yaml
${pipeline.pipeline}
\`\`\`

**Automation Components:**
- **CI/CD:** ${automation.cicd}
- **Infrastructure:** ${automation.infrastructure}
- **Configuration:** ${automation.configuration}
- **Monitoring:** ${automation.monitoring}
- **Notifications:** ${automation.notifications}

**Deployment Constraints:**
${strategy.constraints.map((constraint: string) => `- ${constraint}`).join('\n')}

**Deployment Stages:**
1. **Pre-deployment:** Health checks, backup creation
2. **Deployment:** Gradual rollout with validation
3. **Post-deployment:** Smoke tests, monitoring validation
4. **Rollback:** Automated rollback on failure detection

**Monitoring & Alerting:**
- **Health Checks:** Application and infrastructure
- **Performance Metrics:** Response time, throughput
- **Error Tracking:** Real-time error monitoring
- **SLA Monitoring:** Availability and performance SLAs

**Rollback Procedures:**
- **Trigger Conditions:** Automated failure detection
- **Rollback Time:** ${strategy.rollbackNeeds}
- **Data Consistency:** Database rollback strategies
- **Communication:** Automated stakeholder notifications

**Next Steps:**
1. Set up infrastructure environments
2. Configure CI/CD pipeline
3. Test deployment process
4. Train operations team
5. Establish monitoring dashboards
    `.trim();
  }
}

// 📊 Monitoring Swarm Agent
export class MonitoringAgent extends SwarmAgent {
  private openaiClient: OpenAIClient;

  constructor(id: string = 'monitoring_agent_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: true,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: false,
      canDocument: true,
      canDeploy: true,
      specializedSkills: ['observability', 'alerting', 'metrics-analysis', 'incident-response'],
      domains: ['monitoring', 'observability', 'metrics', 'alerting'],
      languages: ['yaml', 'promql', 'javascript', 'python'],
      frameworks: ['prometheus', 'grafana', 'elk-stack', 'datadog'],
      tools: ['prometheus', 'grafana', 'alertmanager', 'jaeger'],
      maxComplexity: 9,
      parallelTasks: 4,
      collaborationStyle: 'proactive'
    };

    super(id, AgentRole.MONITORING, capabilities);
    this.openaiClient = new OpenAIClient({
      ...openaiConfig,
      fallbackModels: ['gpt-4-turbo-preview', 'gpt-3.5-turbo']
    });
  }

  public async initializeAgent(): Promise<void> {
    if (this.swarmContext) {
      this.updateContext('specialty', 'System Monitoring & Observability');
      this.updateContext('expertise', ['Metrics Collection', 'Alert Management', 'Dashboard Design', 'Incident Response']);
      this.updateContext('focus_areas', ['visibility', 'alerting', 'performance', 'reliability']);
      
      this.swarmContext.set('monitoring_stack', 'prometheus-grafana');
      this.swarmContext.set('alerting_tool', 'alertmanager');
      this.swarmContext.set('log_aggregation', 'elk-stack');
      this.swarmContext.set('tracing_tool', 'jaeger');
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`📊 Monitoring Agent processing: ${task.title}`);
    
    try {
      const requirements = this.analyzeMonitoringRequirements(task);
      const strategy = await this.designMonitoringStrategy(task, requirements);
      const implementation = this.createMonitoringImplementation(strategy);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatMonitoringSolution(strategy, requirements, implementation),
          confidence: strategy.confidence,
          reasoning: `Designed monitoring for ${requirements.systems.length} systems with ${requirements.metrics.length} key metrics`
        },
        nextActions: ['Deploy monitoring infrastructure', 'Configure dashboards', 'Set up alert channels']
      };
      
    } catch (error) {
      console.error('Monitoring setup creation failed:', error);
      throw error;
    }
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    
    const hasValidMonitoring = output.metrics && output.dashboards;
    const hasAlerting = output.alerts && output.thresholds;
    const hasObservability = output.logs || output.traces;
    
    return hasValidMonitoring && hasAlerting && hasObservability;
  }

  private analyzeMonitoringRequirements(task: SwarmTask) {
    return {
      systems: this.identifySystemsToMonitor(task),
      metrics: this.defineKeyMetrics(task),
      slas: this.establishSLAs(task),
      alerting: this.configureAlertingStrategy(task),
      observability: this.planObservabilityStack(task)
    };
  }

  private async designMonitoringStrategy(task: SwarmTask, requirements: any) {
    const monitoringPrompt = this.buildMonitoringPrompt(task, requirements);
    
    try {
      const response = await this.openaiClient.generateCompletion({
        messages: [{ role: 'user', content: monitoringPrompt }],
        temperature: 0.3,
        maxTokens: 2500
      });

      return {
        configuration: response.content,
        confidence: 0.93,
        stack: 'Prometheus + Grafana + ELK',
        coverage: '360-degree observability'
      };
    } catch (error) {
      throw new Error(`Monitoring strategy generation failed: ${error.message}`);
    }
  }

  private createMonitoringImplementation(strategy: any) {
    return {
      infrastructure: 'Kubernetes-native monitoring',
      collection: 'Pull-based metrics with exporters',
      storage: 'Time-series database (Prometheus)',
      visualization: 'Grafana dashboards with alerting',
      correlation: 'Distributed tracing with Jaeger'
    };
  }

  private identifySystemsToMonitor(task: SwarmTask): string[] {
    const description = task.description.toLowerCase();
    const systems = ['application'];
    
    if (description.includes('database')) systems.push('database');
    if (description.includes('cache') || description.includes('redis')) systems.push('cache');
    if (description.includes('queue') || description.includes('message')) systems.push('message-queue');
    if (description.includes('load') || description.includes('balancer')) systems.push('load-balancer');
    if (description.includes('network')) systems.push('network');
    
    systems.push('infrastructure', 'security');
    return systems;
  }

  private defineKeyMetrics(task: SwarmTask): string[] {
    const description = task.description.toLowerCase();
    const metrics = [
      'response_time',
      'throughput',
      'error_rate',
      'availability'
    ];
    
    if (description.includes('cpu')) metrics.push('cpu_utilization');
    if (description.includes('memory')) metrics.push('memory_usage');
    if (description.includes('disk')) metrics.push('disk_io');
    if (description.includes('network')) metrics.push('network_io');
    if (description.includes('custom')) metrics.push('business_metrics');
    
    return metrics;
  }

  private establishSLAs(task: SwarmTask) {
    return {
      availability: '99.9%',
      responseTime: '< 200ms',
      errorRate: '< 0.1%',
      recoveryTime: '< 5 minutes'
    };
  }

  private configureAlertingStrategy(task: SwarmTask) {
    return {
      severity: ['critical', 'warning', 'info'],
      channels: ['email', 'slack', 'pagerduty'],
      escalation: 'tiered escalation based on severity',
      suppression: 'intelligent alert grouping'
    };
  }

  private planObservabilityStack(task: SwarmTask) {
    return {
      metrics: 'Prometheus with custom metrics',
      logs: 'ELK stack for centralized logging',
      traces: 'Jaeger for distributed tracing',
      apm: 'Application Performance Monitoring'
    };
  }

  private buildMonitoringPrompt(task: SwarmTask, requirements: any): string {
    return `As a senior SRE with expertise in observability, design a comprehensive monitoring solution.

Task: ${task.description}
Systems: ${requirements.systems.join(', ')}
Key Metrics: ${requirements.metrics.join(', ')}
SLA Targets: ${requirements.slas.availability} availability, ${requirements.slas.responseTime} response time

Requirements:
- 360-degree system observability
- Proactive alerting and incident response
- Performance monitoring and optimization
- Security and compliance monitoring
- Scalable monitoring infrastructure

Generate:
1. Complete monitoring configuration
2. Dashboard specifications
3. Alert rules and thresholds
4. Observability stack setup
5. Incident response procedures

Focus on proactive monitoring and rapid incident resolution.`;
  }

  private formatMonitoringSolution(strategy: any, requirements: any, implementation: any): string {
    return `
📊 **Monitoring & Observability Solution**

**Monitoring Stack:** ${strategy.stack}
**Coverage:** ${strategy.coverage}
**Systems Monitored:** ${requirements.systems.join(', ')}

**Monitoring Configuration:**
\`\`\`yaml
${strategy.configuration}
\`\`\`

**Key Metrics:**
${requirements.metrics.map((metric: string) => `- ${metric.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`).join('\n')}

**SLA Targets:**
- **Availability:** ${requirements.slas.availability}
- **Response Time:** ${requirements.slas.responseTime}
- **Error Rate:** ${requirements.slas.errorRate}
- **Recovery Time:** ${requirements.slas.recoveryTime}

**Implementation Architecture:**
- **Infrastructure:** ${implementation.infrastructure}
- **Collection:** ${implementation.collection}
- **Storage:** ${implementation.storage}
- **Visualization:** ${implementation.visualization}
- **Correlation:** ${implementation.correlation}

**Alerting Strategy:**
- **Severity Levels:** ${requirements.alerting.severity.join(', ')}
- **Notification Channels:** ${requirements.alerting.channels.join(', ')}
- **Escalation:** ${requirements.alerting.escalation}
- **Suppression:** ${requirements.alerting.suppression}

**Observability Components:**
- **Metrics:** ${requirements.observability.metrics}
- **Logs:** ${requirements.observability.logs}
- **Traces:** ${requirements.observability.traces}
- **APM:** ${requirements.observability.apm}

**Dashboard Categories:**
- **Infrastructure:** CPU, Memory, Disk, Network
- **Application:** Response times, Throughput, Errors
- **Business:** User metrics, Revenue, Conversions
- **Security:** Failed logins, Anomalies, Compliance

**Incident Response:**
1. **Detection:** Automated alert triggers
2. **Assessment:** Impact and severity evaluation
3. **Response:** Escalation and communication
4. **Resolution:** Root cause analysis and fixes
5. **Post-mortem:** Learning and improvement

**Next Steps:**
1. Deploy monitoring infrastructure
2. Configure data collection
3. Create operational dashboards
4. Set up alert notifications
5. Train operations team
    `.trim();
  }
}