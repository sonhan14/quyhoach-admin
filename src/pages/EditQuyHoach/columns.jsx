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
    setSelectedRecord
}) => {
    const renderEditableCell = (text, record, field) => {
        const isEditing = record.key === editingKey && editingField === field;

        const provinces = ["28", "30", "31"];
        const districts = ["01", "02", "03"];
        const expiryYears = ["2027", "2028", "2030"];
        const types = ["Quy hoạch xây dựng", "Bản đồ địa chính", "Kế hoạch sử dụng đất 2024", "Quy hoạch 2030", " Quy hoạch tỉnh 2030"];

        if (["type"].includes(field)) {
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
                            setEditingText
                        )
                    }
                    autoFocus
                >
                    {(field === "idProvince"
                        ? provinces
                        : field === "idDistrict"
                            ? districts
                            : field === "type"
                                ? types
                                : expiryYears
                    ).map((item) => (
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
        if (["idProvince", "idDistrict", "nam_het_han",].includes(field)) {
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
                            setEditingText
                        )
                    }
                    autoFocus
                >
                    {(field === "idProvince"
                        ? provinces
                        : field === "idDistrict"
                            ? districts
                            : field === "type"
                                ? types
                                : expiryYears
                    ).map((item) => (
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
                            setEditingText
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
                        setEditingText
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
                        setEditingText
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
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 80,
            render: (text, record) => renderEditableCell(text, record, "stt"),
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
            title: "Loại quy hoạch",
            dataIndex: "type",
            key: "type",
            width: 300,
            render: (text, record) => renderEditableCell(text, record, "type"),
        },
        {
            title: "Tọa độ (nếu có)",
            dataIndex: "location",
            key: "location",
            width: 300,
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
                    onChange={(e) =>
                        handleCheckboxChange(record, e.target.checked, setCheckedRows)
                    }
                />
            ),
        },
    ];
};