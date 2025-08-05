from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from num2words import num2words
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///affiliate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'affiliate-system-secret-key-2025'
db = SQLAlchemy(app)

# ======================= Models ============================
class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'giaovien' | 'phuhuynh'
    industry = db.Column(db.String(100))
    address = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    referrer_id = db.Column(db.Integer, db.ForeignKey('member.id'))
    referred = db.relationship('Member', backref=db.backref('referrer', remote_side=[id]), lazy='dynamic')
    wallet = db.relationship('Wallet', backref='member', uselist=False)
    is_admin = db.Column(db.Boolean, default=False)

class Wallet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    balance = db.Column(db.Integer, default=0)  # tiền (VND) cho giáo viên, điểm cho phụ huynh
    history = db.Column(db.Text, default='')

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed = db.Column(db.Boolean, default=False)
    confirmed_by = db.Column(db.String(100))  # Admin xác nhận
    added_by = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    notes = db.Column(db.Text)  # Ghi chú nội bộ
    status = db.Column(db.String(20), default='pending')  # pending | confirmed | rejected

class WithdrawalRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending | approved | rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime)
    processed_by = db.Column(db.String(100))

# ======================= Utility Functions ============================
def num2vn(n):
    """Chuyển số thành chữ tiếng Việt"""
    try:
        if n == 0:
            return "Không đồng"
        return num2words(n, lang='vi').capitalize() + ' đồng'
    except:
        return f"{n:,} đồng"

def format_currency(amount):
    """Format số tiền với dấu phẩy"""
    return f"{amount:,}"

def require_login(f):
    """Decorator kiểm tra đăng nhập"""
    def decorated_function(*args, **kwargs):
        if 'member_id' not in session:
            flash('Vui lòng đăng nhập để tiếp tục', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_admin(f):
    """Decorator kiểm tra quyền admin"""
    def decorated_function(*args, **kwargs):
        if 'member_id' not in session:
            return redirect(url_for('login'))
        member = Member.query.get(session['member_id'])
        if not member or not member.is_admin:
            flash('Bạn không có quyền truy cập trang này', 'error')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# ======================= Routes ============================
@app.route('/')
def home():
    if 'member_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        
        # Kiểm tra email và phone đã tồn tại
        existing_email = Member.query.filter_by(email=data['email']).first()
        existing_phone = Member.query.filter_by(phone=data['phone']).first()
        
        if existing_email:
            flash('Email đã được sử dụng', 'error')
            return render_template('register.html')
        
        if existing_phone:
            flash('Số điện thoại đã được sử dụng', 'error')
            return render_template('register.html')
        
        # Tạo thành viên mới
        new_member = Member(
            full_name=data['full_name'],
            phone=data['phone'],
            email=data['email'],
            password=data['password'],  # Trong thực tế nên hash password
            role=data['role'],
            industry=data.get('industry', ''),
            address=data.get('address', ''),
            referrer_id=data.get('referrer_id') if data.get('referrer_id') else None
        )
        
        db.session.add(new_member)
        db.session.commit()
        
        # Tạo ví tự động
        wallet = Wallet(member_id=new_member.id)
        db.session.add(wallet)
        db.session.commit()
        
        flash('Đăng ký thành công! Vui lòng đăng nhập.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        member = Member.query.filter_by(email=email, password=password).first()
        
        if member:
            session['member_id'] = member.id
            session['member_name'] = member.full_name
            session['member_role'] = member.role
            flash(f'Chào mừng {member.full_name}!', 'success')
            
            if member.is_admin:
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('dashboard'))
        else:
            flash('Email hoặc mật khẩu không đúng', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Đã đăng xuất thành công', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@require_login
def dashboard():
    member = Member.query.get(session['member_id'])
    wallet = member.wallet
    
    # Thống kê
    total_students = Student.query.filter_by(added_by=member.id, confirmed=True).count()
    pending_students = Student.query.filter_by(added_by=member.id, confirmed=False).count()
    downline_count = Member.query.filter_by(referrer_id=member.id).count()
    
    # Lịch sử học sinh gần đây
    recent_students = Student.query.filter_by(added_by=member.id).order_by(Student.created_at.desc()).limit(5).all()
    
    balance_text = num2vn(wallet.balance)
    
    return render_template('dashboard.html', 
                         member=member, 
                         wallet=wallet, 
                         balance_text=balance_text,
                         total_students=total_students,
                         pending_students=pending_students,
                         downline_count=downline_count,
                         recent_students=recent_students)

@app.route('/wallet')
@require_login
def view_wallet():
    member = Member.query.get(session['member_id'])
    wallet = member.wallet
    balance_text = num2vn(wallet.balance)
    
    # Tuyến dưới
    downline = Member.query.filter_by(referrer_id=member.id).all()
    
    # Lịch sử giao dịch từ chuỗi text
    history_lines = [line.strip() for line in wallet.history.split('\n') if line.strip()]
    
    return render_template('wallet.html', 
                         member=member, 
                         wallet=wallet, 
                         balance_text=balance_text, 
                         downline=downline,
                         history_lines=history_lines)

@app.route('/add-student', methods=['GET', 'POST'])
@require_login
def add_student():
    if request.method == 'POST':
        name = request.form['name']
        notes = request.form.get('notes', '')
        
        student = Student(
            name=name,
            added_by=session['member_id'],
            notes=notes,
            status='pending'
        )
        
        db.session.add(student)
        db.session.commit()
        
        flash(f'Đã thêm học sinh "{name}". Chờ admin xác minh.', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('add_student.html')

@app.route('/students')
@require_login
def my_students():
    students = Student.query.filter_by(added_by=session['member_id']).order_by(Student.created_at.desc()).all()
    return render_template('my_students.html', students=students)

@app.route('/withdraw', methods=['GET', 'POST'])
@require_login
def withdraw():
    member = Member.query.get(session['member_id'])
    wallet = member.wallet
    
    if request.method == 'POST':
        amount = int(request.form['amount'])
        
        if amount <= 0:
            flash('Số tiền phải lớn hơn 0', 'error')
            return render_template('withdraw.html', member=member, wallet=wallet)
        
        if amount > wallet.balance:
            flash('Số dư không đủ', 'error')
            return render_template('withdraw.html', member=member, wallet=wallet)
        
        # Tạo yêu cầu rút tiền
        req = WithdrawalRequest(
            member_id=member.id,
            amount=amount
        )
        
        db.session.add(req)
        db.session.commit()
        
        flash(f'Đã gửi yêu cầu rút {format_currency(amount)} VND. Chờ admin duyệt.', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('withdraw.html', member=member, wallet=wallet)

@app.route('/withdrawal-history')
@require_login
def withdrawal_history():
    requests = WithdrawalRequest.query.filter_by(member_id=session['member_id']).order_by(WithdrawalRequest.created_at.desc()).all()
    return render_template('withdrawal_history.html', requests=requests)

# ======================= Admin Routes ============================
@app.route('/admin')
@require_admin
def admin_dashboard():
    # Thống kê tổng quan
    total_members = Member.query.count()
    total_teachers = Member.query.filter_by(role='giaovien').count()
    total_parents = Member.query.filter_by(role='phuhuynh').count()
    pending_students = Student.query.filter_by(confirmed=False).count()
    pending_withdrawals = WithdrawalRequest.query.filter_by(status='pending').count()
    
    return render_template('admin/dashboard.html',
                         total_members=total_members,
                         total_teachers=total_teachers,
                         total_parents=total_parents,
                         pending_students=pending_students,
                         pending_withdrawals=pending_withdrawals)

@app.route('/admin/students')
@require_admin
def admin_students():
    status_filter = request.args.get('status', 'pending')
    
    if status_filter == 'all':
        students = Student.query.order_by(Student.created_at.desc()).all()
    else:
        confirmed = True if status_filter == 'confirmed' else False
        students = Student.query.filter_by(confirmed=confirmed).order_by(Student.created_at.desc()).all()
    
    return render_template('admin/students.html', students=students, status_filter=status_filter)

@app.route('/admin/confirm-student/<int:student_id>')
@require_admin
def confirm_student(student_id):
    student = Student.query.get(student_id)
    
    if not student:
        flash('Không tìm thấy học sinh', 'error')
        return redirect(url_for('admin_students'))
    
    if student.confirmed:
        flash('Học sinh đã được xác minh trước đó', 'warning')
        return redirect(url_for('admin_students'))
    
    # Xác minh học sinh
    student.confirmed = True
    student.status = 'confirmed'
    student.confirmed_by = session['member_name']
    db.session.commit()
    
    # Cộng thưởng vào ví
    member = Member.query.get(student.added_by)
    wallet = member.wallet
    
    # Thưởng cơ bản
    if member.role == 'giaovien':
        amount = 2000000  # 2 triệu VND cho giáo viên
        unit = 'VND'
    else:
        amount = 2000  # 2000 điểm cho phụ huynh
        unit = 'điểm'
    
    wallet.balance += amount
    
    # Ghi lịch sử
    history_entry = f"{datetime.now().strftime('%d/%m/%Y %H:%M')} - Tuyển học sinh '{student.name}' +{format_currency(amount)} {unit} (Admin: {session['member_name']})\n"
    wallet.history += history_entry
    
    # Kiểm tra bonus mốc 5 học sinh
    confirmed_count = Student.query.filter_by(added_by=member.id, confirmed=True).count()
    
    if confirmed_count % 5 == 0:  # Mỗi 5 học sinh
        if member.role == 'giaovien':
            bonus = 10000000  # 10 triệu VND
            unit = 'VND'
        else:
            bonus = 10000  # 10000 điểm
            unit = 'điểm'
        
        wallet.balance += bonus
        bonus_entry = f"{datetime.now().strftime('%d/%m/%Y %H:%M')} - 🎉 Thưởng mốc {confirmed_count} học sinh +{format_currency(bonus)} {unit}\n"
        wallet.history += bonus_entry
    
    db.session.commit()
    
    flash(f'Đã xác minh học sinh "{student.name}" và cộng thưởng cho {member.full_name}', 'success')
    return redirect(url_for('admin_students'))

@app.route('/admin/reject-student/<int:student_id>')
@require_admin
def reject_student(student_id):
    student = Student.query.get(student_id)
    
    if not student:
        flash('Không tìm thấy học sinh', 'error')
        return redirect(url_for('admin_students'))
    
    student.status = 'rejected'
    student.confirmed_by = session['member_name']
    db.session.commit()
    
    flash(f'Đã từ chối học sinh "{student.name}"', 'info')
    return redirect(url_for('admin_students'))

@app.route('/admin/withdrawals')
@require_admin
def admin_withdrawals():
    status_filter = request.args.get('status', 'pending')
    
    if status_filter == 'all':
        requests = WithdrawalRequest.query.order_by(WithdrawalRequest.created_at.desc()).all()
    else:
        requests = WithdrawalRequest.query.filter_by(status=status_filter).order_by(WithdrawalRequest.created_at.desc()).all()
    
    return render_template('admin/withdrawals.html', requests=requests, status_filter=status_filter)

@app.route('/admin/approve-withdrawal/<int:req_id>')
@require_admin
def approve_withdrawal(req_id):
    req = WithdrawalRequest.query.get(req_id)
    
    if not req or req.status != 'pending':
        flash('Yêu cầu không hợp lệ', 'error')
        return redirect(url_for('admin_withdrawals'))
    
    wallet = Wallet.query.filter_by(member_id=req.member_id).first()
    
    if wallet.balance < req.amount:
        flash('Số dư trong ví không đủ', 'error')
        return redirect(url_for('admin_withdrawals'))
    
    # Trừ tiền và cập nhật trạng thái
    wallet.balance -= req.amount
    wallet.history += f"{datetime.now().strftime('%d/%m/%Y %H:%M')} - Rút tiền -{format_currency(req.amount)} VND (Duyệt: {session['member_name']})\n"
    
    req.status = 'approved'
    req.processed_at = datetime.utcnow()
    req.processed_by = session['member_name']
    
    db.session.commit()
    
    member = Member.query.get(req.member_id)
    flash(f'Đã duyệt rút tiền {format_currency(req.amount)} VND cho {member.full_name}', 'success')
    return redirect(url_for('admin_withdrawals'))

@app.route('/admin/reject-withdrawal/<int:req_id>')
@require_admin
def reject_withdrawal(req_id):
    req = WithdrawalRequest.query.get(req_id)
    
    if not req or req.status != 'pending':
        flash('Yêu cầu không hợp lệ', 'error')
        return redirect(url_for('admin_withdrawals'))
    
    req.status = 'rejected'
    req.processed_at = datetime.utcnow()
    req.processed_by = session['member_name']
    
    db.session.commit()
    
    member = Member.query.get(req.member_id)
    flash(f'Đã từ chối yêu cầu rút tiền của {member.full_name}', 'info')
    return redirect(url_for('admin_withdrawals'))

@app.route('/admin/members')
@require_admin
def admin_members():
    members = Member.query.order_by(Member.created_at.desc()).all()
    return render_template('admin/members.html', members=members)

# ======================= API Routes ============================
@app.route('/api/stats')
@require_login
def api_stats():
    member = Member.query.get(session['member_id'])
    wallet = member.wallet
    
    stats = {
        'balance': wallet.balance,
        'balance_text': num2vn(wallet.balance),
        'total_students': Student.query.filter_by(added_by=member.id, confirmed=True).count(),
        'pending_students': Student.query.filter_by(added_by=member.id, confirmed=False).count(),
        'downline_count': Member.query.filter_by(referrer_id=member.id).count()
    }
    
    return jsonify(stats)

# ======================= Template Filters ============================
@app.template_filter('currency')
def currency_filter(amount):
    return format_currency(amount)

@app.template_filter('num2vn')
def num2vn_filter(amount):
    return num2vn(amount)

# ======================= Initialize ============================
def init_admin():
    """Tạo tài khoản admin mặc định"""
    admin = Member.query.filter_by(email='admin@mamnon.com').first()
    if not admin:
        admin = Member(
            full_name='Quản trị viên',
            phone='0999999999',
            email='admin@mamnon.com',
            password='admin123',
            role='admin',
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()  # Commit first to get admin.id
        
        # Now create wallet with valid member_id
        wallet = Wallet(member_id=admin.id)
        db.session.add(wallet)
        db.session.commit()
        
        print("✅ Đã tạo tài khoản admin: admin@mamnon.com / admin123")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_admin()
    
    print("🚀 Affiliate System đang chạy...")
    print("📧 Admin: admin@mamnon.com")
    print("🔑 Password: admin123")
    app.run(debug=True, host='0.0.0.0', port=5002)