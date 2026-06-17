# Roadmap, Estimation & Rủi ro

## 1. Roadmap & Milestones (Q3/2026)

Kế hoạch này dựa trên nguồn lực thực tế của team là **1.5 FTE** (1 Full-time, 1 Part-time 50%). Chiến lược chính là **MVP nhỏ gọn, ưu tiên dùng API/SaaS**.

* **16/06/2026 (Đã xong):** Setup Jira DAA + 5 Epics + Components.
* **20/06/2026 - M1 (Backlog ready):** Mỗi Lead tạo $\ge$ 5 Stories cho các Epics (Data Pipeline, Alert System, Dashboard, GenAI Report, ROI Tracking).
* **23/06/2026 - Sprint 1 Planning.**
* **04/07/2026 - M2 (Sprint 1 Done - MVP):**
  * *1.0 FTE:* Viết script kéo Billing Data của 1 dự án (AWS/OpenAI) về database.
  * *0.5 FTE:* Thiết lập webhook bắn thông báo lên Slack khi cost vượt ngưỡng cố định.
* **18/07/2026 - M3 (Internal Demo):**
  * *1.0 FTE:* Dựng nhanh Grafana Dashboard hiển thị cost cơ bản.
  * *0.5 FTE:* Dùng ChatGPT API đọc cost tuần qua và bắn tóm tắt "Vì sao chi phí tăng?" lên Slack.
* **30/09/2026 - M4 (Q3 Release - Production-ready):**
  * *Sprint 3-4:* Cảnh báo % Budget, Phát hiện bất thường (Anomaly Detection).
  * *Sprint 5-6:* Hoàn thiện Dashboard, filter theo team. Bắt đầu tracking ROI.
  * *Sprint 7-8:* Đóng gói hệ thống GenAI gửi Report PDF tự động hàng tháng.

---

## 2. Estimate Khả thi (Feasibility Estimate)

* **Dự đoán đúng hạn (On-time Delivery):** 70%
* **Ngân sách thời gian (Từ 23/06 đến 30/09):** ~14 tuần = **105 man-days**.

| Epic / Hạng mục | Estimate | Phân công | Risk Level |
| :--- | :---: | :--- | :--- |
| **E1: Data Pipeline Foundation** | 25 days | 1.0 FTE | High (Chờ cấp quyền truy cập) |
| **E2: AI Budget Alert** | 15 days | 0.5 FTE | Low |
| **E3: GenAI Automated Reporting** | 20 days | 0.5 FTE | Medium (Tốn thời gian chỉnh Prompt) |
| **E4: Real-time Dashboard** | 20 days | 1.0 FTE | Medium |
| **E5: Optimization & ROI Tracking**| 15 days | Chung | Very High (Khó đo lường "Value" từ các team) |
| **Buffer (Họp, Fix Bug)** | 10 days | Chung | |
| **TỔNG CỘNG** | **105 days**| | *(Vừa khít)* |

---

## 3. Quản trị Rủi ro (Risk Mitigation)

1. **Rủi ro Dữ liệu (Data Silos):** Team không thể tự đi xin API Key của từng dự án AI.
   * *Giải pháp:* Cần CTO ra chỉ thị yêu cầu các team cung cấp Read-Only Access tập trung trước 23/06.
2. **Rủi ro Ôm đồm R&D:** Khung thời gian không cho phép tự train Machine Learning Model.
   * *Giải pháp:* Cấm tự train model. Bắt buộc gọi API thương mại (GPT-4o/Claude) để xử lý logic AI trong giai đoạn này.
3. **Rủi ro Báo cáo ROI:** Tính toán Value của dự án rất trừu tượng.
   * *Giải pháp:* Chốt một "Template" với các team Product trong buổi Demo 18/07. Nếu họ không cung cấp data Doanh thu/User, FinOps team được miễn trừ phần tính Value trong Q3.
