import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getPlaiceholder } from 'plaiceholder';

const IMAGE_DIR = path.join(process.cwd(), 'public/images');
const OUTPUT_DIR = path.join(process.cwd(), 'public/images/optimized');
const MANIFEST_PATH = path.join(process.cwd(), 'public/images/manifest.json');

// Responsive sizes
const SIZES = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920,
};

interface ImageMetadata {
  original: string;
  optimized: {
    webp: Record<string, string>;
    avif: Record<string, string>;
  };
  blurDataURL: string;
  width: number;
  height: number;
  aspectRatio: number;
}

const manifest: Record<string, ImageMetadata> = {};

async function optimizeImage(filePath: string, fileName: string) {
  console.log(`\nOptimizing: ${fileName}`);

  const ext = path.extname(fileName).toLowerCase();

  // Skip non-image files (PDFs, etc.)
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    console.log(`  ⏭️  Skipping ${fileName} (not an image)`);
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.log(`  ⚠️  Skipping ${fileName} (no dimensions)`);
      return;
    }

    const baseName = path.basename(fileName, ext);
    const imageData: ImageMetadata = {
      original: `/images/${fileName}`,
      optimized: {
        webp: {},
        avif: {},
      },
      blurDataURL: '',
      width: metadata.width,
      height: metadata.height,
      aspectRatio: metadata.width / metadata.height,
    };

    // Generate responsive sizes
    for (const [sizeName, width] of Object.entries(SIZES)) {
      // Generate all sizes - withoutEnlargement prevents upscaling
      const webpPath = `/images/optimized/${baseName}-${sizeName}.webp`;
      const avifPath = `/images/optimized/${baseName}-${sizeName}.avif`;

      // WebP
      await image
        .clone()
        .resize(width, undefined, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(process.cwd(), 'public', webpPath));

      imageData.optimized.webp[sizeName] = webpPath;
      console.log(`  ✅ WebP ${sizeName}: ${webpPath}`);

      // AVIF
      await image
        .clone()
        .resize(width, undefined, { withoutEnlargement: true })
        .avif({ quality: 80 })
        .toFile(path.join(process.cwd(), 'public', avifPath));

      imageData.optimized.avif[sizeName] = avifPath;
      console.log(`  ✅ AVIF ${sizeName}: ${avifPath}`);
    }

    // Generate blur placeholder
    try {
      const buffer = await image
        .clone()
        .resize(20)
        .toBuffer();

      const { base64 } = await getPlaiceholder(buffer);
      imageData.blurDataURL = base64;
      console.log(`  ✅ Blur placeholder generated`);
    } catch (err) {
      console.log(`  ⚠️  Could not generate blur: ${err}`);
    }

    manifest[fileName] = imageData;
  } catch (err) {
    console.error(`  ❌ Error processing ${fileName}:`, err);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all images
  const files = fs.readdirSync(IMAGE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  console.log(`Found ${files.length} images to optimize\n`);

  // Process images
  for (const file of files) {
    const filePath = path.join(IMAGE_DIR, file);
    await optimizeImage(filePath, file);
  }

  // Write manifest
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n✅ Optimization complete!`);
  console.log(`📄 Manifest written to: ${MANIFEST_PATH}`);
  console.log(`📊 Total images: ${Object.keys(manifest).length}`);
}

main().catch(console.error);
