export interface INode {
  id: number;
  baseX: number;
  baseY: number;
  floatOffsetX: number;
  floatOffsetY: number;
  floatSpeed: number;
  delay: number;
  duration: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IGlowCircle {
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export interface ISynapse {
  from: number;
  to: number;
  delay: number;
}
