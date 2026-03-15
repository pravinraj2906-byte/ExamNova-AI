#!/bin/bash

# ExamNova AI Setup Script
# This script initializes the project with all necessary configurations

echo "🚀 ExamNova AI - Setup Starting..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
pnpm exec prisma generate

# Create database migrations
echo "🗄️  Setting up database..."
pnpm exec prisma migrate dev --name init

# Seed database (optional - you can create a seed.ts file)
echo "✅ Setup completed!"
echo "👉 Next steps: npm run dev to start the development server"
