import { makeAutoObservable } from "mobx";
import { JsxElement } from "typescript";

interface Modal {
    open: boolean,
    content: JSX.Element | null
}

export default class ModalStore {
    modal: Modal = {open : false, content: null}

    constructor() {
        makeAutoObservable(this);
    }

    openModal = (content: JSX.Element) => {
        this.modal.open = true;
        this.modal.content = content;
    }

    closeModal = () =>{
        this.modal.open = false;
        this.modal.content = null;
    }
}