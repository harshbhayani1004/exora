# Cloudflare R2 Storage Setup

## Configuration

Your project is now configured to use Cloudflare R2 for image storage:

- **Account ID**: 2cfbdaa73d244cae4930d0bdf1c6180f
- **Bucket Name**: exora-web
- **Public URL**: https://pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev
- **S3 API**: https://2cfbdaa73d244cae4930d0bdf1c6180f.r2.cloudflarestorage.com

## How Images Work

1. **Image Storage**: All product images are stored in your Cloudflare R2 bucket `exora-web` under the folder path `exora-product-img/exora-file/`
2. **Database**: Product image filenames are stored in the `product_images` table (e.g., `photo_1_2025-12-10_23-57-59.jpg`)
3. **URL Generation**: The app automatically converts these filenames to full R2 URLs:
   ```
   photo_1_2025-12-10_23-57-59.jpg
   → https://pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev/exora-product-img/exora-file/photo_1_2025-12-10_23-57-59.jpg
   ```

## Uploading Images to R2
    
### Option 1: Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2 → Buckets → exora-web
3. Upload your images directly through the web interface

### Option 2: Using AWS CLI with R2

```bash
# Configure AWS CLI for R2
aws configure --profile r2

# Set these values:
AWS Access Key ID: [Your R2 Access Key]
AWS Secret Access Key: [Your R2 Secret Key]
Default region: auto
Default output format: json

# Upload a file
aws s3 cp image.jpg s3://exora-web/ --endpoint-url https://2cfbdaa73d244cae4930d0bdf1c6180f.r2.cloudflarestorage.com --profile r2

# List files
aws s3 ls s3://exora-web/ --endpoint-url https://2cfbdaa73d244cae4930d0bdf1c6180f.r2.cloudflarestorage.com --profile r2
```

### Option 3: Using Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Upload file to R2
wrangler r2 object put exora-web/image.jpg --file=./image.jpg

# List files
wrangler r2 object list exora-web
```

## Current Product Images

Your database currently has these image references:

- photo_1_2025-12-10_23-57-59.jpg (Product 1)
- photo_2_2025-12-10_23-57-59.jpg (Product 2)
- photo_3_2025-12-10_23-57-59.jpg (Product 3)
- photo_2025-12-10_23-55-31.jpg (Product 4)
- photo_2025-12-10_23-57-14.jpg (Product 5)
- photo_2025-12-10_23-57-28.jpg (Product 6)
- photo_2025-12-10_23-57-29.jpg (Product 7)
- photo_2025-12-10_23-57-30.jpg (Product 8)
- photo_2025-12-10_23-57-31.jpg (Product 9)
- photo_2025-12-10_23-57-32.jpg (Product 10)
- photo_2025-12-10_23-57-33.jpg (Product 11)
- photo_3_2025-12-11_14-58-13.jpg (Product 12)
- photo_4_2025-12-11_14-58-13.jpg (Product 13)
- photo_5_2025-12-11_14-58-13.jpg (Product 14)
- photo_6_2025-12-11_14-58-13.jpg (Product 15)
- photo_7_2025-12-11_14-58-13.jpg (Product 16)
- photo_8_2025-12-11_14-58-13.jpg (Product 17)

**Make sure all these images are uploaded to your R2 bucket!**

## Updating Product Images

To update a product's image:

1. Upload the new image to R2
2. Update the database:

```sql
UPDATE product_images
SET src = 'new-image-filename.jpg'
WHERE product_id = 1;
```

## Stripe Payment Integration

Stripe keys are now configured in your `.env.local`:

- **Publishable Key**: pk_test_51SqV8VDTK9QBFsgf...
- **Secret Key**: sk_test_51SqV8VDTK9QBFsgf...

Use these for payment processing in your checkout flow.

## Security Notes

⚠️ **Important**:

- Never commit `.env.local` to git
- R2 Access Keys should be kept secure and not exposed in client code
- The public URL is read-only access for displaying images
- Write operations (upload/delete) should be done via server-side API routes with proper authentication
