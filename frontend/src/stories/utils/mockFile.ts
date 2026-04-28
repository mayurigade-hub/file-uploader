/**
 * Mock File utility for Storybook
 * Creates File-like objects that work in Storybook's sandboxed environment
 */

export const createMockFile = (
    name: string = "demo.png",
    sizeMB: number = 1,
    type: string = "image/png"
): File => {
    const size = sizeMB * 1024 * 1024;
    const buffer = new Uint8Array(size);

    // Fill with some data to make it realistic
    for (let i = 0; i < Math.min(1024, size); i++) {
        buffer[i] = Math.floor(Math.random() * 256);
    }

    const blob = new Blob([buffer], { type });

    return new File([blob], name, {
        type,
        lastModified: Date.now()
    });
};

/**
 * Predefined mock files for common scenarios
 */
export const mockFiles = {
    pdf: () => createMockFile("document.pdf", 2, "application/pdf"),
    image: () => createMockFile("photo.jpg", 5, "image/jpeg"),
    video: () => createMockFile("video.mp4", 50, "video/mp4"),
    text: () => createMockFile("notes.txt", 0.5, "text/plain"),
    zip: () => createMockFile("archive.zip", 15, "application/zip"),
    small: () => createMockFile("tiny.txt", 0.1, "text/plain"),
    large: () => createMockFile("huge.bin", 100, "application/octet-stream")
};

/**
 * Create multiple mock files for queue testing
 */
export const createMockFileList = (count: number = 3): File[] => {
    const files: File[] = [];

    const templates = [
        { name: "report.pdf", size: 3, type: "application/pdf" },
        { name: "presentation.pptx", size: 7, type: "application/vnd.ms-powerpoint" },
        { name: "image.jpg", size: 2, type: "image/jpeg" },
        { name: "video.mp4", size: 25, type: "video/mp4" },
        { name: "data.csv", size: 1, type: "text/csv" }
    ];

    for (let i = 0; i < count; i++) {
        const template = templates[i % templates.length]!;
        // Non-null assertion fixes TS error

        files.push(
            createMockFile(
                `${i + 1}-${template.name}`,
                template.size,
                template.type
            )
        );
    }

    return files;
};
