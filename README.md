<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1I7cTINeGvub2lpOPSeTPHW-IRq7f7NBs

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Auth (Landing + App Protegido)

### Variáveis de ambiente (Vite)
Crie um arquivo `.env.local` com:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

> O app exibe uma mensagem amigável se `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não estiverem configuradas.

### Vercel (produção)
1. No painel do projeto na Vercel, adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
2. No Supabase > Auth > URL Configuration:
   - **Site URL**: `https://<seu-projeto>.vercel.app`
   - **Redirect URLs**: `https://<seu-projeto>.vercel.app/*` e `http://localhost:3000/*`

> Sem essas URLs, o login pode falhar em produção ou no ambiente local.

### SQL (caso as tabelas ainda não existam)
Execute no SQL Editor do Supabase:

```sql
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  plan text not null default 'FREE' check (plan in ('FREE', 'PAID')),
  role text not null default 'USER' check (role in ('USER', 'ADMIN')),
  created_at timestamptz not null default now()
);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists calendar_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  content text not null,
  scheduled_for date,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table drafts enable row level security;
alter table calendar_items enable row level security;

create policy "Profiles read own" on profiles
  for select using (id = auth.uid());

create policy "Profiles insert own" on profiles
  for insert with check (id = auth.uid());

create policy "Profiles update own" on profiles
  for update using (id = auth.uid());

create policy "Profiles admin all" on profiles
  for all using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Drafts owner read" on drafts
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Drafts owner write" on drafts
  for insert with check (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Drafts owner update" on drafts
  for update using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Drafts owner delete" on drafts
  for delete using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Calendar owner read" on calendar_items
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Calendar owner write" on calendar_items
  for insert with check (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Calendar owner update" on calendar_items
  for update using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Calendar owner delete" on calendar_items
  for delete using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );
```
