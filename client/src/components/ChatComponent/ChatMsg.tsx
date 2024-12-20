'use client';

import styles from './Chat.module.scss';

import { setShowImageViewer } from '@/redux/slices/imageViewerSlice';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { formatTimestamp } from '@/utils/formatTimestamp';

type ChatMsgProps = {
  message: string;
  time: string;
  position: 'you' | 'me';
  setCurrentImage?: (arg: string) => void;
  senderName?: string;
  receiverName?: string;
};

export default function ChatMsg({
  message,
  time,
  position,
  setCurrentImage,
  senderName,
  receiverName,
}: ChatMsgProps) {
  const dispatch = useAppDispatch();

  const handleShowViewer = (currentImage: string) => {
    if (setCurrentImage) {
      setCurrentImage(currentImage);
      dispatch(setShowImageViewer(true));
    }
  };
  return (
    <div
      className={styles.msg_root}
      style={
        position === 'me'
          ? { justifyContent: 'flex-end' }
          : { justifyContent: 'flex-start' }
      }
    >
      <div className={`${styles.msg_wrapper} ${position === 'me' ? styles.me : ''}`}>
        {senderName && receiverName && (
          <p className={styles.author}>
            Надіслано: {position === 'me' ? senderName : receiverName}
          </p>
        )}

        {message?.includes('&&imageUrl=') ? (
          <>
            <div
              className={styles.image_preview}
              style={{
                backgroundImage: `url(${message.split('&&imageUrl=').pop()})`,
              }}
              onClick={() => handleShowViewer(message.split('&&imageUrl=').pop()!)}
            />
            <p>{message.split('&&imageUrl=').shift()}</p>
          </>
        ) : message?.includes('support-images') ? (
          <div
            className={styles.image_preview}
            style={{
              backgroundImage: `url(${message})`,
            }}
            onClick={() => handleShowViewer(message)}
          />
        ) : (
          <p>{message}</p>
        )}
        <span>{formatTimestamp(time)}</span>
      </div>
    </div>
  );
}
