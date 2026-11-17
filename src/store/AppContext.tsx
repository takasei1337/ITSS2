import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createInitialState } from "../data/seedData";
import type { AnonymousPost, AppState, EmpathyResponse, Project, UnderstandingRating } from "../types";

const STORAGE_KEY = "project-compass.state.v2";

type AppContextValue = {
  state: AppState;
  currentProject: Project | null;
  selectProject: (projectId: string | null) => void;
  createProject: (project: Project) => void;
  updateProject: (projectId: string, changes: Partial<Project>) => void;
  setAnonymousPost: (post: AnonymousPost | null) => void;
  setResponses: (responses: EmpathyResponse[]) => void;
  updateResponse: (responseId: string, changes: Partial<EmpathyResponse>) => void;
  setRating: (rating: UnderstandingRating | null) => void;
  setReturnTo: (path: string) => void;
  resetData: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AppState) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AppContextValue>(() => ({
    state,
    currentProject: state.projects.find((project) => project.id === state.currentProjectId) ?? null,
    selectProject(projectId) {
      setState((current) => ({ ...current, currentProjectId: projectId }));
    },
    createProject(project) {
      setState((current) => ({ ...current, projects: [project, ...current.projects], currentProjectId: project.id }));
    },
    updateProject(projectId, changes) {
      setState((current) => ({
        ...current,
        projects: current.projects.map((project) => project.id === projectId
          ? { ...project, ...changes, updatedAt: "Vừa cập nhật" }
          : project),
      }));
    },
    setAnonymousPost(post) {
      setState((current) => ({ ...current, anonymousPost: post }));
    },
    setResponses(responses) {
      setState((current) => ({ ...current, responses }));
    },
    updateResponse(responseId, changes) {
      setState((current) => ({
        ...current,
        responses: current.responses.map((response) => response.id === responseId ? { ...response, ...changes } : response),
      }));
    },
    setRating(rating) {
      setState((current) => ({ ...current, rating }));
    },
    setReturnTo(path) {
      setState((current) => ({ ...current, returnTo: path }));
    },
    resetData() {
      setState(createInitialState());
    },
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
