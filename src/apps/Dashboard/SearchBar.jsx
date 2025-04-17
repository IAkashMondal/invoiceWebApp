import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useCallback } from "react";
import { SearchUserRoyalties } from "../../../Apis/GlobalApi";
import PropTypes from 'prop-types';

const SearchBar = ({ onResults }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = useCallback(async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            onResults([]); // Clear results
            return;
        }

        try {
            const res = await SearchUserRoyalties(value);
            onResults(res.data?.data || []);
            console.log("res", res)
        } catch (err) {
            console.error("Search failed:", err);
        }
    }, [onResults]);

    return (
        <div className="flex justify-end">
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    type="text"
                    name="search"
                    placeholder="Search Name or Reg. No"
                    className="pl-10 p-2"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

SearchBar.propTypes = {
    onResults: PropTypes.func.isRequired
};

export default SearchBar;
