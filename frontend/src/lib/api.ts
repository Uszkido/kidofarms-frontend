export const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // If path is an absolute URL (starts with http), return it as is
    if (path.startsWith('http')) return path;
    return `${baseUrl}${cleanPath}`;
};

export const fetcher = async (path: string, options?: RequestInit) => {
    const url = getApiUrl(path);
    const res = await fetch(url, options);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(error.error || 'Request failed');
    }
    return res.json();
};
