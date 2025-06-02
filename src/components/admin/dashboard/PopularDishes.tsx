import { DishReport } from "@/types";


export function PopularDishes({ dishes }: { dishes: DishReport[] }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Món ăn phổ biến</h2>
            <div className="space-y-3">
                {dishes.map((dish, index) => (
                    <div key={index} className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                            <span className="text-cyan-600">🍲</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-cyan-600 h-1.5 rounded-full"
                                    style={{ width: `${dish.popularity}%` }}
                                />
                            </div>
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-900">
                            {dish.orders} đơn
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}