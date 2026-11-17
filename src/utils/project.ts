import type { Project, ProjectStatus, Requirement, Task } from "../types";

export const suggestedRequirements: Requirement[] = [
  { id: "suggest-login", title: "Đăng nhập", description: "Thành viên truy cập đúng không gian của nhóm.", priority: "must" },
  { id: "suggest-project", title: "Tạo dự án", description: "Khởi tạo dự án và lưu thông tin cơ bản.", priority: "must" },
  { id: "suggest-assign", title: "Giao việc", description: "Phân công đầu việc cho từng thành viên.", priority: "must" },
  { id: "suggest-progress", title: "Theo dõi tiến độ", description: "Đánh dấu hoàn thành và xem phần trăm tiến độ.", priority: "must" },
];

export function calculateTaskProgress(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
}

export function getProjectProgress(project: Project) {
  return calculateTaskProgress(project.tasks);
}

export function getProjectDisplayStatus(project: Project): ProjectStatus {
  const progress = getProjectProgress(project);
  const checklistComplete = Object.values(project.completion).every(Boolean);
  if (project.tasks.some((task) => task.blocked)) return "blocked";
  if (progress === 100 && checklistComplete) return "completed";
  if (progress === 100 || checklistComplete) return "review";
  if (project.tasks.length) return progress > 0 ? "in_progress" : "setup";
  return "setup";
}
