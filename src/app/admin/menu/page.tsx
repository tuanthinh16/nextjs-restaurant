'use client'
import { useEffect, useState } from 'react';
import { get, post, put, deleteAPI } from '@/utils/api';  // Thêm API upload ảnh
import { Button } from '@/components/ui/button';
import { Dialog, DialogForm } from '@/components/ui/Dialog';
import { CloudinaryUploadResponse, Dish } from '@/types';


export default function MenuManager() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDish, setEditDish] = useState<Partial<Dish> | null>(null);
    const [imageEditingDish, setImageEditingDish] = useState<Partial<Dish> | null>(null);  // Lưu món ăn đang chỉnh sửa ảnh
    const [imageFile, setImageFile] = useState<File | null>(null);  // Lưu file ảnh đã chọn
    const [imageUploading, setImageUploading] = useState(false);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0); // To calculate total pages
    const limit = 10; // Number of items per page

    const fetchDishes = async (start: number) => {
        const res = await get<Dish[]>(`/api/menu?start=${start}&limit=${limit}`);
        if (res.success) {
            // console.log(res)
            setDishes(res.data as Dish[]);
            setTotalItems(dishes.length); // Assuming API response includes the total count of items
        }

    };

    useEffect(() => {
        const start = (currentPage - 1) * limit;
        fetchDishes(start);
    }, [currentPage]);

    const handleSubmit = async (formData: Partial<Dish>) => {
        if (!formData.name || !formData.price) return;
        if (editDish?.id) {
            await put(`/api/menu/${editDish.id}`, formData);
        } else {
            await post('/api/menu', formData);
        }
        setDialogOpen(false);
        setEditDish(null);
        const start = (currentPage - 1) * limit;
        fetchDishes(start);
    };

    const handleDelete = async (id: number) => {
        await deleteAPI(`/api/menu/${id}`, {});
        const start = (currentPage - 1) * limit;
        fetchDishes(start);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile || !imageEditingDish?.id) return;
        setImageUploading(true);

        try {
            // 1. Tạo FormData và thêm file vào
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('public_id', `${imageEditingDish.id}`);

            // 2. Upload ảnh lên Cloudinary - with proper typing
            const uploadResponse = await post<CloudinaryUploadResponse>('/api/image/upload', formData);

            if (!uploadResponse.success || !uploadResponse.data) {
                console.error('Upload failed:', uploadResponse.message);
                throw new Error(uploadResponse.message || 'Upload ảnh thất bại');
            }

            console.log("Upload success:", uploadResponse.data);

            // 3. Cập nhật URL ảnh vào database - with proper typing
            const updateResponse = await put<{ success: boolean; message?: string }>(
                `/api/menu/${imageEditingDish.id}/image`,
                {
                    image_url: uploadResponse.data.secure_url
                }
            );

            if (!updateResponse.success) {
                throw new Error(updateResponse.message || 'Cập nhật database thất bại');
            }

            // 4. Cập nhật state local nếu thành công
            setDishes(prevDishes =>
                prevDishes.map(dish =>
                    dish.id === imageEditingDish.id
                        ? { ...dish, image_url: uploadResponse.data!.secure_url }
                        : dish
                )
            );

            setImageFile(null);
            setImageEditingDish(null);
            alert('Cập nhật ảnh thành công!');

        } catch (error) {
            console.error('Error:', error);
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload ảnh');

            // TODO: Thêm logic xóa ảnh đã upload nếu cập nhật database thất bại
            // if (uploadResponse?.data?.public_id) {
            //   await deleteAPI('/api/image/delete', { public_id: uploadResponse.data.public_id });
            // }

        } finally {
            setImageUploading(false);
        }
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit) | 1;

    return (
        <div className="p-4 max-w-3xl mx-auto relative">
            {imageUploading && (
                <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            )}
            <div className={imageUploading ? 'opacity-50 pointer-events-none' : ''}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Quản lý món ăn</h1>
                    <Button onClick={() => { setEditDish(null); setDialogOpen(true); }}>Thêm món</Button>
                </div>

                <ul>
                    {dishes.map((dish) => (
                        <li key={dish.id} className="mb-4 p-4 bg-white rounded shadow flex items-center">
                            <div className="flex-1">
                                <div className="font-semibold text-lg">{dish.name} - {dish.price}₫</div>
                                <p className="text-gray-600">{dish.description}</p>
                                <div className="space-x-3 mt-2">
                                    <Button variant="outline" onClick={() => { setEditDish(dish); setDialogOpen(true); }}>Sửa</Button>
                                    <Button variant="destructive" onClick={() => handleDelete(dish.id)}>Xóa</Button>
                                </div>
                            </div>
                            <div className="ml-4">
                                <img
                                    src={dish.image_url || '/default-image.jpg'}
                                    alt={dish.name}
                                    className="w-32 h-32 object-cover cursor-pointer"
                                    onClick={() => {
                                        setImageEditingDish(dish);
                                        setImageFile(null);  // Reset file on image click
                                    }}
                                />
                                {imageEditingDish?.id === dish.id && (
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="mb-2"
                                        />
                                        <Button
                                            onClick={handleImageUpload}
                                            disabled={!imageFile}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        >
                                            Lưu
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Previous
                    </Button>
                    <span className="mx-4">{currentPage} / {totalPages}</span>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Next
                    </Button>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogForm
                        onSubmit={handleSubmit}
                        onClose={() => setDialogOpen(false)}
                        editDish={editDish} // Pass the editDish state to DialogForm
                    />
                </Dialog>



            </div>
        </div>
    );
}
