import React from "react";

const Progress = ({ className = "", value = 0, max = 100, ...props }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div
            className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
            {...props}
        >
            <div
                className="h-full w-full flex-1 bg-blue-500 transition-all"
                style={{
                    width: `${percentage}%`,
                    transition: "width 0.3s ease"
                }}
            />
        </div>
    );
};

export { Progress }; 