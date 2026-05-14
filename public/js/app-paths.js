function getAppBasePath() {
    const pathName = window.location.pathname;
    const segments = pathName.split("/").filter(Boolean);
    const appFolders = ["public", "backend", "ScriptJuego", "Assets"];
    const folderIndex = segments.findIndex((segment) => appFolders.includes(decodeURIComponent(segment)));

    if (folderIndex >= 0) {
        const baseSegments = segments.slice(0, folderIndex);
        return `/${baseSegments.join("/")}${baseSegments.length ? "/" : ""}`;
    }

    const lastSlashIndex = pathName.lastIndexOf("/");
    return `${pathName.slice(0, lastSlashIndex + 1)}`;
}

function appUrl(relativePath) {
    const cleanRelativePath = relativePath.replace(/^\/+/, "");
    return `${getAppBasePath()}${cleanRelativePath}`;
}

window.APP_PATHS = {
    base: getAppBasePath,
    url: appUrl
};
