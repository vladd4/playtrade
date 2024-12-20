'use client';

import { X } from 'lucide-react';

import styles from './ImageViewer.module.scss';

import Image, { ImageLoader, ImageLoaderProps } from 'next/image';

import { setShowImageViewer } from '@/redux/slices/imageViewerSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

interface ViewerProps {
  imageSrc: string;
  setCurrentImage: (arg: string) => void;
}

const contentfulImageLoader: ImageLoader = ({ src, width }: ImageLoaderProps) => {
  return `${src}?w=${width}`;
};

export default function ImageViewer({ imageSrc, setCurrentImage }: ViewerProps) {
  const { showImageViewer } = useAppSelector((state) => state.imageViewer);

  const dispatch = useAppDispatch();

  const handleCloseViewer = () => {
    setCurrentImage('');
    dispatch(setShowImageViewer(false));
  };

  if (!imageSrc) return null;

  return (
    <div
      className={`${styles.root} ${showImageViewer ? styles.show : ''}`}
      onClick={handleCloseViewer}
    >
      <X
        fill="var(--font-color)"
        className={styles.close}
        size={30}
        onClick={handleCloseViewer}
      />
      <div className={styles.wrapper}>
        <Image
          loader={contentfulImageLoader}
          alt="Image Viewer"
          src={imageSrc}
          width={300}
          height={200}
        />
      </div>
    </div>
  );
}
