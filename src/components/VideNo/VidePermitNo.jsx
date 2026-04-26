import { useState } from "react";



const VidePermitNo = () => {
  const [ownersData, setOwnersData] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [formDataAdd, setFormDataAdd] = useState({
    PurchaserAdd: "",
    PoliceStation: "",
    PurchaserDristic: "",
    ValidityDate: "",
    OwnerName: ""
  });
  const handleOwnerChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOwner(selectedValue);

    const ownerDetails = ownersData.find((owner) => owner.OwnerName === selectedValue);
    if (ownerDetails) {
      setFormDataAdd((prev) => ({
        OwnerName: ownerDetails.OwnerName,
        River: ownerDetails.River,
        SandID: ownerDetails.SandID,
        OwnerDistrict: ownerDetails.OwnerDistrict,
        OwnerAddress: ownerDetails.OwnerAddress,
        OwnerMobileNo: ownerDetails.OwnerMobileNo,
        OwnerMouza: ownerDetails.OwnerMouza,
        OwnerPoliceStation: ownerDetails.OwnerPoliceStation,
        OwnerSubDivision: ownerDetails.OwnerSubDivision,
        OwnerGpWard: ownerDetails.OwnerGpWard,
        VidePermitNo: ownerDetails.VidePermitNo,
        OwnerAddressLine1: ownerDetails.OwnerAddressLine1,
        OwnerAddressLine2: ownerDetails.OwnerAddressLine2,

      }

    ));
    };
    return (
      <div>VidePermitNo
        <form>
          <div className="grid grid-cols-1 mt-3 gap-2 w-full">
            <h2 className="text-sm font-bold mb-2 text-rose-500 w-full">Select Royalty Owner</h2>
            <select
              className="border p-2 rounded w-full"
              name="OwnerName"
              required
              value={selectedOwner}
              onChange={handleOwnerChange}
            >
              <option value="">Select Royalty owner</option>
              {ownersData?.map((owner, index) => (
                <option key={index} value={owner.OwnerName}>
                  {owner.OwnerName}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    )
  }
}
  export default VidePermitNo