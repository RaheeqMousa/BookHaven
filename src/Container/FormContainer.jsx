import React from 'react'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types';
import Style from './FormContainer.module.scss'

function FormContainer(props) {
  const { children, onSubmit, serverError, initialData = null, type } = props;
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialData });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`row flex-direction-column width-100 ${Style['form-style']}`}>
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { register, errors }) : child
      )}
      <p className='error'>{serverError}</p>
      <button type='submit' >{type}</button>
    </form>
  );
}
export default FormContainer

FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  serverError: PropTypes.string,
  type:PropTypes.string,
  book: PropTypes.shape({
    volumeInfo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      categories: PropTypes.arrayOf(PropTypes.string),
      description: PropTypes.string,
      imageLinks: PropTypes.object,
      previewLink: PropTypes.string,
    }).isRequired,
    saleInfo: PropTypes.object,
    accessInfo: PropTypes.object,
  }),
};