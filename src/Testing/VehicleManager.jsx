// VehicleManager.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + "/api/", // Your Strapi API URL
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
});

const VehicleManager = () => {
    const [vehicles, setVehicles] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [editing, setEditing] = useState(null)

    const saveEdit = (() => {

    })
    const fetchVehicles = async () => {

        try {
            const response = await axiosClient.get("/vehicle-numbers?populate=*");
            setVehicles(response.data.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const deleteVehicle = async (id) => {
        try {
            await axiosClient.delete(`/vehicle-numbers/${id}`);
            fetchVehicles();
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    const generateQrCode = (EchallanId) => {
        const url = `/WBMD/Page/each/aspx/id/${encodeURIComponent(EchallanId)}/S/24-25/RPS`;
        setQrCode(url);
    };


    const sortedVehicles = [...vehicles].sort((b, a) => {
        const regA = (a.attributes?.Registration_No || "").toUpperCase();
        const regB = (b.attributes?.Registration_No || "").toUpperCase();
        return regA.localeCompare(regB);
    });
    console.log(vehicles, "vehicles-mander----------->")
    return (
        <table className="p-20">

            <tbody>
                <p className="text-xl font-bold">Vehicle Management</p>
                {
                    sortedVehicles.map((vehicle) => {
                        const attributes = vehicle.attributes || vehicle; // Handle different structures
                        return (
                            <tr key={vehicle.id} className="border">
                                <td className="border p-2">{attributes.id}</td>
                                <td className="border p-2">{attributes.userEmail || "N/A"}</td>
                                <td className="border p-2">{attributes.EchallanId || "Echallan"}</td>
                                <td className="border p-2">{attributes.royaltyID || "N/A"}</td>
                                <td className="border p-2">{attributes.Registration_No || "N/A"}</td>
                                <td className="border p-2">{attributes.NameofPurchaser || "N/A"}</td>
                                <td className="border p-2">{attributes.quantity || "N/A"}</td>
                                <td className="border p-2">{attributes.userName || "N/A"}</td>
                                <td className="border p-2">{attributes.VehicleType || "N/A"}</td>
                                <td className="border p-2">{attributes.updatedAt ? new Date(attributes.updatedAt).toLocaleString() : "N/A"}</td>
                                <td className="border p-2">{attributes.createdAt ? new Date(attributes.createdAt).toLocaleString() : "N/A"}</td>
                                <td>
                                    {editing === vehicle.id ? (
                                        <button onClick={() => saveEdit(vehicle.id)} className="bg-green-500 text-white px-2 py-1">Save</button>
                                    ) : (
                                        <button onClick={() => setEditing(vehicle.id)} className="bg-blue-500 text-white px-2 py-1">Edit</button>
                                    )}
                                    <button onClick={() => deleteVehicle(vehicle.id)} className="bg-red-500 text-white px-2 py-1 ml-2">Delete</button>
                                    <button onClick={() => generateQrCode(attributes.EchallanId)} className="bg-gray-500 text-white px-2 py-1 ml-2">Generate QR</button></td>
                            </tr>
                        );
                    })}
            </tbody>

            {qrCode && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold">QR Code</h3>
                    <QRCodeSVG value={qrCode} size={128} />
                    <p className="mt-2">Scan to visit: <a href={qrCode} target="_blank" rel="noopener noreferrer" className="text-blue-500">{qrCode}</a></p>
                </div>
            )}
        </table>
    );
};

export default VehicleManager;