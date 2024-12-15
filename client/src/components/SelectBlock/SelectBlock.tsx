import { jost } from "@/font";
import styles from "./Select.module.scss";

interface SelectProps {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  onStateChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  value: string;
  defaultValue?: { label: string; value: string };
  className?: string;
}

export default function SelectBlock({
  label,
  options,
  onStateChange,
  value,
  name,
  defaultValue,
  className,
}: SelectProps) {
  return (
    <div className={`${styles.root} ${jost.className} ${className}`}>
      <p>{label}</p>
      <select onChange={onStateChange} value={value} name={name}>
        {defaultValue && (
          <option value="" disabled className={styles.disabled}>
            {defaultValue.label}
          </option>
        )}
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
