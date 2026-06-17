---
title: "CTO Questions"
description: "Key issues to resolve"
---

# Các vấn đề cần giải quyết (CTO Review)

Trong bước **"Anh Review"** của quy trình, team FinOps cần đưa ra các vấn đề đang là "nút thắt cổ chai" (bottleneck) cản trở việc hoàn thành dự án trong Quý 3/2026. 

Dưới đây là 4 vấn đề cốt lõi cần CTO cho chỉ thị giải quyết (Mandate & Solution Request):

## 1. Vấn đề truy cập Dữ liệu (Data Access)
* **Vấn đề:** Đi xin quyền access lẻ tẻ vào Cloud/API của từng team sẽ làm chậm tiến độ Sprint 1. Team FinOps tốn quá nhiều thời gian cho việc phân quyền.
* **Request:** Nhờ anh ra Policy (chỉ thị) yêu cầu các Team Lead chủ động cung cấp Read-only/Billing Access tập trung cho team FinOps trước ngày 23/06.

## 2. Vấn đề Nguồn lực (1.5 FTE) & Scope bản Demo
* **Vấn đề:** Nguồn lực 1.5 người quá mỏng để làm Full-scope kịp ngày Demo (18/07). 
* **Request:** Xin chốt MVP Demo chỉ tracking 1-2 dịch vụ tốn tiền nhất (VD: LLM API, AWS) và cho phép dùng API của LLM thương mại (GPT/Claude) để tự động hóa báo cáo, thay vì tốn thời gian tự train AI model.

## 3. Vấn đề Đo lường ROI
* **Vấn đề:** FinOps tự tính được Cost, nhưng thiếu metric về **Business Value** (Giá trị tạo ra) của các dự án AI để đưa vào báo cáo ROI.
* **Request:** Cần anh chỉ định đầu mối/quy trình để các team cung cấp data Value này (số user, doanh thu, giờ tiết kiệm được) để ráp vào công thức ROI. Team FinOps không tự "bịa" được số này.

## 4. Vấn đề Thẩm quyền Xử lý
* **Vấn đề:** Chưa rõ thẩm quyền hành động khi hệ thống AI phát hiện bất thường hoặc chạm mốc 100% Budget. Việc này ảnh hưởng đến thiết kế của *AI Alert System*.
* **Request:** Xin anh định hướng: Hệ thống của FinOps chỉ dừng ở mức **Cảnh báo (Notify)** lên Slack hay được cấp quyền **Can thiệp tự động (Pause/Kill resource)**?
