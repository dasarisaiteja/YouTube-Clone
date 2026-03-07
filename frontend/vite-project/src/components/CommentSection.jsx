import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function CommentSection({ videoId, comments: initial, onUpdate }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/comments/${videoId}`, { text });
      setText('');
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
    setSubmitting(false);
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await api.put(`/comments/${videoId}/${commentId}`, { text: editText });
      setEditId(null);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to edit comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${videoId}/${commentId}`);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">{initial.length} Comments</h3>

      {user ? (
        <div className="comment-input-row">
          <div className="comment-avatar">{user.username[0].toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <textarea
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="comment-edit-textarea"
            />
            <div className="comment-actions">
              <button className="btn-cancel" onClick={() => setText('')}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd} disabled={submitting}>
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ color: '#aaa', marginBottom: 24, fontSize: 14 }}>
          Sign in to add a comment.
        </p>
      )}

      {initial.map((c) => (
        <div key={c._id} className="comment-item">
          <div className="comment-avatar">{c.username?.[0]?.toUpperCase() || '?'}</div>
          <div className="comment-body">
            <span className="comment-username">@{c.username}</span>
            {editId === c._id ? (
              <>
                <textarea
                  className="comment-edit-textarea"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                />
                <div className="comment-btns">
                  <button className="btn-primary" style={{ fontSize: 12, padding: '4px 12px' }}
                    onClick={() => handleEdit(c._id)}>Save</button>
                  <button className="btn-cancel" style={{ fontSize: 12 }}
                    onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="comment-text">{c.text}</p>
                {user && user.username === c.username && (
                  <div className="comment-btns">
                    <button className="comment-btn" onClick={() => { setEditId(c._id); setEditText(c.text); }}>
                      ✏️ Edit
                    </button>
                    <button className="comment-btn" onClick={() => handleDelete(c._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}