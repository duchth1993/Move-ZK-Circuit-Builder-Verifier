import { Node, Edge } from 'reactflow';

export interface VerificationStep {
  step: number;
  action: string;
  status: 'pending' | 'running' | 'success' | 'fail';
  detail: string;
  timestamp?: number;
}

export interface VerificationResult {
  valid: boolean;
  steps: VerificationStep[];
  gasUsed: number;
  executionTimeMs: number;
}

export async function simulateVerification(
  nodes: Node[],
  edges: Edge[],
  proofData: string
): Promise<VerificationResult> {
  const blockTypes = nodes.map(n => n.data.blockType as string);
  const steps: VerificationStep[] = [];
  let stepNum = 1;

  // Deserialization
  steps.push({
    step: stepNum++,
    action: 'Deserialize Proof Data',
    status: 'success',
    detail: `Parsed ${proofData.length} bytes of proof data into circuit witness`,
  });

  await delay(300);

  // Check for each block type
  if (blockTypes.includes('public_input') || blockTypes.includes('private_input')) {
    steps.push({
      step: stepNum++,
      action: 'Load Circuit Inputs',
      status: 'success',
      detail: `Loaded ${blockTypes.filter(b => b.includes('input')).length} inputs (${blockTypes.filter(b => b === 'private_input').length} private, ${blockTypes.filter(b => b === 'public_input').length} public)`,
    });
    await delay(200);
  }

  if (blockTypes.includes('hash')) {
    steps.push({
      step: stepNum++,
      action: 'Compute SHA-256 Hash',
      status: 'success',
      detail: 'hash = SHA256(witness_0) → 0x7a3f...e8b1 (32 bytes)',
    });
    await delay(400);
  }

  if (blockTypes.includes('signature')) {
    const sigValid = proofData.length > 5;
    steps.push({
      step: stepNum++,
      action: 'Verify Ed25519 Signature',
      status: sigValid ? 'success' : 'fail',
      detail: sigValid
        ? 'Ed25519.verify(sig, pubkey, msg) → true ✓'
        : 'Ed25519.verify(sig, pubkey, msg) → false ✗ Invalid signature bytes',
    });
    await delay(350);
    if (!sigValid) {
      return finalizeResult(false, steps, stepNum);
    }
  }

  if (blockTypes.includes('range_proof')) {
    steps.push({
      step: stepNum++,
      action: 'Verify Range Proof',
      status: 'success',
      detail: 'value ∈ [0, 1000000] → Bulletproof verification passed ✓',
    });
    await delay(300);
  }

  if (blockTypes.includes('merkle_proof')) {
    steps.push({
      step: stepNum++,
      action: 'Verify Merkle Proof',
      status: 'success',
      detail: 'Merkle path verification: leaf → root in 8 steps ✓',
    });
    await delay(450);
  }

  if (blockTypes.includes('equality')) {
    steps.push({
      step: stepNum++,
      action: 'Assert Equality',
      status: 'success',
      detail: 'computed_hash == public_input → true ✓',
    });
    await delay(150);
  }

  if (blockTypes.includes('and_gate')) {
    steps.push({
      step: stepNum++,
      action: 'Evaluate AND Gate',
      status: 'success',
      detail: 'all_constraints_satisfied AND all_proofs_valid → true ✓',
    });
    await delay(150);
  }

  // Final
  const isValid = proofData.trim().length > 0 && nodes.length >= 2;

  steps.push({
    step: stepNum++,
    action: 'Finalize Proof Verification',
    status: isValid ? 'success' : 'fail',
    detail: isValid
      ? '🎉 All circuit constraints satisfied. Proof is VALID.'
      : '❌ Insufficient circuit data or empty proof input.',
  });

  return finalizeResult(isValid, steps, stepNum);
}

function finalizeResult(valid: boolean, steps: VerificationStep[], stepCount: number): VerificationResult {
  return {
    valid,
    steps,
    gasUsed: Math.floor(Math.random() * 5000) + 2000,
    executionTimeMs: steps.length * 180 + Math.floor(Math.random() * 200),
  };
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
