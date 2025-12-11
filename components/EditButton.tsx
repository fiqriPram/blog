interface EditButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditButton({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: EditButtonProps) {
  if (isEditing) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
    >
      Edit
    </button>
  );
}
