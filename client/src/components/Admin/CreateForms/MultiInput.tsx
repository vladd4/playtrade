'use client';

import styles from './CreateForms.module.scss';

import React, { useState } from 'react';

interface MultiProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
}

export default function MultiInput({ tags, setTags, placeholder }: MultiProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue) {
      event.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const addTag = (value: string) => {
    setTags([...tags, value]);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={styles.multi_input}>
      <div>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.tags_div}>
        {tags &&
          tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              <span className={styles.remove_tag} onClick={() => removeTag(tag)}>
                {' '}
                x{' '}
              </span>
            </span>
          ))}
      </div>
    </div>
  );
}
