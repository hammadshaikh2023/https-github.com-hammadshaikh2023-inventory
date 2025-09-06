import React from 'react';

const iconProps = {
    className: "w-7 h-7", // Increased default size
    strokeWidth: 1.5,
};

// Two-tone icon style using transparent layers over a colored base
const TwoToneIcon: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`relative ${className || iconProps.className}`}>
        <div className="absolute inset-0 text-indigo-300 dark:text-indigo-500 opacity-60">{children}</div>
        <div className="relative text-indigo-600 dark:text-indigo-400">{children}</div>
    </div>
);

export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z" />
        </svg>
    </TwoToneIcon>
);

export const InventoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 18H6v-4h2.5v4zm3.5 0H9.5v-4h2.5v4zm3.5 0h-2.5v-4H18v4zm0-6H6V8h12v4z" />
        </svg>
    </TwoToneIcon>
);
export const SalesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 7h-1V5h-2v2h-4V5H9.99v2H9V5H8v2H7V5H5v2H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 11H5V11h14v7z" /><path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
    </TwoToneIcon>
);
export const PurchasesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.44-.83-.44-.32 0-.64.16-.83.44L6.79 9H2c-.55 0-1 .45-1 1s.45 1 1 1h1.61l2.36 10.37c.18.78.89 1.35 1.7.99l.86-.36 1.46 2.19c.28.42.92.42 1.2 0l1.46-2.19.86.36c.81.36 1.52-.21 1.7-.99L19.39 11H21c.55 0 1-.45 1-1s-.45-1-1-1h-3.79zM12 17.27L10.92 19l-1.35-2.02.83-.34 1.6 3.63zm0 0l1.08 1.73L14.43 17l.83.34-1.35 2.02L12 17.27z" />
        </svg>
    </TwoToneIcon>
);
export const WarehouseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm.5 15h-1v-4h1v4zm4-4h-2v4h-2v-4h-2v4h-2v-4H6v5H4v-6.32l8-6.4 8 6.4V14h-2v-2z" />
        </svg>
    </TwoToneIcon>
);
export const FulfillmentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.99 8c0-.55-.45-1-1-1h-3.37c-.55-2.24-2.53-4-4.62-4s-4.07 1.76-4.62 4H5c-.55 0-1 .45-1 1s.45 1 1 1h14.99c.55 0 1-.45 1-1zM12 6c1.38 0 2.5 1.12 2.5 2.5S13.38 11 12 11s-2.5-1.12-2.5-2.5S10.62 6 12 6zm-7 5H3v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V11h-2v9H5v-9zm10 2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
        </svg>
    </TwoToneIcon>
);
export const ReportsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 16H8v-5h1v5zm2 0h-1V8h1v8zm2 0h-1v-3h1v3zm2 0h-1v-4h1v4z" />
        </svg>
    </TwoToneIcon>
);
export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
    </TwoToneIcon>
);
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-7 h-7 text-yellow-500"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 9c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 3c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zm0 16c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1zM5.64 6.36c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l.71.71c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-.71-.71zm12.73 12.73c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l.71.71c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-.71-.71zM4 12c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1s.45-1 1-1h1c.55 0 1 .45 1 1zm16 0c0 .55-.45 1-1 1h-1c-.55 0-1-.45-1-1s.45-1 1-1h1c.55 0 1 .45 1 1zm-2.05-6.36c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-.71.71c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l.71-.71zm-12.73 12.73c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0l-.71.71c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l.71-.71z" />
    </svg>
);
export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-7 h-7 text-gray-400"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
    </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 15.75h5.25a1.125 1.125 0 001.125-1.125v-5.25a1.125 1.125 0 00-1.125-1.125h-2.25M15 18.75h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5m1.125 2.625v1.5a1.125 1.125 0 001.125 1.125h1.5" />
    </svg>
);
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
    </TwoToneIcon>
);
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);
export const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);
export const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);
export const PrinterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 18H6v-2h2v2zm10-4H6v-4h12v4zm-2-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /><path d="M18 3H6v4h12V3z" />
        </svg>
    </TwoToneIcon>
);
export const AuditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z" /><path d="M11 7h2v5h-2zm0 6h2v2h-2z" />
        </svg>
    </TwoToneIcon>
);
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4l-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" />
        </svg>
    </TwoToneIcon>
);
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps} className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);
export const PdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.5 11.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5v-5H8c.83 0 1.5.67 1.5 1.5v1zm-2-0h-1v1h1v-1zm7 0c0 .83-.67 1.5-1.5 1.5h-2.5V9H13c.83 0 1.5.67 1.5 1.5v1zm-2-0h-1v1h1v-1zm4.5-1.5L18 9v6h-1.5V9h-1.5v4.5H16V12h-1.5v3h4.5V9h-1.5z" />
        </svg>
    </TwoToneIcon>
);
export const ExcelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
       <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 9l-2.5 4l2.5 4H14l-2.5-4l2.5-4h2.5zm-6 0l-2.5 4l2.5 4H8l-2.5-4l2.5-4h2.5zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM19 19H5V5h14v14z" />
        </svg>
    </TwoToneIcon>
);
export const WordIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 18l-4-11h2.5l1.5 6.5L13.5 7H16l-4 11z" />
        </svg>
    </TwoToneIcon>
);

export const FontSizeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <TwoToneIcon className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.93 13.5h4.14L12 7.98zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-4.05 11.5h-1.9l-1.2-3H8.15l-1.2 3h-1.9l4-10h1.9l4 10z" />
        </svg>
    </TwoToneIcon>
);