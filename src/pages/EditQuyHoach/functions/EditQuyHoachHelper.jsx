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

export const handleEdit = (key, field, currentText, setEditingKey, setEditingField, setEditingText) => {
    setEditingKey(key);
    setEditingField(field);
    setEditingText(currentText);
};

export const handlePathDoubleClick = (record, setEditingKey, setEditingField, setEditingText) => {
    setEditingKey(record.key);
    setEditingField("path");
    setEditingText(record.path); // Set the path value when double-clicked
};


export const handleSave = (
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

    const updatedData = filteredData.map((item) =>
        item.key === editingKey ? { ...item, [editingField]: editingText } : item
    );

    setFilteredData(updatedData);
    setEditingKey(null);
    setEditingField(null);
    setEditingText("");
};

export const handleDelete = (filteredData, checkedRows, setFilteredData, setCheckedRows, setSelectAllChecked) => {
    const remainingRows = filteredData.filter(
        (item) => !checkedRows[item.key]
    );
    setFilteredData(remainingRows);
    setCheckedRows({});
    setSelectAllChecked(false);
};
