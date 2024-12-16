// columns.js
import { Checkbox, Input, Select } from "antd";
import {
    handleCheckboxChange,
    handleEdit,
    handlePathDoubleClick,
    handleSave,
} from "./functions/EditQuyHoachHelper";

const { Option } = Select;

export const getColumns = ({
    filteredData,
    setFilteredData,
    editingKey,
    setEditingKey,
    editingField,
    setEditingField,
    editingText,
    setEditingText,
    checkedRows,
    setCheckedRows,
    selectAllChecked,
    setSelectAllChecked,
    handleSelectAllChange,
    selectedRecord,
    setSelectedRecord,
    districtData,
    setSelectedType,
    selectedType
}) => {
    const renderEditableCell = (text, record, field) => {
        const isEditing = record.key === editingKey && editingField === field;


        const expiryYears = ["2024", "2025", "2030"];
        const types = ["Quy hoạch xây dựng", "Bản đồ địa chính", "Kế hoạch sử dụng đất 2024", "Quy hoạch 2030", " Quy hoạch tỉnh 2030"];

        if (field === "idDistrict") {
            return isEditing ? (
                <Select
                    style={{ width: 100 }}
                    value={editingText} // Gán giá trị mã quận
                    onChange={(value) => setEditingText(value)}
                    onBlur={() =>
                        handleSave(
                            selectedRecord,
                            editingKey,
                            filteredData,
                            editingField,
                            editingText,
                            setFilteredData,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            selectedType
                        )
                    }
                    autoFocus
                >
                    {districtData.map((item) => (
                        <Option key={item.DistrictID} value={item.DistrictID}>
                            {item.DistrictID}
                        </Option>
                    ))}
                </Select>
            ) : (
                <div
                    onDoubleClick={() =>
                        handleEdit(
                            record,
                            record.key,
                            field,
                            text,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            setSelectedRecord
                        )
                    }
                >
                    {text}
                </div>
            );
        }
        if (field === "type") {
            return isEditing ? (
                <Select
                    value={editingText}
                    onChange={(value) => setEditingText(value)}
                    style={{ width: 250 }}
                    onBlur={() =>
                        handleSave(
                            selectedRecord,
                            editingKey,
                            filteredData,
                            editingField,
                            editingText,
                            setFilteredData,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            selectedType
                        )
                    }
                    autoFocus
                >
                    {types.map((item) => (
                        <Option key={item} value={item}>
                            {item}
                        </Option>
                    ))}

                </Select>
            ) : (
                <div
                    onDoubleClick={() =>
                        handleEdit(
                            record,
                            record.key,
                            field,
                            text,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            setSelectedRecord
                        )
                    }
                >
                    {text}
                </div>
            );
        }
        if (["idProvince", "nam_het_han",].includes(field)) {
            return isEditing ? (
                <Select
                    value={editingText}
                    onChange={(value) => setEditingText(value)}
                    onBlur={() =>
                        handleSave(
                            selectedRecord,
                            editingKey,
                            filteredData,
                            editingField,
                            editingText,
                            setFilteredData,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            selectedType
                        )
                    }
                    autoFocus
                >
                    {expiryYears.map((item) => (
                        <Option key={item} value={item}>
                            {item}
                        </Option>
                    ))}
                </Select>
            ) : (
                <div
                    onDoubleClick={() =>
                        handleEdit(
                            record,
                            record.key,
                            field,
                            text,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            setSelectedRecord
                        )
                    }
                >
                    {text}
                </div>
            );
        }

        if (field === "path") {
            return isEditing ? (
                <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() =>
                        handleSave(
                            editingKey,
                            filteredData,
                            editingField,
                            editingText,
                            setFilteredData,
                            setEditingKey,
                            setEditingField,
                            setEditingText,
                            selectedType
                        )
                    }
                    autoFocus
                />
            ) : (
                <div
                    onDoubleClick={() =>
                        handlePathDoubleClick(
                            record,
                            setEditingKey,
                            setEditingField,
                            setEditingText
                        )
                    }
                >
                    {text}
                </div>
            );
        }

        return isEditing ? (
            <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onPressEnter={() =>
                    handleSave(
                        selectedRecord,
                        editingKey,
                        filteredData,
                        editingField,
                        editingText,
                        setFilteredData,
                        setEditingKey,
                        setEditingField,
                        setEditingText,
                        selectedType
                    )
                }
                onBlur={() =>
                    handleSave(
                        selectedRecord,
                        editingKey,
                        filteredData,
                        editingField,
                        editingText,
                        setFilteredData,
                        setEditingKey,
                        setEditingField,
                        setEditingText,
                        selectedType
                    )
                }
                autoFocus
            />
        ) : (
            <div
                onDoubleClick={() =>
                    handleEdit(
                        record,
                        record.key,
                        field,
                        text,
                        setEditingKey,
                        setEditingField,
                        setEditingText,
                        setSelectedRecord
                    )
                }
            >
                {text}
            </div>
        );
    };

    return [
        {
            title: "Id Quy Hoạch",
            dataIndex: "key",
            key: "key",
            width: 80,
        },
        {
            title: "Tên quy hoạch",
            dataIndex: "description",
            key: "description",
            width: 320,
            render: (text, record) => renderEditableCell(text, record, "description"),
        },
        {
            title: "Mã quận/huyện",
            dataIndex: "idDistrict",
            key: "idDistrict",
            width: 120,
            render: (text, record) => renderEditableCell(text, record, "idDistrict"),
        },
        {
            title: "Năm hết hạn",
            dataIndex: "nam_het_han",
            key: "nam_het_han",
            width: 120,
            render: (text, record) => renderEditableCell(text, record, "nam_het_han"),
        },
        {
            title: "Mã tỉnh",
            dataIndex: "idProvince",
            key: "idProvince",
            width: 80,
            render: (text, record) => renderEditableCell(text, record, "idProvince"),
        },
        {
            title: (
                <Select
                    defaultValue="Quy hoạch xây dựng" // Giá trị mặc định
                    onChange={(value) => {
                        setSelectedType(value); // Cập nhật giá trị đã chọn
                    }}
                >
                    <Option value="Quy hoạch xây dựng">Quy hoạch xây dựng</Option>
                    <Option value="Bản đồ địa chính">Bản đồ địa chính</Option>
                    <Option value="Kế hoạch sử dụng đất 2024">Kế hoạch sử dụng đất 2024</Option>
                    <Option value="Quy hoạch 2030">Quy hoạch 2030</Option>
                    <Option value="Quy hoạch tỉnh 2030">Quy hoạch tỉnh 2030</Option>
                </Select>
            ),
            dataIndex: 'type',
            key: "type",
            width: 250,
            render: (text, record) => renderEditableCell(text, record, "type"),
            // Các thuộc tính khác của cột nếu cần
        },
        // {
        //     title: "Loại quy hoạch",
        //     dataIndex: "type",
        //     key: "type",
        //     width: 250,
        //     render: (text, record) => renderEditableCell(text, record, "type"),
        // },
        {
            title: "Tọa độ (nếu có)",
            dataIndex: "location",
            key: "location",
            width: 250,
            render: (text, record) =>
                renderEditableCell(text, record, "location"),
        },
        {
            title: "Đường dẫn",
            dataIndex: "huyen_image",
            key: "huyen_image",
            width: 350,
            render: (text, record) => renderEditableCell(text, record, "huyen_image"),
        },
        {
            title: (
                <Checkbox
                    checked={selectAllChecked}
                    onChange={(e) =>
                        handleSelectAllChange(
                            e,
                            filteredData,
                            setCheckedRows,
                            setSelectAllChecked
                        )
                    }
                />
            ),
            dataIndex: "select",
            key: "select",
            width: 50,
            render: (_, record) => (
                <Checkbox
                    checked={checkedRows[record.key]}
                    onChange={(e) => {
                        handleCheckboxChange(record, e.target.checked, setCheckedRows)
                    }
                    }
                />
            ),
        },
    ];
};