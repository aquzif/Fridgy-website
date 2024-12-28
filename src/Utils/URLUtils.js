export default class URLUtils {

    static getYoutubeVideoId(url) {
        let videoId = null;
        if (url) {
            if (url.includes('v=')) {
                const match = url.match(/v=(\w+)/);
                videoId = match ? match.pop() : null;
            } else if (url.includes('youtu.be/')) {
                const match = url.match(/youtu.be\/(\w+)/);
                videoId = match ? match.pop() : null;
            }
        }
        return videoId;
    }

    static getYoutubeVideoTimestamp(url) {
        let timestamp = 0;
        if (url) {
           if (url.includes('t=')) {
               const match = url.match(/t=(\d+)/);
               timestamp = match ? match.pop() : 0;
           }
        }
        console.log(timestamp,url);
        return timestamp;
    }

}