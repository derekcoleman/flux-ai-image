import React from "react";

interface DeleteDialogProps {
  onClose: () => void;
  isOpen: boolean;
  heading: string;
  text: string;
  handleDelete: () => void;
  isDeleting: boolean;
}

export function DeleteDialog({
  onClose,
  isOpen,
  heading,
  text,
  handleDelete,
  isDeleting,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="mx-4 w-full max-w-md rounded-lg bg-gray-800">
        <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-gray-800 p-6 shadow-lg duration-200 sm:rounded-lg">
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-white">{heading}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              className="mt-2 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-none border-input bg-transparent px-4 py-2 text-sm font-medium text-gray-300 ring-offset-background transition-colors hover:bg-transparent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleDelete}
            >
              {isDeleting ? "deleting..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
