// Reads the server-reflexive or relay candidate gathered via STUN/TURN; returns '' if unavailable.
export async function detectPublicIp(iceServers: RTCIceServer[], timeoutMs = 5000): Promise<string> {
  const pc = new RTCPeerConnection({ iceServers });
  pc.createDataChannel('ip');
  try {
    return await new Promise<string>((resolve) => {
      const timer = setTimeout(() => resolve(''), timeoutMs);
      pc.onicecandidate = ({ candidate }) => {
        if (!candidate) {
          clearTimeout(timer);
          resolve('');
        } else if ((candidate.type === 'srflx' || candidate.type === 'relay') && candidate.address) {
          clearTimeout(timer);
          resolve(candidate.address);
        }
      };
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => resolve(''));
    });
  } finally {
    pc.close();
  }
}
