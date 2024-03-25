import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal }  from 'react-bootstrap';

function ModalTerms() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="btn btn-link" onClick={handleShow}>
        Terms & Conditions
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body><p><b>Beetpos</b> grants you the right to access and use the Beetpos Services 
through the Beetpos Website with a usage role that has been defined 
for you, according to the type of service you have selected. This right
is non-exclusive, non-transferable and limited by and contingent on
this agreement. You acknowledge and agree to, and subject to 
any written agreement in force between Customer and Invited User, or
other applicable law:<br/>

•That it is the responsibility of the Customer to determine who has access
as an Invited User and the types of roles and rights they have to
access the types of data you have.<br/>

•That the Customer's responsibility for all use of the Service by the Invited
User.<br/>

•That it is the Customer's responsibility to control each Invited User's level
of access to the relevant organization and Services at any time, and
may withdraw or change the Invited User's access or access level at
any time, for any reason in any case.<br/>

•If there is a dispute between the Customer and the Invited User
regarding access to any organization or Service, it is 
the Customer who must make the decision and regulate the access or
level of access to the Data or Services that 
the Invited User will have, if any.<br/></p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalTerms;