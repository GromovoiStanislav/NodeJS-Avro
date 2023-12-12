import { compress, uncompress } from 'snappy';

const originalData = 'Some data to compress';

// Асинхронное сжатие данных
compress(originalData)
  .then((compressedData) => {
    console.log('Compressed data:', compressedData);

    // Асинхронная распаковка данных
    uncompress(compressedData)
      .then((uncompressedData) => {
        console.log('Uncompressed data:', uncompressedData);

        console.log('Original string:', uncompressedData.toString('utf8'));
      })
      .catch((err) => {
        console.error('Uncompression error:', err);
      });
  })
  .catch((err) => {
    console.error('Compression error:', err);
  });
