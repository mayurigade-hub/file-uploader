import type { Meta, StoryObj } from "@storybook/react";
import { FileUploader } from "../../components/FileUploader";
import { createMockFile, mockFiles } from "../utils/mockFile";

const meta: Meta<typeof FileUploader> = {
    title: "Components/FileUploader",
    component: FileUploader,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#000000" }],
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen flex items-center justify-center bg-black p-10">
                <Story />
            </div>
        ),
    ],
    args: {
        disableAutoStart: true,
        onRemove: () => console.log("Removed"),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Uploading: Story = {
    args: {
        id: "uploading",
        file: createMockFile("file.pptx", 8),
        status: "uploading",
        initialStatus: "uploading",
        mode: "normal",
    },
};

export const Paused: Story = {
    args: {
        id: "paused",
        file: mockFiles.video(),
        status: "paused",
        initialStatus: "paused",
        mode: "normal",
    },
};

export const Error: Story = {
    args: {
        id: "error",
        file: mockFiles.zip(),
        status: "error",
        initialStatus: "error",
        mode: "failure",
    },
};

export const Completed: Story = {
    args: {
        id: "completed",
        file: mockFiles.pdf(),
        status: "completed",
        initialStatus: "completed",
        mode: "normal",
    },
};

export const Waiting: Story = {
    args: {
        id: "waiting",
        file: mockFiles.image(),
        status: "waiting",
        mode: "normal",
    },
};

export const MultipleFiles: Story = {
    render: () => (
        <div className="space-y-4">
            <FileUploader
                id="file-1"
                file={createMockFile("report.pdf", 3)}
                status="uploading"
                initialStatus="uploading"
                disableAutoStart
                mode="normal"
                onRemove={() => { }}
            />
            <FileUploader
                id="file-2"
                file={createMockFile("slides.pptx", 7)}
                status="waiting"
                disableAutoStart
                mode="normal"
                onRemove={() => { }}
            />
        </div>
    ),
};
