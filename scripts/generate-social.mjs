import sharp from 'sharp';
await sharp('public/images/og/default.svg').png().toFile('public/images/og/default.png');
await sharp('public/favicon.svg').resize(180,180).png().toFile('public/apple-touch-icon.png');
