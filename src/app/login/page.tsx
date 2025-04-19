// components/LoginForm.tsx
'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
            callbackUrl: '/'
        });

        if (result?.error) {
            setError(result.error);
        } else {
            if (username == 'admin') router.push('/admin');
            else router.push('/');
        }
    };

    const handleGoogleLogin = async () => {
        const result = await signIn('google', {
            redirect: false,
            callbackUrl: '/'
        });

        if (result?.error) {
            setError(result.error);
        }
    };

    return (
        <div className="max-w-md m-auto p-6 bg-white rounded-lg shadow-md mt-15">
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

            {/* Login with Google */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 mb-4 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
                <FcGoogle className="text-xl" />
                <span>Đăng nhập với Google</span>
            </button>

            <div className="flex items-center mb-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500">hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Username/Password Login */}
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block mb-1 font-medium">
                        Tên đăng nhập
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}