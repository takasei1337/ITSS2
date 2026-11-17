import { Plus, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccessibleDateField, ActionBar, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Task, TaskStatus } from "../types";

const statusLabels: Record<TaskStatus, string> = { todo: "Chưa làm", doing: "Đang làm", review: "Chờ kiểm tra", done: "Hoàn thành" };

export function PlanningPage({ projectId }: { projectId: string }) {
  const { state, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const initialTasks = project.tasks.length ? project.tasks : project.requirements.filter((item) => item.priority === "must").map((item, index): Task => ({ id: `task-${Date.now()}-${index}`, requirementId: item.id, title: item.title, assigneeName: project.assigneeNames.split(",")[index % Math.max(project.assigneeNames.split(",").length, 1)]?.trim() || "", status: "todo", priority: index === 0 ? "high" : "medium", dueDate: project.targetDate }));
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();
  const unassigned = useMemo(() => tasks.filter((task) => !task.assigneeName).length, [tasks]);
  const members = project.assigneeNames.split(",").map((name) => name.trim()).filter(Boolean);

  useEffect(() => {
    if (!project.tasks.length && initialTasks.length) updateProject(projectId, { tasks: initialTasks });
  }, []);

  const saveTasks = (next: Task[]) => {
    setTasks(next);
    updateProject(projectId, { tasks: next });
  };

  const updateTask = (id: string, changes: Partial<Task>) => saveTasks(tasks.map((task) => task.id === id ? { ...task, ...changes } : task));
  const addTask = () => { if (!newTitle.trim()) return; saveTasks([...tasks, { id: `task-${Date.now()}`, title: newTitle.trim(), status: "todo", priority: "medium" }]); setNewTitle(""); };

  const continueFlow = () => {
    if (!tasks.length) return;
    updateProject(projectId, { tasks, currentScreen: "S06", status: "in_progress" });
    navigate(`/projects/${projectId}/progress`);
  };

  return (
    <>
      <PageHeading eyebrow="Kế hoạch & phân công" title="Biến yêu cầu thành những việc có thể bắt đầu" description="Mỗi task nên đủ nhỏ, có người phụ trách và thời hạn rõ ràng." />
      <section className="planning-summary"><div><strong>{project.requirements.filter((item) => item.priority === "must").length}</strong><span>Tính năng bắt buộc</span></div><div><strong>{tasks.length}</strong><span>Task đã tạo</span></div><div className={unassigned ? "attention" : ""}><strong>{unassigned}</strong><span>Chưa phân công</span></div></section>
      <section className="task-table-card"><header><div><h2>Danh sách công việc</h2><p>Công việc được gợi ý từ các yêu cầu đã chọn và có thể chỉnh sửa.</p></div></header><div className="task-add"><input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()} placeholder="Thêm công việc mới..." /><button className="button secondary" type="button" onClick={addTask}><Plus size={17} /> Thêm task</button></div><div className="task-table" role="table"><div className="task-row task-head" role="row"><span>Công việc</span><span>Người phụ trách</span><span>Hạn</span><span>Ưu tiên</span><span>Trạng thái</span><span /></div>{tasks.map((task) => <div className="task-row" role="row" key={task.id}><input aria-label="Tên công việc" value={task.title} onChange={(event) => updateTask(task.id, { title: event.target.value })} /><label className="inline-input"><UserRound size={15} /><select aria-label="Người phụ trách" value={task.assigneeName ?? ""} onChange={(event) => updateTask(task.id, { assigneeName: event.target.value })}><option value="">Chưa phân công</option>{members.map((name) => <option key={name} value={name}>{name}</option>)}</select></label><AccessibleDateField value={task.dueDate} onChange={(dueDate) => updateTask(task.id, { dueDate })} label={`Hạn hoàn thành của ${task.title}`} /><select aria-label="Mức ưu tiên" value={task.priority} onChange={(event) => updateTask(task.id, { priority: event.target.value as Task["priority"] })}><option value="low">Thấp</option><option value="medium">Vừa</option><option value="high">Cao</option></select><select aria-label="Trạng thái" value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as TaskStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button className="row-delete" type="button" aria-label={`Xóa ${task.title}`} onClick={() => saveTasks(tasks.filter((item) => item.id !== task.id))}><Trash2 size={16} /></button></div>)}</div></section>
      <ActionBar nextLabel="Bắt đầu theo dõi tiến độ" backLabel="Quay lại chọn công nghệ" disabled={!tasks.length} onBack={() => navigate(`/projects/${projectId}/technology`)} onNext={continueFlow} />
    </>
  );
}
