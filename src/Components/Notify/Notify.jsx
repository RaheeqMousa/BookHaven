import PropTypes from 'prop-types';
import Style from './Notify.module.scss';

function Notify({ message }) {
  if (!message) return null;

  return (
    <p className={Style.notify}>
      {message}
    </p>
  );
}
Notify.propTypes={
  message:PropTypes.string.isRequired
}

export default Notify;
