import sharp from 'sharp';
await sharp('static/images/og/default.svg').png().toFile('static/images/og/default.png');
await sharp('static/favicon.svg').resize(180,180).png().toFile('static/apple-touch-icon.png');
