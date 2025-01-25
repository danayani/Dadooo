export interface PostItem {
    id: string
    userId: string
    username: string
    avatar: string
    shopName: string
    shopId: string
    images: string[] // up to 2 images if available
    comments: number
    date: string
    text: string
    likes: number
    didLike: boolean // did the current user like this feed, wish we had a PUT request to update the DB
    premium: boolean
}

export interface FeedData {
    hasMore: boolean,
    data: PostItem[]
}
