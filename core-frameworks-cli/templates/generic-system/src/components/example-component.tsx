import React from "react";

export const ExampleComponent: React.FC<{ title: string }> = ({ title }) => {
    return <div className="p-4 bg-white/10 rounded text-white font-bold">{title}</div>;
};
