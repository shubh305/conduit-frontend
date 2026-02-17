export interface StepDetail {
  title: string;
  items: string[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  imagePlaceholder: string;
  simulationImage?: string;
  location: string;
  spotlightId?: string | string[];
  details: StepDetail[];
  hasMockProps?: boolean;
}

export type WalkthroughStage = "discovery" | "creator";
