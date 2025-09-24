import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const models = [
  { name: 'Claude', tone: 'analysis', color: 'text-purple-400' },
  { name: 'GPT-4', tone: 'reasoning', color: 'text-blue-400' },
  { name: 'Gemini', tone: 'multimodal', color: 'text-green-400' },
  { name: 'Llama', tone: 'open', color: 'text-yellow-400' },
  { name: 'O1', tone: 'planning', color: 'text-pink-400' },
];

const CollectiveIntelligenceDemo: React.FC = () => {
  return (
    <Card className="glass p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Collective Intelligence Demo</h2>
          <Badge variant="secondary">Live</Badge>
        </div>
        <div className="text-xs text-muted-foreground">Simulated discussion</div>
      </div>

      <Tabs defaultValue="discussion" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="discussion" className="mt-4 space-y-4">
          {models.map((m) => (
            <div key={m.name} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">
                  <span className={m.color}>{m.name}</span>
                  <span className="text-muted-foreground"> · {m.tone}</span>
                </div>
                <Badge variant="outline">thinking</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placeholder response for {m.name}. Integrate real providers in `lib/ai/*` when auth is available.
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">Synthesis</h3>
            <p className="text-sm text-muted-foreground">
              Combined plan distilled from model perspectives. This is a static placeholder to keep the page functional.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-4 space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">Key Insights</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Diverse models reduce blind spots.</li>
              <li>Structured turns improve convergence.</li>
              <li>Validation loops catch contradictions.</li>
            </ul>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Replace with real-time outputs once `puter-auth-manager` enables provider access.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CollectiveIntelligenceDemo;


