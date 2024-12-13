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
    console.log(record);

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

    // if (selectedRecord.type === "QUAN_HUYEN") {
    //     try {
    //         // Making API call to update the data
    //         const formData = new FormData();
    //         formData.append('description', editingText); // Add description field with the editingText value

    //         // Making the API call with form-data
    //         const response = await axios.post(
    //             `https://api.quyhoach.xyz/edit_quyhoach_type/quanhuyen/${selectedRecord.key}`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data', // Ensure the content type is set to form-data
    //                 },
    //             }
    //         );

    //         console.log(response);

    //         // Handling different response status codes
    //         if (response.status === 200) {
    //             const updatedData = filteredData.map((item) =>
    //                 item.key === editingKey ? { ...item, [editingField]: editingText } : item
    //             );

    //             setFilteredData(updatedData);
    //             setEditingKey(null);
    //             setEditingField(null);
    //             setEditingText("");
    //         } else if (response.status === 205) {
    //             // Reset UI or form if 205 is received
    //             setEditingKey(null);
    //             setEditingField(null);
    //             setEditingText("");
    //             console.log(response.data);
    //         } else {
    //             console.error('API update failed:', response);
    //         }
    //     } catch (error) {
    //         console.error('Error updating data:', error);
    //     }
    // }

};


export const handleDelete = (filteredData, checkedRows, setFilteredData, setCheckedRows, setSelectAllChecked) => {
    const remainingRows = filteredData.filter(
        (item) => !checkedRows[item.key]
    );
    setFilteredData(remainingRows);
    setCheckedRows({});
    setSelectAllChecked(false);
};
