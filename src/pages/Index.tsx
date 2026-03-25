import { useState, useCallback } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';
import TopBar from '@/components/TopBar';
import ComponentLibrary from '@/components/ComponentLibrary';
import CircuitCanvas from '@/components/CircuitCanvas';
import CodePanel from '@/components/CodePanel';
import NessyMascot from '@/components/NessyMascot';
import { ExampleCircuit } from '@/lib/circuitTypes';

function CircuitBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nessyMood, setNessyMood] = useState<'idle' | 'thinking' | 'happy' | 'sad'>('idle');

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  const handleNewCircuit = () => {
    setNodes([]);
    setEdges([]);
    setNessyMood('idle');
  };

  const handleLoadExample = (example: ExampleCircuit) => {
    setNodes(example.nodes);
    setEdges(example.edges);
    setNessyMood('idle');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <TopBar
        onNewCircuit={handleNewCircuit}
        onLoadExample={handleLoadExample}
        nodes={nodes}
        edges={edges}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 flex-shrink-0 glass-panel-strong border-r border-border overflow-hidden">
          <ComponentLibrary />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative">
          <CircuitCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            setNodes={setNodes}
          />
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2 animate-fade-in">
                <div className="text-4xl">🔧</div>
                <p className="font-display text-sm text-muted-foreground tracking-wider">
                  Drag components here to build your ZK circuit
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  Or load an example from the top bar
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-72 flex-shrink-0 glass-panel-strong border-l border-border overflow-hidden">
          <CodePanel nodes={nodes} edges={edges} onNessyMood={setNessyMood} />
        </div>
      </div>

      <NessyMascot mood={nessyMood} />
    </div>
  );
}

export default function Index() {
  return (
    <ReactFlowProvider>
      <CircuitBuilder />
    </ReactFlowProvider>
  );
}
