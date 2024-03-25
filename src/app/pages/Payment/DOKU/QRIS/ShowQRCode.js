import React from 'react';
import QRCode from 'qrcode.react'

const ShowQRCode = () => {
  return (
    <div style={{width: "250px", height: "250px"}}>
      <QRCode 
        id="qrcode"
        value={"00020101021226530012COM.DOKU.WWW0118936008990000003254020432540303UME51440014ID.CO.QRIS.WWW0215ID10210754832540303UME5204581453033605406100.005502015802ID5908Lifetech6008DENPASAR61059999962470703A0150363254bd309db4c86648b184f33ef669bee8c563045531"} 
        // ecLevel={"L"}
        level={"L"}
        // logoImage={LogoBeetpos}
        // logoWidth={50}
        // logoHeigth={60}
        includeMargin={true}
      />
    </div>
  );
}

export default ShowQRCode;
