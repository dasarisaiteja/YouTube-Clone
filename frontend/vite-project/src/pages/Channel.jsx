import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';

const CATEGORIES = ['All','Web Development','JavaScript','Data Structures','Music','Gaming','News','Sports','Movies','Live'];

export default function Channel() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [channelForm, setChannelForm] = useState({ channelName: '', description: '', channelBanner: '' });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'All' });
  const [formError, setFormError] = useState('');

  const isMyChannel = id === 'my';

  const fetchChannel = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      if (isMyChannel) {
        if (!user.channels?.length) {
          setChannel(null);
        } else {
          const { data } = await api.get(`/channels/${user.channels[0]}`);
          setChannel(data);
        }
      } else {
        const { data } = await api.get(`/channels/${id}`);
        setChannel(data);
      }
    } catch {
      setChannel(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchChannel(); }, [id]);

  const handleCreateChannel = async () => {
    if (!channelForm.channelName) return setFormError('Channel name is required');
    setFormError('');
    try {
      const { data } = await api.post('/channels', channelForm);
      // Update user channels in localStorage
      const updated = { ...user, channels: [...(user.channels || []), data._id] };
      localStorage.setItem('yt_user', JSON.stringify(updated));
      setShowCreateChannel(false);
      fetchChannel();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create channel');
    }
  };

  const handleUpload = async () => {
    if (!videoForm.title || !videoForm.videoUrl) return setFormError('Title and Video URL are required');
    setFormError('');
    try {
      await api.post('/videos', { ...videoForm, channelId: channel._id });
      setShowUpload(false);
      setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'All' });
      fetchChannel();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to upload video');
    }
  };

  const handleEditVideo = async () => {
    setFormError('');
    try {
      await api.put(`/videos/${editVideo._id}`, videoForm);
      setEditVideo(null);
      fetchChannel();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchChannel();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete video');
    }
  };

  const openEdit = (video) => {
    setEditVideo(video);
    setVideoForm({
      title: video.title, description: video.description,
      thumbnailUrl: video.thumbnailUrl, category: video.category,
    });
    setFormError('');
  };

  if (!user) return null;
  if (loading) return <div className="loading">Loading channel...</div>;

  if (!channel && isMyChannel) {
    return (
      <div className="channel-page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 20, marginBottom: 12 }}>You don't have a channel yet.</p>
          <p style={{ color: '#aaa', marginBottom: 24 }}>Create a channel to upload and manage videos.</p>
          <button className="channel-action-btn btn-create" onClick={() => setShowCreateChannel(true)}>
            + Create Channel
          </button>
        </div>

        {showCreateChannel && (
          <div className="modal-overlay" onClick={() => setShowCreateChannel(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Create Your Channel</h2>
              {formError && <div className="error-msg">{formError}</div>}
              <input className="form-input" placeholder="Channel Name *"
                value={channelForm.channelName}
                onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })} />
              <textarea className="form-input" placeholder="Description"
                value={channelForm.description}
                onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })} />
              <input className="form-input" placeholder="Channel Banner URL (optional)"
                value={channelForm.channelBanner}
                onChange={(e) => setChannelForm({ ...channelForm, channelBanner: e.target.value })} />
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowCreateChannel(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreateChannel}>Create Channel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!channel) return <div className="no-results">Channel not found.</div>;

  const isOwner = user && channel.owner?._id === user._id;

  return (
    <div className="channel-page">
      <div className="channel-banner">
        {channel.channelBanner && <img src={channel.channelBanner} alt="banner" />}
      </div>

      <div className="channel-info">
        <div className="channel-avatar">{channel.channelName[0]}</div>
        <div className="channel-details">
          <h1>{channel.channelName}</h1>
          <p>{channel.subscribers.toLocaleString()} subscribers • {channel.videos?.length || 0} videos</p>
          {channel.description && <p style={{ marginTop: 8 }}>{channel.description}</p>}
        </div>
        {isOwner && (
          <button className="channel-action-btn btn-create" style={{ marginLeft: 'auto' }}
            onClick={() => { setShowUpload(true); setFormError(''); }}>
            + Upload Video
          </button>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18 }}>Videos</h2>
        {channel.videos?.length === 0 ? (
          <div className="no-results">No videos yet.</div>
        ) : (
          <div className="video-grid">
            {channel.videos?.map((v) => (
              <div key={v._id} style={{ position: 'relative' }}>
                <VideoCard video={v} />
                {isOwner && (
                  <div style={{ display: 'flex', gap: 8, padding: '4px 4px 8px', justifyContent: 'flex-end' }}>
                    <button className="channel-action-btn btn-edit" style={{ padding: '4px 12px', fontSize: 12 }}
                      onClick={() => openEdit(v)}>✏️ Edit</button>
                    <button className="channel-action-btn btn-delete" style={{ padding: '4px 12px', fontSize: 12 }}
                      onClick={() => handleDeleteVideo(v._id)}>🗑️ Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Video</h2>
            {formError && <div className="error-msg">{formError}</div>}
            <input className="form-input" placeholder="Title *"
              value={videoForm.title}
              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
            <textarea className="form-input" placeholder="Description"
              value={videoForm.description}
              onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
            <input className="form-input" placeholder="Video URL * (YouTube link or direct URL)"
              value={videoForm.videoUrl}
              onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} />
            <input className="form-input" placeholder="Thumbnail URL (optional)"
              value={videoForm.thumbnailUrl}
              onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })} />
            <select className="form-input" value={videoForm.category}
              onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editVideo && (
        <div className="modal-overlay" onClick={() => setEditVideo(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Video</h2>
            {formError && <div className="error-msg">{formError}</div>}
            <input className="form-input" placeholder="Title"
              value={videoForm.title}
              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
            <textarea className="form-input" placeholder="Description"
              value={videoForm.description}
              onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
            <input className="form-input" placeholder="Thumbnail URL"
              value={videoForm.thumbnailUrl}
              onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })} />
            <select className="form-input" value={videoForm.category}
              onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditVideo(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleEditVideo}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}