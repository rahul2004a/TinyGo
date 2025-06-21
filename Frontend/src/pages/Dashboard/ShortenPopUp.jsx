import React from 'react'
import Modal from '@mui/material/Modal';
import CreateNewShorten from './CreateNewShorten';

const ShortenPopUp = ({ open, setOpen, refetch }) => {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-short-url-modal"
            aria-describedby="create-short-url-form"
            className="flex justify-center items-center p-4"
            style={{
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
        >
            <div className="outline-none">
                <CreateNewShorten setOpen={setOpen} refetch={refetch} />
            </div>
        </Modal>
    )
}

export default ShortenPopUp;