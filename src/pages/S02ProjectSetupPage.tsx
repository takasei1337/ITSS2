import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Target, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { AccessibleDateField, ActionBar, FieldError, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Project } from "../types";
import { suggestedRequirements } from "../utils/project";

const schema = z.object({
  name: z.string().trim().min(1, "Hãy nhập tên dự án trước nhé.").min(2, "Tên dự án cần có ít nhất 2 ký tự."),
  problemStatement: z.string().trim().min(10, "Mô tả vấn đề rõ hơn một chút."),
  targetUsers: z.string(),
  objective: z.string(),
  projectType: z.string(),
  field: z.string(),
  memberCount: z.string(),
  expectedDuration: z.string(),
  assigneeNames: z.string(),
  targetDate: z.string(),
});
type FormData = z.infer<typeof schema>;

export function ProjectSetupPage() {
  const { projectId } = useParams();
  const { state, createProject, updateProject, selectProject } = useApp();
  const existingProject = state.projects.find((project) => project.id === projectId);
  const navigate = useNavigate();
  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existingProject ? {
      name: existingProject.name,
      problemStatement: existingProject.problemStatement,
      targetUsers: existingProject.targetUsers,
      objective: existingProject.objective,
      projectType: existingProject.projectType,
      field: existingProject.field ?? "Web",
      memberCount: existingProject.memberCount ?? "4–5 người",
      expectedDuration: existingProject.expectedDuration ?? "1–2 tháng",
      assigneeNames: existingProject.assigneeNames,
      targetDate: existingProject.targetDate ?? "",
    } : { name: "", problemStatement: "", targetUsers: "", objective: "", projectType: "Web app", field: "Web", memberCount: "4–5 người", expectedDuration: "1–2 tháng", assigneeNames: "", targetDate: "" },
  });

  const submit = handleSubmit((data) => {
    const id = existingProject?.id ?? `project-${Date.now()}`;
    const project: Project = {
      id,
      name: data.name,
      description: data.objective || data.problemStatement.slice(0, 100),
      problemStatement: data.problemStatement,
      targetUsers: data.targetUsers,
      objective: data.objective,
      projectType: data.projectType,
      field: data.field,
      memberCount: data.memberCount,
      expectedDuration: data.expectedDuration,
      assigneeNames: data.assigneeNames,
      targetDate: data.targetDate,
      status: existingProject?.status ?? "setup",
      currentScreen: "S03",
      updatedAt: "Vừa tạo",
      requirements: existingProject?.requirements.length ? existingProject.requirements : structuredClone(suggestedRequirements),
      technologies: existingProject?.technologies ?? {},
      tasks: existingProject?.tasks ?? [],
      completion: existingProject?.completion ?? { requirements: false, responsive: false, criticalBugs: false, guide: false },
    };
    if (existingProject) {
      updateProject(id, project);
      selectProject(id);
    } else {
      createProject(project);
    }
    navigate(`/projects/${id}/requirements`);
  });

  return (
    <main className="standalone-page page-container">
      <PageHeading eyebrow="Khởi tạo dự án" title={existingProject ? "Điều chỉnh thông tin dự án" : "Bắt đầu từ vấn đề cần giải quyết"} description="Thông tin này giúp các bước sau tập trung vào đúng người dùng và mục tiêu." />
      <form className="form-layout" onSubmit={submit}>
        <div className="form-main">
          <section className="form-card"><div className="section-title"><Lightbulb /><div><h2>Ý tưởng dự án</h2><p>Mô tả ngắn gọn, chưa cần hoàn hảo.</p></div></div>
            <label className="form-field"><span>Tên dự án <b>*</b></span><input {...register("name")} placeholder="Ví dụ: Website quản lý đồ án nhóm" autoFocus /><FieldError>{errors.name?.message}</FieldError></label>
            <label className="form-field"><span>Vấn đề bạn muốn giải quyết <b>*</b></span><textarea {...register("problemStatement")} rows={5} placeholder="Người dùng đang gặp khó khăn gì?" /><FieldError>{errors.problemStatement?.message}</FieldError></label>
          </section>
          <section className="form-card"><div className="section-title"><Target /><div><h2>Định hướng ban đầu</h2><p>Có thể quay lại chỉnh sửa ở các bước sau.</p></div></div>
            <div className="form-grid"><label className="form-field"><span>Người dùng mục tiêu</span><input {...register("targetUsers")} placeholder="Ai sẽ sử dụng sản phẩm?" /></label><label className="form-field"><span>Loại dự án</span><select {...register("projectType")}><option>Web app</option><option>Mobile app</option><option>Dịch vụ</option><option>Khác</option></select></label></div>
            <div className="form-grid"><label className="form-field"><span>Lĩnh vực</span><input {...register("field")} placeholder="Ví dụ: Web" /></label><label className="form-field"><span>Số thành viên</span><input {...register("memberCount")} placeholder="Ví dụ: 4–5 người" /></label></div>
            <label className="form-field"><span>Thời gian dự kiến</span><input {...register("expectedDuration")} placeholder="Ví dụ: 1–2 tháng" /></label>
            <label className="form-field"><span>Mục tiêu mong muốn</span><textarea {...register("objective")} rows={3} placeholder="Sản phẩm giúp tạo ra thay đổi gì?" /></label>
            <div className="form-grid"><label className="form-field"><span>Người phụ trách dự kiến</span><div className="input-with-icon"><UserRound size={17} /><input {...register("assigneeNames")} placeholder="Ví dụ: Mai, An" /></div></label><label className="form-field"><span>Thời hạn dự kiến</span><Controller control={control} name="targetDate" render={({ field }) => <AccessibleDateField value={field.value} onChange={field.onChange} label="Thời hạn dự kiến" />} /></label></div>
          </section>
        </div>
        <aside className="form-aside"><h3>Một mô tả tốt nên trả lời</h3><ol><li>Ai đang gặp vấn đề?</li><li>Vấn đề xảy ra khi nào?</li><li>Hậu quả hiện tại là gì?</li><li>Kết quả tốt hơn sẽ trông như thế nào?</li></ol></aside>
      </form>
      <ActionBar nextLabel="Tiếp tục: Xác định yêu cầu" backLabel="Về danh sách dự án" onBack={() => navigate("/projects")} onNext={submit} />
    </main>
  );
}
