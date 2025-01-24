"use client"
import {UIEvent} from 'react';
import {useEffect, useState} from "react";
import axios from "axios";

// would prefer if it would be more globally or with a better state management
const impressionFeeds: string[] = []

export default function FeedPage() {

    // can extract to env, to be configuration dynamic. Or we can use the first `object.length` value we receive.
    const skipStep = 6
    const [skip, setSkip] = useState<number>(0)
    const [feedShows, setFeedShows] = useState<PostItem[]>([])
    const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(true)

    //This is a simple way to load first feeds when the app initiates
    useEffect(() => {
        if (!hasMoreFeed) {
            return
        }
        updateFeedsData()
    }, []);

    /**
     * Handle the scroll event, and check if we need to load more feeds
     * if the user scrolled to the bottom of the page or close to it (90%)
     * 90% can be changed to a more dynamic value, or a configuration value
     * we use threshold to maximise user experience
     * @param event - the scroll event
     */
    function handleScroll(event: UIEvent<HTMLDivElement>) {
        const ratioThreshold = 0.9
        const {scrollTop, scrollHeight, clientHeight} = event.target as HTMLDivElement

        const ratio = scrollTop / (scrollHeight - clientHeight)

        if (ratio > ratioThreshold) {
            if (!hasMoreFeed) {
                console.warn("No more feeds to load")
                return
            }
            updateFeedsData()
        }
    }

    return (<div className={"h-screen overflow-y-scroll"} onScroll={handleScroll}>
        {feedShows.map((feed) => {
            return (
                <div className={'pt-5 items-center flex flex-col'} key={feed.id}>
                    <Post post={feed}/>
                </div>)
        })}
    </div>)

    function baseURL(): string {
        return `https://backend.tedooo.com/hw/feed.json?skip=${skip}`
    }

    function Post(props: { post: PostItem }) {
        impressionTracking(props.post.id)
        return (
            <div className={'flex flex-col gap-4 pt-4 pb-4 bg-White rounded  font-DMSans ' +
                'shadow-[0px_1px_7px_0px_#282F2D12]'
            }>
                <PostInfo date={props.post.date} avatarImage={props.post.avatar} shopName={props.post.shopName}
                          username={props.post.username}/>
                <PostDescription description={props.post.text}/>
                <PostImages images={props.post.images}/>
                <PostInteractionInfo likes={props.post.likes} comments={props.post.comments}/>
                <PostSeparator/>
                <PostInteraction onClick={() => updateFeedLikeness(props.post.id)} didLike={props.post.didLike}/>
            </div>)
    }

    function updateFeedsData() {
        console.log("Loading feeds")
        axios.get(baseURL()
            , {
                headers: {
                    "Access-Control-Allow-Origin": "*" // this is needed only for Vercel deployment (security restrictions)
                }
            }
        ).then((response) => {
            const feedData: FeedData = response.data

            if (feedData.hasMore) {
                setSkip(skip + skipStep)
            }

            setHasMoreFeed(feedData.hasMore)
            setFeedShows([...feedShows, ...feedData.data])
        });
    }

    function updateFeedLikeness(id: string) {
        const updatedFeed = feedShows.map((feed) => {
            if (feed.id === id) {
                feed.didLike = !feed.didLike

                if (feed.didLike) {
                    feed.likes++
                } else {
                    feed.likes--
                }
            }
            return feed
        })
        setFeedShows(updatedFeed)

    }

    function impressionTracking(id: string) {
        if (impressionFeeds.includes(id)) {
            return
        }

        impressionFeeds.push(id)
        axios.get(`https://backend.tedooo.com/?itemId=${id}`
            , {
                headers: {
                    "Access-Control-Allow-Origin": "*" // this is needed only for Vercel deployment (security restrictions)
                }
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    console.log(`impressionFeed ID - ${id} - added`)
                }
            })
    }
}

function PostInfo(props: { avatarImage: string, username: string, shopName: string, date: string }) {
    return <div className={"flex flex-row gap-2 items-center px-4"}>
        <div>
            {/*force the image to be a circle :)*/}
            <div className={'h-10 w-10 overflow-hidden rounded-full'}>
                <img src={props.avatarImage} alt="avatar" height={40} width={40}/>
            </div>
        </div>
        <div className={"flex flex-col font-medium"}>
            <div className={"text-base"}>
                {props.username}
            </div>
            <div className={"flex flex-row gap-1 text-sm"}>
                <div className={"text-Blue"}>
                    {props.shopName}
                </div>
                <TimePass date={props.date}/>
            </div>
        </div>
    </div>
}

function PostInteraction(props: { onClick: () => void, didLike: boolean }) {
    return <div className={"flex flex-row justify-center gap-64 px-4 text-sm font-medium text-DarkGray"}>
        <div className={"flex flex-row gap-1 items-center"}>
            <button onClick={props.onClick}>
                <Like didLike={props.didLike}/>
            </button>
        </div>

        <div className={"flex flex-row gap-1 items-center"}>
            <img src={"/icons/comment.svg"} alt={"comment"} height={18} width={18}/>
            <div>Comment</div>
        </div>
    </div>;
}

function PostSeparator() {
    return <div className={"h-[1px] bg-LightWhite mx-4"}/>;
}

function PostInteractionInfo(props: { likes: number, comments: number }) {
    return <div className={"flex flex-row justify-between px-4 text-Gray text-sm"}>
        <div className={"flex flex-row gap-1 items-center"}>
            <img src={"/icons/like-color.svg"} alt={"like"} height={18} width={18}/>
            <div><span>{props.likes}</span> Likes</div>
        </div>

        <div className={"flex flex-row items-center"}>
            <div><span>{props.comments}</span> comments</div>
        </div>
    </div>;
}

function PostDescription(props: { description: string }) {
    return <p className={"px-4 max-w-[66.875rem] text-sm"}>{props.description}</p>
}


function Like(props: { didLike: boolean }) {
    const likeButtonTextColor = props.didLike ? ' text-Blue ' : ' text-DarkGray '
    const likeButtonIcon = props.didLike ? "/icons/like-blue.svg" : "/icons/unlike.svg"
    return <div className='flex flex-row gap-1 items-center hover:cursor-pointer'>
        <img src={likeButtonIcon} alt={"like"} height={18} width={18}/>
        <div className={likeButtonTextColor}>Like</div>
    </div>
}

function TimePass(props: { date: string }) {
    const postTime = new Date(props.date)
    const currentTime = new Date()

    const diff = currentTime.getTime() - postTime.getTime()
    const hours = Math.floor(diff / 1000 / 60 / 60)

    return <div className={"text-LightGray"}>
        • <span>{hours}</span>hr
    </div>
}

/**
 * This function will render the images of the post
 * the renders will be by `object-fit: contain` to preserve the aspect ratio
 * @param props - images to render
 */
function PostImages(props: { images: string[] }) {
    //there is no images to render
    if (props.images.length === 0) return <div/>

    //can use extractColors for images bg, but the images is blocked for (npm/extract-colors)
    const bgColor = 'bg-VeryLightGray'
    if (props.images.length === 1) {
        return <img className={`h-[517px] w-[1120px] object-contain ${bgColor}`} src={props.images[0]}
                    alt="post image"/>
    }

    if (props.images.length > 1) {
        return (<div className={`flex flex-row w-[1120px] justify-between ${bgColor}`}>
            <img className={`h-[517px] w-[547px] object-contain ${bgColor}`} src={props.images[0]} alt="post image"/>
            <img className={`h-[517px] w-[565px] object-contain ${bgColor}`} src={props.images[1]} alt="post image"/>
        </div>)
    }
}

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

interface FeedData {
    hasMore: boolean,
    data: PostItem[]
}
