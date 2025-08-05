#!/usr/bin/env python3
"""
Quick test script for affiliate login system
"""
from app import app, db, Member, init_admin

def test_login():
    with app.app_context():
        # Create tables
        db.create_all()
        init_admin()
        
        # Test admin login
        admin = Member.query.filter_by(email='admin@mamnon.com').first()
        if admin:
            print(f"✅ Admin found: {admin.full_name}")
            print(f"📧 Email: {admin.email}")
            print(f"🔑 Password stored: {admin.password}")
            print(f"👑 Is admin: {admin.is_admin}")
            
            # Test password check
            if admin.password == 'admin123':
                print("✅ Password matches!")
            else:
                print("❌ Password mismatch!")
                
        else:
            print("❌ Admin not found!")

if __name__ == '__main__':
    test_login()