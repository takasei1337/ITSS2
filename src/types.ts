export type ScreenId = "S02" | "S03" | "S04" | "S05" | "S06" | "S07" | "S08";
export type ProjectStatus = "setup" | "in_progress" | "blocked" | "review" | "completed";
export type RequirementPriority = "must" | "should" | "could" | "wont";
export type TaskStatus = "todo" | "doing" | "review" | "done";

export type Requirement = {
  id: string;
  title: string;
  description?: string;
  priority: RequirementPriority;
  successCriteria?: string;
};

export type Task = {
  id: string;
  requirementId?: string;
  title: string;
  description?: string;
  assigneeName?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  blocked?: boolean;
};

export type TechnologyChoices = {
  frontend?: string;
  backend?: string;
  database?: string;
  hosting?: string;
  note?: string;
};

export type CompletionState = {
  requirements: boolean;
  responsive: boolean;
  criticalBugs: boolean;
  guide: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  problemStatement: string;
  targetUsers: string;
  objective: string;
  projectType: string;
  field: string;
  memberCount: string;
  expectedDuration: string;
  assigneeNames: string;
  targetDate?: string;
  status: ProjectStatus;
  currentScreen: ScreenId;
  updatedAt: string;
  requirements: Requirement[];
  technologies: TechnologyChoices;
  tasks: Task[];
  completion: CompletionState;
  lessons?: string;
  feedback?: string;
};

export type AnonymousPost = {
  id: string;
  topic: string;
  content: string;
  desiredResponse: "listen" | "encourage" | "perspective" | "action";
  createdAt: string;
};

export type EmpathyResponse = {
  id: string;
  postId: string;
  content: string;
  responseType: "validation" | "encouragement" | "perspective" | "action";
  helpful: boolean;
  reported: boolean;
};

export type UnderstandingRating = {
  score: 1 | 2 | 3 | 4 | 5;
  note?: string;
};

export type AppState = {
  projects: Project[];
  currentProjectId: string | null;
  anonymousPost: AnonymousPost | null;
  responses: EmpathyResponse[];
  rating: UnderstandingRating | null;
  returnTo: string;
};
