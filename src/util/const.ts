export function feedURL(skip:number): string {
    return `${tedoooDomain}/hw/feed.json?skip=${skip}`
}

export const tedoooDomain = "https://backend.tedooo.com"