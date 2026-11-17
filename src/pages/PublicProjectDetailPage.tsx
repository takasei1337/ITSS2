import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  Eye,
  GitCompareArrows,
  Layers,
  ListChecks,
  Plus,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Project, RequirementPriority } from "../types";
import { getProjectProgress } from "../utils/project";

const priorityLabels: Record<RequirementPriority, string> = {
  must: "Phải có",
  should: "Nên có",
  could: "Có thể có",
  wont: "Chưa làm",
};

export function PublicProjectDetailPage() {
  const { projectId } = useParams();
  const { state, publicProjects, updateProject, selectProject } = useApp();
  const navigate = useNavigate();
  const [pickTargetOpen, setPickTargetOpen] = useState(false);

  const project = publicProjects.find((item) => item.id === projectId);
  if (!project) return <Navigate to="/projects" replace />;

  const progress = getProjectProgress(project);

  const compareWithProject = (targetProject: Project, destination: "requirements" | "technology" = "requirements") => {
    updateProject(targetProject.id, { referenceProjectId: project.id });
    selectProject(targetProject.id);
    navigate(`/projects/${targetProject.id}/${destination}`);
  };

  const handleCompareClick = () => {
    if (state.projects.length === 0) {
      navigate(`/projects/new?ref=${project.id}`);
      return;
    }
    if (state.projects.length === 1) {
      compareWithProject(state.projects[0], "requirements");
      return;
    }
    setPickTargetOpen(true);
  };

  return (
    <main className="standalone-page page-container">
      <div className="public-readonly-banner" role="status">
        <Eye size={18} />
        <div>
          <strong>Dự án công khai · Chế độ chỉ xem để tham khảo</strong>
          <p>
            {project.authorGroup || "Nhóm sinh viên khác"} · Bạn không thể chỉnh sửa hoặc xóa dự án này, nhưng có thể đối chiếu yêu cầu, công nghệ và lộ trình cho dự án của mình.
          </p>
        </div>
      </div>

      <PageHeading
        eyebrow={`${project.projectType} · ${project.field}`}
        title={project.name}
        description={project.description}
        actions={
          <div className="heading-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() => navigate(`/projects/new?ref=${project.id}`)}
            >
              <Plus size={17} /> Tạo dự án mới từ mẫu này
            </button>
            <button className="button primary" type="button" onClick={handleCompareClick}>
              <GitCompareArrows size={17} /> Đối chiếu với dự án của tôi
            </button>
          </div>
        }
      />

      <section className="result-metrics">
        <div>
          <UsersRound />
          <strong>{project.memberCount}</strong>
          <span>Quy mô nhóm</span>
        </div>
        <div>
          <Clock3 />
          <strong>{project.expectedDuration}</strong>
          <span>Thời gian thực hiện</span>
        </div>
        <div>
          <CheckCircle2 />
          <strong>{progress}%</strong>
          <span>Tiến độ đạt được</span>
        </div>
      </section>

      <div className="result-grid">
        <section className="result-card">
          <header>
            <Layers />
            <h2>Bài toán &amp; Kết quả</h2>
          </header>
          <h3>Vấn đề giải quyết</h3>
          <p>{project.problemStatement}</p>
          <h3>Mục tiêu</h3>
          <p>{project.objective}</p>
          {project.outcomeSummary && (
            <>
              <h3>Kết quả tham khảo</h3>
              <p>{project.outcomeSummary}</p>
            </>
          )}
          {project.knownSkills.length > 0 && (
            <>
              <h3>Kiến thức ban đầu của nhóm</h3>
              <div className="readonly-chip-row">
                {project.knownSkills.map((skill) => (
                  <span className="readonly-chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="result-card">
          <header>
            <Code2 />
            <h2>Công nghệ đã chọn</h2>
          </header>
          <dl className="technology-summary">
            <div>
              <dt>Frontend</dt>
              <dd>{project.technologies.frontend || "Không dùng"}</dd>
            </div>
            <div>
              <dt>Backend</dt>
              <dd>{project.technologies.backend || "Không dùng"}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>{project.technologies.database || "Không dùng"}</dd>
            </div>
            <div>
              <dt>Hosting</dt>
              <dd>{project.technologies.hosting || "Không dùng"}</dd>
            </div>
          </dl>
          {project.technologies.note && (
            <p className="public-tech-note">
              <strong>Lý do lựa chọn:</strong> {project.technologies.note}
            </p>
          )}
        </section>

        {project.starterRoadmap && project.starterRoadmap.length > 0 && (
          <section className="result-card full">
            <header>
              <GitCompareArrows />
              <h2>Lộ trình &amp; Các bước bắt đầu</h2>
            </header>
            <ol className="roadmap-list">
              {project.starterRoadmap.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        <section className="result-card full">
          <header>
            <ListChecks />
            <h2>Yêu cầu cốt lõi &amp; ưu tiên ({project.requirements.length})</h2>
          </header>
          <div className="result-list">
            {project.requirements.map((req) => (
              <div key={req.id}>
                <span className="done">
                  <CheckCircle2 />
                </span>
                <div>
                  <strong>
                    {req.title} <em className={`priority-tag tag-${req.priority}`}>{priorityLabels[req.priority]}</em>
                  </strong>
                  {req.description && <p>{req.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="result-card full">
          <header>
            <CheckCircle2 />
            <h2>Nhiệm vụ mẫu kèm cách làm &amp; tiêu chí hoàn thành</h2>
          </header>
          <div className="public-task-list">
            {project.tasks.map((task) => (
              <article className="public-task-item" key={task.id}>
                <div className="public-task-head">
                  <strong>{task.title}</strong>
                  <span>{task.status === "done" ? "Đã hoàn thành" : "Đang thực hiện"}</span>
                </div>
                {task.howToSteps && task.howToSteps.length > 0 && (
                  <div className="task-guide-block">
                    <small>Cách thực hiện:</small>
                    <ol>
                      {task.howToSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {task.acceptanceCriteria && (
                  <p className="task-criteria-line">
                    <strong>Tiêu chí hoàn thành:</strong> {task.acceptanceCriteria}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="action-bar">
        <div>
          <button className="button ghost" type="button" onClick={() => navigate("/projects")}>
            <ArrowLeft size={18} /> Về danh sách dự án
          </button>
        </div>
        <button className="button primary" type="button" onClick={handleCompareClick}>
          <GitCompareArrows size={18} /> Đối chiếu với dự án của tôi
        </button>
      </div>

      {pickTargetOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => event.currentTarget === event.target && setPickTargetOpen(false)}
        >
          <section className="dialog compare-pick-dialog" role="dialog" aria-modal="true" aria-labelledby="compare-pick-title">
            <h2 id="compare-pick-title">Chọn dự án của bạn để đối chiếu</h2>
            <p>Dự án công khai “{project.name}” sẽ được mở ở phần Xác định yêu cầu và Chọn công nghệ.</p>
            <div className="compare-pick-list">
              {state.projects.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  className="compare-pick-item"
                  onClick={() => compareWithProject(target, "requirements")}
                >
                  <strong>{target.name}</strong>
                  <span>{target.projectType} · {target.field}</span>
                </button>
              ))}
            </div>
            <div className="dialog-actions">
              <button className="button secondary" type="button" onClick={() => setPickTargetOpen(false)}>
                Hủy
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
