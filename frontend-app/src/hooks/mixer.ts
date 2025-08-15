import { OpenVidu, Publisher, Session } from 'openvidu-browser';

export type Mix = {
  ctx: AudioContext;
  dest: MediaStreamAudioDestinationNode;
  ttsGain: GainNode; // 단축키/TTS용 입력
  limiter: DynamicsCompressorNode;
  elNode?: MediaElementAudioSourceNode; // audioRef 연결 노드
};

export async function initMixer(): Promise<Mix> {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  // 사용자 제스처 직후 1회 실행
  try {
    await ctx.resume();
  } catch {}

  const dest = ctx.createMediaStreamDestination();
  const ttsGain = ctx.createGain();
  ttsGain.gain.value = 0.9;

  // 마스터 리미터
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -16;
  limiter.knee.value = 20;
  limiter.ratio.value = 6;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.25;

  ttsGain.connect(limiter);
  limiter.connect(dest);

  return { ctx, dest, ttsGain, limiter };
}

// 믹서 처음 1회 연결
export function attachAudioElementToMixer(mix: Mix, el: HTMLAudioElement) {
  if (mix.elNode) return; // 이미 연결된 상태면 return
  el.muted = true;
  mix.elNode = mix.ctx.createMediaElementSource(el);
  mix.elNode.connect(mix.ttsGain);
}

// 믹서 출력 트랙으로 퍼블리싱
export async function publishMixed(
  session: Session,
  mix: Mix,
  existingPublisher?: Publisher,
): Promise<Publisher> {
  const mixedTrack = mix.dest.stream.getAudioTracks()[0];
  const ov = new OpenVidue();

  if (existingPublisher) {
    await existingPublisher.replaceTrack(mixedTrack);
    return existingPublisher;
  }

  const publisher = ov.initPublisher(undefined, {
    audioSource: mixedTrack,
    videoSource: false,
    publishAudio: true,
    publishVideo: false,
  });

  await session.publish(publisher);
  return publisher;
}


// 정지 
export function stopAudio(){
    audioRef.current?.pause();
}


