import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node, Edge } from 'reactflow';
import { generateMoveCode } from '@/lib/moveCodeGen';
import { simulateVerification, VerificationStep } from '@/lib/mockVerifier';
import confetti from 'canvas-confetti';

interface CodePanelProps {
  nodes: Node[];
  edges: Edge[];
  onNessyMood: (mood: 'idle' | 'thinking' | 'happy' | 'sad') => void;
}

export default function CodePanel({ nodes, edges, onNessyMood }: CodePanelProps) {
  const [tab, setTab] = useState<'code' | 'verify' | 'learn'>('code');
  const [proofInput, setProofInput] = useState('0x7a3f9b2c...e8b1d5a4');
  const [verifying, setVerifying] = useState(false);
  const [steps, setSteps] = useState<VerificationStep[]>([]);
  const [result, setResult] = useState<{ valid: boolean; gas: number; time: number } | null>(null);

  const moveCode = generateMoveCode(nodes, edges);

  const handleVerify = async () => {
    if (nodes.length === 0) return;
    setVerifying(true);
    setSteps([]);
    setResult(null);
    onNessyMood('thinking');

    const res = await simulateVerification(nodes, edges, proofInput);

    // Animate steps one by one
    for (let i = 0; i < res.steps.length; i++) {
      await new Promise(r => setTimeout(r, 250));
      setSteps(prev => [...prev, res.steps[i]]);
    }

    setResult({ valid: res.valid, gas: res.gasUsed, time: res.executionTimeMs });
    setVerifying(false);
    onNessyMood(res.valid ? 'happy' : 'sad');

    if (res.valid) {
      confetti({ particleCount: 120, spread: 70, origin: { x: 0.85, y: 0.3 }, colors: ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e'] });
    }
  };

  const tabs = [
    { id: 'code' as const, label: '⟨/⟩ Move Code' },
    { id: 'verify' as const, label: '🔍 Verify' },
    { id: 'learn' as const, label: '📚 Learn' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2.5 text-[10px] font-display uppercase tracking-wider transition-colors ${
              tab === t.id ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'code' && (
          <motion.pre
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="code-block text-[11px] leading-relaxed whitespace-pre-wrap text-foreground/90"
          >
            {moveCode}
          </motion.pre>
        )}

        {tab === 'verify' && (
          <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div>
              <label className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">
                Proof Data (hex)
              </label>
              <textarea
                value={proofInput}
                onChange={e => setProofInput(e.target.value)}
                className="w-full mt-1 bg-muted/50 border border-border rounded-lg p-2 text-xs font-mono text-foreground resize-none h-20 focus:outline-none focus:border-primary/50"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying || nodes.length === 0}
              className={`w-full py-2.5 rounded-lg font-display text-xs uppercase tracking-wider transition-all ${
                verifying
                  ? 'bg-muted text-muted-foreground cursor-wait'
                  : 'bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(265_90%_62%/0.4)] active:scale-[0.98]'
              }`}
            >
              {verifying ? '⏳ Verifying...' : '⚡ Verify Proof'}
            </button>

            <AnimatePresence>
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass-panel p-2.5 rounded-lg text-[10px] ${
                    s.status === 'success' ? 'border-neon-green/30' : s.status === 'fail' ? 'border-neon-red/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{s.status === 'success' ? '✅' : s.status === 'fail' ? '❌' : '⏳'}</span>
                    <span className="font-semibold text-foreground">Step {s.step}: {s.action}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 font-mono">{s.detail}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {result && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-xl text-center font-display ${
                  result.valid
                    ? 'bg-neon-green/10 border border-neon-green/40 neon-glow-green'
                    : 'bg-neon-red/10 border border-neon-red/40'
                }`}
              >
                <div className="text-lg font-bold">{result.valid ? '✅ VALID PROOF' : '❌ INVALID PROOF'}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Gas: {result.gas.toLocaleString()} | Time: {result.time}ms
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === 'learn' && <LearnPanel />}
      </div>
    </div>
  );
}

function LearnPanel() {
  const lessons = [
    {
      title: 'What are ZK Proofs?',
      content: 'Zero-Knowledge Proofs allow one party (the prover) to prove to another (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.',
      code: `// In Move, we verify proofs on-chain\npublic fun verify(proof: &Proof): bool {\n    zk_proof::verify_groth16(proof)\n}`,
    },
    {
      title: 'Hash-Based Proofs',
      content: 'The simplest ZK proof: prove you know a secret value whose hash matches a public commitment. The verifier only sees the hash, never the secret.',
      code: `let hash = sha2_256(secret);\nassert!(hash == public_commitment, E_INVALID);`,
    },
    {
      title: 'Range Proofs',
      content: 'Prove a value falls within a range without revealing the actual value. Used in confidential transactions to prove amounts are non-negative.',
      code: `// Bulletproof range check\nlet valid = bulletproof::verify_range(\n    &commitment, &proof, 0, MAX\n);`,
    },
    {
      title: 'Merkle Proofs in Move',
      content: 'Verify set membership efficiently. Prove a leaf exists in a Merkle tree by providing a path from leaf to root.',
      code: `let computed_root = merkle::compute_root(\n    leaf, proof_path\n);\nassert!(computed_root == root, E_NOT_MEMBER);`,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h3 className="font-display text-xs font-bold text-primary tracking-widest uppercase">
        Learn ZK in Move
      </h3>
      {lessons.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel p-3 rounded-lg space-y-2"
        >
          <h4 className="text-xs font-bold text-foreground">{l.title}</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{l.content}</p>
          <pre className="code-block text-[10px] !p-2">{l.code}</pre>
        </motion.div>
      ))}
    </motion.div>
  );
}
