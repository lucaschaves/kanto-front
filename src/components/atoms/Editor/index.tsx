import { cn } from "@/lib";
import "quill/dist/quill.snow.css";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useQuill } from "react-quilljs";

interface IPropsEditor {
    className?: string;
    value?: any;
    onChangeText?(text: string): void;
    onChangeHtml?(html: string): void;
}

export interface IRefEditor {
    addBody: (value: any) => void;
}

export const Editor = forwardRef<IRefEditor, IPropsEditor>((props, ref) => {
    const {
        className,
        value,
        onChangeText = () => ({}),
        onChangeHtml = () => ({}),
        ...rest
    } = props;

    const { quill, quillRef } = useQuill();

    const addBody = (val: any) => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(val);
        }
    };

    useEffect(() => {
        if (quill) {
            quill.on("text-change", () => {
                onChangeText(quill.getText());
                onChangeHtml(quill.root.innerHTML);
            });
            quill.clipboard.dangerouslyPasteHTML(value);
        }
    }, [quill]);

    useImperativeHandle(
        ref,
        () => ({
            addBody,
        }),
        [addBody]
    );

    return (
        <div
            className={cn("w-full", "h-full", "min-h-64", className)}
            {...rest}
        >
            <div ref={quillRef} />
        </div>
    );
});
