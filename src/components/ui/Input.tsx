// components/Input.tsx
import React from 'react';

interface InputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name: string; // Thêm thuộc tính name vào đây
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = 'text', name }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name} // Sử dụng prop name trong input
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
            />
        </div>
    );
};

export default Input;
