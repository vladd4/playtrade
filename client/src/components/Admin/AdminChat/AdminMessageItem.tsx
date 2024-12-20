import styles from './AdminChat.module.scss';

import { User } from '@/types/user.type';

import { parseAndFormatDate } from '@/utils/formatTimestamp';

interface CommentProps {
  comment: { id: string; author: User; comment: string; createdAt: string };
}

export default function AdminMessageItem({ comment }: CommentProps) {
  const { formattedDate } = parseAndFormatDate(comment.createdAt);
  return (
    <div className={styles.admin_msg}>
      <p>{comment.comment}</p>
      <p className={styles.date}>
        {formattedDate}, {comment.author.name}
      </p>
    </div>
  );
}
