import { ArrowLeft, ArrowRight, Check, Flag, Heart, MessageCircleHeart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeading } from "../components/UI";
import { createMockResponses } from "../data/mockResponses";
import { useApp } from "../store/AppContext";
import type { AnonymousPost } from "../types";

const typeLabels = { validation: "Lắng nghe", encouragement: "Động viên", perspective: "Góc nhìn", action: "Gợi ý hành động" };

export function EmpathyResponsesPage() {
  const { state, setAnonymousPost, setResponses, updateResponse } = useApp();
  const [responseIndex, setResponseIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.anonymousPost) {
      const post: AnonymousPost = { id: "sample-post", topic: "😟 Lo lắng, mất phương hướng", content: "Mình đang cố hoàn thành dự án nhưng càng làm càng thấy có quá nhiều việc. Mình không biết nên bỏ bớt phần nào và bắt đầu từ đâu.", desiredResponse: "perspective", createdAt: new Date().toISOString() };
      setAnonymousPost(post);
      setResponses(createMockResponses(post.id));
    } else if (!state.responses.length) {
      setResponses(createMockResponses(state.anonymousPost.id));
    }
  }, []);

  const post = state.anonymousPost;
  const responses = state.responses.filter((response) => !response.reported);
  const currentIndex = responses.length ? Math.min(responseIndex, responses.length - 1) : 0;
  const response = responses[currentIndex];

  const showNext = () => {
    if (!responses.length) return;
    setResponseIndex((current) => (current + 1) % responses.length);
  };

  return (
    <main className="support-page">
      <div className="support-container">
        <PageHeading eyebrow="Phản hồi đồng cảm" title="Bạn không cần tự giải quyết mọi thứ một mình" description="Đọc từng phản hồi và chú ý điều gì khiến bạn cảm thấy được lắng nghe." />
        {post && <section className="original-post"><span><MessageCircleHeart /></span><div><small>Chia sẻ của bạn · {post.topic}</small><p>{post.content}</p></div></section>}
        <div className="responses-head"><div><h2>Phản hồi {responses.length ? currentIndex + 1 : 0}/{responses.length} (dữ liệu mẫu)</h2><p>Mỗi lần chỉ hiển thị một phản hồi để bạn dễ tập trung.</p></div></div>
        {response && <section className="response-list single"><article className="response-card" key={response.id}><header><span className={`response-avatar avatar-${currentIndex + 1}`}><Sparkles /></span><div><strong>Người đồng hành ẩn danh</strong><small>Vừa xong · {typeLabels[response.responseType]}</small></div></header><p>{response.content}</p><footer><button className={response.helpful ? "active" : ""} type="button" onClick={() => updateResponse(response.id, { helpful: !response.helpful })}>{response.helpful ? <Check /> : <Heart />} {response.helpful ? "Đã đánh dấu hữu ích" : "Hữu ích"}</button><button type="button" onClick={() => updateResponse(response.id, { reported: true })}><Flag /> Báo cáo</button></footer></article></section>}
        <button className="button secondary response-next" type="button" onClick={showNext} disabled={responses.length < 2}>Xem phản hồi khác <ArrowRight size={17} /></button>
        <div className="support-actions"><button className="button ghost" type="button" onClick={() => navigate("/support/anonymous")}><ArrowLeft /> Quay lại chia sẻ</button><button className="button support" type="button" onClick={() => navigate("/support/anonymous/rating")}>Đánh giá mức độ được thấu hiểu <ArrowRight size={17} /></button></div>
      </div>
    </main>
  );
}
