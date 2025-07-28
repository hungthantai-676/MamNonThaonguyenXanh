export default function DebugForm() {
  console.log('🔥 DEBUG FORM COMPONENT LOADED');
  
  return (
    <div style={{
      backgroundColor: '#FF0000',
      color: 'white',
      padding: '50px',
      minHeight: '100vh',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🚨 DEBUG FORM - TIMESTAMP: {new Date().toLocaleTimeString()} 🚨
      </h1>
      <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '20px' }}>
        Nếu bạn thấy dòng này nghĩa là component mới đã load thành công!
      </div>
      
      <div style={{
        backgroundColor: '#FFFF00',
        color: '#000000',
        padding: '30px',
        margin: '20px 0',
        border: '5px solid #000000',
        borderRadius: '10px'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>TÊN ĐĂNG NHẬP (BẮT BUỘC)</h2>
        <input 
          type="text" 
          placeholder="Nhập tên đăng nhập ở đây"
          style={{
            width: '100%',
            height: '60px',
            fontSize: '24px',
            padding: '15px',
            border: '3px solid #FF0000',
            borderRadius: '5px',
            backgroundColor: '#FFFFFF'
          }}
        />
        <p style={{ margin: '15px 0 0 0', fontSize: '18px' }}>
          ⚠️ Nếu bạn thấy ô input này thì username field hoạt động bình thường
        </p>
      </div>

      <div style={{ backgroundColor: '#333333', padding: '20px', borderRadius: '10px' }}>
        <p style={{ margin: '10px 0' }}>📝 Họ và tên:</p>
        <input type="text" placeholder="Nhập họ tên" style={{
          width: '100%', height: '50px', fontSize: '18px', padding: '10px',
          marginBottom: '15px', borderRadius: '5px', border: 'none'
        }} />
        
        <p style={{ margin: '10px 0' }}>📧 Email:</p>
        <input type="email" placeholder="email@example.com" style={{
          width: '100%', height: '50px', fontSize: '18px', padding: '10px',
          marginBottom: '15px', borderRadius: '5px', border: 'none'
        }} />
        
        <p style={{ margin: '10px 0' }}>📱 Số điện thoại:</p>
        <input type="tel" placeholder="0123456789" style={{
          width: '100%', height: '50px', fontSize: '18px', padding: '10px',
          marginBottom: '20px', borderRadius: '5px', border: 'none'
        }} />
      </div>

      <button 
        onClick={() => {
          const formData = {
            name: document.querySelector('input[placeholder="Nhập họ tên"]').value,
            username: document.querySelector('input[placeholder="Nhập tên đăng nhập ở đây"]').value,
            email: document.querySelector('input[placeholder="email@example.com"]').value,
            phone: document.querySelector('input[placeholder="0123456789"]').value,
            memberType: 'parent'
          };
          
          console.log('🔥 TEST REGISTRATION:', formData);
          
          if (!formData.username) {
            alert('Vui lòng nhập tên đăng nhập!');
            return;
          }
          
          fetch('/api/affiliate/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
          .then(res => res.json())
          .then(data => {
            console.log('✅ Registration success:', data);
            alert('Đăng ký thành công! Username: ' + formData.username);
          })
          .catch(err => {
            console.error('❌ Registration failed:', err);
            alert('Đăng ký thất bại: ' + err.message);
          });
        }}
        style={{
          backgroundColor: '#00FF00',
          color: '#000000',
          padding: '20px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '20px'
        }}
      >
        ĐĂNG KÝ NGAY - TEST WORKING API
      </button>
      
      <div style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '10px',
        fontSize: '16px'
      }}>
        <p><strong>Hướng dẫn test:</strong></p>
        <p>1. Nếu thấy trang này (màu đỏ) = routing OK</p>
        <p>2. Nếu thấy ô input vàng "TÊN ĐĂNG NHẬP" = render OK</p>
        <p>3. Nếu không thấy = có vấn đề nghiêm trọng về browser</p>
      </div>
    </div>
  );
}