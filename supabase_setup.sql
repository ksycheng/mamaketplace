-- Run this in Supabase SQL Editor

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  email text,
  avatar_url text,
  location text,
  created_at timestamp with time zone default now()
);

-- Listings table
create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  seller_name text,
  title text not null,
  description text,
  price numeric default 0,
  is_free boolean default false,
  category text default 'other',
  condition text,
  location text,
  type text default 'sell',
  image_url text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Conversations table
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings,
  user1_id uuid references auth.users not null,
  user2_id uuid references auth.users not null,
  other_user_id uuid references auth.users,
  last_message text,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations not null,
  sender_id uuid references auth.users not null,
  text text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table listings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Listings policies
create policy "Listings are viewable by everyone" on listings for select using (true);
create policy "Users can insert their own listings" on listings for insert with check (auth.uid() = user_id);
create policy "Users can update their own listings" on listings for update using (auth.uid() = user_id);

-- Conversations policies
create policy "Users can view their own conversations" on conversations for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Users can insert conversations" on conversations for insert with check (auth.uid() = user1_id);
create policy "Users can update their own conversations" on conversations for update using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Messages policies
create policy "Users can view messages in their conversations" on messages for select using (
  exists (select 1 from conversations where conversations.id = messages.conversation_id and (conversations.user1_id = auth.uid() or conversations.user2_id = auth.uid()))
);
create policy "Users can insert messages" on messages for insert with check (auth.uid() = sender_id);
