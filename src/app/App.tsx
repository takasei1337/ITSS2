import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { ProjectPage } from "../components/ProjectPage";
import { ProjectListPage } from "../pages/S01ProjectListPage";
import { ProjectSetupPage } from "../pages/S02ProjectSetupPage";
import { PublicProjectDetailPage } from "../pages/PublicProjectDetailPage";
import { RequirementsPage } from "../pages/S03RequirementsPage";
import { TechnologyPage } from "../pages/S04TechnologyPage";
import { PlanningPage } from "../pages/S05PlanningPage";
import { ProgressPage } from "../pages/S06ProgressPage";
import { CompletionPage } from "../pages/S07CompletionPage";
import { ResultPage } from "../pages/S08ResultPage";
import { AnonymousSharePage } from "../pages/S09AnonymousSharePage";
import { EmpathyResponsesPage } from "../pages/S10EmpathyResponsesPage";
import { UnderstandingRatingPage } from "../pages/S11UnderstandingRatingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/new" element={<ProjectSetupPage />} />
        <Route path="projects/public/:projectId" element={<PublicProjectDetailPage />} />
        <Route path="projects/:projectId/setup" element={<ProjectSetupPage />} />
        <Route path="projects/:projectId/requirements" element={<ProjectPage screen="S03">{(id) => <RequirementsPage projectId={id} />}</ProjectPage>} />
        <Route path="projects/:projectId/technology" element={<ProjectPage screen="S04">{(id) => <TechnologyPage projectId={id} />}</ProjectPage>} />
        <Route path="projects/:projectId/planning" element={<ProjectPage screen="S05">{(id) => <PlanningPage projectId={id} />}</ProjectPage>} />
        <Route path="projects/:projectId/progress" element={<ProjectPage screen="S06">{(id) => <ProgressPage projectId={id} />}</ProjectPage>} />
        <Route path="projects/:projectId/review" element={<ProjectPage screen="S07">{(id) => <CompletionPage projectId={id} />}</ProjectPage>} />
        <Route path="projects/:projectId/result" element={<ProjectPage screen="S08">{(id) => <ResultPage projectId={id} />}</ProjectPage>} />
        <Route path="support/anonymous" element={<AnonymousSharePage />} />
        <Route path="support/anonymous/responses" element={<EmpathyResponsesPage />} />
        <Route path="support/anonymous/rating" element={<UnderstandingRatingPage />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Route>
    </Routes>
  );
}
