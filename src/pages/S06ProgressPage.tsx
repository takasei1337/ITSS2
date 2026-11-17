import { AlertCircle, CheckCircle2, Clock3, Filter, MessageCircleHeart, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionBar, DropdownSelect, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Task } from "../types";
import { calculateTaskProgress } from "../utils/project";

export function ProgressPage({ projectId }: { projectId: string }) {
  const { state, updateProject, setReturnTo } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [query, setQuery] = useState("");
  const [assignee, setAssignee] = useState("all");
  const navigate = useNavigate();

  const visibleTasks = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()) && (assignee === "all" || task.assigneeName === assignee)), [tasks, query, assignee]);
  const progress = calculateTaskProgress(tasks);
  const done = tasks.filter((task) => task.status === "done").length;
  const assignees = [...new Set(tasks.map((task) => task.assigneeName).filter(Boolean))] as string[];

  const saveTasks = (next: Task[]) => {
    const nextProgress = calculateTaskProgress(next);
    setTasks(next);
    updateProject(projectId, { tasks: next, status: next.some((task) => task.blocked) ? "blocked" : nextProgress === 100 ? "review" : "in_progress" });
  };

  const toggleTask = (id: string, completed: boolean) => saveTasks(tasks.map((task) => task.id === id ? { ...task, status: completed ? "done" : "todo", blocked: completed ? false : task.blocked } : task));

  const openAnonymous = () => {
    setReturnTo(`/projects/${projectId}/progress`);
    navigate("/support/anonymous");
  };

  const continueFlow = () => {
    updateProject(projectId, { tasks, currentScreen: "S07", status: "review" });
    navigate(`/projects/${projectId}/review`);
  };

  return (
    <>
      <PageHeading eyebrow="Theo dõi tiến độ" title="Dự án đang tiến triển thế nào?" description="Tích hoàn thành từng đầu việc để cập nhật tiến độ ngay tại chỗ." />
      <section className="progress-overview">
        <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span><strong>{progress}%</strong><small>hoàn thành</small></span></div>
        <div className="progress-stats"><div><strong>{done}/{tasks.length}</strong><span>Task hoàn thành</span></div><div><strong>{tasks.length - done}</strong><span>Task còn lại</span></div><div><strong>{tasks.filter((task) => task.blocked).length}</strong><span>Đang bị chặn</span></div></div>
        <div className="progress-copy"><h2>{progress < 40 ? "Dự án đang ở giai đoạn đầu" : progress < 80 ? "Bạn đang đi đúng hướng" : "Dự án gần hoàn thành"}</h2><p>Mỗi đầu việc hoàn thành sẽ được phản ánh ngay trên thanh tiến độ.</p></div>
      </section>
      <button className="anonymous-help-cta" type="button" onClick={openAnonymous}><MessageCircleHeart /> Đang gặp khó khăn / mất phương hướng? Chia sẻ ẩn danh <span>→</span></button>
      <section className="board-toolbar"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công việc..." /></label><DropdownSelect value={assignee} onChange={setAssignee} ariaLabel="Lọc theo người phụ trách" icon={<Filter size={16} />} options={[{ value: "all", label: "Tất cả người phụ trách" }, ...assignees.map((name) => ({ value: name, label: name }))]} /></section>
      <section className="progress-task-list">
        {visibleTasks.map((task) => (
          <label className={`progress-task ${task.status === "done" ? "completed" : ""}`} key={task.id}>
            <input type="checkbox" checked={task.status === "done"} onChange={(event) => toggleTask(task.id, event.target.checked)} />
            <span className="progress-task-check"><CheckCircle2 /></span>
            <span className="progress-task-copy"><strong>{task.title}</strong><small><UserRound size={14} /> {task.assigneeName || "Chưa phân công"}{task.dueDate && <><Clock3 size={14} /> {new Date(task.dueDate).toLocaleDateString("vi-VN")}</>}</small></span>
            {task.blocked && <span className="blocked-label"><AlertCircle size={13} /> Bị chặn</span>}
          </label>
        ))}
      </section>
      <ActionBar nextLabel="Kiểm tra hoàn thiện" backLabel="Quay lại kế hoạch & phân công" onBack={() => navigate(`/projects/${projectId}/planning`)} onNext={continueFlow} extra={<button className="button link" type="button" onClick={() => navigate(`/projects/${projectId}/requirements`)}>Điều chỉnh yêu cầu</button>} />
    </>
  );
}
