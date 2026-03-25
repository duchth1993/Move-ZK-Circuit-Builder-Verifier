import { motion } from 'framer-motion';
import { ZK_BLOCKS, ZKBlockType } from '@/lib/circuitTypes';

const categories = [
  { key: 'io', label: 'Inputs / Outputs' },
  { key: 'primitives', label: 'Crypto Primitives' },
  { key: 'proofs', label: 'Proof Types' },
  { key: 'logic', label: 'Logic Gates' },
] as const;

export default function ComponentLibrary() {
  const onDragStart = (event: React.DragEvent, block: ZKBlockType) => {
    event.dataTransfer.setData('application/zkblock', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full overflow-y-auto p-3 space-y-4">
      <h2 className="font-display text-xs font-bold text-primary tracking-widest uppercase mb-3">
        Components
      </h2>

      {categories.map(cat => {
        const blocks = ZK_BLOCKS.filter(b => b.category === cat.key);
        return (
          <div key={cat.key}>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {cat.label}
            </h3>
            <div className="space-y-1.5">
              {blocks.map((block, i) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={e => onDragStart(e, block)}
                  className="drag-block flex items-center gap-2"
                >
                  <span className="text-base">{block.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{block.label}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{block.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
