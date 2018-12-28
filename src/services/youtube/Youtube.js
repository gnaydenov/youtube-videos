import Axios from 'axios';
import {appConfig} from '../../config';
import {VideoClass} from '../../models/video.class';
import {CategoryClass} from '../../models/category.class';

// const axios = path => Axios.create({
//     baseURL: appConfig.getYoutubeEndPoint(path)
// });

const axios = path => Axios.create({
    baseURL: appConfig.getYoutubeEndPoint(path)
});

export class YoutubeService {
    constructor() {
        this.nextPageToken = '';
    }
    getVideoCategories() {
        const params = {
            regionCode: appConfig.defaultRegion,
            part: 'snippet',
            key: appConfig.youtubeApiKey
        };
        return axios('videoCategories').get('/', {params}).then((res) => {
            return res.data.items
                .map((item) => new CategoryClass(item))
                .filter((item) => item.id !== '');
        }).catch((err) => err);
    }

    async getTrendingVideos(videosPerPage = appConfig.maxVideosToLoad) {
        this.nextPageToken = '';
        let videos = [];

        const  callVideos = (params) => axios('videos').get('/', {params}).then((res) => {

            this.nextPageToken = res.data.nextPageToken;
            return res.data.items
                .map((item) => new VideoClass(item))
                .filter((item) => item.id !== '');
        }).catch((err) => err);


        let params = {
            part: appConfig.partsToLoad,
            chart: appConfig.chart,
            videoCategoryId: appConfig.defaultCategoryId,
            regionCode: appConfig.defaultRegion,
            maxResults: Math.min(videosPerPage, 50),
            key: appConfig.youtubeApiKey,
            pageToken: this.nextPageToken
        };

        while (videos.length < videosPerPage) {
            params.maxResults = Math.min(videosPerPage - videos.length, 50);
            params.pageToken = this.nextPageToken;
            videos = videos.concat(await callVideos(params));
        }

        return videos;
    }


    validateVideoId(videoId) {
        const params = {
            part: appConfig.partsToLoad,
            id: videoId,
            key: appConfig.youtubeApiKey
        };
        return axios('videos').get('/', {params}).then((res) => {
            return res.data.items
                .map((item) => new VideoClass(item))
                .filter((item) => item.id !== '');
        }).catch((err) => err);
    }
}
