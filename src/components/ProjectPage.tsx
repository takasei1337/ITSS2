import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useApp } from "../store/AppContext";
import type { ScreenId } from "../types";
import { ProjectStepper } from "./ProjectStepper";

export function ProjectPage({ screen, children }: { screen: ScreenId; children: (projectId: string) => ReactNode }) {
  const { projectId } = useParams();
  const { state, selectProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId);

  useEffect(() => {
    if (projectId && project) {
      selectProject(projectId);
    }
  }, [projectId]);

  if (!projectId || !project) return <Navigate to="/projects" replace />;

  return (
    <main className="project-main">
      <ProjectStepper project={project} current={screen} />
      <div className="page-container">{children(projectId)}</div>
    </main>
  );
}
