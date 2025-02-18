import React from 'react';

const newsData = [
  { 
    id: 1, 
    title: 'Xe buýt đón lượng khách đông', 
    content: 'Xe buýt đón lượng khách đông sau ngày tết...', 
    link: '/tin-tuc-1',
    image: 'https://ddk.1cdn.vn/thumbs/900x600/2025/01/18/snapseed-65-e1b31e36e3748e54de92a0c0be3e3d1f.jpg'
  },
  { 
    id: 2, 
    title: 'Khai trương xe buýt điện', 
    content: 'Khai trương nhiều xe buýt điện vào sau tết ...', 
    link: '/tin-tuc-2',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3rjvHcXf7HXhyhEjTEd_LTqm7TsvtRVuhaMYHDirLSD00MFukiM9xoDtHphmrkAUzrVE&usqp=CAU'
  },
  { 
    id: 3, 
    title: 'Lịch hoạt động sau tết của xe buýt', 
    content: 'Các tuyến xe buýt nội thành đã hoạt động trở lại...', 
    link: '/tin-tuc-3',
    image: 'https://cdn.tuoitre.vn/zoom/480_300/471584752817336320/2024/11/1/xe-buyt-7-17026226653442031911549-231-427-1214-2000-crop-173042484594333853983.jpg'
  },
  { 
    id: 4, 
    title: 'Tuyển dụng tài xế xe buýt', 
    content: 'Tuyển dụng tài xế xe buýt vào tháng 2...', 
    link: '/tin-tuc-4',
    image: 'https://vcdn1-vnexpress.vnecdn.net/2025/02/07/z6296213370312-5624501361e8cbf-8459-6871-1738920867.jpg?w=500&h=300&q=100&dpr=2&fit=crop&s=XC5aGaz9hn2R342NP7M0Sw'
  },
  { 
    id: 5, 
    title: 'Mở rộng nhiều trạm xe buýt', 
    content: 'Các trạm xe bắt đầu mở rộng ...', 
    link: '/tin-tuc-5',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS6CLK2shNjTx7lhRQh2xJ7WAoYUrJhzs8qg&s'
  },
  { 
    id: 6, 
    title: 'Khai trương các chuyến xe buýt đường dài', 
    content: 'Các chuyến xe khách đi đường dài...', 
    link: '/tin-tuc-6',
    image: 'https://dulichbacgiang.gov.vn/uploads/content/4_9.jpg'
  },
];

function Home() {
  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Trang Chủ - Tin Tức</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {newsData.map((news) => (
          <div key={news.id} className='p-4 border rounded-lg shadow-md hover:shadow-lg transition bg-white'>
            {/* Ảnh minh họa */}
            <img src={news.image} alt={news.title} className='w-full h-40 object-cover rounded-md' />
            
            {/* Tiêu đề tin tức */}
            <h2 className='text-xl font-semibold mt-3'>{news.title}</h2>
            
            {/* Nội dung tin tức */}
            <p className='text-gray-600 mt-1'>{news.content}</p>
            
            {/* Link "Đọc thêm" */}
            <a href={news.link} className='text-blue-500 hover:underline mt-2 block'>Đọc thêm</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
