import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Heart,
  MessageCircleHeart,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeading } from "../components/UI";
import {
  createMockResponses,
  DESIRED_TO_RESPONSE_TYPE,
  findSimilarExperiences,
  MOOD_OPTIONS,
} from "../data/mockResponses";
import { useApp } from "../store/AppContext";
import type { AnonymousPost } from "../types";

const typeLabels = {
  validation: "Lắng nghe",
  encouragement: "Động viên",
  perspective: "Góc nhìn",
  action: "Gợi ý hành động",
};

const desiredLabels: Record<AnonymousPost["desiredResponse"], string> = {
  listen: "Chỉ cần được lắng nghe",
  encourage: "Muốn nhận lời động viên",
  perspective: "Muốn nghe góc nhìn khác",
  action: "Muốn nhận gợi ý hành động",
};

export function EmpathyResponsesPage() {
  const { state, setAnonymousPost, setResponses, updateResponse } = useApp();
  const [responseIndex, setResponseIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.anonymousPost) {
      const post: AnonymousPost = {
        id: "sample-post",
        topic: MOOD_OPTIONS[0],
        content:
          "Mình đang cố hoàn thành dự án nhưng càng làm càng thấy có quá nhiều việc. Mình không biết nên bỏ bớt phần nào và bắt đầu từ đâu.",
        desiredResponse: "perspective",
        createdAt: new Date().toISOString(),
      };
      setAnonymousPost(post);
      setResponses(createMockResponses(post));
    } else if (!state.responses.length || state.responses[0]?.postId !== state.anonymousPost.id) {
      setResponses(createMockResponses(state.anonymousPost));
    }
  }, []);

  useEffect(() => {
    setResponseIndex(0);
  }, [state.anonymousPost?.id]);

  const post = state.anonymousPost;
  const responses = state.responses.filter((response) => !response.reported);
  const currentIndex = responses.length ? Math.min(responseIndex, responses.length - 1) : 0;
  const response = responses[currentIndex];
  const preferredType = post ? DESIRED_TO_RESPONSE_TYPE[post.desiredResponse] : undefined;

  const similarExperiences = useMemo(
    () => (post ? findSimilarExperiences(post) : []),
    [post]
  );

  const showNext = () => {
    if (!responses.length) return;
    setResponseIndex((current) => (current + 1) % responses.length);
  };

  return (
    <main className="support-page">
      <div className="support-container">
        <PageHeading
          eyebrow="Phản hồi đồng cảm"
          title="Bạn không cần tự giải quyết mọi thứ một mình"
          description="Hệ thống ghép chia sẻ của bạn với trải nghiệm tương tự và phản hồi phù hợp với cảm xúc hiện tại."
        />

        {post && (
          <section className="original-post">
            <span>
              <MessageCircleHeart />
            </span>
            <div>
              <small>
                Chia sẻ của bạn · {post.topic} · {desiredLabels[post.desiredResponse]}
              </small>
              <p>{post.content}</p>
            </div>
          </section>
        )}

        {similarExperiences.length > 0 && (
          <section className="similar-experiences-section" aria-label="Trải nghiệm tương tự">
            <div className="similar-exp-head">
              <UsersRound size={17} />
              <h2>Trải nghiệm tương tự với cảm xúc của bạn</h2>
            </div>
            <div className="similar-exp-grid">
              {similarExperiences.map((exp) => (
                <article className="similar-exp-card" key={exp.id}>
                  <small>{exp.topic}</small>
                  <p>{exp.situation}</p>
                  <blockquote>
                    <strong>Cách nhóm đã vượt qua:</strong> {exp.lesson}
                  </blockquote>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="responses-head">
          <div>
            <h2>
              Phản hồi {responses.length ? currentIndex + 1 : 0}/{responses.length}
            </h2>
            <p>Ưu tiên hiển thị phản hồi khớp với cảm xúc và mong muốn bạn đã chọn.</p>
          </div>
        </div>

        {response && (
          <section className="response-list single">
            <article className="response-card" key={response.id}>
              <header>
                <span className={`response-avatar avatar-${(currentIndex % 3) + 1}`}>
                  <Sparkles />
                </span>
                <div>
                  <strong>Người đồng hành ẩn danh</strong>
                  <small>
                    Phù hợp cảm xúc · {typeLabels[response.responseType]}
                  </small>
                </div>
                {preferredType === response.responseType && (
                  <span className="response-match-badge">Khớp mong muốn</span>
                )}
              </header>
              <p>{response.content}</p>
              <footer>
                <button
                  className={response.helpful ? "active" : ""}
                  type="button"
                  onClick={() => updateResponse(response.id, { helpful: !response.helpful })}
                >
                  {response.helpful ? <Check /> : <Heart />}{" "}
                  {response.helpful ? "Đã đánh dấu hữu ích" : "Hữu ích"}
                </button>
                <button
                  type="button"
                  onClick={() => updateResponse(response.id, { reported: true })}
                >
                  <Flag /> Báo cáo
                </button>
              </footer>
            </article>
          </section>
        )}

        <button
          className="button secondary response-next"
          type="button"
          onClick={showNext}
          disabled={responses.length < 2}
        >
          Xem phản hồi khác <ArrowRight size={17} />
        </button>

        <div className="support-actions">
          <button
            className="button ghost"
            type="button"
            onClick={() => navigate("/support/anonymous")}
          >
            <ArrowLeft /> Quay lại chia sẻ
          </button>
          <button
            className="button support"
            type="button"
            onClick={() => navigate("/support/anonymous/rating")}
          >
            Đánh giá mức độ được thấu hiểu <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </main>
  );
}
