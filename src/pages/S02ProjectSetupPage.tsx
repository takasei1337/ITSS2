import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Code2, Lightbulb, Target, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { AccessibleDateField, ActionBar, DropdownSelect, FieldError, PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { Project } from "../types";
import { KNOWN_SKILL_OPTIONS, suggestedRequirements } from "../utils/project";

const schema = z.object({
  name: z.string().trim().min(1, "Hãy nhập tên dự án trước nhé.").min(2, "Tên dự án cần có ít nhất 2 ký tự."),
  problemStatement: z.string().trim().min(10, "Mô tả vấn đề rõ hơn một chút."),
  targetUsers: z.string(),
  objective: z.string(),
  projectType: z.string(),
  field: z.string(),
  memberCount: z.string(),
  expectedDuration: z.string(),
  knownSkills: z.array(z.string()),
  knownSkillsNote: z.string(),
  referenceProjectId: z.string(),
  assigneeNames: z.string(),
  targetDate: z.string(),
});
type FormData = z.infer<typeof schema>;

const projectTypeOptions = [
  { value: "Web app", label: "Web app" },
  { value: "Mobile app", label: "Mobile app" },
  { value: "Dịch vụ", label: "Dịch vụ" },
  { value: "Khác", label: "Khác" },
];

export function ProjectSetupPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const refFromQuery = searchParams.get("ref") ?? "";
  const { state, publicProjects, createProject, updateProject, selectProject } = useApp();
  const existingProject = state.projects.find((project) => project.id === projectId);
  const prefillPublic = !existingProject && refFromQuery
    ? publicProjects.find((item) => item.id === refFromQuery)
    : undefined;
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existingProject
      ? {
          name: existingProject.name,
          problemStatement: existingProject.problemStatement,
          targetUsers: existingProject.targetUsers,
          objective: existingProject.objective,
          projectType: existingProject.projectType,
          field: existingProject.field ?? "Web",
          memberCount: existingProject.memberCount ?? "4–5 người",
          expectedDuration: existingProject.expectedDuration ?? "1–2 tháng",
          knownSkills: Array.isArray(existingProject.knownSkills) ? existingProject.knownSkills : [],
          knownSkillsNote: existingProject.knownSkillsNote ?? "",
          referenceProjectId: existingProject.referenceProjectId ?? "",
          assigneeNames: existingProject.assigneeNames,
          targetDate: existingProject.targetDate ?? "",
        }
      : {
          name: "",
          problemStatement: "",
          targetUsers: "",
          objective: "",
          projectType: prefillPublic?.projectType ?? "Web app",
          field: prefillPublic?.field ?? "Web",
          memberCount: "4–5 người",
          expectedDuration: "1–2 tháng",
          knownSkills: [],
          knownSkillsNote: "",
          referenceProjectId: refFromQuery,
          assigneeNames: "",
          targetDate: "",
        },
  });

  const referenceOptions = [
    { value: "", label: "Tự động gợi ý theo đề tài" },
    ...publicProjects.map((item) => ({
      value: item.id,
      label: `${item.name} (${item.projectType})`,
    })),
  ];

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
      knownSkills: data.knownSkills,
      knownSkillsNote: data.knownSkillsNote.trim(),
      referenceProjectId: data.referenceProjectId || undefined,
      assigneeNames: data.assigneeNames,
      targetDate: data.targetDate,
      status: existingProject?.status ?? "setup",
      currentScreen: "S03",
      updatedAt: "Vừa tạo",
      requirements: existingProject?.requirements.length
        ? existingProject.requirements
        : structuredClone(suggestedRequirements),
      technologies: existingProject?.technologies ?? {},
      tasks: existingProject?.tasks ?? [],
      completion: existingProject?.completion ?? {
        requirements: false,
        responsive: false,
        criticalBugs: false,
        guide: false,
      },
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
      <PageHeading
        eyebrow="Khởi tạo dự án"
        title={existingProject ? "Điều chỉnh thông tin dự án" : "Bắt đầu từ vấn đề cần giải quyết"}
        description="Thông tin về đề tài, kiến thức sẵn có và thời hạn giúp gợi ý công nghệ và lộ trình sát thực tế."
      />
      <form className="form-layout" onSubmit={submit}>
        <div className="form-main">
          <section className="form-card">
            <div className="section-title">
              <Lightbulb />
              <div>
                <h2>Ý tưởng dự án</h2>
                <p>Mô tả ngắn gọn, chưa cần hoàn hảo.</p>
              </div>
            </div>
            <label className="form-field">
              <span>
                Tên dự án <b>*</b>
              </span>
              <input {...register("name")} placeholder="Ví dụ: Website quản lý đồ án nhóm" autoFocus />
              <FieldError>{errors.name?.message}</FieldError>
            </label>
            <label className="form-field">
              <span>
                Vấn đề bạn muốn giải quyết <b>*</b>
              </span>
              <textarea
                {...register("problemStatement")}
                rows={5}
                placeholder="Người dùng đang gặp khó khăn gì?"
              />
              <FieldError>{errors.problemStatement?.message}</FieldError>
            </label>
          </section>

          <section className="form-card">
            <div className="section-title">
              <Target />
              <div>
                <h2>Định hướng ban đầu</h2>
                <p>Có thể quay lại chỉnh sửa ở các bước sau.</p>
              </div>
            </div>
            <div className="form-grid">
              <label className="form-field">
                <span>Người dùng mục tiêu</span>
                <input {...register("targetUsers")} placeholder="Ai sẽ sử dụng sản phẩm?" />
              </label>
              <div className="form-field">
                <span>Loại dự án</span>
                <Controller
                  control={control}
                  name="projectType"
                  render={({ field }) => (
                    <DropdownSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={projectTypeOptions}
                      ariaLabel="Loại dự án"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>
            <div className="form-grid">
              <label className="form-field">
                <span>Lĩnh vực</span>
                <input {...register("field")} placeholder="Ví dụ: Web" />
              </label>
              <label className="form-field">
                <span>Số thành viên</span>
                <input {...register("memberCount")} placeholder="Ví dụ: 4–5 người" />
              </label>
            </div>
            <div className="form-grid">
              <label className="form-field">
                <span>Thời gian dự kiến</span>
                <input {...register("expectedDuration")} placeholder="Ví dụ: 1–2 tháng" />
              </label>
              <div className="form-field">
                <span>Dự án công khai đối chiếu</span>
                <Controller
                  control={control}
                  name="referenceProjectId"
                  render={({ field }) => (
                    <DropdownSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={referenceOptions}
                      ariaLabel="Dự án công khai đối chiếu"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>
            <label className="form-field">
              <span>Mục tiêu mong muốn</span>
              <textarea
                {...register("objective")}
                rows={3}
                placeholder="Sản phẩm giúp tạo ra thay đổi gì?"
              />
            </label>
            <div className="form-grid">
              <label className="form-field">
                <span>Người phụ trách dự kiến</span>
                <div className="input-with-icon">
                  <UserRound size={17} />
                  <input {...register("assigneeNames")} placeholder="Ví dụ: Mai, An" />
                </div>
              </label>
              <div className="form-field">
                <span>Thời hạn dự kiến</span>
                <Controller
                  control={control}
                  name="targetDate"
                  render={({ field }) => (
                    <AccessibleDateField
                      value={field.value}
                      onChange={field.onChange}
                      label="Thời hạn dự kiến"
                    />
                  )}
                />
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="section-title">
              <Code2 />
              <div>
                <h2>Kiến thức sẵn có của nhóm</h2>
                <p>Chọn các ngôn ngữ, framework hoặc công cụ nhóm đã từng làm để nhận gợi ý phù hợp nhất.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="knownSkills"
              render={({ field }) => {
                const toggleSkill = (skill: string) => {
                  const exists = field.value.includes(skill);
                  field.onChange(
                    exists
                      ? field.value.filter((item) => item !== skill)
                      : [...field.value, skill]
                  );
                };
                return (
                  <div className="skill-chip-grid" role="group" aria-label="Kiến thức sẵn có của nhóm">
                    {KNOWN_SKILL_OPTIONS.map((skill) => {
                      const active = field.value.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          className={`skill-chip ${active ? "selected" : ""}`}
                          aria-pressed={active}
                          onClick={() => toggleSkill(skill)}
                        >
                          <CheckCircle2 size={15} />
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
            <label className="form-field skill-other-field">
              <span>Kiến thức / kỹ năng khác (tùy chọn)</span>
              <input
                {...register("knownSkillsNote")}
                placeholder="Ví dụ: Next.js, C#, MongoDB, Figma..."
              />
            </label>
          </section>
        </div>
        <aside className="form-aside">
          <h3>Một mô tả tốt nên trả lời</h3>
          <ol>
            <li>Ai đang gặp vấn đề?</li>
            <li>Vấn đề xảy ra khi nào?</li>
            <li>Hậu quả hiện tại là gì?</li>
            <li>Nhóm đã quen công nghệ nào và có bao nhiêu thời gian?</li>
          </ol>
        </aside>
      </form>
      <ActionBar
        nextLabel="Tiếp tục: Xác định yêu cầu"
        backLabel="Về danh sách dự án"
        onBack={() => navigate("/projects")}
        onNext={submit}
      />
    </main>
  );
}
