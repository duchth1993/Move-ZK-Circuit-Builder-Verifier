import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { ZK_BLOCKS } from '@/lib/circuitTypes';

const colorMap: Record<string, string> = {
  'neon-purple': 'border-neon-purple/60 shadow-[0_0_12px_hsl(265_90%_62%/0.3)]',
  'neon-blue': 'border-neon-blue/60 shadow-[0_0_12px_hsl(210_100%_60%/0.3)]',
  'neon-cyan': 'border-neon-cyan/60 shadow-[0_0_12px_hsl(185_100%_55%/0.3)]',
  'neon-green': 'border-neon-green/60 shadow-[0_0_12px_hsl(145_80%_50%/0.3)]',
  'neon-yellow': 'border-neon-yellow/60 shadow-[0_0_12px_hsl(45_100%_60%/0.3)]',
  'neon-red': 'border-neon-red/60 shadow-[0_0_12px_hsl(0_85%_58%/0.3)]',
};

const ZKBlockNode = memo(({ data }: NodeProps) => {
  const blockDef = ZK_BLOCKS.find(b => b.id === data.blockType);
  if (!blockDef) return null;

  const glowClass = colorMap[blockDef.color] || colorMap['neon-purple'];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`glass-panel-strong border-2 ${glowClass} rounded-xl px-4 py-3 min-w-[180px]`}
    >
      {blockDef.inputs.length > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3"
        />
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{blockDef.icon}</span>
        <span className="font-display text-xs font-bold text-foreground tracking-wide uppercase">
          {data.label || blockDef.label}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight">
        {blockDef.description}
      </p>
      <div className="flex gap-1 mt-2 flex-wrap">
        {blockDef.inputs.map(inp => (
          <span key={inp} className="text-[9px] bg-muted/80 text-muted-foreground px-1.5 py-0.5 rounded font-mono">
            {inp}
          </span>
        ))}
        {blockDef.outputs.map(out => (
          <span key={out} className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
            → {out}
          </span>
        ))}
      </div>

      {blockDef.outputs.length > 0 && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3"
        />
      )}
    </motion.div>
  );
});

ZKBlockNode.displayName = 'ZKBlockNode';
export default ZKBlockNode;
