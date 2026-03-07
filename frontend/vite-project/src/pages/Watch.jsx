import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import api from '../utils/api';

export default function Watch() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeState, setLikeState] = useState({ likes: 0, dislikes: 0, liked: false, disliked: false });

  const fetchVideo = async () => {
    try {
      const { data } = await api.get(`/videos/${id}`);
      setVideo(data);
      setLikeState({
        likes: data.likes.length,
        dislikes: data.dislikes.length,
        liked: user ? data.likes.includes(user._id) : false,
        disliked: user ? data.dislikes.includes(user._id) : false,
      });
    } catch {
      navigate('/');
    }
    setLoading(false);
  };

  useEffect(() => { fetchVideo(); }, [id]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.put(`/videos/${id}/like`);
      setLikeState((p) => ({ ...p, likes: data.likes, dislikes: data.dislikes, liked: data.liked, disliked: false }));
    } catch (err) { console.error(err); }
  };

  const handleDislike = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.put(`/videos/${id}/dislike`);
      setLikeState((p) => ({ ...p, likes: data.likes, dislikes: data.dislikes, disliked: data.disliked, liked: false }));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Loading video...</div>;
  if (!video) return null;

  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');
  const getYTEmbed = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="watch-page">
      <div className="watch-main">
        <div className="video-player-wrapper">
          {isYouTube ? (
            <iframe src={getYTEmbed(video.videoUrl)} allowFullScreen title={video.title} />
          ) : (
            <video src={video.videoUrl} controls />
          )}
        </div>

        <h1 className="watch-title">{video.title}</h1>

        <div className="watch-meta">
          <div>
            <p className="watch-channel">{video.channelId?.channelName}</p>
            <p className="watch-views">{video.views.toLocaleString()} views</p>
          </div>
          <div className="action-btns">
            <button className={`action-btn ${likeState.liked ? 'active' : ''}`} onClick={handleLike}>
              👍 {likeState.likes}
            </button>
            <button className={`action-btn ${likeState.disliked ? 'active' : ''}`} onClick={handleDislike}>
              👎 {likeState.dislikes}
            </button>
          </div>
        </div>

        {video.description && (
          <div className="watch-description">{video.description}</div>
        )}

        <CommentSection
          videoId={id}
          comments={video.comments}
          onUpdate={fetchVideo}
        />
      </div>
    </div>
  );
}