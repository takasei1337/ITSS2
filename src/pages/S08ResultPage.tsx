import { ArrowLeft, Award, CheckCircle2, Code2, Flag, Lightbulb, ListChecks, Send, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import { getProjectProgress } from "../utils/project";

export function ResultPage({ projectId }: { projectId: string }) {
  const { state, updateProject } = useApp();
  const project = state.projects.find((item) => item.id === projectId)!;
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(project.feedback ?? "");
  const [feedbackStatus, setFeedbackStatus] = useState<"" | "error" | "success">("");

  useEffect(() => {
    if (project.currentScreen !== "S08") updateProject(projectId, { currentScreen: "S08" });
  }, []);

  const doneTasks = project.tasks.filter((task) => task.status === "done");
  const mustRequirements = project.requirements.filter((item) => item.priority === "must");
  const progress = getProjectProgress(project);

  const submitFeedback = () => {
    if (!feedback.trim()) {
      setFeedbackStatus("error");
      return;
    }
    updateProject(projectId, { feedback: feedback.trim() });
    setFeedbackStatus("success");
  };

  return (
    <>
      <section className="result-hero">
        <span className="result-icon"><Trophy /></span>
        <span className="eyebrow">Kết quả dự án</span>
        <h1>{project.name}</h1>
        <p>Dự án đã hoàn thành checklist và sẵn sàng để tổng kết.</p>
        <div className="result-status"><CheckCircle2 size={17} /> Đã hoàn thành</div>
      </section>
      <PageHeading title="Nhìn lại hành trình" description="Tổng hợp phạm vi, công nghệ và những gì đã hoàn thành." />
      <section className="result-metrics">
        <div><Flag /><strong>{mustRequirements.length}</strong><span>Yêu cầu bắt buộc</span></div>
        <div><ListChecks /><strong>{doneTasks.length}/{project.tasks.length}</strong><span>Task hoàn thành</span></div>
        <div><Award /><strong>{progress}%</strong><span>Task hoàn thành</span></div>
      </section>
      <div className="result-grid">
        <section className="result-card">
          <header><Lightbulb /><h2>Giá trị dự án</h2></header>
          <p>{project.objective || project.description}</p>
          <h3>Vấn đề đã chọn</h3><p>{project.problemStatement}</p>
          <h3>Người dùng mục tiêu</h3><p>{project.targetUsers || "Chưa xác định"}</p>
        </section>
        <section className="result-card">
          <header><Code2 /><h2>Công nghệ</h2></header>
          <dl className="technology-summary">
            <div><dt>Frontend</dt><dd>{project.technologies.frontend || "Chưa chọn"}</dd></div>
            <div><dt>Backend</dt><dd>{project.technologies.backend || "Chưa chọn"}</dd></div>
            <div><dt>Database</dt><dd>{project.technologies.database || "Chưa chọn"}</dd></div>
            <div><dt>Hosting</dt><dd>{project.technologies.hosting || "Chưa chọn"}</dd></div>
          </dl>
        </section>
        <section className="result-card full">
          <header><CheckCircle2 /><h2>Phạm vi đã hoàn thành</h2></header>
          <div className="result-list">
            {mustRequirements.map((requirement) => {
              const done = project.tasks.some((task) => task.requirementId === requirement.id && task.status === "done");
              return <div key={requirement.id}><span className={done ? "done" : "pending"}>{done ? <CheckCircle2 /> : <ListChecks />}</span><div><strong>{requirement.title}</strong><p>{done ? "Đã có task hoàn thành" : "Chưa hoàn thành trong phiên này"}</p></div></div>;
            })}
          </div>
        </section>
        <section className="result-card full reflection">
          <header><Lightbulb /><h2>Bạn thấy luồng này có giúp bạn tự tin bắt đầu dự án không?</h2></header>
          <textarea value={feedback} rows={4} onChange={(event) => { setFeedback(event.target.value); setFeedbackStatus(""); }} placeholder="Chia sẻ điều hữu ích hoặc điểm bạn vẫn còn băn khoăn..." />
          {feedbackStatus === "error" && <p className="field-error" role="alert">Hãy nhập góp ý trước khi gửi.</p>}
          {feedbackStatus === "success" && <p className="feedback-success" role="status">Cảm ơn bạn đã gửi góp ý!</p>}
          <button className="button primary" type="button" onClick={submitFeedback}><Send size={17} /> Gửi góp ý</button>
        </section>
      </div>
      <div className="result-actions"><button className="button primary" type="button" onClick={() => navigate("/projects")}><ArrowLeft size={18} /> Về danh sách dự án</button></div>
    </>
  );
}
