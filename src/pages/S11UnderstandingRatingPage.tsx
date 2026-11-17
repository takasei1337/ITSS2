import { ArrowLeft, FolderKanban, Heart, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeading } from "../components/UI";
import { useApp } from "../store/AppContext";
import type { UnderstandingRating } from "../types";

const ratings: Array<{ score: 1 | 2 | 3 | 4 | 5; label: string; emoji: string }> = [
  { score: 1, label: "1 · Chưa hiểu mình", emoji: "😞" },
  { score: 2, label: "2", emoji: "🙁" },
  { score: 3, label: "3 · Tạm được", emoji: "😐" },
  { score: 4, label: "4", emoji: "🙂" },
  { score: 5, label: "5 · Rất thấu hiểu", emoji: "😊" },
];

export function UnderstandingRatingPage() {
  const { state, setRating } = useApp();
  const [score, setScore] = useState<UnderstandingRating["score"] | null>(state.rating?.score ?? null);
  const [note, setNote] = useState(state.rating?.note ?? "");
  const navigate = useNavigate();
  const returnsToProgress = state.returnTo.includes("/progress");

  const selectScore = (value: UnderstandingRating["score"]) => {
    setScore(value);
    setRating({ score: value, note: note.trim() || undefined });
  };

  const updateNote = (value: string) => {
    setNote(value);
    if (score) setRating({ score, note: value.trim() || undefined });
  };

  return (
    <main className="support-page rating-page">
      <div className="support-container narrow">
        <PageHeading eyebrow="Phản hồi trải nghiệm" title="Bạn cảm thấy mình được thấu hiểu ở mức nào?" description="Chọn mức gần nhất với cảm nhận của bạn." />
        <section className="rating-card">
          <fieldset><legend className="sr-only">Mức độ được thấu hiểu</legend><div className="rating-options">{ratings.map((item) => <label className={score === item.score ? "selected" : ""} key={item.score}><input type="radio" name="understanding" value={item.score} checked={score === item.score} onChange={() => selectScore(item.score)} /><span className="rating-emoji">{item.emoji}</span><span className="rating-number">{item.score}</span><strong>{item.label}</strong></label>)}</div></fieldset>
          <label className="form-field"><span>Điều gì trong phản hồi giúp ích cho bạn? <small>(không bắt buộc)</small></span><textarea rows={4} value={note} onChange={(event) => updateNote(event.target.value)} placeholder="Ví dụ: Phản hồi giúp mình nhìn vấn đề nhỏ hơn và dễ bắt đầu hơn..." /></label>
          {score && <p className="rating-saved" role="status"><Heart size={17} /> Đã lưu đánh giá mức {score}</p>}
        </section>
        {score && <section className="next-step-card"><h2>Bạn muốn làm gì tiếp theo?</h2><div className="next-step-grid conditional">{score <= 2 ? <button type="button" onClick={() => navigate("/support/anonymous/responses")}><MessageCircleMore /><span><strong>Xem phản hồi khác</strong><small>Quay lại để đọc một phản hồi khác</small></span></button> : <button type="button" onClick={() => navigate(returnsToProgress ? state.returnTo : "/projects")}>
          {returnsToProgress ? <ArrowLeft /> : <FolderKanban />}
          <span><strong>{returnsToProgress ? "Về theo dõi tiến độ" : "Về danh sách dự án"}</strong><small>{returnsToProgress ? "Tiếp tục công việc đang làm" : "Chọn hoặc tạo một dự án"}</small></span>
        </button>}</div></section>}
      </div>
    </main>
  );
}
