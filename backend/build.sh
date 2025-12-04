#!/bin/bash

# Backend Build Script for Deployment
# This ensures Prisma client is generated before building

echo "🔧 Installing dependencies..."
npm install

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🏗️  Building NestJS application..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Run migrations: npx prisma migrate deploy"
echo "   2. Start application: npm run start:prod"
