import type { Project, ProjectStatus, Requirement, Task } from "../types";

export const KNOWN_SKILL_OPTIONS = [
  "HTML/CSS/JS",
  "TypeScript",
  "React",
  "Vue",
  "Node.js",
  "Python",
  "Flutter",
  "PostgreSQL / SQL",
  "Firebase",
  "Supabase",
  "Java",
  "Git",
] as const;

export const suggestedRequirements: Requirement[] = [
  {
    id: "suggest-login",
    title: "Đăng nhập",
    description: "Thành viên truy cập đúng không gian của nhóm.",
    priority: "must",
    successCriteria: "Nhập đúng thông tin sẽ vào không gian nhóm; nhập sai hiển thị thông báo rõ ràng.",
  },
  {
    id: "suggest-project",
    title: "Tạo dự án",
    description: "Khởi tạo dự án và lưu thông tin cơ bản.",
    priority: "must",
    successCriteria: "Tạo xong dự án mới thấy xuất hiện trong danh sách và giữ được sau khi tải lại trang.",
  },
  {
    id: "suggest-assign",
    title: "Giao việc",
    description: "Phân công đầu việc cho từng thành viên.",
    priority: "must",
    successCriteria: "Mỗi đầu việc gán được người phụ trách, hạn hoàn thành và lưu lại ngay.",
  },
  {
    id: "suggest-progress",
    title: "Theo dõi tiến độ",
    description: "Đánh dấu hoàn thành và xem phần trăm tiến độ.",
    priority: "must",
    successCriteria: "Đánh dấu xong một đầu việc làm phần trăm tiến độ cập nhật chính xác ngay lập tức.",
  },
];

export function getDefaultTaskGuide(title: string, requirementId?: string): {
  howToSteps: string[];
  acceptanceCriteria: string;
} {
  const normalized = title.toLowerCase();

  if (requirementId === "suggest-login" || normalized.includes("đăng nhập") || normalized.includes("tài khoản")) {
    return {
      howToSteps: [
        "Tạo giao diện biểu mẫu gồm ô email/tên đăng nhập, mật khẩu và nút xác nhận.",
        "Kiểm tra dữ liệu trống hoặc sai định dạng trước khi gửi yêu cầu.",
        "Lưu trạng thái đăng nhập và chuyển hướng vào trang làm việc chính của nhóm.",
      ],
      acceptanceCriteria: "Đăng nhập hợp lệ vào đúng không gian nhóm; nhập sai hoặc bỏ trống có thông báo lỗi rõ ràng.",
    };
  }

  if (requirementId === "suggest-project" || normalized.includes("tạo dự án") || normalized.includes("khởi tạo")) {
    return {
      howToSteps: [
        "Thiết kế form nhập tên dự án, mô tả vấn đề và các trường thông tin cơ bản.",
        "Thêm kiểm tra bắt buộc cho tên dự án và mô tả vấn đề tối thiểu.",
        "Lưu dự án vào kho dữ liệu và hiển thị ngay trong danh sách dự án.",
      ],
      acceptanceCriteria: "Tạo dự án thành công, quay lại danh sách thấy thẻ dự án mới và dữ liệu còn nguyên khi refresh.",
    };
  }

  if (requirementId === "suggest-assign" || normalized.includes("giao việc") || normalized.includes("phân công")) {
    return {
      howToSteps: [
        "Hiển thị danh sách công việc kèm cột chọn người phụ trách từ thành viên nhóm.",
        "Cho phép chọn hạn hoàn thành và mức ưu tiên cho từng công việc.",
        "Cập nhật cảnh báo số việc chưa phân công khi còn ô để trống.",
      ],
      acceptanceCriteria: "Chọn được người phụ trách và hạn cho từng task; thay đổi được lưu ngay không cần tải lại trang.",
    };
  }

  if (requirementId === "suggest-progress" || normalized.includes("tiến độ") || normalized.includes("theo dõi")) {
    return {
      howToSteps: [
        "Hiển thị danh sách công việc với checkbox đánh dấu hoàn thành.",
        "Tính toán phần trăm bằng số công việc hoàn thành chia tổng số công việc.",
        "Thêm bộ lọc theo tên hoặc người phụ trách để nhóm kiểm tra nhanh.",
      ],
      acceptanceCriteria: "Tích hoặc bỏ tích một công việc sẽ cập nhật ngay số liệu và vòng tròn phần trăm tiến độ.",
    };
  }

  if (normalized.includes("tìm kiếm") || normalized.includes("tra cứu") || normalized.includes("lọc")) {
    return {
      howToSteps: [
        "Tạo ô nhập từ khóa tìm kiếm và bộ lọc theo trạng thái hoặc danh mục.",
        "Lọc danh sách theo thời gian thực khi người dùng gõ hoặc chọn điều kiện.",
        "Hiển thị trạng thái rỗng kèm gợi ý đặt lại bộ lọc khi không có kết quả.",
      ],
      acceptanceCriteria: "Tìm thấy đúng mục khớp từ khóa và hiển thị thông báo rõ ràng khi không có dữ liệu phù hợp.",
    };
  }

  if (normalized.includes("thanh toán") || normalized.includes("đặt") || normalized.includes("lịch") || normalized.includes("mượn")) {
    return {
      howToSteps: [
        "Xác định dữ liệu đầu vào cần thiết (thời gian, đối tượng, xác nhận).",
        "Kiểm tra trùng lặp hoặc điều kiện hợp lệ trước khi lưu giao dịch.",
        "Hiển thị trạng thái xác nhận sau khi hoàn tất thao tác.",
      ],
      acceptanceCriteria: "Thao tác tạo mới hoặc đặt thành công, tránh trùng lịch/trùng dữ liệu và lưu lại trạng thái rõ ràng.",
    };
  }

  return {
    howToSteps: [
      `Xác định phạm vi và đầu ra tối thiểu cho phần "${title}".`,
      "Xây dựng giao diện và xử lý dữ liệu cho luồng sử dụng chính.",
      "Kiểm tra các trường hợp nhập thiếu hoặc lỗi và rà soát trên mobile/desktop.",
    ],
    acceptanceCriteria: `Luồng "${title}" chạy ổn định ở trường hợp chính, lưu được thay đổi và không phát sinh lỗi giao diện.`,
  };
}

export function getAllKnownSkills(project: Pick<Project, "knownSkills" | "knownSkillsNote">): string[] {
  const base = Array.isArray(project.knownSkills) ? project.knownSkills : [];
  const extra = (project.knownSkillsNote ?? "")
    .split(/[,;/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set([...base, ...extra])];
}

export function scoreProjectSimilarity(target: Project, candidate: Project): number {
  let score = 0;
  if (target.projectType && candidate.projectType && target.projectType.toLowerCase() === candidate.projectType.toLowerCase()) {
    score += 4;
  }
  if (target.field && candidate.field) {
    const tf = target.field.toLowerCase();
    const cf = candidate.field.toLowerCase();
    if (tf === cf || tf.includes(cf) || cf.includes(tf)) score += 3;
  }

  const targetWords = new Set(
    `${target.name} ${target.problemStatement} ${target.objective}`
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const candidateText = `${candidate.name} ${candidate.problemStatement} ${candidate.objective}`.toLowerCase();
  for (const word of targetWords) {
    if (candidateText.includes(word)) score += 1;
  }

  const skills = getAllKnownSkills(target).map((s) => s.toLowerCase());
  const candidateTechs = Object.values(candidate.technologies)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const skill of skills) {
    if (candidateTechs.includes(skill) || (skill.includes("sql") && candidateTechs.includes("postgresql"))) {
      score += 2;
    }
  }

  return score;
}

export function findSimilarPublicProjects(target: Project, publicProjects: Project[]) {
  const ranked = [...publicProjects]
    .map((candidate) => ({
      project: candidate,
      score: scoreProjectSimilarity(target, candidate),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.project);

  const preferred = target.referenceProjectId
    ? ranked.find((item) => item.id === target.referenceProjectId)
    : undefined;

  return {
    bestMatch: preferred ?? ranked[0],
    ranked,
  };
}

export type TechOptionRecommendation = {
  name: string;
  detail: string;
  suitability: string;
  recommended: boolean;
  matchesKnownSkill: boolean;
  matchesReference: boolean;
};

export type TechGroupRecommendation = {
  key: "frontend" | "backend" | "database" | "hosting";
  label: string;
  options: TechOptionRecommendation[];
};

const BASE_TECH_OPTIONS: Record<
  "frontend" | "backend" | "database" | "hosting",
  Array<{ name: string; detail: string; skillHints: string[] }>
> = {
  frontend: [
    { name: "React", detail: "Hệ sinh thái lớn, phù hợp ứng dụng tương tác", skillHints: ["react", "typescript", "html/css/js"] },
    { name: "Vue", detail: "Dễ tiếp cận và cấu trúc gọn", skillHints: ["vue", "html/css/js"] },
    { name: "Flutter", detail: "Xây dựng ứng dụng di động đa nền tảng", skillHints: ["flutter"] },
    { name: "HTML/CSS/JS", detail: "Phù hợp sản phẩm đơn giản, ít trạng thái", skillHints: ["html/css/js"] },
  ],
  backend: [
    { name: "Node.js", detail: "Dùng chung JavaScript/TypeScript với frontend", skillHints: ["node.js", "typescript"] },
    { name: "Supabase", detail: "Triển khai nhanh, ít code backend", skillHints: ["supabase", "postgresql / sql"] },
    { name: "Firebase", detail: "Tích hợp nhanh cho ứng dụng mobile & realtime", skillHints: ["firebase"] },
    { name: "Không cần", detail: "Phù hợp ứng dụng lưu dữ liệu cục bộ hoặc tĩnh", skillHints: [] },
  ],
  database: [
    { name: "PostgreSQL", detail: "Ổn định, linh hoạt cho dữ liệu quan hệ", skillHints: ["postgresql / sql", "sql", "postgres"] },
    { name: "Supabase", detail: "Database có sẵn API và xác thực", skillHints: ["supabase", "postgresql / sql"] },
    { name: "Firebase", detail: "Đồng bộ dữ liệu nhanh cho mobile/web nhỏ", skillHints: ["firebase"] },
    { name: "Không cần", detail: "Không lưu dữ liệu trên máy chủ", skillHints: [] },
  ],
  hosting: [
    { name: "Vercel", detail: "Triển khai frontend nhanh từ GitHub", skillHints: ["react", "vue", "git"] },
    { name: "Netlify", detail: "Static hosting đơn giản, dễ cấu hình", skillHints: ["html/css/js", "git"] },
    { name: "Firebase Hosting", detail: "Thuận tiện khi dùng kèm Firebase", skillHints: ["firebase", "flutter"] },
    { name: "Local", detail: "Chỉ chạy trên máy cá nhân khi kiểm tra", skillHints: [] },
  ],
};

export function getTechnologyRecommendations(
  project: Project,
  referenceProject?: Project
): TechGroupRecommendation[] {
  const skills = getAllKnownSkills(project).map((s) => s.toLowerCase());
  const isMobile = project.projectType === "Mobile app";
  const isShortDuration = /tuần|1–2 tuần|2–3 tuần|ngắn/i.test(project.expectedDuration ?? "");
  const hasMustRequirements = project.requirements.filter((r) => r.priority === "must").length;

  const buildGroup = (
    key: "frontend" | "backend" | "database" | "hosting",
    label: string
  ): TechGroupRecommendation => {
    const scored = BASE_TECH_OPTIONS[key].map((opt) => {
      const matchesKnownSkill = opt.skillHints.some((hint) =>
        skills.some((sk) => sk === hint || sk.includes(hint) || hint.includes(sk))
      );
      const matchesReference = referenceProject?.technologies?.[key] === opt.name;

      let priorityScore = 0;
      if (matchesKnownSkill) priorityScore += 4;
      if (matchesReference) priorityScore += 3;
      if (key === "frontend" && isMobile && opt.name === "Flutter") priorityScore += 5;
      if (key === "frontend" && !isMobile && opt.name === "React") priorityScore += 2;
      if (key === "backend" && isShortDuration && (opt.name === "Supabase" || opt.name === "Firebase")) priorityScore += 3;
      if (key === "backend" && !isShortDuration && opt.name === "Node.js") priorityScore += 1;
      if (key === "database" && isMobile && opt.name === "Firebase") priorityScore += 3;
      if (key === "database" && !isMobile && opt.name === "PostgreSQL") priorityScore += 1;
      if (key === "hosting" && opt.name === "Vercel" && !isMobile) priorityScore += 2;
      if (key === "hosting" && opt.name === "Firebase Hosting" && isMobile) priorityScore += 3;
      if (opt.name === "Không cần" && hasMustRequirements > 1) priorityScore -= 5;
      if (opt.name === "Local") priorityScore -= 4;

      const reasons: string[] = [];
      if (matchesKnownSkill) reasons.push("Khớp kiến thức sẵn có");
      if (matchesReference && referenceProject) reasons.push(`Dùng trong "${referenceProject.name}"`);
      if (key === "frontend" && isMobile && opt.name === "Flutter") reasons.push("Tối ưu cho Mobile app");
      if (isShortDuration && (opt.name === "Supabase" || opt.name === "Firebase" || opt.name === "Vercel")) {
        reasons.push("Triển khai nhanh kịp hạn");
      }

      let suitability = "Cân nhắc";
      if (opt.name === "Không cần") {
        suitability = hasMustRequirements > 2 ? "Không khuyến nghị khi có nhiều nghiệp vụ" : "Chỉ phù hợp trang tĩnh";
      } else if (opt.name === "Local") {
        suitability = "Chỉ phù hợp kiểm tra nội bộ";
      } else if (priorityScore >= 4) {
        suitability = `Rất phù hợp (${reasons.join(" · ") || "Phù hợp đề tài"})`;
      } else if (priorityScore >= 2) {
        suitability = `Phù hợp${reasons.length ? ` (${reasons.join(" · ")})` : ""}`;
      } else if (reasons.length) {
        suitability = `Khả thi (${reasons.join(" · ")})`;
      } else if (skills.length > 0) {
        suitability = "Cần thêm thời gian làm quen";
      }

      return {
        name: opt.name,
        detail: opt.detail,
        suitability,
        priorityScore,
        matchesKnownSkill,
        matchesReference,
      };
    });

    const maxScore = Math.max(...scored.map((item) => item.priorityScore));
    let recommendedAssigned = false;

    return {
      key,
      label,
      options: scored.map((item) => {
        const shouldRecommend = !recommendedAssigned && item.priorityScore === maxScore && item.priorityScore > 0;
        if (shouldRecommend) recommendedAssigned = true;
        return {
          name: item.name,
          detail: item.detail,
          suitability: item.suitability,
          recommended: shouldRecommend,
          matchesKnownSkill: item.matchesKnownSkill,
          matchesReference: item.matchesReference,
        };
      }),
    };
  };

  return [
    buildGroup("frontend", "Frontend"),
    buildGroup("backend", "Backend"),
    buildGroup("database", "Database"),
    buildGroup("hosting", "Hosting"),
  ];
}

export function getSuggestedRoadmap(project: Project, referenceProject?: Project): string[] {
  if (referenceProject?.starterRoadmap?.length) {
    return referenceProject.starterRoadmap;
  }
  const mustTitles = project.requirements
    .filter((item) => item.priority === "must")
    .slice(0, 2)
    .map((item) => item.title)
    .join(", ");

  return [
    `Bước 1 — Chốt khung dự án & môi trường (${project.technologies.frontend || "Frontend"} + ${project.technologies.hosting || "Hosting"}) cho ${project.memberCount || "nhóm"}.`,
    `Bước 2 — Làm trước các yêu cầu cốt lõi (${mustTitles || "luồng chính"}) trong nửa đầu thời hạn ${project.expectedDuration || "dự kiến"}.`,
    "Bước 3 — Chia đầu việc rõ người phụ trách, kèm cách làm và tiêu chí hoàn thành cho từng nhiệm vụ.",
    "Bước 4 — Kiểm thử luồng chính, sửa lỗi ưu tiên cao và chuẩn bị bản triển khai cuối.",
  ];
}

export function calculateTaskProgress(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
}

export function getProjectProgress(project: Project) {
  return calculateTaskProgress(project.tasks);
}

export function getProjectDisplayStatus(project: Project): ProjectStatus {
  const progress = getProjectProgress(project);
  const checklistComplete = Object.values(project.completion).every(Boolean);
  if (project.tasks.some((task) => task.blocked)) return "blocked";
  if (progress === 100 && checklistComplete) return "completed";
  if (progress === 100 || checklistComplete) return "review";
  if (project.tasks.length) return progress > 0 ? "in_progress" : "setup";
  return "setup";
}
