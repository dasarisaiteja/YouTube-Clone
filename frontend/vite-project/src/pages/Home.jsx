import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const categoryQuery = new URLSearchParams(location.search).get('category') || '';

  useEffect(() => {
    if (categoryQuery) setActiveFilter(categoryQuery);
  }, [categoryQuery]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (activeFilter !== 'All') params.category = activeFilter;
        const { data } = await api.get('/videos', { params });
        setVideos(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchVideos();
  }, [searchQuery, activeFilter]);

  return (
    <div>
      {!searchQuery && (
        <FilterBar active={activeFilter} onSelect={setActiveFilter} />
      )}
      {searchQuery && (
        <p style={{ marginBottom: 16, color: '#aaa', fontSize: 14 }}>
          Search results for: <strong style={{ color: '#fff' }}>{searchQuery}</strong>
        </p>
      )}
      {loading ? (
        <div className="loading">Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className="no-results">No videos found.</div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
}