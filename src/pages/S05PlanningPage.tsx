import { CheckSquare, ChevronDown, ListOrdered, Plus, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccessibleDateField, ActionBar, DropdownSelect, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Task, TaskStatus } from "../types";
import { getDefaultTaskGuide } from "../utils/project";

const statusLabels: Record<TaskStatus, string> = {
  todo: "Chưa làm",
  doing: "Đang làm",
  review: "Chờ kiểm tra",
  done: "Hoàn thành",
};

const priorityOptions: Array<{ value: Task["priority"]; label: string }> = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Vừa" },
  { value: "high", label: "Cao" },
];

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value: value as TaskStatus,
  label,
}));

export function PlanningPage({ projectId }: { projectId: string }) {
  const { state, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;

  const initialTasks = useMemo(() => {
    const memberList = project.assigneeNames
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    if (project.tasks.length) {
      return project.tasks.map((task) => {
        if (task.howToSteps?.length && task.acceptanceCriteria) return task;
        const guide = getDefaultTaskGuide(task.title, task.requirementId);
        return {
          ...task,
          howToSteps: task.howToSteps?.length ? task.howToSteps : guide.howToSteps,
          acceptanceCriteria: task.acceptanceCriteria || guide.acceptanceCriteria,
        };
      });
    }

    return project.requirements
      .filter((item) => item.priority === "must")
      .map((item, index): Task => {
        const guide = getDefaultTaskGuide(item.title, item.id);
        return {
          id: `task-${Date.now()}-${index}`,
          requirementId: item.id,
          title: item.title,
          howToSteps: guide.howToSteps,
          acceptanceCriteria: item.successCriteria || guide.acceptanceCriteria,
          assigneeName: memberList[index % Math.max(memberList.length, 1)] || "",
          status: "todo",
          priority: index === 0 ? "high" : "medium",
          dueDate: project.targetDate,
        };
      });
  }, []);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    initialTasks.length ? [initialTasks[0].id] : []
  );
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const unassigned = useMemo(() => tasks.filter((task) => !task.assigneeName).length, [tasks]);
  const members = project.assigneeNames
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const assigneeOptions = useMemo(
    () => [
      { value: "", label: "Chưa phân công" },
      ...members.map((name) => ({ value: name, label: name })),
    ],
    [members]
  );

  useEffect(() => {
    if (!project.tasks.length && initialTasks.length) {
      updateProject(projectId, { tasks: initialTasks });
    }
  }, []);

  const saveTasks = (next: Task[]) => {
    setTasks(next);
    updateProject(projectId, { tasks: next });
  };

  const updateTask = (id: string, changes: Partial<Task>) =>
    saveTasks(tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)));

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    const guide = getDefaultTaskGuide(title);
    const created: Task = {
      id: `task-${Date.now()}`,
      title,
      howToSteps: guide.howToSteps,
      acceptanceCriteria: guide.acceptanceCriteria,
      status: "todo",
      priority: "medium",
      dueDate: project.targetDate,
    };
    saveTasks([...tasks, created]);
    setExpandedIds((prev) => [...prev, created.id]);
    setNewTitle("");
  };

  const toggleExpand = (taskId: string) => {
    setExpandedIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const continueFlow = () => {
    if (!tasks.length) return;
    updateProject(projectId, { tasks, currentScreen: "S06", status: "in_progress" });
    navigate(`/projects/${projectId}/progress`);
  };

  return (
    <>
      <PageHeading
        eyebrow="Kế hoạch & phân công"
        title="Biến yêu cầu thành những việc có thể bắt đầu"
        description="Mỗi task gồm người phụ trách, thời hạn, cách thực hiện và tiêu chí hoàn thành rõ ràng."
      />

      <section className="planning-summary">
        <div>
          <strong>{project.requirements.filter((item) => item.priority === "must").length}</strong>
          <span>Tính năng bắt buộc</span>
        </div>
        <div>
          <strong>{tasks.length}</strong>
          <span>Task đã tạo</span>
        </div>
        <div className={unassigned ? "attention" : ""}>
          <strong>{unassigned}</strong>
          <span>Chưa phân công</span>
        </div>
      </section>

      <section className="task-table-card">
        <header>
          <div>
            <h2>Danh sách công việc</h2>
            <p>
              Bấm “Chi tiết” trên từng dòng để xem hoặc chỉnh sửa cách thực hiện và tiêu chí hoàn thành.
            </p>
          </div>
        </header>

        <div className="task-add">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addTask()}
            placeholder="Thêm công việc mới..."
          />
          <button className="button secondary" type="button" onClick={addTask}>
            <Plus size={17} /> Thêm task
          </button>
        </div>

        <div className="task-table" role="table">
          <div className="task-row task-head" role="row">
            <span>Công việc</span>
            <span>Người phụ trách</span>
            <span>Hạn</span>
            <span>Ưu tiên</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>

          {tasks.map((task) => {
            const expanded = expandedIds.includes(task.id);
            const steps = task.howToSteps ?? [];
            return (
              <div className={`task-item-group ${expanded ? "expanded" : ""}`} key={task.id}>
                <div className="task-row" role="row">
                  <div className="task-title-cell">
                    <input
                      aria-label="Tên công việc"
                      value={task.title}
                      onChange={(event) => updateTask(task.id, { title: event.target.value })}
                    />
                  </div>

                  <DropdownSelect
                    ariaLabel="Người phụ trách"
                    value={task.assigneeName ?? ""}
                    onChange={(nextAssignee) => updateTask(task.id, { assigneeName: nextAssignee })}
                    options={assigneeOptions}
                    icon={<UserRound size={15} />}
                    size="compact"
                    fullWidth
                    minMenuWidth={175}
                  />

                  <AccessibleDateField
                    value={task.dueDate}
                    onChange={(dueDate) => updateTask(task.id, { dueDate })}
                    label={`Hạn hoàn thành của ${task.title}`}
                  />

                  <DropdownSelect
                    ariaLabel="Mức ưu tiên"
                    value={task.priority}
                    onChange={(nextPriority) => updateTask(task.id, { priority: nextPriority })}
                    options={priorityOptions}
                    size="compact"
                    fullWidth
                    minMenuWidth={120}
                  />

                  <DropdownSelect
                    ariaLabel="Trạng thái"
                    value={task.status}
                    onChange={(nextStatus) => updateTask(task.id, { status: nextStatus })}
                    options={statusOptions}
                    size="compact"
                    fullWidth
                    minMenuWidth={150}
                  />

                  <div className="task-row-actions">
                    <button
                      type="button"
                      className={`row-detail-toggle ${expanded ? "active" : ""}`}
                      aria-expanded={expanded}
                      aria-label={`Chi tiết ${task.title}`}
                      title="Cách thực hiện & tiêu chí hoàn thành"
                      onClick={() => toggleExpand(task.id)}
                    >
                      <span>Chi tiết</span>
                      <ChevronDown size={14} />
                    </button>
                    <button
                      className="row-delete"
                      type="button"
                      aria-label={`Xóa ${task.title}`}
                      onClick={() => saveTasks(tasks.filter((item) => item.id !== task.id))}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="task-detail-drawer">
                    <div className="task-detail-col">
                      <label className="task-detail-label">
                        <span>
                          <ListOrdered size={15} /> Cách thực hiện (mỗi dòng 1 bước)
                        </span>
                        <textarea
                          rows={3}
                          value={steps.join("\n")}
                          onChange={(event) =>
                            updateTask(task.id, {
                              howToSteps: event.target.value
                                .split("\n")
                                .map((line) => line.replace(/^\d+\.\s*/, "")),
                            })
                          }
                          placeholder="Nhập các bước ngắn gọn để thực hiện nhiệm vụ này..."
                        />
                      </label>
                    </div>
                    <div className="task-detail-col">
                      <label className="task-detail-label">
                        <span>
                          <CheckSquare size={15} /> Tiêu chí hoàn thành (điều kiện để tick xong)
                        </span>
                        <textarea
                          rows={3}
                          value={task.acceptanceCriteria ?? ""}
                          onChange={(event) =>
                            updateTask(task.id, { acceptanceCriteria: event.target.value })
                          }
                          placeholder="Ví dụ: Chạy được luồng chính, lưu dữ liệu ổn định và không lỗi giao diện."
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ActionBar
        nextLabel="Bắt đầu theo dõi tiến độ"
        backLabel="Quay lại chọn công nghệ"
        disabled={!tasks.length}
        onBack={() => navigate(`/projects/${projectId}/technology`)}
        onNext={continueFlow}
      />
    </>
  );
}
