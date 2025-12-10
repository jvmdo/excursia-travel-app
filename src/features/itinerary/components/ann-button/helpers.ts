import {
  BRAIN_POSITIONS,
  BRAIN_SIZE_FACTOR,
  NUMBER_OF_NODES,
} from "@/features/itinerary/components/ann-button/constants";
import {
  IGlowCircle,
  INode,
  IPosition,
  ISynapse,
} from "@/features/itinerary/components/ann-button/types";

export function generateNodes(): INode[] {
  const nodes: INode[] = [];

  for (let i = 0; i < NUMBER_OF_NODES; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 20 + Math.random() * 35;
    const centerX = 50;
    const centerY = 50;

    nodes.push({
      id: i,
      baseX: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
      baseY: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 20,
      floatOffsetX: (Math.random() - 0.5) * 10,
      floatOffsetY: (Math.random() - 0.5) * 10,
      floatSpeed: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    });
  }
  return nodes;
}

export function generateGlowCircles(): IGlowCircle[] {
  const circles: IGlowCircle[] = [];
  for (let i = 0; i < 8; i++) {
    circles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    });
  }
  return circles;
}

export function getNodePosition(
  node: INode,
  time: number,
  isHovered?: boolean,
  isProcessing?: boolean
): IPosition {
  if (isProcessing) {
    const brainCenterX = 50;
    const brainCenterY = 50;
    const hemisphere = node.id < NUMBER_OF_NODES / 2 ? -1 : 1;
    const localId = node.id % (NUMBER_OF_NODES / 2);
    const pos = BRAIN_POSITIONS[localId];

    return {
      x: brainCenterX + hemisphere * pos.x * BRAIN_SIZE_FACTOR,
      y: brainCenterY + pos.y * BRAIN_SIZE_FACTOR,
    };
  }

  if (isHovered) {
    return {
      x: node.baseX + Math.sin(time * node.floatSpeed) * node.floatOffsetX,
      y:
        node.baseY + Math.cos(time * node.floatSpeed * 0.8) * node.floatOffsetY,
    };
  }

  return { x: node.baseX, y: node.baseY };
}

export function generateSynapses(nodeCount: number): ISynapse[] {
  const synapses: ISynapse[] = [];
  const numSynapses = NUMBER_OF_NODES * 2;

  for (let i = 0; i < numSynapses; i++) {
    const from = Math.floor(Math.random() * nodeCount);
    const to = Math.floor(Math.random() * nodeCount);

    if (from !== to) {
      synapses.push({ from, to, delay: Math.random() * 2 });
    }
  }

  return synapses;
}
