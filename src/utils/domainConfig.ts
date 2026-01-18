export const getAppType = () => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('admin')) return 'ADMIN';
    if (hostname.startsWith('tutor')) return 'EXPERT';
    return 'STUDENT'; // Default to student
};

const appType = getAppType();

export const APP_CONFIG = {
    type: appType,
    themeColor: appType === 'ADMIN' ? 'bg-slate-800' : appType === 'EXPERT' ? 'bg-indigo-600' : 'bg-blue-600',
    portalName: appType === 'ADMIN' ? 'Admin Console' : appType === 'EXPERT' ? 'Tutor Portal' : 'Student Marketplace'
};