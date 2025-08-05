#!/usr/bin/env python3
"""
Standalone launcher for Affiliate System
Port: 5001
Admin: admin@mamnon.com / admin123
"""

import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    from app import app, db, init_admin
    
    print("🚀 Starting Affiliate System...")
    print("📧 Admin: admin@mamnon.com")
    print("🔑 Password: admin123")
    print("🌐 URL: http://localhost:5001")
    
    with app.app_context():
        db.create_all()
        init_admin()
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5001)
    except OSError as e:
        if "Address already in use" in str(e):
            print("⚠️ Port 5001 đang được sử dụng, thử port 5002...")
            app.run(debug=True, host='0.0.0.0', port=5002)
        else:
            raise