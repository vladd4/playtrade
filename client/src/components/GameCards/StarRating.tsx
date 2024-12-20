import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  className?: string;
  size: number;
}

const StarRating = ({ rating, className, size }: StarRatingProps) => {
  return (
    <div className={className}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          fill={index < rating ? '#E8D635' : 'none'}
          color="#E8D635"
          size={size}
        />
      ))}
    </div>
  );
};

export default StarRating;
