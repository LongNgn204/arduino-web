# Deploy Arduino Hub lên Cloudflare

## 📁 Cấu trúc Project

```
arduino-web/
├── apps/
│   ├── web-vite/    # ✅ Frontend mới (Vite + React)
│   ├── web/         # ❌ XÓA sau khi restart máy
│   └── workers/     # Backend (Cloudflare Workers)
```

---

## 🗑️ Xóa Files Cũ

Folder `apps/web` (Next.js cũ) đang bị lock. Để xóa:

1. **Đóng tất cả terminals** và **VS Code**
2. **Restart máy** (hoặc chỉ cần logout/login)
3. Mở terminal và chạy:
```bash
cd C:\Users\Administrator\Documents\GitHub\arduino-web
rd /s /q apps\web
ren apps\web-vite web
```

---

## 🚀 Deploy Frontend (Cloudflare Pages)

### Cách 1: Deploy qua Dashboard (Đơn giản)

1. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages** → **Create** → **Pages**
3. Chọn **Connect to Git** → Chọn repo `arduino-web`
4. Cấu hình:
   - **Framework preset**: `None`
   - **Build command**: `cd apps/web-vite && npm install && npm run build`
   - **Build output directory**: `apps/web-vite/dist`
5. Click **Save and Deploy**

### Cách 2: Deploy qua Wrangler CLI

```bash
# Cài Wrangler nếu chưa có
npm install -g wrangler

# Login vào Cloudflare
wrangler login

# Build frontend
cd apps/web-vite
npm run build

# Deploy
wrangler pages deploy dist --project-name=arduino-hub
```

---

## 🔧 Deploy Backend (Cloudflare Workers)

```bash
cd apps/workers

# Setup D1 database (nếu chưa có)
wrangler d1 create arduino-db
# Copy database_id vào wrangler.toml

# Setup KV namespace
wrangler kv:namespace create AI_RATE_LIMIT
# Copy id vào wrangler.toml

# Set secrets
wrangler secret put OPENROUTER_API_KEY

# Run migrations
npm run db:migrate

# Deploy
wrangler deploy
```

---

## 🔗 Cấu hình CORS

Sau khi deploy, cập nhật `API_BASE` trong `authStore.ts`:

```typescript
const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.<your-subdomain>.workers.dev'
    : '';
```

---

## ✅ Checklist Deploy

- [ ] Xóa folder `apps/web` cũ
- [ ] Rename `apps/web-vite` → `apps/web`
- [ ] Deploy Workers backend
- [ ] Deploy Pages frontend
- [ ] Cập nhật API_BASE trong authStore
- [ ] Test đăng ký/đăng nhập trên production
