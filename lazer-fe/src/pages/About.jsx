import React from 'react';

function about() {
  return (
    <div className="container mx-auto p-8">
      {/* Tiêu đề chính */}
      <h1 className="text-4xl font-bold text-center mb-6">Giới Thiệu Về Chúng Tôi</h1>
      
      {/* Nội dung chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Ảnh minh họa */}
        <img 
          src="https://media.istockphoto.com/id/1256096552/vector/about-us-rgb-color-icon.jpg?s=612x612&w=0&k=20&c=KKozSJIgaX2lu1OIRY9Oc5Rp1GhQzpTIKatBtc_4lQQ=" 
          alt="Giới thiệu"
          className="rounded-lg shadow-lg"
        />

        {/* Nội dung giới thiệu */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Chúng tôi là ai?</h2>
          <p className="text-gray-700 mb-4">
            Chúng tôi là một đội ngũ chuyên cung cấp các dịch vụ đặt vé xe buýt tiện lợi, nhanh chóng và đáng tin cậy.
            Với mục tiêu nâng cao trải nghiệm di chuyển của mọi người, chúng tôi cam kết mang đến những dịch vụ tốt nhất.
          </p>
          
            <h2 className="text-2xl font-semibold mb-3">Tên thành viên</h2>
          <p className="text-gray-700 mb-4">
                      Phan Minh Đức,
                      Trương Nam Phương
          </p>
          <h2 className="text-2xl font-semibold mb-3">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-700 mb-4">
            Chúng tôi luôn hướng tới việc phát triển một hệ thống đặt vé thông minh, giúp hành khách dễ dàng tìm kiếm,
            so sánh và đặt vé chỉ trong vài cú nhấp chuột.
          </p>

          <h2 className="text-2xl font-semibold mb-3">Liên hệ với chúng tôi</h2>
          <p className="text-gray-700">
            📍 Địa chỉ: 123 Đường ABC, TP. Hà Nội  
            📞 Hotline: 0123 456 789  
            ✉️ Email: support@example.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default about;
