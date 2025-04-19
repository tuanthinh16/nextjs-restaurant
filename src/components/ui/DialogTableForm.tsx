import { useState } from "react";
import Input from "./Input";

// components/DialogTableForm.tsx
interface TableFormProps {
    onSubmit: (data: { table_number: string; capacity: number }) => void;
    onClose: () => void;
}

export const DialogTableForm: React.FC<TableFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ table_number: '', capacity: 4 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({ table_number: '', capacity: 4 });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Thêm bàn mới</h3>
            <Input label="Số bàn" name="table_number" value={formData.table_number} onChange={handleChange} />
            <Input label="Sức chứa" name="capacity" type="number" value={formData.capacity.toString()} onChange={handleChange} />
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Hủy</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
            </div>
        </div>
    );
};
