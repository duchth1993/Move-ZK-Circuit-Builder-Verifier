export interface ZKBlockType {
  id: string;
  label: string;
  icon: string;
  category: 'primitives' | 'proofs' | 'logic' | 'io';
  description: string;
  inputs: string[];
  outputs: string[];
  color: string;
}

export const ZK_BLOCKS: ZKBlockType[] = [
  {
    id: 'hash', label: 'Hash Function', icon: '#️⃣', category: 'primitives',
    description: 'SHA-256 / Poseidon hash computation',
    inputs: ['preimage'], outputs: ['digest'], color: 'neon-purple',
  },
  {
    id: 'signature', label: 'Signature Verify', icon: '🔏', category: 'primitives',
    description: 'Ed25519 / BLS signature verification',
    inputs: ['message', 'signature', 'pubkey'], outputs: ['valid'], color: 'neon-blue',
  },
  {
    id: 'range_proof', label: 'Range Proof', icon: '📏', category: 'proofs',
    description: 'Prove value is within [min, max]',
    inputs: ['value', 'min', 'max'], outputs: ['in_range'], color: 'neon-cyan',
  },
  {
    id: 'merkle_proof', label: 'Merkle Proof', icon: '🌳', category: 'proofs',
    description: 'Verify membership in Merkle tree',
    inputs: ['leaf', 'root', 'proof_path'], outputs: ['is_member'], color: 'neon-green',
  },
  {
    id: 'equality', label: 'Equality Check', icon: '⚖️', category: 'logic',
    description: 'Assert two values are equal',
    inputs: ['a', 'b'], outputs: ['equal'], color: 'neon-yellow',
  },
  {
    id: 'and_gate', label: 'AND Gate', icon: '🔗', category: 'logic',
    description: 'Logical AND of boolean inputs',
    inputs: ['a', 'b'], outputs: ['result'], color: 'neon-purple',
  },
  {
    id: 'public_input', label: 'Public Input', icon: '📥', category: 'io',
    description: 'Declare a public circuit input',
    inputs: [], outputs: ['value'], color: 'neon-blue',
  },
  {
    id: 'private_input', label: 'Private Input', icon: '🔒', category: 'io',
    description: 'Declare a private witness input',
    inputs: [], outputs: ['value'], color: 'neon-red',
  },
  {
    id: 'output', label: 'Output', icon: '📤', category: 'io',
    description: 'Circuit output / assertion point',
    inputs: ['value'], outputs: [], color: 'neon-green',
  },
];

export interface ExampleCircuit {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
}

export const EXAMPLE_CIRCUITS: ExampleCircuit[] = [
  {
    id: 'simple_hash',
    name: 'Simple Hash Proof',
    description: 'Prove knowledge of a preimage that hashes to a known digest',
    nodes: [
      { id: '1', type: 'zkBlock', position: { x: 50, y: 100 }, data: { blockType: 'private_input', label: 'Secret Preimage' } },
      { id: '2', type: 'zkBlock', position: { x: 50, y: 300 }, data: { blockType: 'public_input', label: 'Known Digest' } },
      { id: '3', type: 'zkBlock', position: { x: 350, y: 100 }, data: { blockType: 'hash', label: 'Hash Function' } },
      { id: '4', type: 'zkBlock', position: { x: 650, y: 200 }, data: { blockType: 'equality', label: 'Equality Check' } },
      { id: '5', type: 'zkBlock', position: { x: 950, y: 200 }, data: { blockType: 'output', label: 'Proof Valid' } },
    ],
    edges: [
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ],
  },
  {
    id: 'range_check',
    name: 'Range Check',
    description: 'Prove a private value falls within a public range',
    nodes: [
      { id: '1', type: 'zkBlock', position: { x: 50, y: 150 }, data: { blockType: 'private_input', label: 'Secret Value' } },
      { id: '2', type: 'zkBlock', position: { x: 400, y: 150 }, data: { blockType: 'range_proof', label: 'Range Proof' } },
      { id: '3', type: 'zkBlock', position: { x: 750, y: 150 }, data: { blockType: 'output', label: 'In Range' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
  },
  {
    id: 'merkle_membership',
    name: 'Merkle Membership',
    description: 'Prove membership in a Merkle tree without revealing the leaf',
    nodes: [
      { id: '1', type: 'zkBlock', position: { x: 50, y: 50 }, data: { blockType: 'private_input', label: 'Secret Leaf' } },
      { id: '2', type: 'zkBlock', position: { x: 50, y: 200 }, data: { blockType: 'public_input', label: 'Merkle Root' } },
      { id: '3', type: 'zkBlock', position: { x: 50, y: 350 }, data: { blockType: 'private_input', label: 'Proof Path' } },
      { id: '4', type: 'zkBlock', position: { x: 400, y: 200 }, data: { blockType: 'merkle_proof', label: 'Merkle Verify' } },
      { id: '5', type: 'zkBlock', position: { x: 750, y: 200 }, data: { blockType: 'output', label: 'Is Member' } },
    ],
    edges: [
      { id: 'e1-4', source: '1', target: '4' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ],
  },
  {
    id: 'sig_and_range',
    name: 'Signature + Range',
    description: 'Verify a signature AND prove a value is in range',
    nodes: [
      { id: '1', type: 'zkBlock', position: { x: 50, y: 50 }, data: { blockType: 'private_input', label: 'Message' } },
      { id: '2', type: 'zkBlock', position: { x: 50, y: 200 }, data: { blockType: 'private_input', label: 'Signature' } },
      { id: '3', type: 'zkBlock', position: { x: 50, y: 350 }, data: { blockType: 'public_input', label: 'Public Key' } },
      { id: '4', type: 'zkBlock', position: { x: 400, y: 150 }, data: { blockType: 'signature', label: 'Sig Verify' } },
      { id: '5', type: 'zkBlock', position: { x: 50, y: 500 }, data: { blockType: 'private_input', label: 'Amount' } },
      { id: '6', type: 'zkBlock', position: { x: 400, y: 450 }, data: { blockType: 'range_proof', label: 'Range Check' } },
      { id: '7', type: 'zkBlock', position: { x: 700, y: 300 }, data: { blockType: 'and_gate', label: 'AND Gate' } },
      { id: '8', type: 'zkBlock', position: { x: 950, y: 300 }, data: { blockType: 'output', label: 'All Valid' } },
    ],
    edges: [
      { id: 'e1-4', source: '1', target: '4' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e4-7', source: '4', target: '7' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-8', source: '7', target: '8' },
    ],
  },
];
