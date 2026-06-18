---
title: "Câu hỏi cho CTO"
description: "Các vấn đề cần chốt Scope và Yêu cầu chỉ đạo"
---

# Các câu hỏi trọng tâm (CTO Review)

Để đảm bảo dự án FinOps đi đúng hướng và đáp ứng kỳ vọng trong Quý 3/2026, dưới đây là danh sách các câu hỏi cần được làm rõ về phạm vi (boundary), tiến độ và quyền hạn triển khai.

## 1. Hiện trạng & Thực tế Phân bổ (Current State & Allocation)
* **Q:** Cách làm FinOps hiện tại của tổ chức là gì?
  * Từng chuỗi / dự án tự báo cáo chi phí?
  * Có tooling system tự động lấy thông tin?
  * Hay có cách tiếp cận khác (Other)?
* **Q:** Thực tế phân bổ tài nguyên theo chuỗi/dự án hiện nay ra sao, độ liên đới / phụ thuộc tài nguyên nằm ở mức nào?
  * Toàn bộ minh bạch, quản trị phân hoá tuyệt đối?
  * Có cần giải bài toán tính chi phí riêng biệt nằm trong một "bucket" dùng chung không?
  * Hay có thực trạng khác (Other)?

## 2. Boundary & Scope (Phạm vi dự án)
* **Q:** Boundary (ranh giới) của hệ thống FinOps trong giai đoạn này là gì? Hệ thống chỉ dừng ở mức quan sát (Observability), hay phải bao gồm cả khả năng can thiệp tự động (Actionability - tự động tắt/giới hạn resource khi vượt budget)?
* **Q:** Đối tượng người dùng chính (End-user) của hệ thống trong giai đoạn MVP là ai? CTO/CFO để xem tổng quan, hay các Product Owner/Dev Lead để tối ưu hóa chi phí hàng ngày?

## 3. Các MVP cụ thể và tính năng trước mắt
* **Q:** Với nguồn lực 1.5 FTE, các tính năng MVP nào là ưu tiên cao nhất cần hoàn thành trước?
  * Đề xuất MVP 1: **Dashboard Tổng quan** (Tracking chi phí tập trung cho 1-2 dịch vụ lớn nhất như AWS, OpenAI).
  * Đề xuất MVP 2: **Hệ thống Alert cơ bản** (Gửi cảnh báo qua kênh chat nội bộ/Email khi chi phí tăng đột biến so với baseline).
* **Q:** Có thể sử dụng các LLM thương mại có sẵn (GPT-4/Claude) qua API để phát triển nhanh tính năng tự động báo cáo, thay vì tốn thời gian tự huấn luyện (train) model nội bộ hay không?

## 4. Tiến độ dự án (Timeline & Progress)
* **Q:** Mốc thời gian kỳ vọng cho phiên bản Demo đầu tiên là khi nào? Nếu lấy mốc giữa tháng 7 (18/07) cho bản Demo, thì phạm vi MVP như đề xuất ở trên đã đáp ứng được kỳ vọng chưa?
* **Q:** Có yêu cầu bắt buộc nào về tiến độ rollout (triển khai) cho toàn bộ các team trong công ty, hay chỉ áp dụng thử nghiệm (pilot) trên 1-2 team cụ thể trong Quý 3?

## 5. Quyền truy cập dữ liệu (Data Access)
* **Q:** Cơ chế nào để team FinOps được cấp quyền Read-only/Billing Access một cách tập trung và nhanh chóng vào các tài khoản Cloud/SaaS của các team khác? Cần một quy trình chuẩn hóa từ top-down để tránh việc yêu cầu phân quyền lẻ tẻ làm chậm tiến độ.

## 6. Đo lường ROI & Business Value
* **Q:** Để tính toán ROI của các dự án AI, FinOps có thể tracking chi phí (Cost), nhưng cần nguồn dữ liệu về Giá trị kinh doanh (Business Value - như số lượng user, doanh thu, giờ làm việc tiết kiệm được). Nguồn dữ liệu này sẽ được thu thập từ đâu và quy trình phối hợp với các team như thế nào?
