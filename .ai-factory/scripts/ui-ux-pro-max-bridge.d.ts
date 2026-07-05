export interface UIUXProMaxBridge {
  generateDesign: (description: string) => Promise<any>;
  generatePalette: (keywords: string[]) => Promise<any>;
  generateTypography: (style: string) => Promise<any>;
  generateComponents: (requirements: string[]) => Promise<any>;
}

export const bridge: {
  default: UIUXProMaxBridge | null;
};

export default bridge;