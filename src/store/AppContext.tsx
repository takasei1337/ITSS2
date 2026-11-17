import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createInitialState, publicProjects } from "../data/seedData";
import type { AnonymousPost, AppState, EmpathyResponse, Project, UnderstandingRating } from "../types";
import { getDefaultTaskGuide } from "../utils/project";

const STORAGE_KEY = "project-compass.state.v2";

type AppContextValue = {
  state: AppState;
  publicProjects: Project[];
  currentProject: Project | null;
  selectProject: (projectId: string | null) => void;
  createProject: (project: Project) => void;
  updateProject: (projectId: string, changes: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setAnonymousPost: (post: AnonymousPost | null) => void;
  setResponses: (responses: EmpathyResponse[]) => void;
  updateResponse: (responseId: string, changes: Partial<EmpathyResponse>) => void;
  setRating: (rating: UnderstandingRating | null) => void;
  setReturnTo: (path: string) => void;
  resetData: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function normalizeProject(project: Project): Project {
  return {
    ...project,
    knownSkills: Array.isArray(project.knownSkills) ? project.knownSkills : [],
    tasks: Array.isArray(project.tasks)
      ? project.tasks.map((task) => {
          const fallback = getDefaultTaskGuide(task.title, task.requirementId);
          return {
            ...task,
            howToSteps: task.howToSteps?.length ? task.howToSteps : fallback.howToSteps,
            acceptanceCriteria: task.acceptanceCriteria || fallback.acceptanceCriteria,
          };
        })
      : [],
  };
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const parsed = JSON.parse(saved) as AppState;
    return {
      ...createInitialState(),
      ...parsed,
      projects: Array.isArray(parsed.projects) ? parsed.projects.map(normalizeProject) : createInitialState().projects,
    };
  } catch {
    return createInitialState();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      publicProjects,
      currentProject: state.projects.find((project) => project.id === state.currentProjectId) ?? null,
      selectProject(projectId) {
        setState((current) => ({ ...current, currentProjectId: projectId }));
      },
      createProject(project) {
        setState((current) => ({
          ...current,
          projects: [normalizeProject(project), ...current.projects],
          currentProjectId: project.id,
        }));
      },
      updateProject(projectId, changes) {
        setState((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? { ...project, ...changes, updatedAt: "Vừa cập nhật" }
              : project
          ),
        }));
      },
      deleteProject(projectId) {
        setState((current) => ({
          ...current,
          projects: current.projects.filter((project) => project.id !== projectId),
          currentProjectId: current.currentProjectId === projectId ? null : current.currentProjectId,
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
          responses: current.responses.map((response) =>
            response.id === responseId ? { ...response, ...changes } : response
          ),
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
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
