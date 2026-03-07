import { useNavigate } from 'react-router-dom';

const formatViews = (views) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views;
};

const formatDate = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 2592000)} months ago`;
};

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const channelName = video.channelId?.channelName || 'Unknown Channel';

  return (
    <div className="video-card" onClick={() => navigate(`/watch/${video._id}`)}>
      {video.thumbnailUrl ? (
        <img className="video-thumbnail" src={video.thumbnailUrl} alt={video.title}
          onError={(e) => { e.target.style.display = 'none'; }} />
      ) : (
        <div className="video-thumbnail-placeholder">🎬</div>
      )}
      <div className="video-info">
        <div className="video-avatar">{channelName[0]?.toUpperCase()}</div>
        <div className="video-details">
          <p className="video-title">{video.title}</p>
          <p className="video-channel">{channelName}</p>
          <p className="video-meta">
            {formatViews(video.views)} views • {formatDate(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}