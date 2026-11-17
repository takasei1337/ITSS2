import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project, ScreenId } from "../types";

const steps: Array<{ id: ScreenId; label: string; path: string }> = [
  { id: "S03", label: "Yêu cầu", path: "requirements" },
  { id: "S04", label: "Công nghệ", path: "technology" },
  { id: "S05", label: "Kế hoạch", path: "planning" },
  { id: "S06", label: "Tiến độ", path: "progress" },
  { id: "S07", label: "Hoàn thiện", path: "review" },
  { id: "S08", label: "Kết quả", path: "result" },
];

export function ProjectStepper({ project, current }: { project: Project; current: ScreenId }) {
  const currentIndex = steps.findIndex((step) => step.id === current);
  const maxIndex = Math.max(currentIndex, steps.findIndex((step) => step.id === project.currentScreen));

  return (
    <nav className="project-stepper" aria-label="Tiến trình dự án">
      <div className="mobile-step-progress">
        <div><span>Bước {currentIndex + 1}/6</span><strong>{steps[currentIndex]?.label}</strong></div>
        <div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={6} aria-valuenow={currentIndex + 1}><span style={{ width: `${((currentIndex + 1) / 6) * 100}%` }} /></div>
      </div>
      <ol>
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const currentStep = index === currentIndex;
          const available = index <= maxIndex;
          const content = <><span className="step-dot">{completed ? <Check size={15} /> : index + 1}</span><span>{step.label}</span></>;
          return (
            <li className={`${completed ? "completed" : ""} ${currentStep ? "current" : ""} ${!available ? "locked" : ""}`} key={step.id}>
              {available ? <Link aria-current={currentStep ? "step" : undefined} to={`/projects/${project.id}/${step.path}`}>{content}</Link> : <span>{content}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
