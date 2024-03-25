import React, {useEffect, useState} from 'react';
import PaymentModuleIndividual from './PaymentModuleIndividual.js'
import PaymentModulePT from './PaymentModulePT.js'
import {
  Paper
} from "@material-ui/core";

const CashlezTab = ({
  t,
  formikFormCz,
  validationFormCz,
  ownerName,
  handleResultSignature,
  showSignaturePad,
  closeSignaturePad,
  handleSubmit,
  handlePreviewLocation,
  handlePreviewSignpost,
  handlePreviewProduct,
  handlePreviewNpwp,
  handlePreviewKtp,
  handleOwnerName,
  openSignaturePad,
  business,
  imageLocation,
  previewLocation,
  imageSignpost,
  previewSignpost,
  imageProduct,
  previewProduct,
  imageNpwp,
  previewNpwp,
  imageKtp,
  previewKtp,
  baseSignature,
  handlePreviewNpwpPt,
  handlePreviewSiup,
  imageNpwpPt,
  previewNpwpPt,
  imageSiup,
  previewSiup,
  handle_register_type_cz
}) => {
  const [showModalIndividual, setShowModalIndividual] = useState(true)
  const [showModalPT, setShowModalPT] = useState(false)
  const [registrationType, setRegistrationType] = useState(t('individualRegistration'))

  const handleRegistrationType = (value) => setRegistrationType(value)

  const openModalIndividual = (params) => {
    // input database
    handle_register_type_cz('individu')

    // untuk judul tab
    setRegistrationType(params)
    setShowModalIndividual(!showModalIndividual)
    setShowModalPT(false)
  }
  const closeModalIndividual = () => setShowModalIndividual(false)

  const openModalPT = (params) =>  {
    // input database
    handle_register_type_cz('pt')

    // untuk judul tab
    setRegistrationType(params)

    setShowModalPT(!showModalPT)
    setShowModalIndividual(false)
  }
  const closeModalPT = () => setShowModalPT(false)

  useEffect(() => {
    formikFormCz.setFieldValue("payment_gateway_name", "cashlez")
  }, [])

  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t('formulirAplikasiMerchant')} ({registrationType})</h3>
          </div>
        </div>
        <div className="btn btn-primary" onClick={() => openModalIndividual(t('individualRegistration'))}>
          {t('individualRegistration')}
        </div>
        <div className="btn btn-primary ml-3" onClick={() => openModalPT(t('PTRegistration'))}>
          {t('PTRegistration')}
        </div>
        <PaymentModuleIndividual 
          stateModal={showModalIndividual}
          closeModal={closeModalIndividual}
          t={t}
          formikFormCz={formikFormCz}
          validationFormCz={validationFormCz}
          ownerName={ownerName}
          handleResultSignature={handleResultSignature}
          showSignaturePad={showSignaturePad}
          closeSignaturePad={closeSignaturePad}
          handleSubmit={handleSubmit}
          handlePreviewLocation={handlePreviewLocation}
          handlePreviewSignpost={handlePreviewSignpost}
          handlePreviewProduct={handlePreviewProduct}
          handlePreviewNpwp={handlePreviewNpwp}
          handlePreviewKtp={handlePreviewKtp}
          handleOwnerName={handleOwnerName}
          handleResultSignature={handleResultSignature}
          openSignaturePad={openSignaturePad}
          business={business}
          imageLocation={imageLocation}
          previewLocation={previewLocation}
          imageSignpost={imageSignpost}
          previewSignpost={previewSignpost}
          imageProduct={imageProduct}
          previewProduct={previewProduct}
          imageNpwp={imageNpwp}
          previewNpwp={previewNpwp}
          imageKtp={imageKtp}
          previewKtp={previewKtp}
          ownerName={ownerName}
          baseSignature={baseSignature}
          showSignaturePad={showSignaturePad}
          handleRegistrationType={handleRegistrationType}
          title={t('paymentIndividual')}
        />

        <PaymentModulePT 
          stateModal={showModalPT}
          closeModal={closeModalPT}
          t={t}
          formikFormCz={formikFormCz}
          validationFormCz={validationFormCz}
          ownerName={ownerName}
          handleResultSignature={handleResultSignature}
          showSignaturePad={showSignaturePad}
          closeSignaturePad={closeSignaturePad}
          handleSubmit={handleSubmit}
          handlePreviewLocation={handlePreviewLocation}
          handlePreviewSignpost={handlePreviewSignpost}
          handlePreviewProduct={handlePreviewProduct}
          handlePreviewNpwp={handlePreviewNpwp}
          handlePreviewKtp={handlePreviewKtp}
          handleOwnerName={handleOwnerName}
          handleResultSignature={handleResultSignature}
          openSignaturePad={openSignaturePad}
          business={business}
          imageLocation={imageLocation}
          previewLocation={previewLocation}
          imageSignpost={imageSignpost}
          previewSignpost={previewSignpost}
          imageProduct={imageProduct}
          previewProduct={previewProduct}
          imageNpwp={imageNpwp}
          previewNpwp={previewNpwp}
          imageKtp={imageKtp}
          previewKtp={previewKtp}
          ownerName={ownerName}
          baseSignature={baseSignature}
          showSignaturePad={showSignaturePad}
          handleRegistrationType={handleRegistrationType}
          title={t('paymentPT')}
          handlePreviewNpwpPt={handlePreviewNpwpPt}
          handlePreviewSiup={handlePreviewSiup}
          imageNpwpPt={imageNpwpPt}
          previewNpwpPt={previewNpwpPt}
          imageSiup={imageSiup}
          previewSiup={previewSiup}
        />
      </Paper>
    </div>
  );
}

export default CashlezTab;
