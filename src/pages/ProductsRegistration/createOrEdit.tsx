import { Modal } from "@/Layout/Modal";
import {
    FCheckboxLabel,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const dataItemsType = [
    {
        id: "game",
        name: "Game",
    },
    {
        id: "console",
        name: "Console",
    },
    {
        id: "accessory",
        name: "Acessório",
    },
    {
        id: "extra",
        name: "Extra",
    },
];

export const PageProductRegistrationCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const [stateType, setType] = useState("");

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            if (isEdit) {
                const { success } = await putApi({
                    url: `/productregistration/${searchParams.get("id")}`,
                    body: data,
                });
                if (success) {
                    onClose();
                }
            } else {
                const { success } = await postApi({
                    url: "/productregistration",
                    body: data,
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
            url: `/productregistration/${searchParams.get("id")}`,
        });
        if (success) {
            const payments: any[] = [];
            data?.payments?.forEach((k: any) => {
                payments.push(k);
            });
            let newData = data;
            data?.payments?.forEach((k: any) => {
                newData = {
                    ...newData,
                    [k.name]: k.value,
                };
            });
            delete newData.payments;
            refForm.current?.reset(newData);
            setType(newData.type);
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
                    "grid-cols-2",
                    "sm:grid-cols-2",
                    `md:grid-cols-3`,
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FSelectLabel
                    label={t("type")}
                    name="type"
                    items={dataItemsType}
                    onEffect={(e) => setType(e)}
                />
                <FSelectLabelSingleApi
                    label={t("factory")}
                    name="factoryId"
                    url="/productsregistration/factory"
                    dependencies={["type"]}
                />
                <FSelectLabelSingleApi
                    label={t("region")}
                    name="regionId"
                    url="/regions"
                />
            </GroupForm>
            {stateType === "console" ? (
                <GroupForm
                    title={t("consoles")}
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-2",
                        "sm:grid-cols-2",
                        `md:grid-cols-3`,
                        "gap-1",
                        "sm:gap-2",
                        "px-3"
                    )}
                >
                    <FCheckboxLabel
                        label={t("consoleComplete")}
                        name="consoleComplete"
                    />
                    <FCheckboxLabel
                        label={t("consolePackaging")}
                        name="consolePackaging"
                    />
                    <FCheckboxLabel
                        label={t("consoleSealed")}
                        name="consoleSealed"
                    />
                    <FCheckboxLabel
                        label={t("consoleTypeUnlocked")}
                        name="consoleTypeUnlocked"
                    />
                    <FCheckboxLabel
                        label={t("consoleUnlocked")}
                        name="consoleUnlocked"
                    />
                    <FCheckboxLabel
                        label={t("consoleWorking")}
                        name="consoleWorking"
                    />
                </GroupForm>
            ) : stateType === "game" ? (
                <GroupForm
                    title={t("games")}
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-2",
                        "sm:grid-cols-2",
                        `md:grid-cols-3`,
                        "gap-1",
                        "sm:gap-2",
                        "px-3"
                    )}
                >
                    <FCheckboxLabel label={t("gameManual")} name="gameManual" />
                    <FCheckboxLabel
                        label={t("gamePackaging")}
                        name="gamePackaging"
                    />
                    <FCheckboxLabel
                        label={t("gamePackagingRental")}
                        name="gamePackagingRental"
                    />
                    <FCheckboxLabel label={t("gameSealed")} name="gameSealed" />
                    <FCheckboxLabel
                        label={t("gameWorking")}
                        name="gameWorking"
                    />
                    <FSelectLabel
                        label={t("gameConversation")}
                        name="gameConversation"
                        items={[
                            {
                                id: "1",
                                name: "1",
                            },
                            {
                                id: "2",
                                name: "2",
                            },
                            {
                                id: "3",
                                name: "3",
                            },
                            {
                                id: "4",
                                name: "4",
                            },
                            {
                                id: "5",
                                name: "5",
                            },
                        ]}
                    />
                </GroupForm>
            ) : (
                <></>
            )}
            <GroupForm
                title={t("prices")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "sm:grid-cols-2",
                    `md:grid-cols-3`,
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FInputLabel
                    label={t("price")}
                    name="pvMercadoLivre"
                    type="currency"
                />
                <FInputLabel label={t("cost")} name="pvCost" type="currency" />
                <FInputLabel
                    label={t("profit")}
                    name="pvProfit"
                    type="currency"
                />
            </GroupForm>
        </Modal>
    );
};
