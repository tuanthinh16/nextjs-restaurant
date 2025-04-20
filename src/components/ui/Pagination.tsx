// components/Pagination.tsx
import { FC } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, handlePageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxInitialPages = 5; // Hiển thị 5 trang đầu tiên

        if (totalPages <= maxInitialPages + 1) {
            // Hiển thị tất cả trang nếu ít hơn hoặc bằng 6 trang
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Hiển thị 5 trang đầu + dấu ... + trang cuối
            for (let i = 1; i <= maxInitialPages; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-3 py-1 text-gray-800 rounded-md  transition duration-200 min-h-[35px] ${currentPage === 1 ? 'text-gray-500 ' : 'hover:bg-gray-300 cursor-pointer'}`}
            >
                <GrFormPrevious size={14} />
            </button>

            <div className="flex space-x-2">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={index} className="px-3 py-1 flex items-center">...</span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => handlePageChange(Number(page))}
                            className={`px-3 py-1 min-w-[36px] min-h-[35px] ${currentPage === page
                                ? 'bg-blue-500 text-white'
                                : ' text-gray-800 hover:bg-gray-300'
                                } transition duration-200 rounded-lg cursor-pointer`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-3 py-1  text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 min-h-[35px] ${currentPage === totalPages ? 'text-gray-500 ' : 'hover:bg-gray-300 cursor-pointer'}`}
            >
                <GrFormNext size={14} />
            </button>
        </div>
    );
};

export default Pagination;