"use client"
import { UIEvent } from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import {Post} from "@/components/post";
import {tedoooDomain} from "@/util/const";
import {FeedData, PostItem} from "@/util/types";
import {feedURL, impressionTracking} from "@/util/functions";

// would prefer if it would be more globally or with a better state management
const AlreadyImpressionsIds: string[] = []

export default function Feed() {

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

    return (<div className={"h-screen overflow-y-scroll"} onScroll={handleScroll}>
        {feedShows.map((feed) => {
            return (
                <div className={'pt-5 items-center flex flex-col'} key={feed.id}>
                    <Post post={feed} updateFeedLikeness={updateFeedLikeness} alreadyImpressionIds={AlreadyImpressionsIds}/>
                </div>)
        })}
    </div>)

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

    function updateFeedsData() {
        console.log("Loading feeds")
        axios.get(feedURL(skip)).then((response) => {
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
}
