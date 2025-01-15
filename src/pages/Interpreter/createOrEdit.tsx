import { Modal } from "@/Layout/Modal";
import { FSelectLabel, IBaseFormRef } from "@/components";
import { useDynamicRefs } from "@/hooks";
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

    const [getRef] = useDynamicRefs();

    const refForm = useRef<IBaseFormRef>(null);

    const [stateDisabled, setDisabled] = useState(false);
    const [stateIds, setIds] = useState<string[]>([]);

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        const { table } = data;
        setDisabled(true);
        try {
            const refInterpreter = getRef<any>("interpreterSheet");
            const nameInterpreter = refInterpreter?.current?.getName();
            let dataImport: any[] = [];
            let countSend = 500;
            if (
                ["jogo", "console", "jogos", "consoles"].includes(
                    nameInterpreter?.toLowerCase()
                )
            ) {
                const dataAll = refInterpreter?.current?.getItems();
                dataImport = dataAll?.rows;
                countSend = 250;
            } else {
                const dataIds: any[] = stateIds?.map((id: any) => ({
                    name: id,
                }));
                dataImport = dataIds;
            }
            if (dataImport?.length) {
                let successAll = true;

                // const count = 1
                const count = Math.ceil(dataImport.length / countSend);
                let indexCount = 0;
                for (let index = 0; index < count; index++) {
                    const element = dataImport.slice(
                        indexCount,
                        indexCount + countSend
                    );
                    const { success } = await postApi({
                        url: table,
                        body: {
                            data: element,
                        },
                    });
                    indexCount += countSend;
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
        setIds(location.state?.ids);
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
