import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { socketClient } from '../lib/socket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export default function VoiceChat() {
  const { currentChannel } = useChatStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [participants, setParticipants] = useState<Array<{ userId: string; socketId: string }>>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  useEffect(() => {
    if (!currentChannel || currentChannel.type !== 'VOICE') return;

    const socket = socketClient.getSocket();
    if (!socket) return;

    // Setup voice event listeners
    socket.on('voice:participants', handleParticipants);
    socket.on('voice:user-joined', handleUserJoined);
    socket.on('voice:user-left', handleUserLeft);
    socket.on('voice:offer', handleOffer);
    socket.on('voice:answer', handleAnswer);
    socket.on('voice:ice-candidate', handleIceCandidate);

    return () => {
      socket.off('voice:participants', handleParticipants);
      socket.off('voice:user-joined', handleUserJoined);
      socket.off('voice:user-left', handleUserLeft);
      socket.off('voice:offer', handleOffer);
      socket.off('voice:answer', handleAnswer);
      socket.off('voice:ice-candidate', handleIceCandidate);
      disconnectVoice();
    };
  }, [currentChannel]);

  const handleParticipants = (existingParticipants: Array<{ userId: string; socketId: string }>) => {
    setParticipants(existingParticipants);
    // Create peer connections for existing participants
    existingParticipants.forEach(participant => {
      createPeerConnection(participant.socketId, true);
    });
  };

  const handleUserJoined = ({ socketId }: { socketId: string; userId: string }) => {
    setParticipants(prev => [...prev, { socketId, userId: socketId }]);
    createPeerConnection(socketId, false);
  };

  const handleUserLeft = ({ socketId }: { socketId: string }) => {
    setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    const pc = peerConnectionsRef.current.get(socketId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(socketId);
    }
    remoteStreamsRef.current.delete(socketId);
  };

  const createPeerConnection = async (socketId: string, initiator: boolean) => {
    if (!localStreamRef.current) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(socketId, pc);

    // Add local stream tracks
    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      remoteStreamsRef.current.set(socketId, remoteStream);
      
      // Play remote audio
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(e => console.error('Error playing remote audio:', e));
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketClient.emit('voice:ice-candidate', {
          to: socketId,
          candidate: event.candidate
        });
      }
    };

    // If initiator, create and send offer
    if (initiator) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketClient.emit('voice:offer', { to: socketId, offer });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }
  };

  const handleOffer = async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
    if (!localStreamRef.current) return;

    let pc = peerConnectionsRef.current.get(from);
    if (!pc) {
      pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(from, pc);

      // Add local stream tracks
      localStreamRef.current.getTracks().forEach(track => {
        pc!.addTrack(track, localStreamRef.current!);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        remoteStreamsRef.current.set(from, remoteStream);
        
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play().catch(e => console.error('Error playing remote audio:', e));
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketClient.emit('voice:ice-candidate', {
            to: from,
            candidate: event.candidate
          });
        }
      };
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketClient.emit('voice:answer', { to: from, answer });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
    const pc = peerConnectionsRef.current.get(from);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  };

  const handleIceCandidate = async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
    const pc = peerConnectionsRef.current.get(from);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  };

  const connectVoice = async () => {
    if (!currentChannel) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      localStreamRef.current = stream;
      setIsConnected(true);
      
      // Join voice channel
      socketClient.emit('voice:join', currentChannel.id);
    } catch (error) {
      console.error('Failed to connect voice:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const disconnectVoice = () => {
    if (!currentChannel) return;

    // Leave voice channel
    socketClient.emit('voice:leave', currentChannel.id);

    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    remoteStreamsRef.current.clear();

    setIsConnected(false);
    setParticipants([]);
    setIsMuted(false);
    setIsDeafened(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleDeafen = () => {
    const newDeafened = !isDeafened;
    setIsDeafened(newDeafened);
    
    // Mute all remote audio
    remoteStreamsRef.current.forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !newDeafened;
      });
    });
    
    // Also mute local if deafening
    if (newDeafened && localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = false;
        setIsMuted(true);
      }
    }
  };

  if (!currentChannel || currentChannel.type !== 'VOICE') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-discord-dark border-t border-discord-darker p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white font-medium">
              {isConnected ? `Voice Connected - ${currentChannel.name}` : 'Voice Disconnected'}
            </span>
          </div>
          
          {isConnected && participants.length > 0 && (
            <div className="text-gray-400 text-sm">
              {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button
              onClick={connectVoice}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              Join Voice
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`p-3 rounded-lg transition ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-discord-darker hover:bg-discord-darkest'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              <button
                onClick={toggleDeafen}
                className={`p-3 rounded-lg transition ${
                  isDeafened 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-discord-darker hover:bg-discord-darkest'
                }`}
                title={isDeafened ? 'Undeafen' : 'Deafen'}
              >
                {isDeafened ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              <button
                onClick={disconnectVoice}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
