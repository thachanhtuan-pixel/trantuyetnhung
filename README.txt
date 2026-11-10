LOVE10112026 — WEBSITE SINH NHẬT
================================

CẤU TRÚC
- index.html   : cấu trúc trang và nội dung lá thư
- style.css    : màu sắc, bố cục responsive và toàn bộ hiệu ứng chuyển cảnh
- script.js    : xử lý các bước tương tác, âm thanh fade và mưa chữ/ảnh

THÊM NHẠC VÀ ẢNH
Đặt các file media cùng thư mục với 3 file chính, dùng đúng tên:
- audio1.mp3  : nhạc khi mở phong bì
- audio2.mp3  : nhạc ở màn hình bất ngờ
- image1.png  : ảnh xuất hiện trong cơn mưa
- image2.png  : ảnh xuất hiện trong cơn mưa

Nếu chưa thêm media, trang vẫn mở và chạy hiệu ứng; chỉ phần nhạc/ảnh thật sẽ không có.
Trình duyệt thường chỉ cho phép phát nhạc sau thao tác của người dùng, nên nhạc bắt đầu
sau khi nhấn nút “Mở thư”. Hãy thử bằng cách mở trang và nhấn nút này.

CÁ NHÂN HÓA
1. Mở index.html và sửa lời thư, lời chào, chữ ở màn hình cuối theo câu chuyện của hai bạn.
2. Mở script.js:
   - Sửa RAIN_TEXTS = ["text1", "text2", "text3"] để đổi chữ rơi trong cơn mưa.
   - Sửa CENTER_SEQUENCE_TEXTS = ["text4", "text5", "text6", "text7", "text8"] để đổi 5 dòng chữ lớn ở giữa màn hình.
   - Mặc định sequence bắt đầu sau 4 giây; mỗi dòng hiển thị trong 4 giây, được reveal từ trái sang phải rồi fade sang dòng tiếp theo. Sau dòng cuối, chữ trung tâm biến mất và mưa vẫn tiếp tục.
4. Có thể đổi CONFIG.imageSources nếu bạn muốn đặt ảnh ở thư mục con, ví dụ:
   imageSources: ["images/image1.png", "images/image2.png"]
   Nhớ sửa src mặc định trong template ở index.html cho đồng bộ.
5. Có thể chỉnh tốc độ/độ dày cơn mưa tại CONFIG trong script.js.

ĐƯA LÊN GITHUB PAGES
1. Giải nén love10112026.zip.
2. Tạo một repository GitHub mới (hoặc dùng repository website hiện có).
3. Upload toàn bộ nội dung bên trong thư mục love10112026 lên thư mục gốc của repository:
   index.html, style.css, script.js, README.txt và 4 file media của bạn.
   Lưu ý: index.html phải nằm ở root mà GitHub Pages được cấu hình để xuất bản.
4. Vào Settings → Pages → Build and deployment, chọn Deploy from a branch,
   chọn branch (thường là main) và folder /(root), rồi Save.
5. Mở URL GitHub Pages được cấp. Dùng URL đó để tạo QR code.

Không cần cài Node.js, framework, build tool hay thư viện JavaScript bên ngoài.
Font chữ được tải từ Google Fonts; nếu ngoại tuyến, trang tự dùng font dự phòng.
