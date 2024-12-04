import { TypeOptions, toast } from "react-toastify";

interface IMessage {
    message: string;
    status?: number;
    hash?: string;
    component?: string;
    tagId?: string;
    elapsed?: string;
    data?: any;
}

interface IMessageUpdate extends IMessage {
    type?: TypeOptions;
    id: string | number;
    autoClose?: number | false;
}

const messageError = ({ message, elapsed = "0ms" }: IMessage) => {
    try {
        console.error("error post message: ", message);
        toast.error(message);
    } catch (err) {
        console.error("messageError: ", err);
    }
    return {
        message,
        elapsed,
        success: false,
    };
};

const messageWarn = ({ message, data }: IMessage) => {
    try {
        console.warn("error post message: ", message);
        toast.warn(message);
    } catch (err) {
        console.error("messageWarn: ", err);
    }
    return {
        message,
        data,
        success: false,
    };
};

const messageSuccess = ({ message, data }: IMessage) => {
    try {
        console.info("success post message: ", message);
        toast.success(message);
    } catch (err) {
        console.info("messageSuccess: ", err);
    }
    return {
        message,
        data,
        success: false,
    };
};

const messageInfo = ({ message, data }: IMessage) => {
    try {
        console.info("info post message: ", message);
        toast.info(message);
    } catch (err) {
        console.info("messageInfo: ", err);
    }
    return {
        message,
        data,
        success: false,
    };
};

const messagePromise = ({ message }: IMessage): string | number => {
    const id = toast.loading(message);
    return id;
};

const messageUpdate = ({
    message,
    id,
    type = "default",
    autoClose = 3000,
}: IMessageUpdate) => {
    toast.update(id, {
        render: message,
        type,
        isLoading: false,
        autoClose,
        closeButton: true,
    });

    return {
        message,
        data: null,
        success: false,
    };
};

export {
    messageError,
    messageInfo,
    messagePromise,
    messageSuccess,
    messageUpdate,
    messageWarn,
};
