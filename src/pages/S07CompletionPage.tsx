import { AlertTriangle, CheckCircle2, ClipboardCheck, MonitorSmartphone, NotebookText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionBar, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { CompletionState } from "../types";

const checks = [
  { key: "requirements" as const, title: "Tính năng bắt buộc hoạt động", description: "Các yêu cầu “Phải có” đã được kiểm tra.", icon: ClipboardCheck },
  { key: "responsive" as const, title: "Giao diện responsive", description: "Có thể sử dụng trên desktop và mobile.", icon: MonitorSmartphone },
  { key: "criticalBugs" as const, title: "Không còn lỗi nghiêm trọng", description: "Không có lỗi chặn luồng chính.", icon: ShieldCheck },
  { key: "guide" as const, title: "Có hướng dẫn sử dụng", description: "Người dùng mới biết cách bắt đầu.", icon: NotebookText },
];

export function CompletionPage({ projectId }: { projectId: string }) {
  const { state, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const [completion, setCompletion] = useState<CompletionState>(project.completion);
  const navigate = useNavigate();
  const completedChecks = checks.filter((item) => completion[item.key]).length;
  const unfinishedMust = project.requirements.filter((item) => item.priority === "must").filter((requirement) => !project.tasks.some((task) => task.requirementId === requirement.id && task.status === "done"));
  const canViewResult = completedChecks === checks.length;

  const toggleCheck = (key: keyof Pick<CompletionState, "requirements" | "responsive" | "criticalBugs" | "guide">, checked: boolean) => {
    const next = { ...completion, [key]: checked };
    setCompletion(next);
    updateProject(projectId, { completion: next });
  };

  const continueFlow = () => {
    if (!canViewResult) return;
    updateProject(projectId, { completion, currentScreen: "S08", status: "completed" });
    navigate(`/projects/${projectId}/result`);
  };

  return (
    <>
      <PageHeading eyebrow="Kiểm tra hoàn thiện" title="Dự án đã sẵn sàng để xem kết quả?" description="Đối chiếu kết quả thực hiện với các yêu cầu ban đầu trước khi tổng kết." />
      {unfinishedMust.length > 0 && <div className="inline-alert warning"><AlertTriangle /><div><strong>Còn {unfinishedMust.length} yêu cầu bắt buộc chưa có task hoàn thành</strong><p>{unfinishedMust.map((item) => item.title).join(", ")}</p></div></div>}
      <section className="checklist-card completion-single">
        <header><div><h2>Checklist hoàn thiện</h2><p>{completedChecks}/{checks.length} mục đã xác nhận</p></div><div className="mini-progress"><span style={{ width: `${(completedChecks / checks.length) * 100}%` }} /></div></header>
        {checks.map((item) => {
          const Icon = item.icon;
          return <label className={`check-item ${completion[item.key] ? "checked" : ""}`} key={item.key}><input type="checkbox" checked={completion[item.key]} onChange={(event) => toggleCheck(item.key, event.target.checked)} /><span className="check-visual"><CheckCircle2 /></span><Icon className="check-icon" /><span><strong>{item.title}</strong><small>{item.description}</small></span></label>;
        })}
      </section>
      {!canViewResult && <p className="completion-hint">Hoàn thành đủ 4 tiêu chí để mở khóa kết quả.</p>}
      <ActionBar nextLabel="Xem kết quả dự án" backLabel="Quay lại tiếp tục làm" disabled={!canViewResult} onBack={() => navigate(`/projects/${projectId}/progress`)} onNext={continueFlow} />
    </>
  );
}
