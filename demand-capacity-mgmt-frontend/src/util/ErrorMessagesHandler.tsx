// ErrorMessages.ts

import { ToastContent, toast } from "react-toastify";

interface ErrorMessage {
    objectType: string;
    errorCode: string;
    lastDigits: string;
    message: string;
}

export const errorMessages: ErrorMessage[] = [
    // Material Demand Errors
    { objectType: '1', errorCode: '0', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '1', errorCode: '0', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '1', errorCode: '1', lastDigits: '50', message: 'Error creating material demand. Invalid data.' },
    { objectType: '1', errorCode: '2', lastDigits: '50', message: 'Error creating material demand.' },

    // Capacity Group Errors
    { objectType: '2', errorCode: '0', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '2', errorCode: '0', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },

    // EDC Communication Errors
    { objectType: '3', errorCode: '0', lastDigits: '00', message: 'Sometimes, the server has been died because many people access it at the same time. Sorry for the inconvenience.' },
    { objectType: '3', errorCode: '0', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },

    // Other Contexts Errors
    // Addressbook Errors
    { objectType: '4', errorCode: '1', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '1', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '1', lastDigits: '15', message: 'Failed to update data on the server, try again later.' },
    { objectType: '4', errorCode: '1', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    // Alerts Errors
    { objectType: '4', errorCode: '2', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '2', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '2', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    // Events Errors
    { objectType: '4', errorCode: '3', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '3', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '3', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '4', errorCode: '3', lastDigits: '70', message: 'Error fetching data, try again later' },
    { objectType: '4', errorCode: '3', lastDigits: '71', message: 'Error fetching data, try again later' },
    { objectType: '4', errorCode: '3', lastDigits: '75', message: 'Error fetching data, try again later' },
    { objectType: '4', errorCode: '3', lastDigits: '90', message: 'Error processing request' },
    // Favorite Errors
    { objectType: '4', errorCode: '4', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '4', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '4', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '4', errorCode: '4', lastDigits: '70', message: 'Error fetching data, try again later' },
    // InfoMenu Errors
    { objectType: '4', errorCode: '5', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '5', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '5', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    // Company Data Errors
    { objectType: '4', errorCode: '6', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '6', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '6', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '4', errorCode: '6', lastDigits: '70', message: 'Error fetching top companies, try again later' },
    // Unit of Measure errors
    { objectType: '4', errorCode: '7', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '7', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '7', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
];


export const customErrorToast = (objectType: string, errorCode: string, lastDigits: string, toastProps?: object): React.ReactText => {
    const fullErrorCode = objectType + errorCode + lastDigits;
    const errorMessage = errorMessages.find((error) => error.objectType === objectType && error.errorCode === errorCode && error.lastDigits === lastDigits);

    if (errorMessage) {
        let formattedMessage = `Code <strong>${fullErrorCode}</strong><br />${errorMessage.message}`;

        // Replace %timestamp% with the current formatted timestamp
        if (formattedMessage.includes('%timestamp%')) {
            const currentTimestamp = new Date().toLocaleString('en-US', { hour12: false });
            formattedMessage = formattedMessage.replace('%timestamp%', `${currentTimestamp}`);
        }

        const toastContent: ToastContent = (
            <div className="error-msg-container" dangerouslySetInnerHTML={{ __html: formattedMessage }} />
        );

        return toast.error(toastContent, {
            ...toastProps
        });
    } else {
        return 'Unknown error occurred.';
    }
};




