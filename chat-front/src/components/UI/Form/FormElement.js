import React from 'react';
import PropTypes from 'prop-types';
import {Col, ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";


const FormElement = props => {
  let componentClass, formControlChildren;

  if (props.type === 'textarea') {
    componentClass = 'textarea';
  }

  if (props.type === 'select') {
    componentClass = 'select';

    props.options.unshift({
      id: '', title: 'Please select ' + props.title + ' ...'
    });

    formControlChildren = props.options.map(option => (
      <option key={option.id} value={option.id}>{option.title}</option>
    ))
  }


  return (
    <FormGroup
      controlId={props.propertyName}
      validationState={props.error && 'error'}>

      <Col componentClass={ControlLabel} sm={2}>
        {props.title}
      </Col>
      <Col sm={10}>
        <FormControl
          type={props.type}
          componentClass={componentClass}
          required={props.required}
          placeholder={props.placeholder}
          name={props.propertyName}
          value={props.value}
          onChange={props.changeHandler}
          autoComplete={props.autoComplete}
        >
          {formControlChildren}
        </FormControl>
        {props.error &&
        <HelpBlock>{props.error}</HelpBlock>
        }
      </Col>
    </FormGroup>
  )
};

FormElement.propTypes = {
  propertyName: PropTypes.string.isRequired,
  error: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeHandler: PropTypes.func.isRequired,
  autoComplete: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object)
};


export default FormElement;