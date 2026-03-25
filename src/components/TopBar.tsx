import { motion } from 'framer-motion';
import { EXAMPLE_CIRCUITS, ExampleCircuit } from '@/lib/circuitTypes';
import { generateMoveCode, generateExportPackage } from '@/lib/moveCodeGen';
import { Node, Edge } from 'reactflow';

interface TopBarProps {
  onNewCircuit: () => void;
  onLoadExample: (example: ExampleCircuit) => void;
  nodes: Node[];
  edges: Edge[];
}

export default function TopBar({ onNewCircuit, onLoadExample, nodes, edges }: TopBarProps) {
  const handleExport = () => {
    const code = generateMoveCode(nodes, edges);
    const pkg = generateExportPackage(code);
    const blob = new Blob([pkg], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zk_circuit_export.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    localStorage.setItem('zk-circuit-save', data);
    alert('Circuit saved to local storage!');
  };

  const btnClass = "px-3 py-1.5 text-[10px] font-display uppercase tracking-wider rounded-lg transition-all hover:scale-105 active:scale-95";

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel-strong border-b border-border flex items-center justify-between px-4 py-2 z-20"
    >
      <div className="flex items-center gap-3">
        <h1 className="font-display text-sm font-bold tracking-wider">
          <span className="text-primary neon-text">ZK</span>
          <span className="text-foreground"> Circuit Builder</span>
        </h1>
        <span className="text-[9px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full font-mono">
          Endless Ecosystem
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onNewCircuit} className={`${btnClass} bg-muted text-foreground hover:bg-muted/80`}>
          ✨ New
        </button>
        <button onClick={handleSave} className={`${btnClass} bg-muted text-foreground hover:bg-muted/80`}>
          💾 Save
        </button>
        <button onClick={handleExport} className={`${btnClass} bg-secondary text-secondary-foreground hover:shadow-[0_0_15px_hsl(210_100%_60%/0.3)]`}>
          📦 Export
        </button>

        <div className="relative group">
          <button className={`${btnClass} bg-primary/20 text-primary border border-primary/30`}>
            📂 Examples
          </button>
          <div className="absolute right-0 top-full mt-1 w-56 glass-panel-strong rounded-lg p-1.5 hidden group-hover:block shadow-xl z-50">
            {EXAMPLE_CIRCUITS.map(ex => (
              <button
                key={ex.id}
                onClick={() => onLoadExample(ex)}
                className="w-full text-left px-3 py-2 text-[10px] rounded-md hover:bg-primary/10 transition-colors"
              >
                <div className="font-semibold text-foreground">{ex.name}</div>
                <div className="text-muted-foreground">{ex.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
