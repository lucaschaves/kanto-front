import { Modal } from "@/Layout/Modal";
import { FInputLabel, GroupForm, IBaseFormRef } from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { useCallback, useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PagePaymentsPvCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const onClose = useCallback(() => navigate(-1), []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            let valueFun = `if(${data.se.replaceAll(
                " ",
                ""
            )}){${data.entao.replaceAll(" ", "")}}else{${data.ou.replaceAll(
                " ",
                ""
            )}}`;
            if (isEdit) {
                const { success } = await putApi({
                    url: `/paymentspv/${searchParams.get("id")}`,
                    body: {
                        name: data.name,
                        value: valueFun,
                    },
                });
                if (success) {
                    onClose();
                }
            } else {
                const { success } = await postApi({
                    url: "/paymentspv",
                    body: {
                        name: data.name,
                        value: valueFun,
                    },
                });
                if (success) {
                    onClose();
                }
            }
        },
        [onClose, isEdit]
    );

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: `/paymentspv/${searchParams.get("id")}`,
        });
        if (success) {
            const se = data.value.slice(
                data.value.indexOf("f(") + 2,
                data.value.indexOf("){")
            );
            const entao = data.value.slice(
                data.value.indexOf("){") + 2,
                data.value.indexOf("}e")
            );
            const ou = data.value.slice(
                data.value.indexOf("se{") + 3,
                data.value.lastIndexOf("}")
            );
            refForm.current?.reset({
                name: data.name,
                se,
                entao,
                ou,
            });
        }
    }, [searchParams]);

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={isEdit ? t("edit") : t("add")}
        >
            <GroupForm
                title={t("general")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-1",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FInputLabel label="Nome" name="name" />
            </GroupForm>
            <GroupForm
                title={t("Função")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-1",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FInputLabel label="Se" name="se" />
                <FInputLabel label="Então" name="entao" />
                <FInputLabel label="Ou" name="ou" />
            </GroupForm>
        </Modal>
    );
};
