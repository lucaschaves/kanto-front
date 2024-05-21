import { Button, Card, CardContent } from "@/components";
import { cn } from "@/lib";
import { UploadIcon } from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";

interface DropzoneProps {
    onChange: React.Dispatch<React.SetStateAction<string[]>>;
    className?: string;
    fileExtension?: string;
}

const Dropzone = ({
    onChange,
    className,
    fileExtension,
    ...props
}: DropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileInfo, setFileInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const { files } = e.dataTransfer;
        handleFiles(files);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
            handleFiles(files);
        }
    };

    const handleFiles = (files: FileList) => {
        const uploadedFile = files[0];

        if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
            setError(`Invalid file type. Expected: .${fileExtension}`);
            return;
        }

        const fileSizeInKB = Math.round(uploadedFile.size / 1024);

        const fileList = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );
        onChange((prevFiles) => [...prevFiles, ...fileList]);

        setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
        setError(null);
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Card
            className={cn(
                "border",
                "border-dashed",
                "bg-white",
                "hover:cursor-pointer",
                "hover:border-muted-foreground/50",
                className
            )}
            {...props}
        >
            <CardContent
                className={cn(
                    "flex",
                    "flex-col",
                    "items-center",
                    "justify-center",
                    "space-y-2",
                    "px-2",
                    "py-4",
                    "text-xs"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <UploadIcon className="w-10 h-10" />
                {fileInfo ? (
                    <p className="text-muted-foreground">{fileInfo}</p>
                ) : (
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "items-center",
                            "justify-center",
                            "text-muted-foreground"
                        )}
                    >
                        <span className="font-medium text-center">
                            Arraste os arquivos para fazer upload ou
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleButtonClick}
                            type="button"
                        >
                            Clique aqui
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={`.${fileExtension}`}
                            onChange={handleFileInputChange}
                            className="hidden"
                            multiple
                        />
                    </div>
                )}
                {error && <span className="text-red-500">{error}</span>}
            </CardContent>
        </Card>
    );
};

export { Dropzone };
