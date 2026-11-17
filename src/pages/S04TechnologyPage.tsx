import { Check, Code2, Database, ExternalLink, Info, Server, StickyNote } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionBar, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { TechnologyChoices } from "../types";

const groups = [
  {
    key: "frontend" as const,
    label: "Frontend",
    icon: Code2,
    options: [
      { name: "React", detail: "Hệ sinh thái lớn, phù hợp ứng dụng tương tác", suitability: "Rất phù hợp", recommended: true },
      { name: "Vue", detail: "Dễ tiếp cận và cấu trúc gọn", suitability: "Phù hợp", recommended: false },
      { name: "Flutter", detail: "Xây dựng ứng dụng di động đa nền tảng", suitability: "Phù hợp với mobile", recommended: false },
      { name: "HTML/CSS/JS", detail: "Phù hợp sản phẩm đơn giản", suitability: "Cân nhắc", recommended: false },
    ],
  },
  {
    key: "backend" as const,
    label: "Backend",
    icon: Server,
    options: [
      { name: "Node.js", detail: "Dùng chung JavaScript với frontend", suitability: "Rất phù hợp", recommended: true },
      { name: "Supabase", detail: "Triển khai nhanh, ít code backend", suitability: "Phù hợp", recommended: false },
      { name: "Firebase", detail: "Tích hợp nhanh cho ứng dụng mobile", suitability: "Phù hợp với mobile", recommended: false },
      { name: "Không cần", detail: "Phù hợp ứng dụng tĩnh", suitability: "Chỉ phù hợp khi không có dữ liệu", recommended: false },
    ],
  },
  {
    key: "database" as const,
    label: "Database",
    icon: Database,
    options: [
      { name: "PostgreSQL", detail: "Ổn định, linh hoạt cho dữ liệu quan hệ", suitability: "Rất phù hợp", recommended: true },
      { name: "Supabase", detail: "Database có sẵn API và xác thực", suitability: "Phù hợp", recommended: false },
      { name: "Firebase", detail: "Đồng bộ dữ liệu nhanh cho mobile", suitability: "Phù hợp với mobile", recommended: false },
      { name: "Không cần", detail: "Không lưu dữ liệu lâu dài", suitability: "Chỉ phù hợp với trang tĩnh", recommended: false },
    ],
  },
  {
    key: "hosting" as const,
    label: "Hosting",
    icon: ExternalLink,
    options: [
      { name: "Vercel", detail: "Triển khai frontend nhanh", suitability: "Rất phù hợp", recommended: true },
      { name: "Netlify", detail: "Static hosting đơn giản", suitability: "Phù hợp", recommended: false },
      { name: "Firebase Hosting", detail: "Thuận tiện khi dùng Firebase", suitability: "Phù hợp với mobile/web", recommended: false },
      { name: "Local", detail: "Chỉ chạy trên máy cá nhân", suitability: "Chỉ phù hợp để kiểm tra nội bộ", recommended: false },
    ],
  },
];

export function TechnologyPage({ projectId }: { projectId: string }) {
  const { state, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const [choices, setChoices] = useState<TechnologyChoices>(project.technologies);
  const navigate = useNavigate();

  const saveChoices = (next: TechnologyChoices) => {
    setChoices(next);
    updateProject(projectId, { technologies: next });
  };

  const continueFlow = () => {
    if (!choices.frontend || !choices.hosting) return;
    updateProject(projectId, { technologies: choices, currentScreen: "S05" });
    navigate(`/projects/${projectId}/planning`);
  };

  const selectedSummary = groups
    .map((group) => choices[group.key] && `${group.label}: ${choices[group.key]}`)
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHeading eyebrow="Lựa chọn công nghệ" title="Chọn công nghệ phù hợp cho dự án" description="Ưu tiên công nghệ nhóm có thể sử dụng và triển khai trong thời gian dự kiến." />
      <div className="inline-alert info"><Info /><div><strong>Gợi ý dựa trên phạm vi hiện tại</strong><p>Với {project.requirements.filter((item) => item.priority === "must").length} tính năng bắt buộc, hãy ưu tiên bộ công nghệ quen thuộc với nhóm.</p></div></div>
      <p className="selected-technology"><strong>Đã chọn:</strong> {selectedSummary || "Chưa có lựa chọn"}</p>
      <div className="technology-groups">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <section className="technology-group" key={group.key}>
              <header><span><Icon /></span><div><h2>{group.label}</h2><p>Chọn một phương án</p></div></header>
              <div className="technology-options">
                {group.options.map((option) => {
                  const selected = choices[group.key] === option.name;
                  return <button className={`technology-card ${selected ? "selected" : ""}`} type="button" key={option.name} onClick={() => saveChoices({ ...choices, [group.key]: option.name })}><span className="radio-visual">{selected && <Check size={14} />}</span><div><strong>{option.name}</strong>{option.recommended && <small>Đề xuất</small>}<p>{option.detail}</p><em>Mức phù hợp: {option.suitability}</em></div></button>;
                })}
              </div>
            </section>
          );
        })}
      </div>
      <label className="decision-note"><span><StickyNote size={18} /> Ghi chú quyết định</span><textarea value={choices.note ?? ""} onChange={(event) => saveChoices({ ...choices, note: event.target.value })} placeholder="Vì sao các lựa chọn này phù hợp với nhóm?" rows={3} /></label>
      <ActionBar nextLabel="Tiếp tục: Kế hoạch & phân công" backLabel="Quay lại xác định yêu cầu" disabled={!choices.frontend || !choices.hosting} onBack={() => navigate(`/projects/${projectId}/requirements`)} onNext={continueFlow} />
    </>
  );
}
