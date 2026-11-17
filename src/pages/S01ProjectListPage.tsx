import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleDashed, Clock3, Code2, Filter, FolderOpen, Search, Sparkles, UsersRound } from "lucide-react";
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

const routeByScreen = { S02: "setup", S03: "requirements", S04: "technology", S05: "planning", S06: "progress", S07: "review", S08: "result" } as const;
const stepLabels = { S02: "Khởi tạo dự án", S03: "Xác định yêu cầu", S04: "Chọn công nghệ", S05: "Kế hoạch & phân công", S06: "Theo dõi tiến độ", S07: "Kiểm tra hoàn thiện", S08: "Kết quả dự án" } as const;

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const progress = getProjectProgress(project);
  const displayStatus = getProjectDisplayStatus(project);
  const technologies = [...new Set([project.technologies.frontend, project.technologies.backend, project.technologies.database].filter(Boolean))].join(" + ");
  return (
    <article className="project-card">
      <div className="project-card-top"><span className={`status-badge status-${displayStatus}`}>{displayStatus === "completed" ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}{statusLabels[displayStatus]}</span></div>
      <button className="project-card-main" type="button" onClick={onOpen}><span className="project-icon"><FolderOpen /></span><h2>{project.name}</h2><p>{project.description}</p>{technologies && <span className="project-technologies"><Code2 size={14} /> {technologies}</span>}</button>
      <div className="project-progress"><div><span>Tiến độ</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      <div className="project-meta"><span><Clock3 size={14} /> {project.updatedAt}</span><span><UsersRound size={14} /> {project.assigneeNames || "Chưa phân công"}</span></div>
      <button className="card-continue" type="button" onClick={onOpen}>Tiếp tục tại {stepLabels[project.currentScreen]} <ArrowRight size={16} /></button>
    </article>
  );
}

export function ProjectListPage() {
  const { state, selectProject, setReturnTo } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
  const navigate = useNavigate();

  useEffect(() => { selectProject(null); }, []);

  const projects = useMemo(() => state.projects.filter((project) => {
    const matchesQuery = `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "all" || getProjectDisplayStatus(project) === filter);
  }), [state.projects, query, filter]);

  const openProject = (project: Project) => {
    selectProject(project.id);
    navigate(`/projects/${project.id}/${routeByScreen[project.currentScreen]}`);
  };

  const openAnonymous = () => {
    setReturnTo("/projects");
    navigate("/support/anonymous");
  };

  return (
    <main className="list-page page-container wide">
      <PageHeading eyebrow="Không gian làm việc" title="Dự án của tôi" description="Tiếp tục một dự án đang làm hoặc bắt đầu từ một ý tưởng mới." actions={<div className="heading-actions"><button className="button support-outline" type="button" onClick={openAnonymous}><Sparkles size={18} /> Chia sẻ ẩn danh</button><button className="button primary" type="button" onClick={() => navigate("/projects/new")}>+ Tạo dự án mới</button></div>} />
      <section className="list-toolbar" aria-label="Tìm và lọc dự án">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên dự án..." /></label>
        <DropdownSelect value={filter} onChange={setFilter} ariaLabel="Lọc theo trạng thái" icon={<Filter size={17} />} options={[{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(statusLabels).map(([value, label]) => ({ value: value as ProjectStatus, label }))]} />
      </section>
      {projects.length ? <section className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => openProject(project)} />)}</section> : <EmptyState icon={<FolderOpen />} title="Không tìm thấy dự án" description="Thử đổi bộ lọc hoặc tạo một dự án mới." action={<button className="button primary" type="button" onClick={() => navigate("/projects/new")}>+ Tạo dự án mới</button>} />}
    </main>
  );
}
