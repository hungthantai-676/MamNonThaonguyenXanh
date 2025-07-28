import { useState } from "react";

export default function ForceNewForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: ""
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Đang gửi...");
    
    try {
      const response = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          memberType: 'parent'
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus(`✅ THÀNH CÔNG! Username: ${formData.username}, Member ID: ${result.memberId}`);
      } else {
        setStatus(`❌ LỖI: ${result.message}`);
      }
    } catch (error) {
      setStatus(`❌ LỖI MẠNG: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#000080', 
      color: 'white', 
      padding: '40px', 
      minHeight: '100vh',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '30px' }}>
        🆕 FORM MỚI HOÀN TOÀN - {new Date().toLocaleString()}
      </h1>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', color: 'black', padding: '30px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>
              📝 Họ và tên:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px', backgroundColor: '#ffff00', padding: '20px', border: '3px solid red', borderRadius: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '20px', color: 'red' }}>
              🔥 TÊN ĐĂNG NHẬP (USERNAME):
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Nhập username của bạn"
              style={{ width: '100%', padding: '15px', fontSize: '18px', border: '3px solid red', borderRadius: '5px', backgroundColor: 'white' }}
              required
            />
            <div style={{ marginTop: '10px', fontSize: '16px', color: 'blue' }}>
              Giá trị hiện tại: <strong>{formData.username || "(chưa nhập)"}</strong>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>
              📧 Email:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>
              📱 Số điện thoại:
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: '#00ff00',
              color: 'black',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            🚀 ĐĂNG KÝ AFFILIATE NGAY
          </button>
        </form>

        {status && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: status.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `2px solid ${status.includes('✅') ? 'green' : 'red'}`,
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}