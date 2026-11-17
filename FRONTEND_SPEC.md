# Đặc tả frontend – Project Compass

## 1. Mục tiêu sản phẩm

Project Compass là công cụ quản lý dự án chung dành cho sinh viên làm dự án nhóm. Ứng dụng giúp nhóm xác định yêu cầu, chọn công nghệ, lập kế hoạch, phân công, theo dõi tiến độ và tổng kết kết quả.

Ứng dụng cũng cung cấp luồng chia sẻ ẩn danh để người dùng nhận phản hồi đồng cảm khi gặp khó khăn trong quá trình làm dự án.

## 2. Nguyên tắc nội dung

- Mọi nội dung hiển thị phải phục vụ trực tiếp cho người dùng.
- Không hiển thị các nhãn như “prototype”, “nghiên cứu”, “phỏng vấn”, “demo” hoặc “mô phỏng”.
- Không đưa hướng dẫn dành cho người điều phối vào giao diện người dùng.
- Không hiển thị công cụ ghi log, bảng sự kiện hoặc thông tin kỹ thuật nội bộ.
- Dùng tiếng Việt rõ ràng, ngắn gọn và nhất quán.
- Tên màn hình S01–S11 chỉ dùng để đối chiếu đặc tả; không phải thông tin bắt buộc phải nhấn mạnh trên giao diện.
- Không hiển thị mã S01–S11 trong eyebrow, nút điều hướng hoặc thẻ dự án.

Phạm vi triển khai hiện tại là bản nộp Phase 1 của môn học; đây không phải loại dự án mà ứng dụng quản lý.

## 3. Phạm vi Phase 1

### Có trong Phase 1

- Xem, tìm kiếm và lọc danh sách dự án.
- Tạo và cập nhật thông tin dự án.
- Xác định và ưu tiên yêu cầu dự án.
- Chọn công nghệ.
- Tạo kế hoạch và phân công công việc.
- Theo dõi tiến độ theo trạng thái.
- Kiểm tra mức độ hoàn thiện.
- Xem kết quả dự án.
- Chia sẻ ẩn danh.
- Xem phản hồi đồng cảm.
- Đánh giá mức độ được thấu hiểu.
- Lưu dữ liệu trên trình duyệt và đặt lại dữ liệu.

### Chưa có trong Phase 1

- Đăng nhập và phân quyền.
- Đồng bộ nhiều thiết bị.
- Backend và cơ sở dữ liệu thật.
- Gửi email hoặc thông báo đẩy.
- Trò chuyện thời gian thực.
- Thanh toán.
- Quản trị nội dung.
- Phân tích hành vi hoặc ghi log nghiên cứu.

## 4. Cấu trúc màn hình và route

| Màn hình | Chức năng | Route |
|---|---|---|
| S01 | Danh sách dự án | `/projects` |
| S02 | Khởi tạo hoặc cập nhật dự án | `/projects/new`, `/projects/:projectId/setup` |
| S03 | Xác định yêu cầu | `/projects/:projectId/requirements` |
| S04 | Lựa chọn công nghệ | `/projects/:projectId/technology` |
| S05 | Kế hoạch và phân công | `/projects/:projectId/planning` |
| S06 | Theo dõi tiến độ | `/projects/:projectId/progress` |
| S07 | Kiểm tra hoàn thiện | `/projects/:projectId/review` |
| S08 | Kết quả dự án | `/projects/:projectId/result` |
| S09 | Chia sẻ ẩn danh | `/support/anonymous` |
| S10 | Phản hồi đồng cảm | `/support/anonymous/responses` |
| S11 | Đánh giá mức độ được thấu hiểu | `/support/anonymous/rating` |

## 5. Luồng chính

### 5.1 Luồng tạo và hoàn thiện dự án

1. Người dùng mở S01.
2. Chọn “Tạo dự án mới” để vào S02.
3. Nhập thông tin dự án và tiếp tục sang S03.
4. Thêm yêu cầu, xác định độ ưu tiên và tiếp tục sang S04.
5. Chọn công nghệ phù hợp và tiếp tục sang S05.
6. Tạo công việc, phân công người thực hiện và bắt đầu theo dõi tại S06.
7. Cập nhật trạng thái công việc tại S06.
8. Chọn “Kiểm tra hoàn thiện” để vào S07.
9. Đánh dấu đủ các tiêu chí để mở khóa nút xem S08.
10. Từ S08, quay về danh sách dự án.

### 5.2 Luồng quay lại

- S02 → S01.
- S03 → S02.
- S04 → S03.
- S05 → S04.
- S06 → S05.
- S07 → S06.
- S08 → S01.
- S04 hoặc S06 có thể quay về S03 để điều chỉnh yêu cầu.

### 5.3 Luồng chia sẻ ẩn danh

1. Người dùng có thể vào S09 từ S01 hoặc S06.
2. Chọn chủ đề, nhập nội dung và chọn loại phản hồi mong muốn.
3. Chọn “Đăng ẩn danh” để vào S10.
4. Tại S10, người dùng có thể đánh dấu phản hồi hữu ích, báo cáo phản hồi hoặc chuyển sang S11.
5. Tại S11, người dùng chọn mức đánh giá từ 1 đến 5 và có thể nhập ghi chú.
6. Sau khi lưu, người dùng có thể xem phản hồi khác, chia sẻ lần nữa, quay về điểm bắt đầu hoặc về danh sách dự án.

## 6. Yêu cầu từng màn hình

### S01 – Danh sách dự án

- Hiển thị tên, mô tả, trạng thái, tiến độ, thời gian cập nhật và người phụ trách.
- Có tìm kiếm theo tên hoặc mô tả.
- Có lọc theo trạng thái.
- Bộ lọc trạng thái dùng dropdown tùy chỉnh; popup phải thẳng và rộng đúng bằng ô điều khiển.
- Có hành động “Tạo dự án mới”.
- Có hành động “Chia sẻ ẩn danh”.
- Khi mở dự án, chuyển tới bước gần nhất của dự án đó.

### S02 – Khởi tạo dự án

- Trường bắt buộc: tên dự án và vấn đề cần giải quyết.
- Trường tùy chọn: người dùng mục tiêu, mục tiêu, loại dự án, người thực hiện và ngày dự kiến.
- Hiển thị lỗi ngay gần trường nhập.
- Khi hợp lệ, tạo hoặc cập nhật dự án rồi chuyển sang S03.

### S03 – Xác định yêu cầu

- Hiển thị bốn yêu cầu gợi ý được chọn sẵn: đăng nhập, tạo dự án, giao việc và theo dõi tiến độ.
- Hiển thị dòng giải thích rằng các nhóm tương tự thường bắt đầu với các yêu cầu này.
- Cho phép thêm, sửa và xóa yêu cầu.
- Form thêm yêu cầu có lựa chọn mức ưu tiên trước khi tạo thẻ.
- Mỗi yêu cầu có tên, mô tả, tiêu chí thành công và độ ưu tiên.
- Độ ưu tiên gồm: Must, Should, Could và Won’t.
- Phải có ít nhất một yêu cầu trước khi tiếp tục.

### S04 – Lựa chọn công nghệ

- Cho phép chọn frontend, backend, database và hosting.
- Frontend và hosting là lựa chọn bắt buộc.
- Hiển thị mô tả ngắn giúp người dùng hiểu từng lựa chọn.
- Mỗi lựa chọn có mức độ phù hợp; dòng “Đã chọn” cập nhật ngay tại chỗ.
- Lưu lựa chọn ngay khi thay đổi, kể cả khi người dùng quay lại màn trước.
- Cho phép quay lại điều chỉnh yêu cầu.

### S05 – Kế hoạch và phân công

- Cho phép tạo công việc từ yêu cầu.
- Mỗi công việc có tên, người phụ trách, mức ưu tiên, hạn hoàn thành và trạng thái.
- Người phụ trách được chọn từ danh sách thành viên của nhóm.
- Mọi chỉnh sửa công việc được lưu ngay khi thay đổi.
- Hiển thị cảnh báo khi còn công việc chưa có người phụ trách.
- Phải có ít nhất một công việc trước khi tiếp tục.

### S06 – Theo dõi tiến độ

- Hiển thị công việc dưới dạng checklist.
- Khi tích hoặc bỏ tích một công việc, phần trăm tiến độ cập nhật ngay.
- S01, S06 và S08 dùng cùng một công thức: số task hoàn thành chia tổng số task.
- Hiển thị tổng tiến độ và số công việc bị chặn.
- Bộ lọc người phụ trách dùng cùng dropdown tùy chỉnh với bộ lọc trạng thái ở S01.
- Có lối vào chia sẻ ẩn danh khi người dùng gặp khó khăn.

### S07 – Kiểm tra hoàn thiện

- Các tiêu chí gồm: yêu cầu chính, responsive, lỗi nghiêm trọng và hướng dẫn sử dụng.
- Không có nhóm kết luận riêng.
- Nút xem kết quả bị khóa rõ ràng cho tới khi đủ bốn tiêu chí.
- Task bắt buộc chưa hoàn thành vẫn được cảnh báo nhưng không khóa nút sau khi checklist đạt 4/4.
- Nút quay lại ghi rõ đích S06.

### S08 – Kết quả dự án

- Hiển thị trạng thái tổng kết, yêu cầu bắt buộc, số công việc hoàn thành và tiến độ cuối.
- Tổng hợp giá trị dự án, vấn đề, người dùng mục tiêu và công nghệ.
- Hiển thị phạm vi đã hoàn thành.
- Có ô góp ý “Bạn thấy luồng này có giúp bạn tự tin bắt đầu dự án không?”.
- Gửi trống hiển thị lỗi tại chỗ; gửi thành công hiển thị lời cảm ơn và không chuyển màn.

### S09 – Chia sẻ ẩn danh

- Hiển thị rõ rằng danh tính không xuất hiện cùng bài chia sẻ.
- Ô chia sẻ để trống khi mở màn hình; người dùng chọn tâm trạng từ danh sách.
- Nội dung tối thiểu 20 ký tự, tối đa 1000 ký tự.
- Cho phép chọn loại phản hồi mong muốn.
- Không yêu cầu tên, email hoặc thông tin định danh.
- Hiển thị các chia sẻ ẩn danh mẫu kèm phản hồi dưới biểu mẫu.

### S10 – Phản hồi đồng cảm

- Hiển thị lại nội dung người dùng đã chia sẻ.
- Mỗi lần chỉ hiển thị một trong ba phản hồi và đánh số `Phản hồi 1/3`, `2/3`, `3/3`.
- “Xem phản hồi khác” đổi thẻ ngay tại chỗ và không đổi URL.
- Cho phép đánh dấu hữu ích hoặc báo cáo.
- Có hành động chuyển sang đánh giá mức độ được thấu hiểu.

### S11 – Đánh giá mức độ được thấu hiểu

- Bắt buộc chọn một mức từ 1 đến 5.
- Ghi chú là tùy chọn.
- Mức 1–2 hiển thị hành động quay lại S10 xem phản hồi khác.
- Mức 3–5 hiển thị hành động về S06 nếu bắt đầu từ tiến độ, hoặc S01 nếu bắt đầu từ danh sách dự án.

## 7. Điều hướng và trạng thái

- Route không hợp lệ chuyển về `/projects`.
- Route dự án không tồn tại chuyển về `/projects`.
- Refresh trang không làm mất dữ liệu đã nhập.
- Ứng dụng ghi nhớ dự án đang mở và điểm quay lại của luồng chia sẻ ẩn danh.
- “Đặt lại dữ liệu” phải có bước xác nhận.

## 8. Dữ liệu cục bộ

Dữ liệu được lưu trong `localStorage` với key `project-compass.state.v2`.

```ts
type AppState = {
  projects: Project[];
  currentProjectId: string | null;
  anonymousPost: AnonymousPost | null;
  responses: EmpathyResponse[];
  rating: UnderstandingRating | null;
  returnTo: string;
};
```

Không lưu mật khẩu, token, email hoặc dữ liệu định danh nhạy cảm.

## 9. Giao diện và responsive

- Desktop: nội dung có chiều rộng tối đa, card theo lưới và bảng công việc nhiều cột.
- Tablet: giảm số cột và giữ vùng bấm đủ lớn.
- Mobile: chuyển về một cột; các hành động chính dễ chạm; không tràn ngang.
- Thanh hành động nằm sau nội dung, không cố định đè lên vùng đang đọc.
- Trạng thái “Hoàn thành” trên thẻ dự án chỉ xuất hiện khi checklist đạt và 100% task hoàn thành.
- Màu cam được dùng có chủ đích cho các hành động trong khu vực hỗ trợ ẩn danh; luồng quản lý dự án dùng màu xanh dương.
- Trạng thái hover chỉ dùng để tăng phản hồi thị giác, không làm thay đổi hoặc che nội dung quan trọng.
- Focus bàn phím phải rõ ràng.
- Màu sắc phải đủ tương phản.
- Các trường ngày ở S02 và S05 dùng nút mở lịch có nhãn tiếng Việt; input ngày native được ẩn khỏi accessibility tree để tránh nhãn trình duyệt bị lặp.
- Icon dùng từ `lucide-react`, không phụ thuộc đường dẫn ảnh bên ngoài.

## 10. Tiêu chí hoàn thành

- Tất cả route S01–S11 hoạt động.
- Luồng dự án có thể đi từ S01 đến S08 và quay lại.
- Luồng chia sẻ có thể đi từ S09 đến S11 và quay lại đúng điểm bắt đầu.
- Validation hoạt động tại các bước bắt buộc.
- Dữ liệu được khôi phục sau khi refresh.
- Đặt lại dữ liệu hoạt động sau bước xác nhận.
- Không có nội dung dành riêng cho nghiên cứu hoặc người điều phối xuất hiện trên giao diện.
- TypeScript kiểm tra thành công.
- Build production thành công.
