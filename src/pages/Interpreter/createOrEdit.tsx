import { Modal } from "@/Layout/Modal";
import { FSelectLabel, IBaseFormRef } from "@/components";
import { modulesFactory } from "@/routes/modules";
import { postApi } from "@/services";
import { messageError, messageSuccess, sleep } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const PageInterpreterCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const refForm = useRef<IBaseFormRef>(null);

    const [stateDisabled, setDisabled] = useState(false);

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        const { ids, table } = data;
        setDisabled(true);
        try {
            let successAll = true;
            console.log("ids", table, ids);
            const dataIds: any[] = ids?.map((id: any) => ({ name: id }));
            console.log("dataIds", dataIds);
            if (dataIds?.length) {
                const count = Math.ceil(dataIds.length / 1000);
                let indexCount = 0;
                for (let index = 0; index < count; index++) {
                    const element = dataIds.slice(
                        indexCount,
                        indexCount + 1000
                    );
                    const { success } = await postApi({
                        url: table,
                        body: {
                            data: element,
                        },
                    });
                    indexCount += 1000;
                    if (!success) {
                        successAll = false;
                    }
                    await sleep(500);
                }

                if (successAll) {
                    messageSuccess({ message: "Importado com sucesso" });
                    onClose();
                }
            } else {
                messageError({ message: "Não há dados a importar" });
            }
            setDisabled(false);
        } catch (err) {
            console.error("error", err);
            setDisabled(false);
        }
    };

    useEffect(() => {
        refForm.current?.reset({
            ...location.state,
        });
    }, [location.pathname]);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={t("import")}
            className="max-w-sm"
            disabled={stateDisabled}
        >
            <span>
                {location.state?.ids?.length} Items a serem importados para
            </span>
            <FSelectLabel
                label={t("table")}
                name="table"
                items={modulesFactory.map((key) => ({
                    id: key.name,
                    name: t(key.name),
                }))}
            />
        </Modal>
    );
};

export { PageInterpreterCreateOrEdit };
