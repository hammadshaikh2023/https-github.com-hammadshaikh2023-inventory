import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Logo from Sidebar component
const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAACvCAMAAADob2qvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkE0NEQyNTdEMUM1MTFFNEI0M0JFNjNCODBEREE5MTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkE0NEQyNThEMUM1MTFFNEI0M0JFNjNCODBEREE5MTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QTQ0RDI1NUQxQzUxMUU0QjQzQkU2M0I4MERERDkxNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QTQ0RDI1NkQxQzUxMUU0QjQzQkU2M0I4MERERDkxNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps63Z5cAAAC5SURBVHja7N1ncsIwEAVQNrfS3b/S3X+p0+L0YpI2V98QcTzm9/zNS2lMmqZpmu5fPj/+/v39+/fL9++fPj19+7Isy/7+1y+3P/758+fz52/n9++/f/789e/X+/s/LMvy52/n9a+fdz+u9+vP2y/7//39+8/Pz98/f/r8e31/LcvS76/P/+2X/3+9fv7+f/r5/+f6/f/1359//+fz8/f/f/n8+P33v37+/H79/PuH+/fP28/vP6/f/17/P7/vP7/evn5+/v37/ev3/5+3n9f7969fP7//fv/99+/v3z8/v/7+//r8+/v796+f37/+/f/9+v2P9+9fv3/+8/Pz9/f/1++f6+/f//f/5++/f/7++9/v718/f37/fvn++9ev/3/+8/f/9fP39/f/9ev7/8/P38+v/+9//9//v/73/fv/68//+fv+58+/+vP7/+v/7z9//v7z/fv/9fP/v39/33/9+//r/f/r++/P//fv37+/f3+///7z/+/v689/vf/+/fn/7c+f//7++/3z++//P/95+3n/6/f/33/7+f/f/9+/v/+///z++vP/v/+8/v/+v77+f/f/9f33/5/fn/+///763/3nx88AQIAAQIE+AUECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgAABYlwADADn1Q+dM8o/VAAAAAElFTkSuQmCC";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { users } = useData();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('bws123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const user = users.find(u => u.username === username);

            if (user && user.password === password) {
                if (user.status === 'Blocked') {
                    setError('Your account is blocked. Please contact an administrator.');
                    setIsLoading(false);
                    return;
                }
                login(user.id);
                navigate(from, { replace: true });
            } else {
                setError('Invalid username or password');
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8 animate-zoomIn">
                <div className="text-center">
                    <img className="mx-auto h-16 w-auto" src={logoSrc} alt="BWS Inventory Logo" />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        BWS Inventory Management
                    </p>
                </div>
                <form className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username-address" className="sr-only">Username</label>
                            <input
                                id="username-address"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    {error && (
                         <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                     <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        <p>Demo credentials:</p>
                        <p>Username: <strong>admin</strong> | Password: <strong>bws123</strong></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
