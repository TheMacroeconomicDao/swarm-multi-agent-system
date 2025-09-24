// 🌍 STIGMERGIC ENVIRONMENT - Indirect Communication Through Environment
// Стигмергическая среда для косвенной коммуникации агентов

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface EnvironmentMarker {
  id: string;
  type: 'pheromone' | 'artifact' | 'signal' | 'warning' | 'resource' | 'goal';
  agentId: string;
  position: Vector3;
  intensity: number; // 0-1
  data: any;
  timestamp: Date;
  lifetime: number; // milliseconds
  diffusionRate: number; // How fast it spreads
  evaporationRate: number; // How fast it disappears
}

export interface GradientField {
  markerId: string;
  center: Vector3;
  radius: number;
  gradientFunction: (distance: number) => number;
  lastUpdate: Date;
}

export interface EnvironmentSignal {
  type: string;
  intensity: number;
  direction: Vector3;
  distance: number;
  data: any;
  source: string;
}

export interface StigmergicTrace {
  agentId: string;
  action: string;
  position: Vector3;
  timestamp: Date;
  impact: number;
  artifacts: string[];
}

export interface EnvironmentRegion {
  id: string;
  bounds: { min: Vector3; max: Vector3 };
  markers: Set<string>;
  density: number;
  activity: number;
}

export class StigmergicEnvironment {
  private markers: Map<string, EnvironmentMarker> = new Map();
  private gradients: Map<string, GradientField> = new Map();
  private traces: StigmergicTrace[] = [];
  private regions: Map<string, EnvironmentRegion> = new Map();
  private spatialIndex: Map<string, Set<string>> = new Map(); // Grid-based spatial indexing
  
  // Configuration
  private gridSize: number = 10; // Size of spatial grid cells
  private maxMarkers: number = 10000;
  private updateInterval: number = 100; // ms
  private diffusionSteps: number = 3;
  
  // Metrics
  private metrics = {
    totalMarkers: 0,
    activeGradients: 0,
    evaporatedMarkers: 0,
    strongestSignal: 0,
    hotspots: new Map<string, number>()
  };
  
  private updateTimer?: NodeJS.Timer;

  constructor() {
    this.startEnvironmentUpdate();
  }

  /**
   * Agent leaves a marker in the environment
   */
  public leaveMarker(marker: EnvironmentMarker): void {
    // Limit total markers
    if (this.markers.size >= this.maxMarkers) {
      this.cleanupOldestMarkers();
    }
    
    this.markers.set(marker.id, marker);
    this.addToSpatialIndex(marker);
    
    // Create gradient field for diffusion
    if (marker.diffusionRate > 0) {
      this.createGradientField(marker);
    }
    
    // Record trace
    this.traces.push({
      agentId: marker.agentId,
      action: `placed_${marker.type}`,
      position: marker.position,
      timestamp: marker.timestamp,
      impact: marker.intensity,
      artifacts: [marker.id]
    });
    
    this.metrics.totalMarkers++;
    console.log(`🏷️ Marker placed: ${marker.type} at (${marker.position.x}, ${marker.position.y}, ${marker.position.z})`);
  }

  /**
   * Agent senses environment at a position
   */
  public senseEnvironment(position: Vector3, senseRadius: number = 50): EnvironmentSignal[] {
    const signals: EnvironmentSignal[] = [];
    const nearbyMarkers = this.getMarkersInRadius(position, senseRadius);
    
    for (const marker of nearbyMarkers) {
      const distance = this.calculateDistance(position, marker.position);
      
      // Apply gradient if exists
      let intensity = marker.intensity;
      const gradient = this.gradients.get(marker.id);
      if (gradient) {
        intensity *= gradient.gradientFunction(distance);
      }
      
      // Only sense if above threshold
      if (intensity > 0.01) {
        const direction = this.normalizeVector({
          x: marker.position.x - position.x,
          y: marker.position.y - position.y,
          z: marker.position.z - position.z
        });
        
        signals.push({
          type: marker.type,
          intensity,
          direction,
          distance,
          data: marker.data,
          source: marker.agentId
        });
      }
    }
    
    // Sort by intensity (strongest first)
    signals.sort((a, b) => b.intensity - a.intensity);
    
    return signals;
  }

  /**
   * Get aggregate signal at position (for decision making)
   */
  public getAggregateSignal(position: Vector3, signalType?: string): {
    totalIntensity: number;
    dominantDirection: Vector3;
    sources: number;
  } {
    const signals = this.senseEnvironment(position);
    const filteredSignals = signalType 
      ? signals.filter(s => s.type === signalType)
      : signals;
    
    if (filteredSignals.length === 0) {
      return {
        totalIntensity: 0,
        dominantDirection: { x: 0, y: 0, z: 0 },
        sources: 0
      };
    }
    
    // Calculate weighted average direction
    let totalIntensity = 0;
    const weightedDirection = { x: 0, y: 0, z: 0 };
    
    for (const signal of filteredSignals) {
      totalIntensity += signal.intensity;
      weightedDirection.x += signal.direction.x * signal.intensity;
      weightedDirection.y += signal.direction.y * signal.intensity;
      weightedDirection.z += signal.direction.z * signal.intensity;
    }
    
    // Normalize
    const dominantDirection = this.normalizeVector(weightedDirection);
    
    return {
      totalIntensity,
      dominantDirection,
      sources: filteredSignals.length
    };
  }

  /**
   * Create artifact in environment (persistent marker)
   */
  public createArtifact(
    agentId: string, 
    position: Vector3, 
    type: string, 
    data: any
  ): string {
    const artifactId = `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const artifact: EnvironmentMarker = {
      id: artifactId,
      type: 'artifact',
      agentId,
      position,
      intensity: 1.0,
      data: { artifactType: type, ...data },
      timestamp: new Date(),
      lifetime: Infinity, // Artifacts don't expire
      diffusionRate: 0,
      evaporationRate: 0
    };
    
    this.leaveMarker(artifact);
    return artifactId;
  }

  /**
   * Modify existing marker (stigmergic feedback)
   */
  public reinforceMarker(markerId: string, amount: number = 0.1): void {
    const marker = this.markers.get(markerId);
    if (marker) {
      marker.intensity = Math.min(1.0, marker.intensity + amount);
      marker.timestamp = new Date(); // Reset age
      console.log(`💪 Marker reinforced: ${markerId} to ${marker.intensity}`);
    }
  }

  /**
   * Create gradient field for marker diffusion
   */
  private createGradientField(marker: EnvironmentMarker): void {
    const gradient: GradientField = {
      markerId: marker.id,
      center: marker.position,
      radius: 100 * marker.diffusionRate,
      gradientFunction: (distance: number) => {
        // Gaussian diffusion
        const sigma = 20 * marker.diffusionRate;
        return Math.exp(-(distance * distance) / (2 * sigma * sigma));
      },
      lastUpdate: new Date()
    };
    
    this.gradients.set(marker.id, gradient);
    this.metrics.activeGradients++;
  }

  /**
   * Spatial indexing for efficient queries
   */
  private addToSpatialIndex(marker: EnvironmentMarker): void {
    const cellKey = this.getCellKey(marker.position);
    
    if (!this.spatialIndex.has(cellKey)) {
      this.spatialIndex.set(cellKey, new Set());
    }
    
    this.spatialIndex.get(cellKey)?.add(marker.id);
  }

  /**
   * Remove from spatial index
   */
  private removeFromSpatialIndex(marker: EnvironmentMarker): void {
    const cellKey = this.getCellKey(marker.position);
    this.spatialIndex.get(cellKey)?.delete(marker.id);
    
    if (this.spatialIndex.get(cellKey)?.size === 0) {
      this.spatialIndex.delete(cellKey);
    }
  }

  /**
   * Get markers in radius using spatial index
   */
  private getMarkersInRadius(position: Vector3, radius: number): EnvironmentMarker[] {
    const markers: EnvironmentMarker[] = [];
    const cellsToCheck = this.getCellsInRadius(position, radius);
    
    for (const cellKey of cellsToCheck) {
      const markerIds = this.spatialIndex.get(cellKey);
      if (markerIds) {
        for (const markerId of markerIds) {
          const marker = this.markers.get(markerId);
          if (marker && this.calculateDistance(position, marker.position) <= radius) {
            markers.push(marker);
          }
        }
      }
    }
    
    return markers;
  }

  /**
   * Get all cells that might contain markers within radius
   */
  private getCellsInRadius(position: Vector3, radius: number): string[] {
    const cells: string[] = [];
    const cellRadius = Math.ceil(radius / this.gridSize);
    
    const centerCell = this.getCellCoordinates(position);
    
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        for (let dz = -cellRadius; dz <= cellRadius; dz++) {
          cells.push(this.cellCoordsToKey(
            centerCell.x + dx,
            centerCell.y + dy,
            centerCell.z + dz
          ));
        }
      }
    }
    
    return cells;
  }

  /**
   * Environment update loop
   */
  private startEnvironmentUpdate(): void {
    this.updateTimer = setInterval(() => {
      this.updateEnvironment();
    }, this.updateInterval);
  }

  /**
   * Update environment state
   */
  private updateEnvironment(): void {
    const now = Date.now();
    const markersToRemove: string[] = [];
    
    // Update all markers
    for (const [markerId, marker] of this.markers) {
      // Evaporation
      if (marker.evaporationRate > 0) {
        marker.intensity *= (1 - marker.evaporationRate);
        
        if (marker.intensity < 0.01) {
          markersToRemove.push(markerId);
        }
      }
      
      // Lifetime check
      const age = now - marker.timestamp.getTime();
      if (marker.lifetime !== Infinity && age > marker.lifetime) {
        markersToRemove.push(markerId);
      }
      
      // Diffusion
      if (marker.diffusionRate > 0 && marker.intensity > 0.1) {
        this.diffuseMarker(marker);
      }
    }
    
    // Remove dead markers
    for (const markerId of markersToRemove) {
      this.removeMarker(markerId);
    }
    
    // Update regions
    this.updateRegions();
    
    // Update metrics
    this.updateMetrics();
  }

  /**
   * Diffuse marker to neighboring areas
   */
  private diffuseMarker(marker: EnvironmentMarker): void {
    const diffusionAmount = marker.intensity * marker.diffusionRate * 0.1;
    
    // Create diffusion markers in neighboring cells
    const offsets = [
      { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
    ];
    
    for (const offset of offsets) {
      const newPosition = {
        x: marker.position.x + offset.x * this.gridSize,
        y: marker.position.y + offset.y * this.gridSize,
        z: marker.position.z + offset.z * this.gridSize
      };
      
      // Check if diffusion marker already exists at this position
      const existingMarker = this.findMarkerAtPosition(newPosition, marker.type);
      
      if (existingMarker) {
        // Reinforce existing marker
        this.reinforceMarker(existingMarker.id, diffusionAmount);
      } else {
        // Create new diffusion marker
        const diffusionMarker: EnvironmentMarker = {
          id: `${marker.id}_diff_${Date.now()}_${Math.random()}`,
          type: marker.type,
          agentId: marker.agentId,
          position: newPosition,
          intensity: diffusionAmount,
          data: { ...marker.data, diffused: true },
          timestamp: new Date(),
          lifetime: marker.lifetime,
          diffusionRate: marker.diffusionRate * 0.8, // Reduce diffusion rate
          evaporationRate: marker.evaporationRate * 1.2 // Increase evaporation
        };
        
        this.leaveMarker(diffusionMarker);
      }
    }
    
    // Reduce original marker intensity
    marker.intensity *= (1 - marker.diffusionRate * 0.1);
  }

  /**
   * Find marker at specific position
   */
  private findMarkerAtPosition(position: Vector3, type: string): EnvironmentMarker | null {
    const cellKey = this.getCellKey(position);
    const markerIds = this.spatialIndex.get(cellKey);
    
    if (!markerIds) return null;
    
    for (const markerId of markerIds) {
      const marker = this.markers.get(markerId);
      if (marker && 
          marker.type === type &&
          this.calculateDistance(position, marker.position) < 1) {
        return marker;
      }
    }
    
    return null;
  }

  /**
   * Update region statistics
   */
  private updateRegions(): void {
    this.regions.clear();
    
    // Group markers by regions
    const regionSize = this.gridSize * 10;
    
    for (const [markerId, marker] of this.markers) {
      const regionKey = this.getRegionKey(marker.position, regionSize);
      
      if (!this.regions.has(regionKey)) {
        const regionCoords = this.parseRegionKey(regionKey);
        this.regions.set(regionKey, {
          id: regionKey,
          bounds: {
            min: {
              x: regionCoords.x * regionSize,
              y: regionCoords.y * regionSize,
              z: regionCoords.z * regionSize
            },
            max: {
              x: (regionCoords.x + 1) * regionSize,
              y: (regionCoords.y + 1) * regionSize,
              z: (regionCoords.z + 1) * regionSize
            }
          },
          markers: new Set(),
          density: 0,
          activity: 0
        });
      }
      
      const region = this.regions.get(regionKey)!;
      region.markers.add(markerId);
      region.density = region.markers.size / (regionSize * regionSize * regionSize);
      region.activity += marker.intensity;
    }
    
    // Identify hotspots
    this.metrics.hotspots.clear();
    for (const [regionKey, region] of this.regions) {
      if (region.activity > 10) {
        this.metrics.hotspots.set(regionKey, region.activity);
      }
    }
  }

  /**
   * Update environment metrics
   */
  private updateMetrics(): void {
    this.metrics.activeGradients = this.gradients.size;
    
    // Find strongest signal
    let strongest = 0;
    for (const marker of this.markers.values()) {
      if (marker.intensity > strongest) {
        strongest = marker.intensity;
      }
    }
    this.metrics.strongestSignal = strongest;
  }

  /**
   * Remove marker from environment
   */
  private removeMarker(markerId: string): void {
    const marker = this.markers.get(markerId);
    if (marker) {
      this.removeFromSpatialIndex(marker);
      this.markers.delete(markerId);
      this.gradients.delete(markerId);
      this.metrics.evaporatedMarkers++;
    }
  }

  /**
   * Cleanup oldest markers when limit reached
   */
  private cleanupOldestMarkers(): void {
    const markerArray = Array.from(this.markers.entries());
    markerArray.sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime());
    
    // Remove oldest 10%
    const removeCount = Math.floor(this.maxMarkers * 0.1);
    for (let i = 0; i < removeCount; i++) {
      this.removeMarker(markerArray[i][0]);
    }
  }

  /**
   * Utility methods
   */
  private calculateDistance(p1: Vector3, p2: Vector3): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private normalizeVector(v: Vector3): Vector3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (length === 0) return { x: 0, y: 0, z: 0 };
    return {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length
    };
  }

  private getCellKey(position: Vector3): string {
    const coords = this.getCellCoordinates(position);
    return this.cellCoordsToKey(coords.x, coords.y, coords.z);
  }

  private getCellCoordinates(position: Vector3): { x: number; y: number; z: number } {
    return {
      x: Math.floor(position.x / this.gridSize),
      y: Math.floor(position.y / this.gridSize),
      z: Math.floor(position.z / this.gridSize)
    };
  }

  private cellCoordsToKey(x: number, y: number, z: number): string {
    return `${x},${y},${z}`;
  }

  private getRegionKey(position: Vector3, regionSize: number): string {
    const x = Math.floor(position.x / regionSize);
    const y = Math.floor(position.y / regionSize);
    const z = Math.floor(position.z / regionSize);
    return `region_${x}_${y}_${z}`;
  }

  private parseRegionKey(key: string): { x: number; y: number; z: number } {
    const parts = key.split('_');
    return {
      x: parseInt(parts[1]),
      y: parseInt(parts[2]),
      z: parseInt(parts[3])
    };
  }

  /**
   * Public API for monitoring and visualization
   */
  public getEnvironmentState(): {
    markers: number;
    gradients: number;
    regions: number;
    hotspots: Array<{ region: string; activity: number }>;
    strongestSignal: number;
  } {
    return {
      markers: this.markers.size,
      gradients: this.gradients.size,
      regions: this.regions.size,
      hotspots: Array.from(this.metrics.hotspots.entries()).map(([region, activity]) => ({
        region,
        activity
      })),
      strongestSignal: this.metrics.strongestSignal
    };
  }

  public getHeatmap(resolution: number = 10): Array<{
    position: Vector3;
    intensity: number;
  }> {
    const heatmap: Array<{ position: Vector3; intensity: number }> = [];
    
    // Sample environment at regular intervals
    const bounds = this.getEnvironmentBounds();
    
    for (let x = bounds.min.x; x <= bounds.max.x; x += resolution) {
      for (let y = bounds.min.y; y <= bounds.max.y; y += resolution) {
        for (let z = bounds.min.z; z <= bounds.max.z; z += resolution) {
          const position = { x, y, z };
          const signals = this.senseEnvironment(position, resolution);
          const intensity = signals.reduce((sum, s) => sum + s.intensity, 0);
          
          if (intensity > 0) {
            heatmap.push({ position, intensity });
          }
        }
      }
    }
    
    return heatmap;
  }

  private getEnvironmentBounds(): { min: Vector3; max: Vector3 } {
    if (this.markers.size === 0) {
      return {
        min: { x: 0, y: 0, z: 0 },
        max: { x: 0, y: 0, z: 0 }
      };
    }
    
    let min = { x: Infinity, y: Infinity, z: Infinity };
    let max = { x: -Infinity, y: -Infinity, z: -Infinity };
    
    for (const marker of this.markers.values()) {
      min.x = Math.min(min.x, marker.position.x);
      min.y = Math.min(min.y, marker.position.y);
      min.z = Math.min(min.z, marker.position.z);
      max.x = Math.max(max.x, marker.position.x);
      max.y = Math.max(max.y, marker.position.y);
      max.z = Math.max(max.z, marker.position.z);
    }
    
    return { min, max };
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    
    this.markers.clear();
    this.gradients.clear();
    this.traces = [];
    this.regions.clear();
    this.spatialIndex.clear();
    
    console.log('🌍 Stigmergic environment destroyed');
  }
}

