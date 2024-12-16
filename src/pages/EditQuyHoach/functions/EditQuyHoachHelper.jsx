import axios from 'axios';

export const handleCheckboxChange = (record, checked, setCheckedRows) => {
    if (checked) {
        setCheckedRows((prevCheckedRows) => ({ ...prevCheckedRows, [record.key]: record.key }));
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
    setEditingText,
    selectedType,
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
            let response;
            if (selectedType === "Quy hoạch 2030" || selectedType === "Kế hoạch sử dụng đất 2024") {
                response = await axios.post(
                    `https://api.quyhoach.xyz/edit_quyhoach_type/quanhuyen/${selectedRecord.key}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Ensure the content type is set to form-data
                        },
                    }
                );
            }

            if (selectedType === "Quy hoạch tỉnh 2030") {
                response = await axios.post(
                    `https://api.quyhoach.xyz/edit_quyhoach_type/tinh/${selectedRecord.key}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Ensure the content type is set to form-data
                        },
                    }
                );
            }

            if (selectedType === "Bản đồ địa chính") {
                response = await axios.post(
                    `https://api.quyhoach.xyz/edit_quyhoach_type/diachinh/${selectedRecord.key}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Ensure the content type is set to form-data
                        },
                    }
                );
            }

            if (selectedType === "Quy hoạch xây dựng") {
                response = await axios.post(
                    `https://api.quyhoach.xyz/edit_quyhoach_type/xaydung/${selectedRecord.key}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Ensure the content type is set to form-data
                        },
                    }
                );
            }

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


export const handleDelete = async (filteredData, checkedRows, setFilteredData, setCheckedRows, setSelectAllChecked, selectedType) => {

    const keysToDelete = Object.keys(checkedRows);

    try {
        const deletePromises = keysToDelete.map(async (key) => {
            if (selectedType === "Quy hoạch tỉnh 2030") {
                const response = await axios.post(`https://api.quyhoach.xyz/remove_quyhoach/tinh/${key}`);
                return response;
            }
            if (selectedType === "Quy hoạch 2030" || selectedType === "Kế hoạch sử dụng đất 2024") {
                const response = await axios.post(`https://api.quyhoach.xyz/remove_quyhoach/quanhuyen/${key}`);
                return response;
            }
            if (selectedType === "Bản đồ địa chính") {
                const response = await axios.post(`https://api.quyhoach.xyz/remove_quyhoach/diachinh/${key}`);
                return response;
            }
            if (selectedType === "Quy hoạch xây dựng") {
                const response = await axios.post(`https://api.quyhoach.xyz/remove_quyhoach/xaydung/${key}`);
                return response;
            }

        });

        // Chờ tất cả các yêu cầu xóa hoàn thành
        const responses = await Promise.all(deletePromises);
        // Kiểm tra phản hồi và cập nhật dữ liệu
        const allDeleted = responses.every(response => response.status === 200);
        if (allDeleted) {
            const remainingRows = filteredData.filter(
                (item) => !checkedRows[item.key]
            );
            setFilteredData(remainingRows);
            setCheckedRows({});
            setSelectAllChecked(false);
        } else {
            console.error('Some API delete requests failed:', responses);
        }
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};
