# Quản lý Ngân sách & Hợp đồng

Đây là hạng mục đảm bảo sự phối hợp chặt chẽ giữa Kỹ thuật (Engineering) và Tài chính (Finance / Procurement) nhằm kiểm soát rủi ro về chi phí bị đội lên bất ngờ (cost spike) và quản lý rủi ro pháp lý/chi phí với các bên thứ ba.

## 1. Budget Management (Quản lý Ngân sách)

Ngân sách công nghệ không nên là một "hộp đen" hay một con số vô hạn. Quá trình này bao gồm:
* **Thiết lập ngân sách:** Xác định định mức ngân sách theo quý (Quarterly) hoặc năm (Yearly) cho mỗi dự án và mỗi team. Việc này được thực hiện từ đầu kỳ với sự thống nhất của BOD.
* **Budget Alert System (Hệ thống Cảnh báo Ngân sách):** 
  * Đây là một trong các Output quan trọng (Q3/2026).
  * Hệ thống sẽ tự động đối chiếu chi phí thực tế (Actual Cost) với Ngân sách (Budget).
  * Sẽ có **Notification** (qua Email, Slack/Teams...) cảnh báo cho Lead của dự án và FinOps Team khi chi phí tiệm cận các ngưỡng: **80%, 90% và 100%**.
  * Giúp các team kịp thời rà soát và tránh tình trạng "vượt rào" quá lớn vào cuối tháng/quý.

## 2. Vendor & Contract Management (Quản lý Nhà cung cấp & Hợp đồng)

Các dịch vụ công nghệ thường đi kèm với các hợp đồng Enterprise, cam kết sử dụng (Commitments), hoặc phí bản quyền. FinOps Team cần theo dõi tập trung:
* **Theo dõi hợp đồng:** Nắm rõ các điều khoản sử dụng, số lượng license, chiết khấu.
* **Renewal Dates (Ngày gia hạn):** Theo dõi sát sao ngày hết hạn hợp đồng của các dịch vụ SaaS, công cụ AI, hoặc Cloud Support để tránh việc tự động gia hạn (auto-renewal) đối với các dịch vụ không còn nhu cầu sử dụng.
* **Negotiation Opportunities (Cơ hội đàm phán):** Khi tổng hợp được nhu cầu của nhiều dự án khác nhau (ví dụ: gộp chung nhu cầu mua license cho toàn bộ Ban Công nghệ thay vì từng team mua lẻ tẻ), FinOps Team có thể đại diện để đàm phán (negotiate) với Vendor nhằm lấy được mức giá/chiết khấu tốt hơn.
