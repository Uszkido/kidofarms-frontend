"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        if (result?.info?.secure_url) {
            onChange([...value, result.info.secure_url]);
        }
    };

    if (!isMounted) return null;

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden border border-primary/10 shadow-sm group">
                        <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Product Image"
                            src={url}
                        />
                    </div>
                ))}

                {value.length === 0 && (
                    <div className="w-[200px] h-[200px] rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-primary/20 bg-neutral-50">
                        <ImageIcon size={48} />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Image</span>
                    </div>
                )}
            </div>

            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: 5,
                    clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <button
                            type="button"
                            onClick={onClick}
                            className="flex items-center gap-2 bg-white border border-primary/10 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-primary hover:bg-neutral-50 transition-all shadow-sm group"
                        >
                            <Upload size={20} className="text-secondary group-hover:scale-110 transition-transform" />
                            Upload Product Image
                        </button>
                    );
                }}
            </CldUploadWidget>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-4">
                Recommended: 1080x1080px (Square) &bull; Max 5 images
            </p>
        </div>
    );
}
