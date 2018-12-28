/* eslint-disable */
import React, {Component} from 'react';
import Axios from 'axios';
import MovieIcon from '@material-ui/icons/Movie';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';
import {getValueFromKeyLocalStorage} from '../../services/utils.js';
import InfiniteScroll from 'react-infinite-scroller';
import {YoutubeService} from '../../services/youtube/Youtube';
import './Youtube.scss';

const service = new YoutubeService();

class Youtube extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trends: [],
            isError: false,
            loadVideoBatch: 10
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.config.maxVideosToLoad !== prevState.trends.length)
            this.props.onChanges(() => this.loadVideos(this.state.loadVideoBatch));
    }

    componentDidMount() {
        if(getValueFromKeyLocalStorage('itemsPerPage') !== '') {
            this.props.config.maxVideosToLoad = getValueFromKeyLocalStorage('itemsPerPage');
        }
        this.props.setTitle('YOUTUBE');
        this.props.onChanges(() => this.loadVideos());
    }

    // fetch
    async loadVideos(loadVideoBatch) {
        Axios.all(await service.getTrendingVideos(loadVideoBatch && this.props.config.maxVideosToLoad))
            .then((data) => {
                this.setState({
                    trends: data,
                    isError: false
                });
            })
            .catch((err) => {
                this.setState({isError: true});
                console.log(err);
            });
    }

    openVideo() {
        return window.location.href = '/youtube/' + this;
    }

    youtubeCard() {
        return this.state.trends.map((videos, index) =>
            <div key={index} className="card-container">
                <div className="card" onClick={this.openVideo.bind(videos.id)}>
                    <div className="img-container">
                        <img src={videos.thumbnail} alt={videos.title}/>
                        <MovieIcon/>
                    </div>
                    <div className="video-statistic">
                        <div className="publishedAt">
                            <AvTimerIcon/>
                            <span>{videos.publishedAt}</span>
                        </div>
                        <div className="viewCount">
                            <VisibilityIcon/>
                            <span>{videos.viewCount}</span>
                        </div>
                        <div className="likeCount">
                            <FavoriteIcon/>
                            <span>{videos.likeCount}</span>
                        </div>
                    </div>
                    <p className="video-title text-ellipsis">
                        {videos.title}
                    </p>
                </div>
            </div>
        );
    }

    errorOnPage() {
        return <div className="error-plate">
            <WarningIcon/>
            <span>Error loading. Please try again later.</span>
        </div>;
    }

    render() {
        return !this.state.isError ? (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => this.loadVideos()}
                    hasMore={this.props.config.maxVideosToLoad > 10}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                >
                    <div id="youtube">
                        <div className="row">
                            {this.youtubeCard()}
                        </div>
                    </div>
                </InfiniteScroll>

        ) : (this.errorOnPage());
    }
}

Youtube.propTypes = {
    setTitle: PropTypes.func,
    config: PropTypes.object,
    onChanges: PropTypes.func
};

export default Youtube;
