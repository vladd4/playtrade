import { jost, mont } from "@/font";
import styles from "./Notifications.module.scss";

const messages = [
  {
    type: "Гаманець",
    message: "Надходження коштів від ABCD",
    date: "18.05.24",
  },
  {
    type: "Повідомлення",
    message: "ABCD надіслав Вам повідомлення",
    date: "18.05.24",
  },
  {
    type: "Гаманець",
    message: "Надходження коштів від ABCD",
    date: "18.05.24",
  },
  {
    type: "Гаманець",
    message: "Надходження коштів від ABCD",
    date: "18.05.24",
  },
  {
    type: "Повідомлення",
    message: "ABCD надіслав Вам повідомлення",
    date: "18.05.24",
  },
  {
    type: "Гаманець",
    message: "Надходження коштів від ABCD",
    date: "18.05.24",
  },
  {
    type: "Гаманець",
    message: "Надходження коштів від ABCD",
    date: "18.05.24",
  },
  {
    type: "Повідомлення",
    message: "ABCD надіслав Вам повідомлення",
    date: "18.05.24",
  },
  {
    type: "Гаманець",
    message: "Надходження коштів від ABCD",
    date: "18.05.24",
  },
];

export default function Notifications() {
  return (
    <article className={`${styles.root} ${jost.className}`}>
      <p className={mont.className}>Центр сповіщень</p>
      <div className={styles.messages}>
        {messages.map((msg) => {
          return (
            <div className={styles.msg_item} key={msg.message}>
              <span>{msg.date}</span>
              <h5>{msg.type}</h5>
              <p>{msg.message}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
