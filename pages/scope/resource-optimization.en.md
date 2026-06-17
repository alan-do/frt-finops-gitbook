# Tối ưu hóa Tài nguyên

Đây là khu vực thuộc giai đoạn **Optimize** của FinOps, nơi các kỹ sư (Engineering) và FinOps team cùng phối hợp để đạt được mục tiêu **giảm 20% chi phí infrastructure** vào Q3/2026.

## 1. Theo dõi mức sử dụng (Resource Utilization)

Để tối ưu, trước tiên cần đo lường chính xác các chỉ số tải của hệ thống. Chúng ta cần theo dõi chặt chẽ:
* **Server Compute:** Mức độ tải của CPU, RAM.
* **GPU Utilization:** Đặc biệt quan trọng cho các dự án AI, cần theo dõi tỷ lệ nhàn rỗi (idle) của GPU đắt tiền.
* **Storage & Bandwidth:** IOPS, dung lượng lưu trữ thực tế so với dung lượng đã cấp phát, lưu lượng mạng (Egress/Ingress).
* **License Seats:** Số lượng user đang active trên các phần mềm SaaS trả phí theo user (vd: công cụ CI/CD, project management).

## 2. Các Khuyến nghị Tối ưu (Optimization Recommendations)

Dựa trên dữ liệu thu thập, FinOps team sẽ đưa ra các khuyến nghị hành động cụ thể cho từng dự án:

* **Right-sizing (Chọn đúng kích thước):** Hạ cấp các Server, Database đang chạy với cấu hình quá lớn (Over-provisioned) so với nhu cầu thực tế.
* **Reserved Instances / Savings Plans:** Cam kết sử dụng dài hạn (1-3 năm) cho các workload ổn định để nhận mức chiết khấu cao từ nhà cung cấp Cloud.
* **Idle Resource Cleanup (Dọn dẹp tài nguyên nhàn rỗi):** Xóa bỏ các unattached EBS volumes, các IP tĩnh không sử dụng, hoặc tắt các server ở môi trường Dev/Staging ngoài giờ làm việc.
* **Shared Infrastructure:** Tận dụng hạ tầng dùng chung (ví dụ: chung Kubernetes cluster, chung hệ thống Database tập trung) để tránh lãng phí khi các dự án tự dựng hạ tầng riêng biệt và không chạy hết công suất.
