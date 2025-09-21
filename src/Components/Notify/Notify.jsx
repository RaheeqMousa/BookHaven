import Style from './Notify.module.scss';

function Notify({ message }) {
  if (!message) return null; // optional: don't render if no message

  return (
    <p className={Style.notify}>
      {message}
    </p>
  );
}

export default Notify;
