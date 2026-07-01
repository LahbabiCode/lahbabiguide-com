# LahbabiGuide.com Migration & Portability Guide

This guide details the procedures for migrating LahbabiGuide.com from its initial cloud-native stack (Vercel + Neon + Vercel Blob) to a self-hosted or standard VPS architecture (PostgreSQL + S3/MinIO + Docker).

## 1. Database Migration (Neon to Self-Hosted PostgreSQL)

### Prerequisites
- Target PostgreSQL server version 15+
- Source Connection String (Neon)
- Target Connection String (Plesk/VPS)

### Migration Steps
1. **Maintenance Mode**: Enable maintenance mode via admin settings or environment variables to prevent data writes.
2. **Export Schema and Data**:
   ```bash
   pg_dump --no-owner --no-privileges $DATABASE_URL > backup.sql
   ```
3. **Restore to Target**:
   ```bash
   psql $NEW_DATABASE_URL < backup.sql
   ```
4. **Update Prisma**: Change `DATABASE_URL` in your `.env` to point to the new server and run:
   ```bash
   npx prisma generate
   ```

## 2. Storage Migration (Vercel Blob to S3/MinIO/R2)

LahbabiGuide.com uses a `StorageAdapter` pattern. To migrate:

1. **Configure S3 Adapter**: Update `.env` with your S3-compatible credentials.
2. **Migration Script**: Use the provided `/scripts/migrate-storage.ts` to copy blobs from Vercel to your new bucket.
3. **Registry**: All media metadata is stored in the `Media` table. The `url` field should remain consistent if using a CDN, or be updated via a SQL script if the path structure changes.

## 3. VPS / Plesk Deployment

### Deployment via Docker (Recommended)
1. **Pull Registry**: Upload your image to a private registry.
2. **Manual Compose**: 
   - Upload `docker-compose.yml` to your VPS.
   - Run `docker-compose up -d`.

### Manual Node.js Deployment
1. **Install Dependencies**: `npm install --production`
2. **Build**: `npm run build`
3. **Process Manager**: Use PM2 to manage the process:
   ```bash
   pm2 start npm --name "lahbabiguide" -- start
   ```

## 4. Docker Readiness

The included `Dockerfile` uses a multi-stage build to minimize footprint:
- **Build Stage**: Compiles TypeScript and Next.js.
- **Runner Stage**: Minimal alpine image with only production dependencies.

## 5. Backup Strategy

### Automated Backups
- **Database**: Schedule a CRON job to run `pg_dump` daily.
- **Media**: S3-compatible storage usually handles redundancy, but cross-region replication is recommended for critical data.

### Restore Procedure
```bash
# Database restore
psql $DATABASE_URL < latest_backup.sql

# Environment restore
cp .env.production .env
```

## 6. Environment Variables (Required for Production)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for Admin Auth |
| `GEMINI_API_KEY` | Server-side AI key |
| `STORAGE_TYPE` | `vercel-blob` or `s3` |
| `S3_BUCKET` | For S3-compatible storage |
| `S3_REGION` | For S3-compatible storage |
| `S3_ACCESS_KEY` | For S3-compatible storage |
| `S3_SECRET_KEY` | For S3-compatible storage |
| `S3_ENDPOINT` | Required for MinIO/R2 |

## 7. Revalidation Strategy

- **ISR**: Pages are cached for 3600s by default.
- **On-Demand**: Admin actions trigger `revalidateTag` or `revalidatePath` to purge cache immediately after content updates.
