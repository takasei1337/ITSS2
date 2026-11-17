import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  GitCompareArrows,
  ListChecks,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ActionBar, DropdownSelect, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Project, Requirement, RequirementPriority } from "../types";
import { findSimilarPublicProjects, suggestedRequirements } from "../utils/project";

const columns: Array<{ id: RequirementPriority; label: string; description: string }> = [
  { id: "must", label: "Phải có", description: "Yêu cầu cốt lõi của dự án" },
  { id: "should", label: "Nên có", description: "Quan trọng nhưng có thể làm sau" },
  { id: "could", label: "Có thể có", description: "Tốt nếu đủ thời gian" },
  { id: "wont", label: "Chưa làm", description: "Chủ động để ngoài phạm vi" },
];

const priorityLabelMap: Record<RequirementPriority, string> = {
  must: "Phải có",
  should: "Nên có",
  could: "Có thể có",
  wont: "Chưa làm",
};

export function RequirementsPage({ projectId }: { projectId: string }) {
  const { state, publicProjects, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const [requirements, setRequirements] = useState<Requirement[]>(
    project.requirements.length ? project.requirements : structuredClone(suggestedRequirements)
  );
  const [draft, setDraft] = useState("");
  const [draftPriority, setDraftPriority] = useState<RequirementPriority>("must");
  const navigate = useNavigate();

  const mustCount = useMemo(
    () => requirements.filter((item) => item.priority === "must").length,
    [requirements]
  );

  const { bestMatch, ranked } = useMemo(
    () => findSimilarPublicProjects(project, publicProjects),
    [project, publicProjects]
  );

  const referenceProject: Project | undefined = bestMatch;

  const priorityOptions = columns.map((option) => ({ value: option.id, label: option.label }));

  const commitRequirements = (next: Requirement[]) => {
    setRequirements(next);
    updateProject(projectId, { requirements: next });
  };

  const addRequirement = () => {
    const title = draft.trim();
    if (!title) return;
    commitRequirements([
      ...requirements,
      { id: `req-${Date.now()}`, title, priority: draftPriority },
    ]);
    setDraft("");
  };

  const importRequirement = (req: Requirement) => {
    const exists = requirements.some(
      (item) => item.title.trim().toLowerCase() === req.title.trim().toLowerCase()
    );
    if (exists) return;
    commitRequirements([
      ...requirements,
      {
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: req.title,
        description: req.description,
        priority: req.priority,
      },
    ]);
  };

  const updateRequirement = (id: string, changes: Partial<Requirement>) =>
    commitRequirements(
      requirements.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

  const removeRequirement = (id: string) =>
    commitRequirements(requirements.filter((item) => item.id !== id));

  const toggleSuggestion = (suggestion: Requirement) => {
    const selected = requirements.some((item) => item.title === suggestion.title);
    commitRequirements(
      selected
        ? requirements.filter((item) => item.title !== suggestion.title)
        : [...requirements, { ...suggestion }]
    );
  };

  const continueFlow = () => {
    if (!requirements.length) return;
    updateProject(projectId, {
      requirements,
      referenceProjectId: referenceProject?.id,
      currentScreen: "S04",
    });
    navigate(`/projects/${projectId}/technology`);
  };

  return (
    <>
      <PageHeading
        eyebrow="Yêu cầu dự án"
        title="Xác định yêu cầu"
        description="Chọn các yêu cầu cần thiết, đối chiếu với dự án tương tự và sắp xếp mức độ ưu tiên."
      />

      <section className="context-strip">
        <Target size={20} />
        <div>
          <strong>Vấn đề đang giải quyết</strong>
          <p>{project.problemStatement}</p>
        </div>
      </section>

      {referenceProject && (
        <section className="reference-compare-card" aria-label="Đối chiếu với dự án tương tự">
          <div className="reference-compare-header">
            <div className="reference-compare-title">
              <span className="reference-badge">
                <GitCompareArrows size={15} /> Đối chiếu dự án tương tự
              </span>
              <h2>{referenceProject.name}</h2>
              <p>
                {referenceProject.authorGroup} · {referenceProject.projectType} · Công nghệ:{" "}
                {[
                  referenceProject.technologies.frontend,
                  referenceProject.technologies.backend,
                  referenceProject.technologies.database,
                ]
                  .filter(Boolean)
                  .join(" + ")}
              </p>
            </div>
            <div className="reference-compare-controls">
              <DropdownSelect
                value={referenceProject.id}
                onChange={(nextId) => updateProject(projectId, { referenceProjectId: nextId })}
                ariaLabel="Chọn dự án công khai để đối chiếu"
                size="compact"
                minMenuWidth={240}
                options={ranked.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
              <button
                type="button"
                className="button secondary small-btn"
                onClick={() => navigate(`/projects/public/${referenceProject.id}`)}
              >
                <Eye size={15} /> Xem chi tiết
              </button>
            </div>
          </div>

          <div className="reference-compare-grid">
            <div className="reference-col">
              <h3>Yêu cầu từ dự án tương tự</h3>
              <ul className="reference-req-list">
                {referenceProject.requirements.map((req) => {
                  const alreadyAdded = requirements.some(
                    (item) => item.title.trim().toLowerCase() === req.title.trim().toLowerCase()
                  );
                  return (
                    <li key={req.id}>
                      <div>
                        <strong>{req.title}</strong>
                        <small>{priorityLabelMap[req.priority]}</small>
                        {req.description && <p>{req.description}</p>}
                      </div>
                      {alreadyAdded ? (
                        <span className="added-pill">
                          <CheckCircle2 size={14} /> Đã có
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="button secondary small-btn"
                          onClick={() => importRequirement(req)}
                        >
                          <Plus size={14} /> Thêm vào dự án
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {referenceProject.starterRoadmap && (
              <div className="reference-col">
                <h3>Các bước bắt đầu gợi ý</h3>
                <ol className="reference-roadmap-list">
                  {referenceProject.starterRoadmap.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="suggestion-card">
        <h2>Gợi ý để bắt đầu</h2>
        <p>Các nhóm làm đề tài giống bạn thường bắt đầu với: đăng nhập, tạo dự án, giao việc, theo dõi tiến độ.</p>
        <div className="suggestion-options">
          {suggestedRequirements.map((item) => {
            const checked = requirements.some((requirement) => requirement.title === item.title);
            return (
              <label className={checked ? "selected" : ""} key={item.id}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSuggestion(item)}
                />
                <CheckCircle2 />
                <span>{item.title}</span>
              </label>
            );
          })}
        </div>
      </section>

      {mustCount > 5 && (
        <div className="inline-alert warning">
          <AlertTriangle />
          <div>
            <strong>Phạm vi “Phải có” đang khá lớn</strong>
            <p>Thử chuyển một số yêu cầu sang “Nên có” để dự án dễ triển khai hơn.</p>
          </div>
        </div>
      )}

      <section className="requirement-add">
        <div className="requirement-add-field">
          <span className="requirement-add-label">Thêm một tính năng hoặc nhu cầu</span>
          <div className="requirement-add-controls">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addRequirement())}
              placeholder="Ví dụ: Tạo công việc mới"
              aria-label="Tên tính năng hoặc nhu cầu mới"
            />
            <DropdownSelect
              ariaLabel="Mức ưu tiên của yêu cầu mới"
              value={draftPriority}
              onChange={setDraftPriority}
              options={priorityOptions}
              className="requirement-priority-select"
            />
            <button className="button primary" type="button" onClick={addRequirement}>
              <Plus size={17} /> Thêm
            </button>
          </div>
        </div>
      </section>

      <div className="requirements-board">
        {columns.map((column) => (
          <section className={`requirement-column priority-${column.id}`} key={column.id}>
            <header>
              <div>
                <h2>{column.label}</h2>
                <p>{column.description}</p>
              </div>
              <span>{requirements.filter((item) => item.priority === column.id).length}</span>
            </header>
            <div className="requirement-list">
              {requirements
                .filter((item) => item.priority === column.id)
                .map((item) => (
                  <article className="requirement-card" key={item.id}>
                    <input
                      aria-label="Tên yêu cầu"
                      value={item.title}
                      onChange={(event) => updateRequirement(item.id, { title: event.target.value })}
                    />
                    <textarea
                      aria-label="Mô tả yêu cầu"
                      value={item.description ?? ""}
                      onChange={(event) => updateRequirement(item.id, { description: event.target.value })}
                      placeholder="Mô tả ngắn..."
                      rows={2}
                    />
                    <div className="requirement-card-footer">
                      <DropdownSelect
                        ariaLabel="Mức ưu tiên"
                        value={item.priority}
                        onChange={(nextPriority) => updateRequirement(item.id, { priority: nextPriority })}
                        options={priorityOptions}
                        size="compact"
                        fullWidth
                        minMenuWidth={155}
                      />
                      <button
                        className="requirement-delete"
                        type="button"
                        aria-label={`Xóa ${item.title}`}
                        onClick={() => removeRequirement(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>

      <section className="scope-summary">
        <div>
          <CheckCircle2 />
          <span>
            <strong>{mustCount}</strong> yêu cầu cốt lõi
          </span>
        </div>
        <div>
          <ListChecks />
          <span>
            <strong>{requirements.filter((item) => item.priority !== "must").length}</strong> yêu cầu ưu tiên sau
          </span>
        </div>
      </section>

      <ActionBar
        nextLabel="Tiếp tục: Chọn công nghệ"
        backLabel="Quay lại khởi tạo dự án"
        disabled={!requirements.length}
        onBack={() => navigate(`/projects/${projectId}/setup`)}
        onNext={continueFlow}
      />
    </>
  );
}
