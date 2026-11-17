import {
  Check,
  Code2,
  Compass,
  Database,
  ExternalLink,
  GitCompareArrows,
  Info,
  Server,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionBar, DropdownSelect, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { TechnologyChoices } from "../types";
import {
  findSimilarPublicProjects,
  getAllKnownSkills,
  getSuggestedRoadmap,
  getTechnologyRecommendations,
} from "../utils/project";

const groupIcons = {
  frontend: Code2,
  backend: Server,
  database: Database,
  hosting: ExternalLink,
} as const;

export function TechnologyPage({ projectId }: { projectId: string }) {
  const { state, publicProjects, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const [choices, setChoices] = useState<TechnologyChoices>(project.technologies);
  const navigate = useNavigate();

  const knownSkills = useMemo(() => getAllKnownSkills(project), [project]);
  const { bestMatch: referenceProject, ranked } = useMemo(
    () => findSimilarPublicProjects(project, publicProjects),
    [project, publicProjects]
  );

  const recommendedGroups = useMemo(
    () => getTechnologyRecommendations(project, referenceProject),
    [project, referenceProject]
  );

  const roadmapSteps = useMemo(
    () => getSuggestedRoadmap({ ...project, technologies: choices }, referenceProject),
    [project, choices, referenceProject]
  );

  const saveChoices = (next: TechnologyChoices) => {
    setChoices(next);
    updateProject(projectId, { technologies: next });
  };

  const applyReferenceStack = () => {
    if (!referenceProject) return;
    saveChoices({
      ...choices,
      frontend: referenceProject.technologies.frontend,
      backend: referenceProject.technologies.backend,
      database: referenceProject.technologies.database,
      hosting: referenceProject.technologies.hosting,
    });
  };

  const continueFlow = () => {
    if (!choices.frontend || !choices.hosting) return;
    updateProject(projectId, {
      technologies: choices,
      referenceProjectId: referenceProject?.id,
      currentScreen: "S05",
    });
    navigate(`/projects/${projectId}/planning`);
  };

  const selectedSummary = recommendedGroups
    .map((group) => choices[group.key] && `${group.label}: ${choices[group.key]}`)
    .filter(Boolean)
    .join(" · ");

  const mustCount = project.requirements.filter((item) => item.priority === "must").length;

  return (
    <>
      <PageHeading
        eyebrow="Lựa chọn công nghệ"
        title="Chọn công nghệ & lộ trình phù hợp"
        description="Đề xuất được đối chiếu từ dự án tương tự, kiến thức sẵn có của nhóm và thời hạn thực hiện."
      />

      <div className="inline-alert info">
        <Info />
        <div>
          <strong>
            Gợi ý dựa trên kiến thức sẵn có, thời hạn ({project.expectedDuration || "1–2 tháng"}) &amp; dự án tương tự
          </strong>
          <p>
            Với {mustCount} tính năng bắt buộc và nền tảng đã biết{" "}
            <strong>
              {knownSkills.length ? knownSkills.join(", ") : "chưa khai báo"}
            </strong>
            {referenceProject ? (
              <>
                , đối chiếu cùng dự án <strong>“{referenceProject.name}”</strong> gợi ý ưu tiên bộ công nghệ vừa sức để kịp tiến độ.
              </>
            ) : (
              "."
            )}
          </p>
        </div>
        {!knownSkills.length && (
          <button
            type="button"
            onClick={() => navigate(`/projects/${projectId}/setup`)}
          >
            Thêm kiến thức sẵn có →
          </button>
        )}
      </div>

      {referenceProject && (
        <section className="tech-compare-panel" aria-label="Đối chiếu công nghệ và lộ trình">
          <div className="reference-compare-header">
            <div className="reference-compare-title">
              <span className="reference-badge">
                <GitCompareArrows size={15} /> Đối chiếu dự án tương tự
              </span>
              <h2>{referenceProject.name}</h2>
              <p>
                {referenceProject.authorGroup} · {referenceProject.projectType} · Thời gian:{" "}
                {referenceProject.expectedDuration}
              </p>
            </div>
            <div className="reference-compare-controls">
              <DropdownSelect
                value={referenceProject.id}
                onChange={(nextId) => updateProject(projectId, { referenceProjectId: nextId })}
                ariaLabel="Đổi dự án tương tự để đối chiếu"
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
                onClick={applyReferenceStack}
              >
                <Sparkles size={15} /> Dùng bộ công nghệ này
              </button>
            </div>
          </div>

          <div className="tech-compare-table">
            <div className="tech-compare-head">
              <span>Hạng mục</span>
              <span>Lựa chọn hiện tại của bạn</span>
              <span>Dự án tương tự ({referenceProject.name})</span>
            </div>
            {recommendedGroups.map((group) => (
              <div className="tech-compare-row" key={group.key}>
                <strong>{group.label}</strong>
                <span>{choices[group.key] || "Chưa chọn"}</span>
                <span>{referenceProject.technologies[group.key] || "Không dùng"}</span>
              </div>
            ))}
          </div>

          {referenceProject.technologies.note && (
            <p className="public-tech-note">
              <strong>Kinh nghiệm từ nhóm thực hiện:</strong> {referenceProject.technologies.note}
            </p>
          )}

          <div className="roadmap-suggest-box">
            <div className="roadmap-suggest-head">
              <Compass size={17} />
              <strong>Lộ trình &amp; Các bước bắt đầu đề xuất</strong>
            </div>
            <ol className="roadmap-list compact">
              {roadmapSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <p className="selected-technology">
        <strong>Đã chọn:</strong> {selectedSummary || "Chưa có lựa chọn"}
      </p>

      <div className="technology-groups">
        {recommendedGroups.map((group) => {
          const Icon = groupIcons[group.key];
          return (
            <section className="technology-group" key={group.key}>
              <header>
                <span>
                  <Icon />
                </span>
                <div>
                  <h2>{group.label}</h2>
                  <p>Chọn một phương án</p>
                </div>
              </header>
              <div className="technology-options">
                {group.options.map((option) => {
                  const selected = choices[group.key] === option.name;
                  return (
                    <button
                      className={`technology-card ${selected ? "selected" : ""}`}
                      type="button"
                      key={option.name}
                      onClick={() => saveChoices({ ...choices, [group.key]: option.name })}
                    >
                      <span className="radio-visual">{selected && <Check size={14} />}</span>
                      <div>
                        <strong>{option.name}</strong>
                        {option.recommended && <small>Đề xuất</small>}
                        <p>{option.detail}</p>
                        <em>Mức phù hợp: {option.suitability}</em>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <label className="decision-note">
        <span>
          <StickyNote size={18} /> Ghi chú quyết định
        </span>
        <textarea
          value={choices.note ?? ""}
          onChange={(event) => saveChoices({ ...choices, note: event.target.value })}
          placeholder="Vì sao các lựa chọn này phù hợp với kiến thức và thời hạn của nhóm?"
          rows={3}
        />
      </label>

      <ActionBar
        nextLabel="Tiếp tục: Kế hoạch & phân công"
        backLabel="Quay lại xác định yêu cầu"
        disabled={!choices.frontend || !choices.hosting}
        onBack={() => navigate(`/projects/${projectId}/requirements`)}
        onNext={continueFlow}
      />
    </>
  );
}
