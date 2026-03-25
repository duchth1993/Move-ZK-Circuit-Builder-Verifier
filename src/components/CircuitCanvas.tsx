import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ZKBlockNode from './ZKBlockNode';

const nodeTypes = { zkBlock: ZKBlockNode };

interface CircuitCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export default function CircuitCanvas({
  nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes
}: CircuitCanvasProps) {
  const reactFlowInstance = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/zkblock');
    if (!data) return;

    const block = JSON.parse(data);
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'zkBlock',
      position,
      data: { blockType: block.id, label: block.label },
    };

    setNodes(prev => [...prev, newNode]);
  }, [reactFlowInstance, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(265, 90%, 62%)', strokeWidth: 2 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(260, 30%, 18%)" />
        <Controls />
        <MiniMap
          nodeColor={() => 'hsl(265, 90%, 62%)'}
          maskColor="hsl(240, 15%, 6%, 0.8)"
        />
      </ReactFlow>
    </div>
  );
}
