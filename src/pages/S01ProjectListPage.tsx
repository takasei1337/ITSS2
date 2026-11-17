import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Code2,
  Eye,
  Filter,
  FolderOpen,
  GitCompareArrows,
  Globe,
  Search,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownSelect, EmptyState, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Project, ProjectStatus } from "../types";
import { getProjectDisplayStatus, getProjectProgress } from "../utils/project";

const statusLabels: Record<ProjectStatus, string> = {
  setup: "Đang thiết lập",
  in_progress: "Đang thực hiện",
  blocked: "Bị chặn",
  review: "Cần kiểm tra",
  completed: "Hoàn thành",
};

const routeByScreen = {
  S02: "setup",
  S03: "requirements",
  S04: "technology",
  S05: "planning",
  S06: "progress",
  S07: "review",
  S08: "result",
} as const;

const stepLabels = {
  S02: "Khởi tạo dự án",
  S03: "Xác định yêu cầu",
  S04: "Chọn công nghệ",
  S05: "Kế hoạch & phân công",
  S06: "Theo dõi tiến độ",
  S07: "Kiểm tra hoàn thiện",
  S08: "Kết quả dự án",
} as const;

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const progress = getProjectProgress(project);
  const displayStatus = getProjectDisplayStatus(project);
  const technologies = [
    ...new Set([project.technologies.frontend, project.technologies.backend, project.technologies.database].filter(Boolean)),
  ].join(" + ");

  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className={`status-badge status-${displayStatus}`}>
          {displayStatus === "completed" ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
          {statusLabels[displayStatus]}
        </span>
        <button
          className="card-delete"
          type="button"
          aria-label={`Xóa ${project.name}`}
          title="Xóa dự án"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
      </div>
      <button className="project-card-main" type="button" onClick={onOpen}>
        <span className="project-icon">
          <FolderOpen />
        </span>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        {technologies && (
          <span className="project-technologies">
            <Code2 size={14} /> {technologies}
          </span>
        )}
      </button>
      <div className="project-progress">
        <div>
          <span>Tiến độ</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="project-meta">
        <span>
          <Clock3 size={14} /> {project.updatedAt}
        </span>
        <span>
          <UsersRound size={14} /> {project.assigneeNames || "Chưa phân công"}
        </span>
      </div>
      <button className="card-continue" type="button" onClick={onOpen}>
        Tiếp tục tại {stepLabels[project.currentScreen]} <ArrowRight size={16} />
      </button>
    </article>
  );
}

function PublicProjectCard({
  project,
  onView,
  onCompare,
}: {
  project: Project;
  onView: () => void;
  onCompare: () => void;
}) {
  const progress = getProjectProgress(project);
  const displayStatus = getProjectDisplayStatus(project);
  const technologies = [
    ...new Set(
      [
        project.technologies.frontend,
        project.technologies.backend,
        project.technologies.database,
        project.technologies.hosting,
      ].filter(Boolean)
    ),
  ].join(" + ");

  return (
    <article className="project-card public-project-card">
      <div className="project-card-top">
        <span className="public-badge">
          <Eye size={13} /> Công khai · Chỉ xem
        </span>
        <span className={`status-badge status-${displayStatus}`}>{statusLabels[displayStatus]}</span>
      </div>
      <button className="project-card-main" type="button" onClick={onView}>
        <span className="project-icon public-icon">
          <Globe size={20} />
        </span>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        {technologies && (
          <span className="project-technologies">
            <Code2 size={14} /> {technologies}
          </span>
        )}
      </button>
      <div className="project-progress">
        <div>
          <span>Tiến độ tham khảo</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="project-meta">
        <span>
          <UsersRound size={14} /> {project.authorGroup || "Nhóm khác"}
        </span>
        <span>
          <Clock3 size={14} /> {project.expectedDuration}
        </span>
      </div>
      <div className="public-card-actions">
        <button className="button secondary small-btn" type="button" onClick={onView}>
          <Eye size={15} /> Xem chi tiết
        </button>
        <button className="button primary small-btn" type="button" onClick={onCompare}>
          <GitCompareArrows size={15} /> Đối chiếu
        </button>
      </div>
    </article>
  );
}

export function ProjectListPage() {
  const { state, publicProjects, selectProject, updateProject, deleteProject, setReturnTo } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [comparingPublic, setComparingPublic] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    selectProject(null);
  }, []);

  const projects = useMemo(
    () =>
      state.projects.filter((project) => {
        const matchesQuery = `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (filter === "all" || getProjectDisplayStatus(project) === filter);
      }),
    [state.projects, query, filter]
  );

  const visiblePublicProjects = useMemo(
    () =>
      publicProjects.filter((project) => {
        const matchesQuery = `${project.name} ${project.description} ${project.technologies.frontend ?? ""} ${project.field}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (filter === "all" || getProjectDisplayStatus(project) === filter);
      }),
    [publicProjects, query, filter]
  );

  const openProject = (project: Project) => {
    selectProject(project.id);
    navigate(`/projects/${project.id}/${routeByScreen[project.currentScreen]}`);
  };

  const startCompareWith = (publicProject: Project) => {
    if (state.projects.length === 0) {
      navigate(`/projects/new?ref=${publicProject.id}`);
      return;
    }
    if (state.projects.length === 1) {
      const target = state.projects[0];
      updateProject(target.id, { referenceProjectId: publicProject.id });
      selectProject(target.id);
      navigate(`/projects/${target.id}/requirements`);
      return;
    }
    setComparingPublic(publicProject);
  };

  const applyCompareTarget = (target: Project, step: "requirements" | "technology") => {
    if (!comparingPublic) return;
    updateProject(target.id, { referenceProjectId: comparingPublic.id });
    selectProject(target.id);
    setComparingPublic(null);
    navigate(`/projects/${target.id}/${step}`);
  };

  const openAnonymous = () => {
    setReturnTo("/projects");
    navigate("/support/anonymous");
  };

  return (
    <main className="list-page page-container wide">
      <PageHeading
        eyebrow="Không gian làm việc"
        title="Dự án của tôi"
        description="Tiếp tục dự án của nhóm bạn, bắt đầu từ ý tưởng mới hoặc đối chiếu với các dự án công khai để chọn hướng triển khai phù hợp."
        actions={
          <div className="heading-actions">
            <button className="button support-outline" type="button" onClick={openAnonymous}>
              <Sparkles size={18} /> Chia sẻ ẩn danh
            </button>
            <button className="button primary" type="button" onClick={() => navigate("/projects/new")}>
              + Tạo dự án mới
            </button>
          </div>
        }
      />

      <section className="list-toolbar" aria-label="Tìm và lọc dự án">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên, mô tả hoặc công nghệ..."
          />
        </label>
        <DropdownSelect
          value={filter}
          onChange={setFilter}
          ariaLabel="Lọc theo trạng thái"
          icon={<Filter size={17} />}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            ...Object.entries(statusLabels).map(([value, label]) => ({
              value: value as ProjectStatus,
              label,
            })),
          ]}
        />
      </section>

      {projects.length ? (
        <section className="project-grid" aria-label="Danh sách dự án của tôi">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => openProject(project)}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={<FolderOpen />}
          title="Chưa có dự án phù hợp trong mục Dự án của tôi"
          description="Bạn có thể tạo dự án mới hoặc chọn một dự án công khai bên dưới để tham khảo và đối chiếu."
          action={
            <button className="button primary" type="button" onClick={() => navigate("/projects/new")}>
              + Tạo dự án mới
            </button>
          }
        />
      )}

      <section className="public-projects-section" aria-labelledby="public-projects-heading">
        <header className="section-divider-head">
          <div>
            <span className="eyebrow">Tham khảo &amp; Đối chiếu</span>
            <h2 id="public-projects-heading">Dự án công khai từ các nhóm khác</h2>
            <p>Các dự án mẫu ở chế độ chỉ xem giúp bạn so sánh yêu cầu, bộ công nghệ và các bước bắt đầu phù hợp với đề tài của mình.</p>
          </div>
        </header>

        {visiblePublicProjects.length ? (
          <div className="project-grid">
            {visiblePublicProjects.map((project) => (
              <PublicProjectCard
                key={project.id}
                project={project}
                onView={() => navigate(`/projects/public/${project.id}`)}
                onCompare={() => startCompareWith(project)}
              />
            ))}
          </div>
        ) : (
          <p className="public-empty-note">Không có dự án công khai nào khớp bộ lọc hiện tại.</p>
        )}
      </section>

      {deletingProject && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => event.currentTarget === event.target && setDeletingProject(null)}
        >
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
            <button
              className="dialog-close"
              type="button"
              aria-label="Đóng"
              onClick={() => setDeletingProject(null)}
            >
              <X />
            </button>
            <span className="dialog-icon warning">
              <Trash2 />
            </span>
            <h2 id="delete-project-title">Xóa dự án?</h2>
            <p>Dự án “{deletingProject.name}” sẽ bị xóa khỏi danh sách Dự án của tôi.</p>
            <div className="dialog-actions">
              <button className="button secondary" type="button" onClick={() => setDeletingProject(null)}>
                Hủy
              </button>
              <button
                className="button danger"
                type="button"
                onClick={() => {
                  deleteProject(deletingProject.id);
                  setDeletingProject(null);
                }}
              >
                Xóa dự án
              </button>
            </div>
          </section>
        </div>
      )}

      {comparingPublic && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => event.currentTarget === event.target && setComparingPublic(null)}
        >
          <section className="dialog compare-pick-dialog" role="dialog" aria-modal="true" aria-labelledby="compare-modal-title">
            <button
              className="dialog-close"
              type="button"
              aria-label="Đóng"
              onClick={() => setComparingPublic(null)}
            >
              <X />
            </button>
            <h2 id="compare-modal-title">Đối chiếu “{comparingPublic.name}” với dự án nào?</h2>
            <p>Chọn dự án của bạn và màn hình muốn mở để so sánh trực tiếp.</p>
            <div className="compare-pick-list">
              {state.projects.map((target) => (
                <div className="compare-pick-row" key={target.id}>
                  <div>
                    <strong>{target.name}</strong>
                    <span>{target.projectType} · {target.field}</span>
                  </div>
                  <div className="compare-pick-btns">
                    <button
                      type="button"
                      className="button secondary small-btn"
                      onClick={() => applyCompareTarget(target, "requirements")}
                    >
                      So sánh Yêu cầu
                    </button>
                    <button
                      type="button"
                      className="button primary small-btn"
                      onClick={() => applyCompareTarget(target, "technology")}
                    >
                      So sánh Công nghệ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
