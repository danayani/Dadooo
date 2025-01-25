import {tedoooDomain} from "@/util/const";
import axios from "axios";

export function feedURL(skip:number): string {
    return `${tedoooDomain}/hw/feed.json?skip=${skip}`
}

export function impressionTracking(id: string, alreadyImpressionIds: string[]) {
    if (alreadyImpressionIds.includes(id)) {
        return
    }

    alreadyImpressionIds.push(id)
    axios.get(`${tedoooDomain}/?itemId=${id}`)
        .then((response) => {
            if (response.status === 200) {
                console.log(`impressionFeed ID - ${id} - added`)
            }
        })
}