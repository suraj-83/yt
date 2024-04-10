import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
    const { videoId } = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentsData, setCommentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVideoData = async () => {
        try {
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
            const response = await fetch(videoDetails_url);
            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }
            const data = await response.json();
            setApiData(data.items[0]);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherData = async () => {
        if (!apiData) return;
        try {
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const response = await fetch(channelData_url);
            if (!response.ok) {
                throw new Error('Failed to fetch channel data');
            }
            const data = await response.json();
            setChannelData(data.items[0]);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchCommentsData = async () => {
        try {
            const commentsData_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=55&videoId=${videoId}&key=${API_KEY}`;
            const response = await fetch(commentsData_url);
            if (!response.ok) {
                throw new Error('Failed to fetch comments data');
            }
            const data = await response.json();
            setCommentsData(data.items);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        if (apiData) {
            fetchOtherData();
            fetchCommentsData();
        }
    }, [apiData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='play-video'>
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen title="YouTube Video"></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className="play-video-info">
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16K"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
                <div>
                    <span><img src={like} alt='' /> {apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
                    <span><img src={dislike} alt='' /> </span>
                    <span><img src={share} alt='' /> share</span>
                    <span><img src={save} alt='' /> Save</span>
                </div>
            </div>
            <hr />
            <div className='publisher'>
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt='' />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? (channelData.statistics.subscriberCount >= 1e6 ? (channelData.statistics.subscriberCount / 1e6).toFixed(1) + "M" : channelData.statistics.subscriberCount) : ""}</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} comments</h4>
                {commentsData.map((item, index) => (
                    <div key={index} className="comment">
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl || user_profile} alt='' />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className="comment-action">
                                <img src={like} alt='' />
                                <span>{item.snippet.topLevelComment.snippet.likeCount}</span>
                                <img src={dislike} alt='' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlayVideo;
