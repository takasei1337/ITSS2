import { ArrowLeft, EyeOff, HeartHandshake, MessageCircleMore, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldError, PageHeading } from "../components/UI";
import { createMockResponses } from "../data/mockResponses";
import { useApp } from "../store/AppContext";
import type { AnonymousPost } from "../types";

const moods = [
  "😟 Lo lắng, mất phương hướng",
  "😣 Áp lực vì tiến độ",
  "😕 Thiếu kỹ năng hoặc kinh nghiệm",
  "😞 Khó phối hợp với nhóm",
  "🙂 Muốn tìm một góc nhìn khác",
];

const responseTypes = [
  { id: "listen" as const, title: "Chỉ cần được lắng nghe", description: "Không cần lời khuyên ngay lúc này" },
  { id: "encourage" as const, title: "Muốn nhận lời động viên", description: "Một chút khích lệ để tiếp tục" },
  { id: "perspective" as const, title: "Muốn nghe góc nhìn khác", description: "Nhìn vấn đề từ một hướng mới" },
  { id: "action" as const, title: "Muốn nhận gợi ý hành động", description: "Một bước nhỏ có thể làm tiếp" },
];

const sampleShares = [
  { mood: "😟 Lo lắng, mất phương hướng", content: "Nhóm mình có quá nhiều ý tưởng nhưng chưa biết tính năng nào cần làm trước.", response: "Hãy chọn một vấn đề quan trọng nhất và chỉ giữ những tính năng trực tiếp giải quyết vấn đề đó." },
  { mood: "😣 Áp lực vì tiến độ", content: "Dự án đang chậm và mình sợ cả nhóm không kịp hoàn thành.", response: "Bạn có thể cùng nhóm chia nhỏ phần còn lại, chọn một việc quan trọng nhất cho hôm nay rồi cập nhật lại kế hoạch." },
  { mood: "😞 Khó phối hợp với nhóm", content: "Mọi người chưa rõ trách nhiệm nên nhiều đầu việc bị bỏ sót.", response: "Một danh sách công việc có người phụ trách và hạn rõ ràng có thể giúp cả nhóm phối hợp nhẹ nhàng hơn." },
];

export function AnonymousSharePage() {
  const { state, setAnonymousPost, setResponses } = useApp();
  const [topic, setTopic] = useState(moods[0]);
  const [content, setContent] = useState("");
  const [desiredResponse, setDesiredResponse] = useState<AnonymousPost["desiredResponse"]>("listen");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const createLatestPost = () => {
    if (content.trim().length < 20) {
      setError("Hãy chia sẻ thêm một chút để nhận phản hồi phù hợp hơn.");
      return null;
    }
    const post: AnonymousPost = { id: `post-${Date.now()}`, topic, content: content.trim(), desiredResponse, createdAt: new Date().toISOString() };
    setAnonymousPost(post);
    setResponses(createMockResponses(post.id));
    return post;
  };

  const submit = () => {
    if (!createLatestPost()) return;
    setSubmitting(true);
    window.setTimeout(() => navigate("/support/anonymous/responses"), 500);
  };

  const viewResponses = () => {
    if (content.trim().length >= 20) {
      if (!createLatestPost()) return;
    } else if (!state.anonymousPost) {
      setError("Hãy chia sẻ thêm một chút để nhận phản hồi phù hợp hơn.");
      return;
    }
    navigate("/support/anonymous/responses");
  };

  return (
    <main className="support-page">
      <div className="support-container">
        <PageHeading eyebrow="Không gian an toàn" title="Chia sẻ điều đang khiến bạn khó tiếp tục" description="Bạn không cần viết hoàn hảo. Chỉ cần mô tả điều đang xảy ra và loại phản hồi bạn mong muốn." />
        <section className="privacy-card"><span><EyeOff /></span><div><h2>Danh tính của bạn được bảo vệ</h2><p>Tên, dự án và thông tin cá nhân của bạn sẽ không hiển thị cùng bài chia sẻ.</p></div><ShieldCheck /></section>
        <section className="share-form-card">
          <label className="form-field"><span>Tâm trạng hiện tại</span><select value={topic} onChange={(event) => setTopic(event.target.value)}>{moods.map((mood) => <option key={mood}>{mood}</option>)}</select></label>
          <label className="form-field"><span>Bạn đang gặp điều gì? <b>*</b></span><textarea autoFocus rows={7} maxLength={1000} value={content} onChange={(event) => { setContent(event.target.value); setError(""); }} placeholder="Ví dụ: Mình đã lên kế hoạch nhưng càng làm càng thấy phạm vi quá lớn..." /><small className="character-count">{content.length}/1000</small><FieldError>{error}</FieldError></label>
          <fieldset><legend>Bạn muốn nhận phản hồi như thế nào?</legend><div className="response-type-grid">{responseTypes.map((item) => <label className={desiredResponse === item.id ? "selected" : ""} key={item.id}><input type="radio" name="responseType" value={item.id} checked={desiredResponse === item.id} onChange={() => setDesiredResponse(item.id)} /><HeartHandshake /><span><strong>{item.title}</strong><small>{item.description}</small></span></label>)}</div></fieldset>
        </section>
        <div className="support-actions"><button className="button ghost" type="button" onClick={() => navigate("/projects")}><ArrowLeft /> Về danh sách dự án</button><div><button className="button secondary" type="button" onClick={viewResponses}><MessageCircleMore /> Xem phản hồi đồng cảm <span>→</span></button><button className="button support" type="button" disabled={submitting} onClick={submit}>{submitting ? "Đang đăng..." : <><Send /> Đăng ẩn danh</>}</button></div></div>
        <section className="sample-share-section"><header><h2>Chia sẻ ẩn danh từ cộng đồng</h2><p>Một vài tình huống và phản hồi để bạn tham khảo.</p></header><div className="sample-share-list">{sampleShares.map((item) => <article key={item.content}><small>{item.mood}</small><p>{item.content}</p><blockquote><strong>Phản hồi:</strong> {item.response}</blockquote></article>)}</div></section>
      </div>
    </main>
  );
}
