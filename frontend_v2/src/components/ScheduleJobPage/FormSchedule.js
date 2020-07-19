import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import {Form, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import { useAuth0 } from "../../react-auth0-spa"

const schema = yup.object({
    senderFirstName: yup.string().required('Required'),
    senderLastName: yup.string().required('Required'),
    senderContact: yup.string().required('Required'),
    pickUpAddress: yup.string().required('Required'),
    pickUpUnitNumber: yup.string().required('Required'),
    pickUpPostal: yup.string().required('Required'),

    recipientFirstName: yup.string().required('Required'),
    recipientLastName: yup.string().required('Required'),
    recipientContact: yup.string().required('Required'),
    destinationAddress: yup.string().required('Required'),
    destinationUnitNumber: yup.string().required('Required'),
    destinationPostal: yup.string().required('Required'),

    parcelSize: yup.string()
      .oneOf(
        ['Small', 'Medium', 'Large', 'ExtraLarge'],
        'Invalid Parcel Size'
      )
      .required('Required')
})

function FormSchedule() {
    return (
        <div className="container" style={{justifyContent:"center"}}>
          <FormInformation />
        </div>
    )
}
  
function FormInformation() {
  const { getTokenSilently } = useAuth0();
  
    return (
      <Formik
        validationSchema={schema}
        initialValues={{
          senderFirstName: '',
          senderLastName: '',
          senderContact: '',
          pickUpAddress: '',
          pickUpUnitNumber: '',
          pickUpPostal: '',
          recipientFirstName: '',
          recipientLastName: '',
          recipientContact: '',
          destinationAddress: '',
          destinationUnitNumber: '',
          destinationPostal: '',
          fragile: false,
          parcelSize: '',
          comments: ''
        }}
        onSubmit={async (values, { setSubmitting, resetForm} ) => {
          const token = await getTokenSilently();
          await axios.post('http://localhost:5000/api/jobs', {
            values
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            console.log(response);  
            resetForm();
          })
          .catch(error => {
            console.log(error);
          })
          setSubmitting(false)
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <h3>Sender's Information</h3>
              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="senderFirstName">
                  <Form.Label>Sender's First name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="senderFirstName"
                    placeholder="First name"
                    value={values.senderFirstName}
                    onChange={handleChange}
                    isValid={touched.senderFirstName && !errors.senderFirstName}
                  />
                </Form.Group>
                  
                <Form.Group as={Col} md="4" controlId="senderLastName">
                  <Form.Label>Sender's Last name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="senderLastName"
                    placeholder="Last name"
                    value={values.senderLastName}
                    onChange={handleChange}
                    isValid={touched.senderLastName && !errors.senderLastName}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>   
                <Form.Group as={Col} md={{ span:8, offset:2 }} controlId="pickUpAddress">
                  <Form.Label>Pick Up Address</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Street name and number"
                    name="pickUpAddress"
                    value={values.pickUpAddress}
                    onChange={handleChange}
                    isInvalid={!!errors.pickUpAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pickUpAddress}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row> 

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2}} controlId="pickUpUnitNumber">
                  <Form.Label>Unit number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Unit number"
                    name="pickUpUnitNumber"
                    value={values.pickUpUnitNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.pickUpUnitNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pickUpUnitNumber}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter "-" if unit number is not applicable
                  </Form.Text>
                </Form.Group>
              
                <Form.Group as={Col} md="4" controlId="pickUpPostal">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Postal Code"
                    name="pickUpPostal"
                    value={values.pickUpPostal}
                    onChange={handleChange}
                    isInvalid={!!errors.pickUpPostal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pickUpPostal}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="senderContact">
                  <Form.Label>Sender's Contact number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="senderContact"
                    placeholder="Contact number"
                    value={values.senderContact}
                    onChange={handleChange}
                    isInvalid={!!errors.senderContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.senderContact}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <h3>Recipient's Information</h3>
               
              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="recipientFirstName">
                  <Form.Label>Recipient's First name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="recipientFirstName"
                    placeholder="First name"
                    value={values.recipientFirstName}
                    onChange={handleChange}
                    isValid={touched.recipientFirstName && !errors.recipientFirstName}
                  />
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="recipientLastName">
                  <Form.Label>Recipient's Last name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="recipientLastName"
                    placeholder="Last name"
                    value={values.recipientLastName}
                    onChange={handleChange}
                    isValid={touched.recipientLastName && !errors.recipientLastName}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>   
                <Form.Group as={Col} md={{ span:8, offset:2 }} controlId="destinationAddress">
                  <Form.Label>Destination Address</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Street name and number"
                    name="destinationAddress"
                    value={values.destinationAddress}
                    onChange={handleChange}
                    isInvalid={!!errors.destinationAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationAddress}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row> 

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2}} controlId="destinationUnitNumber">
                  <Form.Label>Unit number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Unit number"
                    name="destinationUnitNumber"
                    value={values.destinationUnitNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.destinationUnitNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationUnitNumber}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter "-" if unit number is not applicable
                  </Form.Text>
                </Form.Group>
              
                <Form.Group as={Col} md="4" controlId="destinationPostal">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Postal Code"
                    name="destinationPostal"
                    value={values.destinationPostal}
                    onChange={handleChange}
                    isInvalid={!!errors.destinationPostal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationPostal}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="recipientContact">
                  <Form.Label>Recipient's Contact number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="recipientContact"
                    placeholder="Contact number"
                    value={values.recipientContact}
                    onChange={handleChange}
                    isInvalid={!!errors.recipientContact}
                  />              
                  <Form.Control.Feedback type="invalid">
                    {errors.recipientContact}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <h4>Additional Details</h4>
              <Form.Row>
                <Form.Group controlId="parcelSize" as={Col} md={{ offset:2, span:3}}>
                  <Form.Label>Select parcel size</Form.Label>
                  <Form.Control
                      as="select"
                      size="sm"
                      name="parcelSize"
                      value={values.parcelSize}
                      onChange={handleChange} 
                      isInvalid={!!errors.parcelSize}
                      custom>
                      <option value="" label="Select a size" />
                      <option value="Small" label="Small" />
                      <option value="Medium" label="Medium" />
                      <option value="Large" label="Large" />
                      <option value="ExtraLarge" label="Extra Large" />
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.parcelSize}
                  </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <br></br>
            <Form.Row>
                <Form.Group as={Col} md={{ span:3, offset:2 }} controlId="fragile">
                <Form.Check
                  name="fragile"
                  label="Yes, my parcel is fragile"
                  value={values.fragile}
                  onChange={handleChange}
                  id="checkbox"
                />
                <Form.Text className="text-muted">
                  Tick this checkbox if your parcel is fragile
                </Form.Text></Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="comments" md={{span:8, offset:2}}>
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    as="textarea" 
                    rows="6"
                    name="comments"
                    value={values.comments}
                    onChange={handleChange}
                    />
                </Form.Group>
            </Form.Row>

            <Button disabled={isSubmitting} type="submit">Submit</Button>
        </Form> 
        )}
      </Formik>
    )
}

export default FormSchedule;