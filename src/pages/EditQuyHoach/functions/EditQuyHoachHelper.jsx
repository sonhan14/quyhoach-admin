import axios from 'axios';

export const handleCheckboxChange = (record, checked, setCheckedRows) => {
    if (checked) {
        setCheckedRows((prevCheckedRows) => ({ ...prevCheckedRows, [record.key]: true }));
    } else {
        setCheckedRows((prevCheckedRows) => {
            const newCheckedRows = { ...prevCheckedRows };
            delete newCheckedRows[record.key];
            return newCheckedRows;
        });
    }
};

export const handleSelectAllChange = (e, dataSource, setCheckedRows, setSelectAllChecked) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    if (checked) {
        const newCheckedRows = {};
        dataSource.forEach((item) => {
            newCheckedRows[item.key] = true;
        });
        setCheckedRows(newCheckedRows);
    } else {
        setCheckedRows({});
    }
};

export const handleEdit = (record, key, field, currentText, setEditingKey, setEditingField, setEditingText, setSelectedRecord) => {
    setEditingKey(key);
    setEditingField(field);
    setEditingText(currentText);
    setSelectedRecord(record)
};

export const handlePathDoubleClick = (record, setEditingKey, setEditingField, setEditingText) => {
    setEditingKey(record.key);
    setEditingField("path");
    setEditingText(record.path); // Set the path value when double-clicked
};


export const handleSave = async (
    selectedRecord,
    editingKey,
    filteredData,
    editingField,
    editingText,
    setFilteredData,
    setEditingKey,
    setEditingField,
    setEditingText
) => {
    if (!editingKey) return;

    if (selectedRecord.type === "QUAN_HUYEN") {
        try {
            // Making API call to update the data
            const formData = new FormData();
            if (editingField === "description") {
                formData.append('description', editingText);
            }

            if (editingField === "idProvince") {
                formData.append('idProvince', editingText);
            }

            if (editingField === "huyen_image") {
                formData.append('huyen_image', editingText);
            }

            if (editingField === "idDistrict") {
                formData.append('idDistrict', editingText);
            }

            if (editingField === "nam_het_han") {
                formData.append('nam_het_han', editingText);
                console.log(editingText);

            }


            // Making the API call with form-data
            const response = await axios.post(
                `https://api.quyhoach.xyz/edit_quyhoach_type/quanhuyen/${selectedRecord.key}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Ensure the content type is set to form-data
                    },
                }
            );

            // Handling different response status codes
            if (response.status === 200) {
                const updatedData = filteredData.map((item) =>
                    item.key === editingKey ? { ...item, [editingField]: editingText } : item
                );

                setFilteredData(updatedData);
                setEditingKey(null);
                setEditingField(null);
                setEditingText("");
            } else {
                console.error('API update failed:', response);
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

};


export const handleDelete = (filteredData, checkedRows, setFilteredData, setCheckedRows, setSelectAllChecked) => {
    const remainingRows = filteredData.filter(
        (item) => !checkedRows[item.key]
    );
    setFilteredData(remainingRows);
    setCheckedRows({});
    setSelectAllChecked(false);
};
