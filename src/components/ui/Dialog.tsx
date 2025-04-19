import React, { ReactNode, useEffect, useState } from 'react';
import Input from './Input';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className=" p-6 rounded-lg shadow-lg w-96">
                <button
                    className="absolute top-2 right-2"
                    onClick={() => onOpenChange(false)}
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
};


// components/DialogForm.tsx
import { Dish } from '@/types';

interface DialogFormProps {
    onSubmit: (data: any) => void;
    onClose: () => void;
    editDish: Partial<Dish> | null; // Receives the dish data to edit
}

export const DialogForm: React.FC<DialogFormProps> = ({ onSubmit, onClose, editDish }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
    });

    useEffect(() => {
        if (editDish) {
            setFormData({
                name: editDish.name || '',
                price: editDish.price?.toString() || '',
                description: editDish.description || '',
            });
        }
    }, [editDish]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({ name: '', price: '', description: '' });
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">{editDish ? 'Sửa Món Ăn' : 'Thêm Món Ăn'}</h3>
                <Input label="Name" value={formData.name} onChange={handleInputChange} name="name" />
                <Input label="Price" value={formData.price} onChange={handleInputChange} name="price" type="number" />
                <Input label="Description" value={formData.description} onChange={handleInputChange} name="description" />

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};



