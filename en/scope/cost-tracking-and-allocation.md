# Theo dõi & Phân bổ Chi phí

Khả năng theo dõi chi phí (Cost Tracking) và phân bổ (Allocation/Chargeback) là nền tảng của giai đoạn **Inform** trong FinOps. Tại FRT, mục tiêu là mang lại sự minh bạch tuyệt đối về chi phí cho tất cả các dự án.

## 1. Cost Tracking Tập trung

Thay vì các dự án tự quản lý chi phí riêng lẻ, FinOps Team sẽ triển khai việc theo dõi tập trung cho **toàn bộ dự án thuộc Ban Công nghệ**.

Các hạng mục hạ tầng được tracking bao gồm:
* **Cloud & Compute:** VMs, Serverless, K8s clusters.
* **Storage:** Block storage, Object storage, Database.
* **Network & Bandwidth:** Phí truyền tải dữ liệu, Load Balancers.
* **AI & LLM Services:** Chi phí gọi API của các LLM (GPT, Claude...), chi phí thuê GPU.
* **Licensing & SaaS:** Bản quyền phần mềm, các dịch vụ SaaS (CI/CD, Monitoring tools, etc.).

## 2. Usage Analytics (Phân tích mức sử dụng)

Để hiểu rõ "chi phí sinh ra từ đâu", cần phân tích sâu vào các chỉ số kỹ thuật (usage metrics):
* **Compute hours:** Số giờ chạy server.
* **Storage growth:** Tốc độ tăng trưởng dữ liệu lưu trữ theo tháng.
* **API calls & Token consumption:** Cực kỳ quan trọng đối với các dự án AI, cần tracking số lượng token in/out.
* **Active users:** Số lượng người dùng thực tế tương ứng với tài nguyên tiêu thụ.

## 3. Chargeback / Showback Report

**Mục tiêu:** Phân bổ chi phí về đúng dự án / đơn vị sử dụng.
* **Showback:** Hiển thị cho các team Engineering / Product biết dự án của họ đang tiêu tốn bao nhiêu tài nguyên (không bắt buộc phải trả tiền thực tế, chỉ để nâng cao nhận thức).
* **Chargeback:** Dữ liệu chi phí sẽ được chuyển cho phòng Finance để trừ trực tiếp vào ngân sách (budget) của từng đơn vị/dự án.

## 4. Báo cáo ROI (Return on Investment)

Đây là Output quan trọng nhằm trả lời câu hỏi: *Với chi phí bỏ ra, dự án mang lại giá trị gì?*
* Báo cáo **ROI per project** sẽ đối chiếu trực tiếp giữa:
  * **Tổng Cost** (đã chargeback).
  * **Business Value** (Doanh thu tạo ra, số lượng user tiếp cận, tỷ lệ chuyển đổi, hoặc lượng thời gian tiết kiệm được...).
