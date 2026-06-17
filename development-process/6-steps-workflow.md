# Workflow 6 Bước (Chuẩn CTO)

Để đảm bảo chất lượng kỹ thuật và tiến độ, mọi tính năng mới (Epic) của dự án FinOps đều phải đi qua vòng lặp 6 bước sau:

## 1. Concept - Vision
* **Định nghĩa:** Làm rõ bài toán cần giải quyết, đối tượng sử dụng (Personas), và kết quả kỳ vọng (Output).
* **Ứng dụng tại FinOps:** 
  * *Ví dụ:* Concept cho "Hệ thống Cảnh báo Bất thường bằng AI" là ngăn chặn ngay lập tức tình trạng "đốt tiền" ngoài ý muốn trên Cloud/LLM, nhắm tới đối tượng là Tech Lead các dự án.

## 2. Kiến trúc (High Level Architect + Data + ADR)
* **Định nghĩa:** Thiết kế luồng đi của hệ thống trước khi code.
* **Ứng dụng tại FinOps:**
  * **Data:** Xác định nguồn lấy Cost Data (API của OpenAI, Billing Report của AWS...). Dữ liệu sẽ lưu ở đâu?
  * **Architect:** Vẽ sơ đồ tương tác giữa Scheduler (cronjob kéo data) -> AI Agent (để phân tích) -> Slack Webhook (hiển thị).
  * **ADR (Architecture Decision Record):** Ghi chú lại lý do chọn công nghệ (Ví dụ: "ADR-01: Quyết định dùng Superset làm Dashboard thay vì tự build React để tiết kiệm 1.0 FTE").

## 3. Anh Review (CTO Review)
* **Định nghĩa:** Buổi bảo vệ thiết kế và chốt Scope (Sprint Planning).
* **Ứng dụng tại FinOps:** Mang tài liệu Kiến trúc + ADR trình bày với CTO. Đặt ra các [Câu hỏi chốt Scope](cto-review-questions.md) để xin cấp quyền truy cập dữ liệu và chốt ngân sách thời gian. Đây là chốt chặn quan trọng nhất để tránh rủi ro về sau.

## 4. Bọn em Burn (Execution)
* **Định nghĩa:** Giai đoạn tập trung code và hiện thực hóa bản thiết kế.
* **Ứng dụng tại FinOps:** Team (1.5 FTE) chia task theo Jira. Áp dụng triệt để nguyên tắc dùng API/SaaS có sẵn. Không tự train Machine Learning Model nội bộ nếu có thể dùng Prompt Engineering gọi GPT/Claude API.

## 5. Test
* **Định nghĩa:** Đảm bảo hệ thống hoạt động đúng.
* **Ứng dụng tại FinOps:** Khác với test phần mềm thông thường, **Test FinOps là test độ chính xác của Tiền**. Nếu Dashboard hiển thị sai số liệu cost, hệ thống sẽ mất hoàn toàn sự tin tưởng từ người dùng. Cần đối soát (cross-check) tay giữa Dashboard tự làm và Dashboard gốc của nhà cung cấp Cloud.

## 6. Onboard User vào Test (UAT)
* **Định nghĩa:** Đưa sản phẩm cho End-user dùng thử.
* **Ứng dụng tại FinOps:** 
  * Demo bản tính năng MVP cho các Stakeholders (Lead các team AI/App). 
  * Add họ vào channel Slack nhận Alert thử nghiệm (chạy song song, chưa áp dụng chặn action thực tế). 
  * Thu thập phản hồi về độ "ồn" của alert hoặc tính dễ đọc của Báo cáo tự động.
