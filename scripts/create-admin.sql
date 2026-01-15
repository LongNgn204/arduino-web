-- Update mật khẩu và role cho user admin hiện có
-- Username: admin
-- Password mới: 123123

UPDATE users 
SET password_hash = 'pbkdf2$100000$y/tSifv9q2hWNz7TEvmKhA==$Y//e0b9kEmm7hinb9DXIS983r87/v2dp8cjHB/lwEyQ=',
    role = 'admin',
    display_name = 'Admin',
    updated_at = 1768484347
WHERE username = 'admin';
