import { IPosition } from "@/features/itinerary/components/ann-button/types";

export const BRAIN_SIZE_FACTOR = 2.75;

// TODO: rename to NODE_
export const BRAIN_POSITIONS: IPosition[] = [
  { x: 0, y: -15 },
  { x: 8, y: -12 },
  { x: 12, y: -5 },
  { x: 14, y: 5 },
  { x: 5, y: 15 },
  { x: 5, y: 5 },
  { x: 8, y: 0 },
  { x: 3, y: -8 },
  { x: 6, y: -6 },
  { x: 11, y: 3 },
  { x: -9, y: 8 },
  { x: -10, y: 12 },
  { x: 3, y: 11 },
];

export const NUMBER_OF_NODES = BRAIN_POSITIONS.length * 2;

export const CODE_LINES = [
  "import tensorflow as tf",
  "01101000 01100101 01101100",
  "const model = await load()",
  "11010011 10101110 00110101",
  "def train_model(data):",
  "01110011 01110100 01100001",
  "neural_net.forward(x)",
  "10100110 11001001 01010011",
];
