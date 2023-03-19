import React, { useState, useEffect } from 'react';
import './App.css';
import {io, Socket} from 'socket.io-client';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (joined) {
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);
      newSocket.on('chat message', (msg: string) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [joined]);

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJoined(true);
  };

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket) {
      socket.emit('chat message', `${name}: ${message}`);
      setMessage('');
    }
  };

  if (!joined) {
    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleJoin}>
                  <div className="form-group">
                    <label htmlFor="name">名前:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    入室
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleMessageSubmit}>
                <div className="form-group">
                  <label htmlFor="message">メッセージ:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  送信
                </button>
              </form>
              <div className="mt-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="alert alert-info"
                    role="alert"
                    style={{
                      textAlign: msg.startsWith(name) ? 'right' : 'left',
                    }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
