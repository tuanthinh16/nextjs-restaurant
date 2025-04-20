import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FiPlus } from "react-icons/fi";
import { RiSubtractFill } from "react-icons/ri";
import Input from './Input';
interface CardMenuProps {
    item: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string; // Added image prop
    };
    order: Record<string, number>;
    addItem: (itemId: string) => void;
    subItem: (itemId: string) => void;
}

const CardMenu = ({ item, order, addItem, subItem }: CardMenuProps) => {
    const quantity = order[item.id] || 0;
    const [isSelectQuanti, setSelectQuanti] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setSelectQuanti(false);
        }, 2000); // 5 giây

        return () => clearTimeout(timer); // clear khi component unmount hoặc re-run
    }, [quantity]);

    return (
        <div
            className="relative h-64 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
            style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Quantity badge - top right corner */}
            {quantity > 0 && (


                <div
                    className={`absolute top-2 right-2 cursor-pointer text-black flex items-center justify-center shadow-md transition-all
        ${isSelectQuanti ? 'w-24 gap-2 rounded-lg bg-gray-300 p-1' : 'w-8 h-8 rounded-full bg-gray-200'}`}
                    onClick={() => setSelectQuanti(true)}
                >
                    {isSelectQuanti ? (
                        <>
                            <RiSubtractFill
                                className="text-red-700 hover:text-red-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    subItem(item.id);
                                }}
                            />
                            <input
                                type="text"
                                className="w-8 text-center bg-transparent border-none outline-none"
                                value={quantity}

                            />
                            <FiPlus
                                className="text-green-700 hover:text-green-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addItem(item.id);
                                }}
                            />
                        </>
                    ) : (
                        <span className="font-semibold text-sm">{quantity}</span>
                    )}
                </div>



            )}

            {/* Content container */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold line-clamp-1">{item.name}</h2>
                        <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                    </div>
                    <p className="text-lg font-bold whitespace-nowrap ml-2">{item.price.toLocaleString()}₫</p>
                </div>

                {/* Add button with icon */}
                <Button
                    onClick={() => addItem(item.id)}
                    size="sm"
                    className="mt-3 w-full bg-primary/90 hover:bg-primary cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm vào đơn
                </Button>
            </div>
        </div>
    );
};

export default CardMenu;