import type { EmpathyResponse } from "../types";

export const createMockResponses = (postId: string): EmpathyResponse[] => [
  {
    id: "response-1",
    postId,
    content: "Nghe như bạn đã cố gắng giữ rất nhiều phần việc cùng lúc. Cảm giác quá tải trong tình huống này là hoàn toàn dễ hiểu.",
    responseType: "validation",
    helpful: false,
    reported: false,
  },
  {
    id: "response-2",
    postId,
    content: "Bạn không cần giải quyết mọi thứ trong một lần. Có thể chọn một việc nhỏ nhất giúp dự án tiến lên, hoàn thành nó rồi mới quyết định bước tiếp theo.",
    responseType: "action",
    helpful: false,
    reported: false,
  },
  {
    id: "response-3",
    postId,
    content: "Việc bạn dừng lại để nhìn nhận khó khăn đã là một bước quan trọng. Dự án chậm lại không có nghĩa là bạn đang thất bại.",
    responseType: "encouragement",
    helpful: false,
    reported: false,
  },
];
