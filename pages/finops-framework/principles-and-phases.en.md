# Nguyên tắc & Các Giai đoạn

## 6 Nguyên tắc FinOps tại FRT

Để thay đổi văn hóa tổ chức và đạt được hiệu quả về chi phí, mọi hoạt động của Ban Công nghệ cần bám sát 6 nguyên tắc cốt lõi:

1. **Teams need to collaborate (Các nhóm cần cộng tác):** Kỹ sư (Engineering), Tài chính (Finance), và Kinh doanh (Business/BOD) phải làm việc cùng nhau gần như theo thời gian thực.
2. **Business value drives technology decisions (Giá trị kinh doanh định hướng quyết định công nghệ):** Chi phí hạ tầng (Cost) luôn phải được cân đối với ROI của từng dự án AI, Cloud, Data...
3. **Everyone takes ownership for their usage (Mọi người chịu trách nhiệm về việc sử dụng của mình):** Mỗi dự án/team phải hiểu và chịu trách nhiệm về ngân sách infrastructure mà mình tiêu thụ (Chargeback/Showback).
4. **FinOps data should be accessible, timely, and accurate (Dữ liệu FinOps phải dễ tiếp cận, kịp thời và chính xác):** Yêu cầu xây dựng Cost Dashboard Real-time (đạt mục tiêu Q3/2026) để ai cũng có thể theo dõi.
5. **FinOps should be enabled centrally (FinOps nên được quản lý tập trung):** Cần một đội ngũ (DaiDX, NghiaNH12) quản lý tập trung cho toàn bộ các dự án thuộc Ban Công nghệ để không bỏ lỡ cơ hội tối ưu chung.
6. **Take advantage of the variable cost model of the cloud (Tận dụng mô hình chi phí biến đổi của cloud):** Tối ưu hóa liên tục (right-sizing, reserved instances, dọn dẹp tài nguyên).

---

## 3 Giai đoạn của FinOps (Phases)

FinOps là một vòng lặp liên tục, bao gồm 3 giai đoạn chính:

### 1. Inform (Thông tin & Hiển thị)
Đây là giai đoạn đầu tiên: **Cung cấp khả năng hiển thị chi phí**.
* **Hành động tại FRT:** 
  * Gắn tag (tagging) toàn bộ tài nguyên (compute, storage, LLM API, GPU).
  * Xây dựng *Cost dashboard real-time* để phân tách chi phí theo team/service/environment.
  * Phân bổ chi phí (Chargeback/Showback) về đúng dự án sử dụng.
  * Tạo *Budget alert system* cảnh báo ở các ngưỡng 80%, 90%, 100%.

### 2. Optimize (Tối ưu hóa)
Sau khi đã thấy rõ chi phí, giai đoạn tiếp theo là **Hành động để giảm chi phí**.
* **Hành động tại FRT:**
  * Khuyến nghị tối ưu hóa tài nguyên: Right-sizing (cấp phát đúng mức), mua Reserved Instances/Savings Plans.
  * *Idle resource cleanup:* Dọn dẹp server, storage, license không sử dụng.
  * Tối ưu hóa API calls, token consumption cho các dự án AI/LLM.
  * **Mục tiêu:** Giảm 20% chi phí infrastructure.

### 3. Operate (Vận hành)
Giai đoạn cuối là **Tự động hóa và đưa vào quy trình chuẩn**.
* **Hành động tại FRT:**
  * Báo cáo FinOps hàng tháng tự động gửi cho Ban Công nghệ & BOD.
  * Theo dõi hợp đồng Vendor & renewal dates.
  * Tính toán và tự động xuất *ROI report per project*.
  * Đánh giá liên tục các chỉ số để quay lại giai đoạn Inform với dữ liệu chính xác hơn.
