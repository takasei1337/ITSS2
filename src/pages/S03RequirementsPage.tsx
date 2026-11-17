import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ListChecks, Plus, Target, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ActionBar, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Requirement, RequirementPriority } from "../types";
import { suggestedRequirements } from "../utils/project";

const columns: Array<{ id: RequirementPriority; label: string; description: string }> = [
  { id: "must", label: "Phải có", description: "Yêu cầu cốt lõi của dự án" },
  { id: "should", label: "Nên có", description: "Quan trọng nhưng có thể làm sau" },
  { id: "could", label: "Có thể có", description: "Tốt nếu đủ thời gian" },
  { id: "wont", label: "Chưa làm", description: "Chủ động để ngoài phạm vi" },
];

export function RequirementsPage({ projectId }: { projectId: string }) {
  const { state, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const [requirements, setRequirements] = useState<Requirement[]>(project.requirements.length ? project.requirements : structuredClone(suggestedRequirements));
  const [draft, setDraft] = useState("");
  const [draftPriority, setDraftPriority] = useState<RequirementPriority>("must");
  const navigate = useNavigate();
  const mustCount = useMemo(() => requirements.filter((item) => item.priority === "must").length, [requirements]);

  const commitRequirements = (next: Requirement[]) => {
    setRequirements(next);
    updateProject(projectId, { requirements: next });
  };

  const addRequirement = () => {
    const title = draft.trim();
    if (!title) return;
    commitRequirements([...requirements, { id: `req-${Date.now()}`, title, priority: draftPriority }]);
    setDraft("");
  };

  const updateRequirement = (id: string, changes: Partial<Requirement>) => commitRequirements(requirements.map((item) => item.id === id ? { ...item, ...changes } : item));
  const removeRequirement = (id: string) => commitRequirements(requirements.filter((item) => item.id !== id));
  const toggleSuggestion = (suggestion: Requirement) => {
    const selected = requirements.some((item) => item.title === suggestion.title);
    commitRequirements(selected ? requirements.filter((item) => item.title !== suggestion.title) : [...requirements, { ...suggestion }]);
  };

  const continueFlow = () => {
    if (!requirements.length) return;
    updateProject(projectId, { requirements, currentScreen: "S04" });
    navigate(`/projects/${projectId}/technology`);
  };

  return (
    <>
      <PageHeading eyebrow="Yêu cầu dự án" title="Xác định yêu cầu" description="Chọn các yêu cầu cần thiết, sau đó sắp xếp mức độ ưu tiên cho dự án." />
      <section className="context-strip"><Target size={20} /><div><strong>Vấn đề đang giải quyết</strong><p>{project.problemStatement}</p></div></section>
      <section className="suggestion-card"><h2>Gợi ý để bắt đầu</h2><p>Các nhóm làm đề tài giống bạn thường bắt đầu với: đăng nhập, tạo dự án, giao việc, theo dõi tiến độ.</p><div className="suggestion-options">{suggestedRequirements.map((item) => { const checked = requirements.some((requirement) => requirement.title === item.title); return <label className={checked ? "selected" : ""} key={item.id}><input type="checkbox" checked={checked} onChange={() => toggleSuggestion(item)} /><CheckCircle2 /><span>{item.title}</span></label>; })}</div></section>
      {mustCount > 5 && <div className="inline-alert warning"><AlertTriangle /><div><strong>Phạm vi “Phải có” đang khá lớn</strong><p>Thử chuyển một số yêu cầu sang “Nên có” để dự án dễ triển khai hơn.</p></div></div>}
      <section className="requirement-add"><label><span>Thêm một tính năng hoặc nhu cầu</span><div><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addRequirement())} placeholder="Ví dụ: Tạo công việc mới" /><select aria-label="Mức ưu tiên của yêu cầu mới" value={draftPriority} onChange={(event) => setDraftPriority(event.target.value as RequirementPriority)}>{columns.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select><button className="button primary" type="button" onClick={addRequirement}><Plus size={17} /> Thêm</button></div></label></section>
      <div className="requirements-board">{columns.map((column) => <section className={`requirement-column priority-${column.id}`} key={column.id}><header><div><h2>{column.label}</h2><p>{column.description}</p></div><span>{requirements.filter((item) => item.priority === column.id).length}</span></header><div className="requirement-list">{requirements.filter((item) => item.priority === column.id).map((item) => <article className="requirement-card" key={item.id}><input aria-label="Tên yêu cầu" value={item.title} onChange={(event) => updateRequirement(item.id, { title: event.target.value })} /><textarea aria-label="Mô tả yêu cầu" value={item.description ?? ""} onChange={(event) => updateRequirement(item.id, { description: event.target.value })} placeholder="Mô tả ngắn..." rows={2} /><div><select aria-label="Mức ưu tiên" value={item.priority} onChange={(event) => updateRequirement(item.id, { priority: event.target.value as RequirementPriority })}>{columns.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select><button type="button" aria-label={`Xóa ${item.title}`} onClick={() => removeRequirement(item.id)}><Trash2 size={15} /></button></div></article>)}</div></section>)}</div>
      <section className="scope-summary"><div><CheckCircle2 /><span><strong>{mustCount}</strong> yêu cầu cốt lõi</span></div><div><ListChecks /><span><strong>{requirements.filter((item) => item.priority !== "must").length}</strong> yêu cầu ưu tiên sau</span></div></section>
      <ActionBar nextLabel="Tiếp tục: Chọn công nghệ" backLabel="Quay lại khởi tạo dự án" disabled={!requirements.length} onBack={() => navigate(`/projects/${projectId}/setup`)} onNext={continueFlow} />
    </>
  );
}
