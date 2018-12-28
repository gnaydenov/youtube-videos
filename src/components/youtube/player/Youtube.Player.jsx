/* eslint-disable */
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import { YoutubeService } from '../../../services/youtube/Youtube';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

import './Youtube.Player.scss';

const service = new YoutubeService();

class YoutubePlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId:this.getVideoId(),
            isValidVideoId:true
        };

    }

    componentWillMount() {
        this.renderPageOnValidVideoId(this.state.videoId);
    }


    // Validate video ID
    async renderPageOnValidVideoId(videoId) {
        Axios.all(await service.validateVideoId(videoId))
            .then((video) => {
                if(video.length > 0 && video[0].id) {
                    this.setState({
                        isValidVideoId: true
                    });
                } else {
                    this.setState({
                        isValidVideoId: false
                    });
                }

                this.pageInit();
            })
            .catch((err) => {
                this.setState({isValidVideoId: false});
                console.log(err);
            });
    }

    getVideoId = () => {
        const id = window.location.href
            .replace(/^.*\//g, '')
            .replace(/^.*\..*/g, '');
        return id;
    }


    pageInit = () => {
        if(this.state.isValidVideoId) {
            const iframe = '<iframe title="Video"' +
                '        width="100%"' +
                '        height="100%"' +
                '        src=https://www.youtube.com/embed/'+this.state.videoId+'?autoplay=1'+
                '        frameBorder="0"'+
                '        allowFullScreen/>';
                if (document.getElementsByClassName('frame-block')[0]) {
                    document.getElementsByClassName('frame-block')[0].innerHTML = iframe;
                }
        } else {
            this.props.history.push("/");
        }


    }

    render() {
        return (
                    <div className="video-container">
                        <div className="frame-block"/>
                        <div className="controls">
                            <Link className="btn btn-primary" to="/youtube"> &#60; Back to Trends</Link>
                        </div>
                    </div>

            );
    }
}

export default withRouter(YoutubePlayer);
