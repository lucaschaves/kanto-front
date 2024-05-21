interface IPropsForm {
    name: string;
}

const Form = (props: IPropsForm) => {
    const { name } = props;
    return <div>Form - {name}</div>;
};

export { Form };
