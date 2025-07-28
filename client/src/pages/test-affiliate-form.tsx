export default function TestAffiliateForm() {
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#ff0000', 
      color: 'white', 
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      <h1>🔥 TEST FORM - USERNAME FIELD 🔥</h1>
      
      <div style={{
        backgroundColor: '#yellow',
        color: 'black',
        padding: '30px',
        margin: '20px',
        border: '5px solid black'
      }}>
        <h2>TÊN ĐĂNG NHẬP (BẮT BUỘC)</h2>
        <input 
          type="text" 
          placeholder="Nhập tên đăng nhập"
          style={{
            width: '100%',
            height: '50px',
            fontSize: '20px',
            padding: '10px',
            border: '3px solid red'
          }}
        />
      </div>

      <div style={{ margin: '20px' }}>
        <input 
          type="text" 
          placeholder="Họ và tên"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '16px',
            padding: '10px',
            margin: '10px 0'
          }}
        />
        <input 
          type="email" 
          placeholder="Email"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '16px',
            padding: '10px',
            margin: '10px 0'
          }}
        />
        <input 
          type="tel" 
          placeholder="Số điện thoại"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '16px',
            padding: '10px',
            margin: '10px 0'
          }}
        />
      </div>

      <button style={{
        backgroundColor: '#green',
        color: 'white',
        padding: '15px 30px',
        fontSize: '20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        ĐĂNG KÝ NGAY
      </button>
    </div>
  );
}