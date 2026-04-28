/**
 * Mock File Helper for Storybook
 * Creates realistic File objects without requiring real file system access
 */

export const createMockFile = (
    name: string = 'example-file.png',
    sizeMB: number = 5,
    type: string = 'image/png'
): File => {
    const size = sizeMB * 1024 * 1024;
    const buffer = new Uint8Array(size);

    // Fill with some random data to make it realistic
    for (let i = 0; i < Math.min(1024, size); i++) {
        buffer[i] = Math.floor(Math.random() * 256);
    }

    const blob = new Blob([buffer], { type });
    const file = new File([blob], name, {
        type,
        lastModified: Date.now()
    });

    return file;
};

/**
 * Common mock files for testing
 */
export const mockFiles = {
    smallPDF: () => createMockFile('document.pdf', 2, 'application/pdf'),
    mediumImage: () => createMockFile('photo.jpg', 5, 'image/jpeg'),
    largeVideo: () => createMockFile('video.mp4', 50, 'video/mp4'),
    textFile: () => createMockFile('data.txt', 0.5, 'text/plain'),
    archive: () => createMockFile('archive.zip', 15, 'application/zip')
};
