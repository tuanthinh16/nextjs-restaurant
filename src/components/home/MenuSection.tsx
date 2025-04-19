'use client'
import { get } from '@/utils/api';
import React, { useEffect, useState } from 'react'
import CardLoading from '../ui/CardLoading';
import { useLanguage } from '@/app/languageContex';
import { useTranslation } from 'react-i18next';

const MenuSection = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const { locale } = useLanguage();
    const { t } = useTranslation('common');
    console.log("locale", locale)
    useEffect(() => {
        setLoading(true);
        get('/api/menu?target_lang=' + locale)
            .then(res => setData(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [locale]);
    if (loading) {
        return <CardLoading />;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!data) {
        return <div>No Menu Found</div>;
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('menuTitle')}</h1>
            <div className="grid grid-cols-2 gap-4">
                {data?.map((item: any) => (
                    <div key={item.id} className="border p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-green-600 font-bold">{item.price}₫</p>
                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-40 object-cover mt-2 rounded"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuSection