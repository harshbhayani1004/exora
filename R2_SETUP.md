# Cloudflare R2 Storage Setup

## Configuration

Product images are stored in Cloudflare R2. Set the following in your `.env.local` (see `.env.local.example` if present, or your team's secrets manager):

```env
R2_ACCOUNT_ID=your-account-id
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-public-bucket-url
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
```

## How Images Work

1. **Image Storage**: Product images are stored in the R2 bucket under `exora-product-img/exora-file/`.
2. **Database**: Product image filenames are stored in the `product_images` table.
3. **URL Generation**: The app converts stored filenames into full R2 URLs at request time, e.g.:

   ```
   <filename>.jpg → <R2_PUBLIC_URL>/exora-product-img/exora-file/<filename>.jpg
   ```

## Uploading Images to R2

### Option 1: Cloudflare Dashboard

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2 → Buckets → your bucket
3. Upload images directly through the web interface

### Option 2: AWS CLI (R2 is S3-compatible)

```bash
aws configure --profile r2
# Default region: auto
# Default output format: json

aws s3 cp image.jpg s3://<bucket>/ --endpoint-url https://<account-id>.r2.cloudflarestorage.com --profile r2
aws s3 ls s3://<bucket>/ --endpoint-url https://<account-id>.r2.cloudflarestorage.com --profile r2
```

### Option 3: Wrangler CLI

```bash
npm install -g wrangler
wrangler login

wrangler r2 object put <bucket>/image.jpg --file=./image.jpg
wrangler r2 object list <bucket>
```

## Updating Product Images

1. Upload the new image to R2.
2. Update the corresponding row in the `product_images` table with the new filename.

## Security Notes

⚠️ **Important**:

- Never commit `.env.local` or any file containing real credentials to git.
- R2 access keys and Stripe secret keys must be kept server-side only and never exposed in client code.
- The R2 public bucket URL should be read-only for displaying images.
- Write operations (upload/delete) must go through authenticated server-side API routes.
