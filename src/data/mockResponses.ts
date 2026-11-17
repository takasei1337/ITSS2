import type { AnonymousPost, EmpathyResponse, SimilarExperience } from "../types";

export const MOOD_OPTIONS = [
  "😟 Lo lắng, mất phương hướng",
  "😣 Áp lực vì tiến độ",
  "😕 Thiếu kỹ năng hoặc kinh nghiệm",
  "😞 Khó phối hợp với nhóm",
  "🙂 Muốn tìm một góc nhìn khác",
] as const;

export const DESIRED_TO_RESPONSE_TYPE: Record<
  AnonymousPost["desiredResponse"],
  EmpathyResponse["responseType"]
> = {
  listen: "validation",
  encourage: "encouragement",
  perspective: "perspective",
  action: "action",
};

type MoodResponseTemplate = {
  responseType: EmpathyResponse["responseType"];
  content: string;
};

const RESPONSES_BY_MOOD: Record<string, MoodResponseTemplate[]> = {
  "😟 Lo lắng, mất phương hướng": [
    {
      responseType: "validation",
      content:
        "Khi nhìn một danh sách yêu cầu quá dài mà chưa rõ bắt đầu từ đâu, cảm giác lo lắng và mông lung là điều rất nhiều sinh viên gặp phải khi mới vào đồ án.",
    },
    {
      responseType: "action",
      content:
        "Bạn thử tạm gác các tính năng mở rộng sang một bên, chỉ giữ lại 1–2 yêu cầu 'Phải có' cốt lõi nhất rồi tách thành 1 việc nhỏ làm xong trong 30 phút tới.",
    },
    {
      responseType: "perspective",
      content:
        "Mất phương hướng thường không phải vì mình kém, mà vì mình đang cố nhìn toàn bộ dự án cùng một lúc thay vì nhìn từng bước bắt đầu.",
    },
    {
      responseType: "encouragement",
      content:
        "Chỉ cần chốt được bước đầu tiên rõ ràng, sự hoang mang sẽ giảm đi rất nhanh. Bạn đã đi đúng hướng khi dừng lại để sắp xếp lại mục tiêu.",
    },
  ],
  "😣 Áp lực vì tiến độ": [
    {
      responseType: "validation",
      content:
        "Nhìn deadline đang tới gần trong khi danh sách task còn nhiều chưa xong thực sự rất dễ khiến mình căng thẳng và ngợp. Cảm giác áp lực tiến độ này hoàn toàn dễ hiểu.",
    },
    {
      responseType: "action",
      content:
        "Để giảm tải áp lực deadline ngay lúc này, hãy rà lại các đầu việc đang dở: chuyển những phần 'Nên có / Có thể có' ra sau, chỉ giữ các task cốt lõi và chọn 1 việc quan trọng nhất để hoàn thành trước tối nay.",
    },
    {
      responseType: "perspective",
      content:
        "Chạy gấp nhiều việc cùng lúc thường khiến tiến độ chậm hơn vì dễ phát sinh lỗi. Chốt gọn phạm vi để chạy trọn vẹn luồng chính luôn hiệu quả hơn làm dang dở nhiều phần.",
    },
    {
      responseType: "encouragement",
      content:
        "Chậm tiến độ một nhịp không có nghĩa là dự án sẽ thất bại. Mỗi task nhỏ được tick hoàn thành hôm nay đều giúp bạn lấy lại nhịp độ trước hạn nộp.",
    },
  ],
  "😕 Thiếu kỹ năng hoặc kinh nghiệm": [
    {
      responseType: "validation",
      content:
        "Làm đồ án với công nghệ chưa từng đụng tới luôn tạo cảm giác thiếu tự tin và sợ mình làm chậm cả nhóm. Ai bắt đầu với stack mới cũng từng trải qua giai đoạn lúng túng này.",
    },
    {
      responseType: "action",
      content:
        "Thay vì cố học hết tài liệu từ đầu, bạn có thể tham khảo cấu trúc của một dự án tương tự, dựng thử một màn hình nhỏ nhất chạy được trước rồi mới mở rộng dần.",
    },
    {
      responseType: "perspective",
      content:
        "Đồ án học phần là nơi để tập làm và học qua thực tế, không ai kỳ vọng bạn phải thành thạo mọi kỹ năng ngay từ ngày đầu tiên.",
    },
    {
      responseType: "encouragement",
      content:
        "Thiếu kinh nghiệm ban đầu chỉ là khoảng cách ngắn hạn. Khi bạn chia phần chưa biết thành từng câu hỏi nhỏ và xử lý từng bước, bạn sẽ tiến bộ nhanh hơn mình nghĩ.",
    },
  ],
  "😞 Khó phối hợp với nhóm": [
    {
      responseType: "validation",
      content:
        "Khó đồng bộ công việc hay cảm thấy các thành viên chưa nắm rõ trách nhiệm là nỗi mệt mỏi rất phổ biến khi làm project nhóm. Việc bạn thấy bức bối trong tình huống này là rất bình thường.",
    },
    {
      responseType: "action",
      content:
        "Bạn có thể đề xuất nhóm họp nhanh 10 phút để chốt lại bảng phân công: mỗi task ghi rõ 1 người phụ trách, hạn hoàn thành và tiêu chí để kiểm tra khi ghép code.",
    },
    {
      responseType: "perspective",
      content:
        "Đôi khi thành viên chậm hoặc làm lệch hướng không phải vì thiếu hợp tác, mà vì ngay từ đầu nhóm chưa thống nhất cùng một cách hiểu về đầu việc và tiêu chí hoàn thành.",
    },
    {
      responseType: "encouragement",
      content:
        "Chủ động đặt lại cách phân chia rõ ràng từ bây giờ sẽ giúp cả nhóm nhẹ đầu hơn ở giai đoạn cuối. Sự thẳng thắn mang tính xây dựng của bạn rất đáng trân trọng.",
    },
  ],
  "🙂 Muốn tìm một góc nhìn khác": [
    {
      responseType: "validation",
      content:
        "Việc chủ động dừng lại để tìm một góc nhìn mới khi đang mắc kẹt cho thấy bạn đang nhìn nhận dự án rất nghiêm túc và cầu tiến.",
    },
    {
      responseType: "perspective",
      content:
        "Thử đặt mình vào vai người dùng lần đầu mở sản phẩm của bạn: họ cần giải quyết đúng 1 vấn đề nào đầu tiên? Câu trả lời đó thường giúp lược bỏ được một nửa phần rườm rà.",
    },
    {
      responseType: "action",
      content:
        "Hãy thử đối chiếu dự án hiện tại với một dự án công khai tương tự xem họ chọn kiến trúc nào và đi qua các bước đầu ra sao, bạn có thể thấy hướng đi gọn hơn hẳn.",
    },
    {
      responseType: "encouragement",
      content:
        "Đôi khi chỉ cần đổi góc tiếp cận một chút, bài toán tưởng bế tắc sẽ trở nên rất sáng rõ. Cứ thử cho mình một phương án mới nhé!",
    },
  ],
};

const SIMILAR_EXPERIENCES: SimilarExperience[] = [
  {
    id: "exp-1",
    topic: "😣 Áp lực vì tiến độ",
    situation:
      "Trước hạn nộp 5 ngày, nhóm mình vẫn còn hơn nửa số task chưa xong và ai cũng cuống vì sợ không kịp ghép bài.",
    lesson:
      "Bọn mình dừng thêm tính năng phụ, giữ lại 4 yêu cầu 'Phải có', chia nhỏ mỗi đầu việc kèm tiêu chí rõ ràng để giải quyết gọn trong 2 ngày cuối.",
    keywords: ["deadline", "tiến độ", "chậm", "task", "hạn", "gấp", "áp lực"],
  },
  {
    id: "exp-2",
    topic: "😣 Áp lực vì tiến độ",
    situation:
      "Mình bị trễ lịch 2 task liền vì tính năng phức tạp hơn dự kiến, càng nhìn bảng tiến độ càng thấy áp lực.",
    lesson:
      "Mình tách task lớn thành 2 bước nhỏ hơn, báo với nhóm dời phần phụ sang tuần sau và tập trung làm chạy xong luồng chính trước.",
    keywords: ["trễ", "lịch", "task", "chưa xong", "deadline", "căng thẳng"],
  },
  {
    id: "exp-3",
    topic: "😟 Lo lắng, mất phương hướng",
    situation:
      "Lúc mới nhận đề tài, nhóm mình liệt kê gần 15 tính năng nhưng không biết chọn công nghệ nào và bắt đầu viết gì trước.",
    lesson:
      "Nhóm xem lại một dự án thư viện mẫu có phạm vi gần giống, chọn lại bộ React + Supabase cho vừa sức và chỉ làm 4 tính năng lõi trước.",
    keywords: ["bắt đầu", "chọn", "công nghệ", "phạm vi", "ý tưởng", "lo", "mất phương hướng"],
  },
  {
    id: "exp-4",
    topic: "😕 Thiếu kỹ năng hoặc kinh nghiệm",
    situation:
      "Nhóm mình chọn framework mới nhưng cả 4 bạn đều chưa từng làm thực tế nên mất cả tuần đầu chỉ để đọc tài liệu mà chưa ra giao diện.",
    lesson:
      "Nhóm chuyển sang dùng stack có người quen hơn ở frontend, đồng thời làm theo từng bước hướng dẫn ngắn cho từng task đầu tiên nên chạy kịp tiến độ.",
    keywords: ["kỹ năng", "kinh nghiệm", "framework", "mới", "code", "học", "chưa biết"],
  },
  {
    id: "exp-5",
    topic: "😞 Khó phối hợp với nhóm",
    situation:
      "Mỗi bạn code một kiểu, đến lúc ghép code thì xung đột Git và có việc bị trùng, việc lại bỏ sót.",
    lesson:
      "Nhóm mình quy định rõ mỗi task chỉ có 1 người phụ trách, ghi rõ tiêu chí hoàn thành trước khi nhận việc và cập nhật trạng thái cuối mỗi ngày.",
    keywords: ["nhóm", "phối hợp", "git", "code", "chia việc", "trách nhiệm", "đồng bộ"],
  },
  {
    id: "exp-6",
    topic: "🙂 Muốn tìm một góc nhìn khác",
    situation:
      "Mình thấy ứng dụng ngày càng rối vì cố nhét quá nhiều màn hình quản trị mà trải nghiệm chính lại chưa mượt.",
    lesson:
      "Khi nhìn từ góc độ người dùng cuối và đối chiếu với một bài mẫu hoàn chỉnh, mình cắt bỏ 3 màn hình ít dùng để làm thật tốt luồng cốt lõi.",
    keywords: ["góc nhìn", "ý tưởng", "rối", "thiết kế", "trải nghiệm", "khác"],
  },
];

export function findSimilarExperiences(post: Pick<AnonymousPost, "topic" | "content">): SimilarExperience[] {
  const normalizedContent = post.content.toLowerCase();
  const scored = SIMILAR_EXPERIENCES.map((exp) => {
    let score = exp.topic === post.topic ? 5 : 0;
    for (const kw of exp.keywords) {
      if (normalizedContent.includes(kw)) score += 2;
    }
    return { exp, score };
  }).sort((a, b) => b.score - a.score);

  return scored.slice(0, 2).map((item) => item.exp);
}

export function createMockResponses(postOrId: AnonymousPost | string): EmpathyResponse[] {
  const post: AnonymousPost =
    typeof postOrId === "string"
      ? {
          id: postOrId,
          topic: MOOD_OPTIONS[0],
          content: "",
          desiredResponse: "listen",
          createdAt: new Date().toISOString(),
        }
      : postOrId;

  const templates = RESPONSES_BY_MOOD[post.topic] ?? RESPONSES_BY_MOOD[MOOD_OPTIONS[0]];
  const preferredType = DESIRED_TO_RESPONSE_TYPE[post.desiredResponse];

  const ordered = [
    ...templates.filter((item) => item.responseType === preferredType),
    ...templates.filter((item) => item.responseType !== preferredType),
  ];

  return ordered.map((item, index) => ({
    id: `${post.id}-response-${index + 1}`,
    postId: post.id,
    content: item.content,
    responseType: item.responseType,
    matchedTopic: post.topic,
    helpful: false,
    reported: false,
  }));
}
